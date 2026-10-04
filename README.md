<div align="center">

# 🩺 AuraHealth CADSS

### AI-Assisted Clinical Decision Support System

**One intelligent health platform. Seven integrated clinical tools.**

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-00C7B7?style=for-the-badge)](https://aurahealth-cadss.vercel.app/)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render)

<br/>

> ## Understand your health. Make informed decisions.

**AuraHealth CADSS** is a modern AI-assisted healthcare decision-support platform that combines intelligent analysis, deterministic clinical logic, medical data, and a premium clinical interface into one unified system.

<br/>

### 🌐 [Launch AuraHealth CADSS](https://aurahealth-cadss.vercel.app/)

</div>

---

# ✨ About AuraHealth

AuraHealth CADSS is an **AI-Assisted Clinical Decision Support System** designed to help users understand health-related information through a connected digital platform.

Instead of providing only one AI feature, AuraHealth combines **seven integrated healthcare tools** inside one application.

The platform includes:

- 💊 Medicine Scanner
- 🩺 Clinical Triage
- 🛡️ Drug Safety
- ⚡ Metabolic Health
- 🥗 Eat / Avoid
- 🩸 Blood Compatibility
- 🧪 Lab Report AI
- 👤 Patient Profile
- 🕘 Health History

AuraHealth combines **AI assistance, structured medical logic, external drug-label information, deterministic calculations, safety-focused prompts, and modern UI/UX**.

> AuraHealth is designed for educational and clinical decision-support purposes and is not a replacement for professional medical care.

---

# 🚀 Live Application

<div align="center">

## 🌐 [Open AuraHealth CADSS](https://aurahealth-cadss.vercel.app/)

</div>

| Component | Technology |
|---|---|
| 🌐 Frontend | Next.js + Vercel |
| ⚙️ Backend | FastAPI + Render |
| 🤖 AI Engine | Google Gemini |
| 💊 Drug Information | openFDA |
| 🧠 Clinical Logic | Python |
| 🗂️ Patient Data | Browser Local Storage |

---

# 🧭 Core Healthcare Modules

## 💊 1. Medicine Scanner

The Medicine Scanner allows users to upload an image of medicine packaging and receive structured medicine information.

It can organize information such as:

- medicine name
- active ingredients
- strength
- dosage form
- manufacturer information
- visible packaging information
- common medicine purpose
- warnings and safety context

The feature uses multimodal AI to analyze medicine packaging.

**Route:** `/medicine`

---

## 🩺 2. Clinical Triage

Clinical Triage helps users organize symptoms and understand possible urgency.

It considers information such as:

- symptoms
- duration
- severity
- symptom combinations
- possible red flags
- urgency guidance

The system is designed to provide **educational triage support**, not a definitive diagnosis.

**Route:** `/triage`

---

## 🛡️ 3. Drug Safety

The Drug Safety module helps users compare two medicines.

It uses available medication-label information and AI-assisted analysis to provide structured safety information.

The backend can:

- search openFDA drug labels
- compare available medicine information
- review warnings
- provide structured interaction context
- detect insufficient available information
- resolve selected Pakistani medicine brands to their generic ingredients

### Selected Pakistani / Regional Brand Support

| Brand | Generic Ingredient |
|---|---|
| Panadol | Acetaminophen |
| Calpol | Acetaminophen |
| Brufen | Ibuprofen |
| Disprin | Aspirin |
| Ponstan | Mefenamic Acid |
| Flagyl | Metronidazole |
| Augmentin | Amoxicillin + Clavulanate |
| Amoxil | Amoxicillin |
| Zithromax | Azithromycin |
| Nexum | Esomeprazole |
| Risek | Omeprazole |
| Glucophage | Metformin |
| Amaryl | Glimepiride |
| Norvasc | Amlodipine |
| Concor | Bisoprolol |
| Cozaar | Losartan |
| Zyrtec | Cetirizine |
| Telfast | Fexofenadine |
| Ventolin | Albuterol |

> AuraHealth does not claim complete medicine coverage and does not replace pharmacist or physician guidance.

**Route:** `/drug-safety`

---

## ⚡ 4. Metabolic Health

The Metabolic Health module provides structured health and fitness calculations.

It can calculate:

- Basal Metabolic Rate
- Total Daily Energy Expenditure
- calorie estimates
- activity-based energy requirements
- macronutrient estimates
- body-related health metrics

This feature uses **deterministic calculations** instead of relying completely on generative AI.

**Route:** `/metabolic`

---

## 🥗 5. Eat / Avoid

Eat / Avoid provides practical nutrition guidance based on a user's health concern.

The system can provide:

- foods to consider
- foods to limit
- hydration guidance
- nutrition notes
- practical food suggestions
- safety-focused dietary information

The tool is designed for educational use and does not replace a dietitian or medical professional.

**Route:** `/eat-avoid`

---

## 🩸 6. Blood Compatibility

The Blood Compatibility module uses deterministic ABO and Rh blood-group logic.

Supported blood groups:

- O-
- O+
- A-
- A+
- B-
- B+
- AB-
- AB+

The tool provides structured blood-donation compatibility information.

Because the core compatibility logic is deterministic, it does not depend on generative AI.

**Route:** `/blood`

---

## 🧪 7. Lab Report AI

Lab Report AI allows users to upload laboratory reports for structured analysis.

The system can organize:

- test names
- measured values
- units
- reference ranges
- Low / Normal / High status
- abnormal findings
- educational explanations

The feature is designed to help users better understand visible information from laboratory reports.

**Route:** `/lab-report`

---

# 👤 Patient Profile

AuraHealth includes a dedicated Patient Profile section.

Users can store basic patient information locally for a more connected experience.

The profile is stored in the browser using local storage.

**Route:** `/profile`

---

# 🕘 Health History

AuraHealth includes a Health History section where users can review recent tool activity.

The history system supports:

- previous health-tool activity
- local browser storage
- organized result history
- print / save as PDF through the browser

**Route:** `/history`

---

# 🧠 System Architecture

```mermaid
flowchart TD

    A[User] --> B[Next.js Frontend]

    B --> C[FastAPI Backend]

    C --> D[Google Gemini]
    C --> E[openFDA Drug Labels]
    C --> F[Deterministic Clinical Logic]

    D --> G[Structured Results]
    E --> G
    F --> G

    G --> B

    B --> H[Patient Profile]
    B --> I[Health History]

    H --> J[Browser Local Storage]
    I --> J
