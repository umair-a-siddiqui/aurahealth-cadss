from __future__ import annotations

import asyncio
from collections import deque
import hashlib
import json
import os
import time
import threading
from typing import Literal

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel


# =========================================================
# App setup
# =========================================================

load_dotenv()

app = FastAPI(
    title="AuraHealth CADSS API",
    version="1.3.0",
    description="Clinical decision-support backend for AuraHealth",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

DEFAULT_TEXT_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
]

DEFAULT_VISION_MODELS = [
    "gemini-2.5-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
]


def _models_from_env(name: str, defaults: list[str]) -> list[str]:
    raw = os.getenv(name, "").strip()
    if not raw:
        return defaults

    models = [item.strip() for item in raw.split(",") if item.strip()]
    return models or defaults


TEXT_MODELS = _models_from_env("GEMINI_TEXT_MODELS", DEFAULT_TEXT_MODELS)
VISION_MODELS = _models_from_env("GEMINI_VISION_MODELS", DEFAULT_VISION_MODELS)

gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


# =========================================================
# Lightweight AI request protection
# =========================================================

# Designed for a simple single-process hackathon deployment:
# - blocks rapid duplicate submissions for a few seconds
# - caps extreme global bursts without requiring Redis
# - allows normal use by many different users
DUPLICATE_REQUEST_COOLDOWN_SECONDS = 8
GLOBAL_AI_WINDOW_SECONDS = 60
GLOBAL_AI_MAX_REQUESTS = 30

_recent_ai_requests: dict[str, float] = {}
_global_ai_requests: deque[float] = deque()
_ai_guard_lock = threading.Lock()


def _request_fingerprint(endpoint: str, payload: str | bytes) -> str:
    if isinstance(payload, str):
        payload = payload.encode("utf-8", errors="ignore")

    digest = hashlib.sha256(payload).hexdigest()
    return f"{endpoint}:{digest}"


def guard_ai_request(fingerprint: str):
    now = time.monotonic()

    with _ai_guard_lock:
        # Remove old global request timestamps.
        while (
            _global_ai_requests
            and now - _global_ai_requests[0] >= GLOBAL_AI_WINDOW_SECONDS
        ):
            _global_ai_requests.popleft()

        # Remove expired duplicate fingerprints periodically.
        expired = [
            key
            for key, timestamp in _recent_ai_requests.items()
            if now - timestamp >= DUPLICATE_REQUEST_COOLDOWN_SECONDS
        ]
        for key in expired:
            _recent_ai_requests.pop(key, None)

        previous = _recent_ai_requests.get(fingerprint)
        if previous is not None:
            retry_after = max(
                1,
                int(DUPLICATE_REQUEST_COOLDOWN_SECONDS - (now - previous)) + 1,
            )
            raise HTTPException(
                status_code=429,
                detail=(
                    "This AI request was submitted very recently. "
                    f"Please wait about {retry_after} seconds and try again."
                ),
                headers={"Retry-After": str(retry_after)},
            )

        if len(_global_ai_requests) >= GLOBAL_AI_MAX_REQUESTS:
            raise HTTPException(
                status_code=429,
                detail=(
                    "AuraHealth is receiving many AI requests right now. "
                    "Please wait a short moment and try again."
                ),
                headers={"Retry-After": "10"},
            )

        _recent_ai_requests[fingerprint] = now
        _global_ai_requests.append(now)


# =========================================================
# Shared Gemini reliability helpers
# =========================================================

# Simple in-memory cooldowns. This is intentionally lightweight for the
# hackathon/demo deployment and avoids Redis or another service.
_MODEL_COOLDOWNS: dict[str, float] = {}

QUOTA_COOLDOWN_SECONDS = 5 * 60
TRANSIENT_COOLDOWN_SECONDS = 30


def _gemini_error_text(error: Exception) -> str:
    return str(error).lower()


def _is_quota_error(error: Exception) -> bool:
    text = _gemini_error_text(error)
    quota_markers = (
        "429",
        "resource_exhausted",
        "quota exceeded",
        "quota_exceeded",
        "free_tier_requests",
        "generate_content_free_tier_requests",
    )
    return any(marker in text for marker in quota_markers)


def _is_transient_error(error: Exception) -> bool:
    text = _gemini_error_text(error)
    transient_markers = (
        "503",
        "unavailable",
        "service_unavailable",
        "temporarily unavailable",
        "timeout",
        "timed out",
        "deadline exceeded",
    )
    return any(marker in text for marker in transient_markers)


def _cooldown_model(model: str, seconds: int):
    _MODEL_COOLDOWNS[model] = time.monotonic() + seconds


def _model_available(model: str) -> bool:
    expires_at = _MODEL_COOLDOWNS.get(model, 0)

    if expires_at <= time.monotonic():
        _MODEL_COOLDOWNS.pop(model, None)
        return True

    return False


def gemini_json(contents, models: list[str]):
    """
    Try each configured Gemini model at most once.

    Behavior:
    - quota exhaustion (429): temporarily skip that model and try the next one
    - transient provider/capacity failure (503): briefly skip and try the next one
    - malformed/empty response: try the next model
    - if every model fails, return a controlled HTTP 429/503/502
    """
    if not GEMINI_API_KEY or gemini_client is None:
        raise HTTPException(
            status_code=503,
            detail="AuraHealth AI is not configured on the server.",
        )

    attempted = 0
    saw_quota_error = False
    saw_transient_error = False
    last_nonavailability_error: Exception | None = None

    for model in models:
        if not _model_available(model):
            continue

        attempted += 1

        try:
            response = gemini_client.models.generate_content(
                model=model,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                ),
            )

            if not response.text:
                last_nonavailability_error = ValueError(
                    f"{model} returned an empty response"
                )
                continue

            try:
                result = json.loads(response.text)
            except json.JSONDecodeError as error:
                print(f"Gemini JSON parsing error ({model}):", error)
                last_nonavailability_error = error
                continue

            print(f"Gemini model succeeded: {model}")
            return result

        except Exception as error:
            if _is_quota_error(error):
                saw_quota_error = True
                _cooldown_model(model, QUOTA_COOLDOWN_SECONDS)
                print(f"Gemini quota exhausted ({model})")
                continue

            if _is_transient_error(error):
                saw_transient_error = True
                _cooldown_model(model, TRANSIENT_COOLDOWN_SECONDS)
                print(f"Gemini temporarily unavailable ({model})")
                continue

            print(f"Gemini request error ({model}):", error)
            last_nonavailability_error = error
            continue

    if attempted == 0:
        # All configured models are currently cooling down.
        raise HTTPException(
            status_code=503,
            detail=(
                "AuraHealth AI is temporarily busy. "
                "Please try again shortly."
            ),
        )

    if saw_transient_error:
        raise HTTPException(
            status_code=503,
            detail=(
                "AuraHealth AI is temporarily busy across the available models. "
                "Please try again shortly."
            ),
        )

    if saw_quota_error:
        raise HTTPException(
            status_code=429,
            detail=(
                "AuraHealth AI has reached the current usage limit across "
                "the available models. Please try again after quota resets."
            ),
        )

    if last_nonavailability_error is not None:
        raise HTTPException(
            status_code=502,
            detail="AuraHealth AI could not complete this request.",
        )

    raise HTTPException(
        status_code=503,
        detail="AuraHealth AI is temporarily unavailable.",
    )


# =========================================================
# Health checks
# =========================================================

@app.get("/")
def root():
    return {
        "app": "AuraHealth CADSS",
        "status": "online",
        "message": "Backend is working successfully",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "ai_configured": bool(GEMINI_API_KEY),
        "text_models": TEXT_MODELS,
        "vision_models": VISION_MODELS,
        "ai_request_protection": "enabled",
    }


# =========================================================
# Blood Compatibility
# =========================================================

BLOOD_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]


def blood_markers(blood_type: str):
    return (
        "A" in blood_type,
        "B" in blood_type,
        "+" in blood_type,
    )


def can_donate(donor: str, recipient: str):
    donor_markers = blood_markers(donor)
    recipient_markers = blood_markers(recipient)

    return all(
        (not donor_marker) or recipient_marker
        for donor_marker, recipient_marker in zip(
            donor_markers,
            recipient_markers,
        )
    )


@app.get("/blood/compatibility")
def blood_compatibility(type: str):
    blood_type = type.upper()

    if blood_type not in BLOOD_TYPES:
        return {
            "error": "Unknown blood type",
            "valid_types": BLOOD_TYPES,
        }

    return {
        "blood_type": blood_type,
        "can_give_to": [
            candidate
            for candidate in BLOOD_TYPES
            if can_donate(blood_type, candidate)
        ],
        "can_receive_from": [
            candidate
            for candidate in BLOOD_TYPES
            if can_donate(candidate, blood_type)
        ],
        "warning": (
            "Blood compatibility shown here is educational decision support. "
            "Real transfusions require hospital blood-bank testing and cross-matching."
        ),
    }


# =========================================================
# Metabolic Calculator
# =========================================================

class MetabolicRequest(BaseModel):
    age: int
    sex: Literal["male", "female"]
    height_cm: float
    weight_kg: float
    activity_level: Literal[
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
    ]


ACTIVITY_FACTORS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}


@app.post("/metabolic/calculate")
def metabolic_calculator(data: MetabolicRequest):
    if data.age < 1 or data.age > 120:
        raise HTTPException(status_code=400, detail="Please enter a valid age.")

    if data.height_cm <= 0 or data.weight_kg <= 0:
        raise HTTPException(
            status_code=400,
            detail="Height and weight must be greater than zero.",
        )

    if data.sex == "male":
        bmr = (
            10 * data.weight_kg
            + 6.25 * data.height_cm
            - 5 * data.age
            + 5
        )
    else:
        bmr = (
            10 * data.weight_kg
            + 6.25 * data.height_cm
            - 5 * data.age
            - 161
        )

    tdee = bmr * ACTIVITY_FACTORS[data.activity_level]

    protein = data.weight_kg * 1.2
    fat = (tdee * 0.25) / 9
    carbs = (tdee - (protein * 4) - (fat * 9)) / 4

    return {
        "bmr": round(bmr),
        "tdee": round(tdee),
        "daily_targets": {
            "protein_g": round(protein),
            "carbohydrates_g": round(max(carbs, 0)),
            "fat_g": round(fat),
        },
        "note": (
            "These are estimated nutrition targets for educational purposes "
            "and are not a medical prescription."
        ),
    }


# =========================================================
# AI Medicine Scanner
# =========================================================

@app.post("/medicine/scan")
async def scan_medicine(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()

        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image.")

        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="Medicine image is too large. Maximum size is 10 MB.",
            )

        guard_ai_request(
            _request_fingerprint("medicine-scan", image_bytes)
        )

        prompt = """
Analyze this medicine packaging, blister pack, bottle, box, or prescription.

Return JSON containing:
{
  "medicine_name": "",
  "active_ingredients": [],
  "strength": "",
  "dosage_form": "",
  "main_use": "",
  "manufacturer": "",
  "expiry_date": "",
  "batch_number": "",
  "warnings": [],
  "image_quality": "",
  "confidence": ""
}

Rules:
- Extract only information visible or reasonably identifiable.
- Never invent unreadable information.
- Use "Not visible" when information cannot be read.
- Never prescribe a dose.
- Never diagnose a disease.
- Keep main_use educational and concise.
- Mention unclear or blurry packaging in warnings.
- confidence must be High, Medium, or Low.
"""

        result = await asyncio.to_thread(
            gemini_json,
            [
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=image.content_type or "image/jpeg",
                ),
                prompt,
            ],
            VISION_MODELS,
        )

        result.setdefault("medicine_name", "Not visible")
        result.setdefault("active_ingredients", [])
        result.setdefault("strength", "Not visible")
        result.setdefault("dosage_form", "Not visible")
        result.setdefault("main_use", "Not visible")
        result.setdefault("manufacturer", "Not visible")
        result.setdefault("expiry_date", "Not visible")
        result.setdefault("batch_number", "Not visible")
        result.setdefault("warnings", [])
        result.setdefault("image_quality", "Not stated")
        result.setdefault("confidence", "Low")

        result["medical_notice"] = (
            "AuraHealth provides educational decision support only. "
            "Confirm medicine information with the original packaging, "
            "a pharmacist, or another qualified healthcare professional."
        )

        return result

    except HTTPException:
        raise
    except Exception as error:
        print("Unexpected Medicine Scanner error:", error)
        raise HTTPException(
            status_code=500,
            detail=(
                "AuraHealth could not process the medicine image. "
                "Please try again."
            ),
        )


# =========================================================
# AI Lab Report Analyzer
# =========================================================

@app.post("/lab-report/analyze")
async def analyze_lab_report(report: UploadFile = File(...)):
    try:
        report_bytes = await report.read()

        if not report_bytes:
            raise HTTPException(status_code=400, detail="Empty report.")

        if len(report_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="Report is too large. Maximum size is 10 MB.",
            )

        guard_ai_request(
            _request_fingerprint("lab-report", report_bytes)
        )

        prompt = """
You are the lab-report reading component of AuraHealth, a clinical
decision-support application.

Analyze ONLY the information visible in this uploaded laboratory report.

Extract the laboratory tests, measured values, units, and the reference
ranges printed on THIS report.

Return valid JSON exactly in this structure:

{
  "report_type": "",
  "patient_name": "",
  "report_date": "",
  "summary": "",
  "tests": [
    {
      "test_name": "",
      "value": "",
      "unit": "",
      "reference_range": "",
      "status": "Normal",
      "explanation": ""
    }
  ],
  "important_findings": [],
  "questions_for_doctor": [],
  "image_quality": "",
  "confidence": ""
}

Rules:
- Never invent a test, value, unit, patient detail, or reference range.
- Use the reference range printed on the uploaded report whenever available.
- If no reference range is visible, write "Not provided" and do NOT guess one.
- Status must be "Low", "Normal", "High", or "Unknown".
- Determine Low/Normal/High only when the report provides enough information.
- explanation must be short, plain-language, and educational.
- Do not diagnose any disease.
- Do not recommend starting, stopping, or changing medication.
- Do not claim that an abnormal result proves a medical condition.
- Clearly mention unreadable or uncertain information.
- confidence must be High, Medium, or Low.
"""

        result = await asyncio.to_thread(
            gemini_json,
            [
                types.Part.from_bytes(
                    data=report_bytes,
                    mime_type=report.content_type or "image/jpeg",
                ),
                prompt,
            ],
            VISION_MODELS,
        )

        result["medical_notice"] = (
            "AuraHealth provides educational decision support only. "
            "Laboratory results must be interpreted in clinical context by "
            "a qualified healthcare professional. Seek urgent medical care "
            "for severe or rapidly worsening symptoms."
        )

        return result

    except HTTPException:
        raise
    except Exception as error:
        print("Lab report analyzer error:", error)
        raise HTTPException(
            status_code=500,
            detail=(
                "Could not analyze the laboratory report. "
                "Please try again or upload a clearer report."
            ),
        )


# =========================================================
# AI Clinical Triage
# =========================================================

class TriageRequest(BaseModel):
    age: int
    sex: Literal["male", "female"]
    symptoms: str
    duration: str
    severity: Literal["mild", "moderate", "severe"]
    medical_context: str = ""


@app.post("/triage/analyze")
def analyze_triage(data: TriageRequest):
    try:
        if data.age < 1 or data.age > 120:
            raise HTTPException(
                status_code=400,
                detail="Please enter a valid age.",
            )

        if not data.symptoms.strip():
            raise HTTPException(
                status_code=400,
                detail="Please describe the symptoms.",
            )

        triage_payload = json.dumps(
            data.model_dump(),
            sort_keys=True,
            separators=(",", ":"),
        )
        guard_ai_request(
            _request_fingerprint("triage", triage_payload)
        )

        prompt = f"""
You are the clinical triage decision-support component of AuraHealth.

PATIENT INFORMATION:
Age: {data.age}
Sex: {data.sex}
Symptoms: {data.symptoms}
Duration: {data.duration}
User-rated severity: {data.severity}
Additional medical context: {data.medical_context or "None provided"}

Your task is TRIAGE, not diagnosis.

Return valid JSON exactly in this structure:

{{
  "urgency_level": "",
  "urgency_title": "",
  "summary": "",
  "possible_categories": [],
  "red_flags": [],
  "recommended_action": "",
  "self_care": [],
  "monitor_for": [],
  "questions_for_clinician": [],
  "confidence": ""
}}

URGENCY LEVEL must be exactly one of:
- Emergency
- Urgent
- Soon
- Routine
- Unclear

Rules:
- Never provide a definitive diagnosis.
- Never claim that the patient definitely has a disease.
- Do not prescribe prescription medicines or medication doses.
- Do not recommend starting or stopping prescription medication.
- possible_categories must contain broad educational possibilities,
  not definitive diagnoses.
- Consider age when evaluating urgency.
- Treat severe symptoms cautiously.
- Identify clinically important red-flag symptoms.
- If symptoms could indicate an immediate life-threatening emergency,
  set urgency_level to "Emergency".
- Emergency recommended_action should clearly advise seeking immediate
  emergency medical care or contacting local emergency services.
- If information is insufficient, use "Unclear" rather than guessing.
- self_care must only contain conservative, low-risk general measures.
- If self-care advice would be inappropriate, return an empty list.
- monitor_for should identify symptoms or changes that warrant
  reassessment or escalation.
- Keep the summary concise and understandable.
- confidence must be High, Medium, or Low.
"""

        result = gemini_json(prompt, TEXT_MODELS)

        result["medical_notice"] = (
            "AuraHealth provides educational clinical decision support "
            "and does not provide a medical diagnosis. If symptoms are "
            "severe, rapidly worsening, or you believe there may be an "
            "emergency, seek immediate medical care."
        )

        return result

    except HTTPException:
        raise
    except Exception as error:
        print("Clinical triage error:", error)
        raise HTTPException(
            status_code=500,
            detail=(
                "Clinical triage is temporarily unavailable. "
                "If this may be a medical emergency, seek immediate "
                "professional medical care."
            ),
        )


# =========================================================
# Drug Safety
# =========================================================

class DrugSafetyRequest(BaseModel):
    drug_1: str
    drug_2: str


def get_fda_drug_label(drug_name: str):
    """
    Retrieve a matching FDA drug label.
    Tries generic name, brand name, then substance name.
    """
    fields = [
        "openfda.generic_name",
        "openfda.brand_name",
        "openfda.substance_name",
    ]

    for field in fields:
        try:
            response = requests.get(
                "https://api.fda.gov/drug/label.json",
                params={
                    "search": f'{field}:"{drug_name}"',
                    "limit": 1,
                },
                timeout=10,
            )

            if response.status_code == 200:
                data = response.json()
                if data.get("results"):
                    return data["results"][0]

        except requests.RequestException as error:
            print("openFDA request error:", error)

    return None


def first_text(record, field):
    value = record.get(field, [])

    if isinstance(value, list) and value:
        return value[0]

    if isinstance(value, str):
        return value

    return ""


@app.post("/drug-safety/check")
def check_drug_safety(data: DrugSafetyRequest):
    drug_1 = data.drug_1.strip()
    drug_2 = data.drug_2.strip()

    if not drug_1 or not drug_2:
        raise HTTPException(
            status_code=400,
            detail="Please enter two medicine names.",
        )

    if drug_1.lower() == drug_2.lower():
        raise HTTPException(
            status_code=400,
            detail="Please enter two different medicines.",
        )

    drug_payload = json.dumps(
        {
            "drug_1": drug_1.lower(),
            "drug_2": drug_2.lower(),
        },
        sort_keys=True,
        separators=(",", ":"),
    )
    guard_ai_request(
        _request_fingerprint("drug-safety", drug_payload)
    )

    label_1 = get_fda_drug_label(drug_1)
    label_2 = get_fda_drug_label(drug_2)

    if not label_1 and not label_2:
        return {
            "drug_1": drug_1,
            "drug_2": drug_2,
            "status": "Insufficient Data",
            "summary": (
                "AuraHealth could not locate matching FDA labeling "
                "for these medicine names."
            ),
            "drug_1_found": False,
            "drug_2_found": False,
            "drug_1_interactions": "",
            "drug_2_interactions": "",
            "warnings": [
                "Check the spelling or try the generic medicine names."
            ],
            "medical_notice": (
                "Do not start, stop, combine, or change medicines based "
                "only on this tool. Confirm medicine combinations with a "
                "pharmacist or qualified healthcare professional."
            ),
        }

    interaction_1 = (
        first_text(label_1, "drug_interactions")
        if label_1 else ""
    )
    interaction_2 = (
        first_text(label_2, "drug_interactions")
        if label_2 else ""
    )

    warning_1 = ""
    if label_1:
        warning_1 = (
            first_text(label_1, "warnings")
            or first_text(label_1, "warnings_and_cautions")
        )

    warning_2 = ""
    if label_2:
        warning_2 = (
            first_text(label_2, "warnings")
            or first_text(label_2, "warnings_and_cautions")
        )

    prompt = f"""
You are the drug-safety explanation component of AuraHealth.

The following information was retrieved from FDA drug labeling.

DRUG 1:
Name entered: {drug_1}
FDA label found: {bool(label_1)}
Drug interaction section:
{interaction_1 or "No interaction section retrieved."}

Warnings:
{warning_1 or "No warning section retrieved."}

DRUG 2:
Name entered: {drug_2}
FDA label found: {bool(label_2)}
Drug interaction section:
{interaction_2 or "No interaction section retrieved."}

Warnings:
{warning_2 or "No warning section retrieved."}

Analyze ONLY the supplied FDA-label information.

Return JSON exactly in this structure:

{{
  "status": "",
  "summary": "",
  "interaction_evidence": [],
  "important_warnings": [],
  "questions_for_pharmacist": [],
  "confidence": ""
}}

Rules:
- Never claim the combination is safe merely because no interaction
  was found in the retrieved text.
- Do not invent an interaction.
- Do not use medical knowledge that is absent from the supplied evidence.
- If the supplied FDA text explicitly describes a relevant interaction,
  explain it cautiously.
- status must be one of:
  "Interaction Found",
  "No Specific Interaction Found",
  "Insufficient Data"
- "No Specific Interaction Found" does NOT mean the combination is proven safe.
- Never prescribe a dose.
- Never recommend starting, stopping, or changing medication.
- Keep explanations concise and understandable.
- confidence must be High, Medium, or Low.
"""

    try:
        result = gemini_json(prompt, TEXT_MODELS)
    except HTTPException as error:
        if error.status_code in (429, 503):
            return {
                "drug_1": drug_1,
                "drug_2": drug_2,
                "status": "Insufficient Data",
                "summary": (
                    "FDA labeling was retrieved, but the AI explanation "
                    "service is temporarily unavailable."
                ),
                "drug_1_found": bool(label_1),
                "drug_2_found": bool(label_2),
                "drug_1_interactions": interaction_1,
                "drug_2_interactions": interaction_2,
                "warnings": [],
                "medical_notice": (
                    "Do not start, stop, combine, or change medicines based "
                    "only on this tool. Confirm medicine combinations with a "
                    "pharmacist or qualified healthcare professional."
                ),
            }
        raise

    result["drug_1"] = drug_1
    result["drug_2"] = drug_2
    result["drug_1_found"] = bool(label_1)
    result["drug_2_found"] = bool(label_2)

    result["medical_notice"] = (
        "This feature summarizes available FDA labeling for educational "
        "decision support. Absence of a specific interaction in the "
        "retrieved labeling does not prove that a combination is safe. "
        "Do not start, stop, combine, or change medicines without "
        "appropriate professional advice."
    )

    return result


# =========================================================
# AI Eat / Avoid
# =========================================================

class EatAvoidRequest(BaseModel):
    condition: str
    age: int
    goal: str = ""
    dietary_preferences: str = ""
    additional_context: str = ""


@app.post("/eat-avoid/analyze")
def analyze_eat_avoid(data: EatAvoidRequest):
    try:
        condition = data.condition.strip()

        if not condition:
            raise HTTPException(
                status_code=400,
                detail="Please enter a health condition.",
            )

        if data.age < 1 or data.age > 120:
            raise HTTPException(
                status_code=400,
                detail="Please enter a valid age.",
            )

        eat_avoid_payload = json.dumps(
            data.model_dump(),
            sort_keys=True,
            separators=(",", ":"),
        )
        guard_ai_request(
            _request_fingerprint("eat-avoid", eat_avoid_payload)
        )

        prompt = f"""
You are the nutrition decision-support component of AuraHealth.

USER INFORMATION:
Age: {data.age}
Health condition or concern: {condition}
Goal: {data.goal or "Not provided"}
Dietary preferences: {data.dietary_preferences or "Not provided"}
Additional context: {data.additional_context or "None provided"}

Provide general educational food guidance relevant to the stated
condition or concern.

Return valid JSON exactly in this structure:

{{
  "condition": "",
  "nutrition_focus": "",
  "foods_to_prioritize": [
    {{
      "food": "",
      "reason": ""
    }}
  ],
  "foods_to_limit": [
    {{
      "food": "",
      "reason": ""
    }}
  ],
  "meal_ideas": [],
  "practical_tips": [],
  "important_considerations": [],
  "confidence": ""
}}

Rules:
- This is educational nutrition guidance, not a medical diet prescription.
- Do not diagnose the user.
- Do not claim food can cure the condition.
- Do not recommend supplements, medicines, or medication doses.
- Do not recommend stopping or changing prescribed medication.
- Use "foods_to_limit" rather than claiming a food is universally forbidden.
- Consider the user's age.
- Respect dietary preferences when provided.
- Keep recommendations practical and based on generally accepted
  nutrition principles.
- Avoid extreme restriction.
- If the condition requires highly individualized nutrition management,
  clearly mention this in important_considerations.
- If information is insufficient, say so rather than inventing details.
- meal_ideas must be simple examples, not rigid meal prescriptions.
- confidence must be High, Medium, or Low.
"""

        result = gemini_json(prompt, TEXT_MODELS)

        result["medical_notice"] = (
            "AuraHealth provides general educational nutrition guidance, "
            "not an individualized medical diet. Nutrition needs can vary "
            "with medical conditions, medications, laboratory results, "
            "allergies, pregnancy, and other factors. Consult an appropriate "
            "healthcare professional or registered dietitian when needed."
        )

        return result

    except HTTPException:
        raise
    except Exception as error:
        print("Eat/Avoid error:", error)
        raise HTTPException(
            status_code=500,
            detail=(
                "Nutrition guidance is temporarily unavailable. "
                "Please try again."
            ),
        )
