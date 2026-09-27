"use client";

import { FormEvent, useState } from "react";

type TriageResult = {
  urgency_level?: string;
  urgency_title?: string;
  summary?: string;
  possible_categories?: string[];
  red_flags?: string[];
  recommended_action?: string;
  self_care?: string[];
  monitor_for?: string[];
  questions_for_clinician?: string[];
  confidence?: string;
  medical_notice?: string;
};

export default function TriagePage() {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [medicalContext, setMedicalContext] = useState("");

  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!age || !symptoms.trim() || !duration.trim()) {
      setError("Please complete age, symptoms and duration.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/triage/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            age: Number(age),
            sex,
            symptoms,
            duration,
            severity,
            medical_context: medicalContext,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Clinical triage is temporarily unavailable."
        );
      }

      setResult(data);

      // Save successful triage activity to AuraHealth History.
      try {
        const historyKey = "aurahealth_history";
        const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const history = Array.isArray(existing) ? existing : [];

        history.unshift({
          id: `triage-${Date.now()}`,
          module: "Clinical Triage",
          title: data.urgency_title || data.urgency_level || "Triage assessment",
          summary:
            data.summary ||
            `Symptoms: ${symptoms.trim()} • Severity: ${severity}`,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 100)));
      } catch {
        // History saving must never interrupt a successful triage result.
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during triage."
      );
    } finally {
      setLoading(false);
    }
  }

  function urgencyStyle(level?: string) {
    switch (level?.toLowerCase()) {
      case "emergency":
        return {
          badge:
            "border-rose-400/30 bg-rose-400/10 text-rose-300",
          box:
            "border-rose-400/25 bg-rose-400/[0.07]",
          dot: "bg-rose-400",
        };

      case "urgent":
        return {
          badge:
            "border-orange-400/30 bg-orange-400/10 text-orange-300",
          box:
            "border-orange-400/25 bg-orange-400/[0.07]",
          dot: "bg-orange-400",
        };

      case "soon":
        return {
          badge:
            "border-amber-400/30 bg-amber-400/10 text-amber-300",
          box:
            "border-amber-400/25 bg-amber-400/[0.07]",
          dot: "bg-amber-400",
        };

      case "routine":
        return {
          badge:
            "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
          box:
            "border-emerald-400/25 bg-emerald-400/[0.07]",
          dot: "bg-emerald-400",
        };

      default:
        return {
          badge:
            "border-slate-400/20 bg-slate-400/10 text-slate-300",
          box:
            "border-slate-400/20 bg-slate-400/[0.05]",
          dot: "bg-slate-400",
        };
    }
  }

  const urgency = urgencyStyle(result?.urgency_level);

  return (
    <main className="min-h-screen bg-[#f4f8fa] text-[#173b47]">
      <nav className="border-b border-white/10 bg-[#082c39]">
        <div className="mx-auto flex h-[70px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#64ddcb] text-[#073743]">✚</div>
            <div>
              <p className="text-sm font-semibold text-white">AuraHealth</p>
              <p className="text-[8px] tracking-[0.16em] text-white/35">CLINICAL INTELLIGENCE</p>
            </div>
          </a>
          <a href="/" className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[10px] font-medium text-white/65 transition hover:bg-white/[0.1] hover:text-white">
            All Tools →
          </a>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-[#082b38] via-[#0a3947] to-[#0b5960] px-5 pb-20 pt-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <a href="/" className="text-xs text-white/55 hover:text-white">← Health Tools</a>
          <div className="mt-7 max-w-3xl">
            <p className="text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">AURAHEALTH TRIAGE</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Clinical Triage</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">
              Describe the current symptoms to receive an educational urgency assessment, warning signs and practical next steps.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto -mt-9 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSubmit} className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">
            <div className="border-b border-[#e8eff1] px-6 py-5">
              <p className="text-sm font-semibold text-[#183b47]">Patient Information</p>
              <p className="mt-1 text-[10px] text-[#8299a2]">Tell AuraHealth what is happening now</p>
            </div>

            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Age">
                  <input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 22" className={inputClass} />
                </Field>
                <Field label="Sex">
                  <select value={sex} onChange={(e) => setSex(e.target.value)} className={inputClass}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </Field>
              </div>

              <div className="mt-5">
                <Field label="What symptoms are you experiencing?">
                  <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={5} placeholder="Example: Sore throat, mild cough and runny nose..." className={`${inputClass} resize-none`} />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="How long have you had these symptoms?">
                  <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 2 days" className={inputClass} />
                </Field>
              </div>

              <div className="mt-5">
                <label className="mb-3 block text-xs font-semibold text-[#45636d]">How severe do the symptoms feel?</label>
                <div className="grid grid-cols-3 gap-2">
                  {["mild", "moderate", "severe"].map((level) => (
                    <button type="button" key={level} onClick={() => setSeverity(level)}
                      className={`rounded-xl border px-3 py-3 text-xs font-semibold capitalize transition ${
                        severity === level
                          ? level === "severe"
                            ? "border-[#e9b6b6] bg-[#fff3f3] text-[#b44f4f]"
                            : level === "moderate"
                            ? "border-[#ead7a8] bg-[#fff9e9] text-[#9a7425]"
                            : "border-[#b9e3dc] bg-[#effaf8] text-[#168b7c]"
                          : "border-[#dce7e9] bg-[#fafcfc] text-[#738a92] hover:bg-[#f4f8f9]"
                      }`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <Field label="Additional medical context (optional)">
                  <textarea value={medicalContext} onChange={(e) => setMedicalContext(e.target.value)} rows={3}
                    placeholder="Relevant conditions, medications, recent illness, pregnancy, allergies, etc."
                    className={`${inputClass} resize-none`} />
                </Field>
              </div>

              <button type="submit" disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#139f8d] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(19,159,141,.18)] transition hover:bg-[#108f80] disabled:cursor-not-allowed disabled:bg-[#c8d5d8] disabled:shadow-none">
                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Analyzing symptoms...</> : <>Analyze Symptoms <span>→</span></>}
              </button>

              {error && <div className="mt-4 rounded-2xl border border-[#efcaca] bg-[#fff6f6] p-4 text-xs leading-5 text-[#a05454]">{error}</div>}
            </div>
          </form>

          <section className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">
            <div className="flex items-center justify-between border-b border-[#e8eff1] px-6 py-5">
              <div>
                <p className="text-sm font-semibold text-[#183b47]">Triage Assessment</p>
                <p className="mt-1 text-[10px] text-[#8299a2]">Urgency guidance and clinical considerations</p>
              </div>
              <span className={`rounded-full border px-3 py-1.5 text-[8px] font-bold tracking-[0.1em] ${result ? "border-[#bfe6df] bg-[#effaf8] text-[#168b7c]" : "border-[#e1e9eb] bg-[#f8fafb] text-[#91a3aa]"}`}>
                {loading ? "ANALYZING" : result ? "COMPLETE" : "STANDBY"}
              </span>
            </div>

            <div className="min-h-[610px] p-6">
              {loading ? (
                <div className="flex min-h-[540px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7f4]">
                    <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#159d8b]/20 border-t-[#159d8b]" />
                  </div>
                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Assessing symptoms</h2>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">Reviewing the information for urgency and warning signs. Results will appear as soon as analysis is complete.</p>
                </div>
              ) : !result ? (
                <div className="flex min-h-[540px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf7f5] text-3xl text-[#169d8b]">✚</div>
                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Triage results</h2>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">Complete the symptom information and select Analyze Symptoms to begin.</p>
                  <div className="mt-7 grid w-full max-w-[420px] grid-cols-3 gap-2">
                    {["Assess", "Prioritize", "Guide"].map((item) => <div key={item} className="rounded-xl border border-[#e2ebed] bg-[#fafcfc] p-3 text-[9px] font-medium text-[#6f8991]">{item}</div>)}
                  </div>
                </div>
              ) : (
                <ResultView result={result} urgency={urgency} />
              )}
            </div>
          </section>
        </div>

        {result?.monitor_for && result.monitor_for.length > 0 && (
          <InfoSection eyebrow="REASSESSMENT" title="Monitor for these changes" tone="amber"
            items={result.monitor_for} />
        )}

        {result?.questions_for_clinician && result.questions_for_clinician.length > 0 && (
          <InfoSection eyebrow="PREPARE FOR CARE" title="Questions you may discuss with a clinician" tone="teal"
            items={result.questions_for_clinician} />
        )}

        <div className="mt-6 flex gap-4 rounded-[24px] border border-[#eadfbd] bg-[#fffbef] p-6">
          <div className="text-xl text-[#b7892d]">⚕</div>
          <div>
            <p className="text-[9px] font-bold tracking-[0.16em] text-[#a77b26]">MEDICAL SAFETY</p>
            <p className="mt-2 text-xs leading-6 text-[#766a4f]">
              {result?.medical_notice || "AuraHealth provides educational clinical decision support and does not replace assessment by a qualified healthcare professional. Seek urgent care for severe or rapidly worsening symptoms."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#d9e5e8] bg-[#fafcfc] px-4 py-3 text-sm text-[#294c57] outline-none transition placeholder:text-[#a2b1b6] focus:border-[#58bfae] focus:bg-white focus:ring-2 focus:ring-[#58bfae]/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#45636d]">{label}</label>
      {children}
    </div>
  );
}

function ResultView({
  result,
  urgency,
}: {
  result: TriageResult;
  urgency: { badge: string; box: string; dot: string };
}) {
  const level = result.urgency_level?.toLowerCase();
  const light =
    level === "emergency"
      ? { box: "border-[#efc4c4] bg-[#fff5f5]", badge: "border-[#eabcbc] bg-white text-[#b34f4f]", dot: "bg-[#d85d5d]" }
      : level === "urgent"
      ? { box: "border-[#efd2b9] bg-[#fff8f1]", badge: "border-[#ebc8aa] bg-white text-[#ad682f]", dot: "bg-[#dc8844]" }
      : level === "soon"
      ? { box: "border-[#ebddae] bg-[#fffbef]", badge: "border-[#e6d39b] bg-white text-[#967124]", dot: "bg-[#d2a43e]" }
      : level === "routine"
      ? { box: "border-[#bfe5de] bg-[#f1faf8]", badge: "border-[#b7dfd7] bg-white text-[#168b7c]", dot: "bg-[#27b49e]" }
      : { box: "border-[#dce7e9] bg-[#f8fafb]", badge: "border-[#dce7e9] bg-white text-[#718990]", dot: "bg-[#91a3aa]" };

  return (
    <div className="space-y-5">
      <div className={`rounded-[22px] border p-5 ${light.box}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[8px] font-bold tracking-[0.16em] text-[#789099]">TRIAGE LEVEL</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#234752]">{result.urgency_title || result.urgency_level || "Assessment"}</h2>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[9px] font-bold ${light.badge}`}>
            <span className={`h-2 w-2 rounded-full ${light.dot}`} />
            {result.urgency_level || "Unclear"}
          </span>
        </div>
        {result.summary && <p className="mt-4 text-xs leading-6 text-[#58737c]">{result.summary}</p>}
      </div>

      {result.recommended_action && (
        <ResultCard title="Recommended Next Step" text={result.recommended_action} />
      )}

      {!!result.possible_categories?.length && (
        <div>
          <p className="mb-3 text-xs font-semibold text-[#385964]">Possible symptom categories</p>
          <div className="flex flex-wrap gap-2">
            {result.possible_categories.map((category, index) => (
              <span key={index} className="rounded-full border border-[#dce7e9] bg-[#f8fafb] px-3 py-2 text-[10px] text-[#647e86]">{category}</span>
            ))}
          </div>
        </div>
      )}

      {!!result.red_flags?.length && (
        <ListBlock title="Warning signs to watch for" items={result.red_flags} tone="red" />
      )}

      {!!result.self_care?.length && (
        <ListBlock title="General supportive measures" items={result.self_care} tone="green" />
      )}

      {result.confidence && (
        <div className="flex items-center justify-between border-t border-[#e7eef0] pt-5">
          <span className="text-xs text-[#81969d]">AI confidence</span>
          <span className="rounded-full border border-[#bfe5de] bg-[#effaf8] px-3 py-1.5 text-[9px] font-semibold text-[#168b7c]">{result.confidence}</span>
        </div>
      )}
    </div>
  );
}

function ResultCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#cfe8e4] bg-[#f3faf8] p-5">
      <p className="text-[8px] font-bold tracking-[0.15em] text-[#168f80]">{title.toUpperCase()}</p>
      <p className="mt-3 text-xs leading-6 text-[#486970]">{text}</p>
    </div>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "red" | "green" }) {
  const red = tone === "red";
  return (
    <div>
      <p className={`mb-3 text-xs font-semibold ${red ? "text-[#a85353]" : "text-[#257c70]"}`}>{title}</p>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className={`flex gap-3 rounded-xl border p-3 text-xs leading-5 ${red ? "border-[#f0d0d0] bg-[#fff7f7] text-[#815c5c]" : "border-[#d5e9e5] bg-[#f7fbfa] text-[#55716f]"}`}>
            <span className={red ? "text-[#cf6262]" : "text-[#25a18f]"}>{red ? "!" : "✓"}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoSection({ eyebrow, title, items, tone }: { eyebrow: string; title: string; items: string[]; tone: "amber" | "teal" }) {
  const amber = tone === "amber";
  return (
    <section className="mt-6 rounded-[26px] border border-[#dce8eb] bg-white p-6 shadow-[0_12px_35px_rgba(23,70,84,.05)]">
      <p className={`text-[9px] font-bold tracking-[0.17em] ${amber ? "text-[#aa7e2b]" : "text-[#168f80]"}`}>{eyebrow}</p>
      <h2 className="mt-2 text-lg font-semibold text-[#244853]">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-[#e1e9eb] bg-[#fafcfc] p-4 text-xs leading-6 text-[#5c757d]">
            <span className={`mr-2 font-semibold ${amber ? "text-[#bd8d32]" : "text-[#169d8b]"}`}>{String(index + 1).padStart(2, "0")}.</span>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
