"use client";

import { FormEvent, useState } from "react";

type DrugSafetyResult = {
  status?: string;

  summary?: string;

  interaction_evidence?: string[];

  important_warnings?: string[];

  questions_for_pharmacist?: string[];

  confidence?: string;

  drug_1?: string;

  drug_2?: string;

  drug_1_found?: boolean;

  drug_2_found?: boolean;

  drug_1_interactions?: string;

  drug_2_interactions?: string;

  warnings?: string[];

  medical_notice?: string;
};

export default function DrugSafetyPage() {
  const [drug1, setDrug1] = useState("");

  const [drug2, setDrug2] = useState("");

  const [result, setResult] = useState<DrugSafetyResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function checkSafety(event: FormEvent) {
    event.preventDefault();

    if (!drug1.trim() || !drug2.trim()) {
      setError("Please enter both medicine names.");

      return;
    }

    if (drug1.trim().toLowerCase() === drug2.trim().toLowerCase()) {
      setError("Please enter two different medicines.");

      return;
    }

    setLoading(true);

    setError("");

    setResult(null);

    try {
      const response = await fetch(

        "http://127.0.0.1:8000/drug-safety/check",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            drug_1: drug1.trim(),

            drug_2: drug2.trim(),
          }),
        }

      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(

          data.detail || "Could not complete the drug safety check."

        );
      }      setResult(data);

      try {
        const historyKey = "aurahealth_history";
        const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const history = Array.isArray(existing) ? existing : [];

        history.unshift({
          id: `drug-safety-${Date.now()}`,
          module: "Drug Safety",
          title: `${data.drug_1 || drug1.trim()} + ${data.drug_2 || drug2.trim()}`,
          summary: data.summary || data.status || "Drug safety review completed.",
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
          historyKey,
          JSON.stringify(history.slice(0, 100))
        );
      } catch {
        // History saving must never interrupt a successful drug-safety result.
      }
    } catch (err) {
      setError(

        err instanceof Error

          ? err.message

          : "Something went wrong while checking these medicines."

      );
    } finally {
      setLoading(false);
    }
  }

  function statusStyle(status?: string) {
    switch (status?.toLowerCase()) {
      case "interaction found":

        return {
          badge:

            "border-rose-400/30 bg-rose-400/10 text-rose-300",

          panel:

            "border-rose-400/20 bg-rose-400/[0.06]",

          dot: "bg-rose-400",
        };

      case "no specific interaction found":

        return {
          badge:

            "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",

          panel:

            "border-emerald-400/20 bg-emerald-400/[0.05]",

          dot: "bg-emerald-400",
        };

      default:

        return {
          badge:

            "border-amber-400/30 bg-amber-400/10 text-amber-300",

          panel:

            "border-amber-400/20 bg-amber-400/[0.05]",

          dot: "bg-amber-400",
        };
    }
  }

  const status = statusStyle(result?.status);

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

            <p className="text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">MEDICATION SAFETY</p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Drug Safety</h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">

              Compare two medicines using available FDA labeling and receive a structured review of interaction evidence and important warnings.

            </p>

          </div>

        </div>

      </header>

      <section className="mx-auto -mt-9 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">

        <div className="grid items-start gap-6 xl:grid-cols-[0.88fr_1.12fr]">

          <form onSubmit={checkSafety} className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

            <div className="border-b border-[#e8eff1] px-6 py-5">

              <p className="text-sm font-semibold text-[#183b47]">Compare Medicines</p>

              <p className="mt-1 text-[10px] text-[#8299a2]">Generic medicine names usually provide the best results</p>

            </div>

            <div className="p-6">

              <DrugField label="First medicine" value={drug1} setValue={setDrug1} placeholder="e.g. Warfarin" />

              <div className="my-4 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#e3ecee]" />

                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dce7e9] bg-[#f8fafb] text-xs text-[#789099]">+</div>

                <div className="h-px flex-1 bg-[#e3ecee]" />

              </div>

              <DrugField label="Second medicine" value={drug2} setValue={setDrug2} placeholder="e.g. Aspirin" />

              <button type="button" onClick={() => {
                setDrug1("warfarin");

                setDrug2("aspirin");

                setResult(null);

                setError("");
              }} className="mt-4 text-[10px] font-semibold text-[#168f80] hover:underline">

                Try example: Warfarin + Aspirin →

              </button>

              <button type="submit" disabled={loading}

                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#139f8d] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(19,159,141,.18)] transition hover:bg-[#108f80] disabled:cursor-not-allowed disabled:bg-[#c8d5d8] disabled:shadow-none">

                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Checking medicine safety...</> : <>Check Drug Safety <span>→</span></>}

              </button>

              {error && <div className="mt-4 rounded-2xl border border-[#efcaca] bg-[#fff6f6] p-4 text-xs leading-5 text-[#a05454]">{error}</div>}

              <div className="mt-6 border-t border-[#e7eef0] pt-5">

                <p className="text-[8px] font-bold tracking-[0.15em] text-[#91a3aa]">PRIMARY DATA SOURCE</p>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-[#e0e9eb] bg-[#fafcfc] px-4 py-3">

                  <div>

                    <p className="text-xs font-semibold text-[#355660]">FDA Drug Labeling</p>

                    <p className="mt-1 text-[9px] text-[#8ba0a7]">Retrieved through openFDA</p>

                  </div>

                  <span className="h-2 w-2 rounded-full bg-[#28b49f]" />

                </div>

              </div>

            </div>

          </form>

          <section className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

            <div className="flex items-center justify-between border-b border-[#e8eff1] px-6 py-5">

              <div>

                <p className="text-sm font-semibold text-[#183b47]">Safety Review</p>

                <p className="mt-1 text-[10px] text-[#8299a2]">FDA label evidence and AI-assisted summary</p>

              </div>

              <span className={`rounded-full border px-3 py-1.5 text-[8px] font-bold tracking-[0.1em] ${
                result ? "border-[#bfe6df] bg-[#effaf8] text-[#168b7c]" : "border-[#e1e9eb] bg-[#f8fafb] text-[#91a3aa]"
              }`}>

                {loading ? "CHECKING" : result ? "COMPLETE" : "STANDBY"}

              </span>

            </div>

            <div className="min-h-[570px] p-6">

              {loading ? (

                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7f4]">

                    <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#159d8b]/20 border-t-[#159d8b]" />

                  </div>

                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Checking medicine safety</h2>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                    Reviewing available FDA labeling. Results will appear as soon as the check is complete.

                  </p>

                </div>

              ) : !result ? (

                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf7f5] text-3xl text-[#169d8b]">⚕</div>

                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Drug safety results</h2>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                    Enter two different medicines to check available labeling for relevant interaction and warning information.

                  </p>

                  <div className="mt-7 grid w-full max-w-[420px] grid-cols-3 gap-2">

                    {["Search", "Compare", "Explain"].map((item) => (

                      <div key={item} className="rounded-xl border border-[#e2ebed] bg-[#fafcfc] p-3 text-[9px] font-medium text-[#6f8991]">{item}</div>

                    ))}

                  </div>

                </div>

              ) : (

                <DrugResult result={result} drug1={drug1} drug2={drug2} />

              )}

            </div>

          </section>

        </div>

        {!!result?.questions_for_pharmacist?.length && (

          <section className="mt-6 rounded-[26px] border border-[#dce8eb] bg-white p-6 shadow-[0_12px_35px_rgba(23,70,84,.05)]">

            <p className="text-[9px] font-bold tracking-[0.17em] text-[#168f80]">PROFESSIONAL REVIEW</p>

            <h2 className="mt-2 text-lg font-semibold text-[#244853]">Questions to discuss with a pharmacist</h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">

              {result.questions_for_pharmacist.map((question, index) => (

                <div key={index} className="rounded-xl border border-[#e1e9eb] bg-[#fafcfc] p-4 text-xs leading-6 text-[#5c757d]">

                  <span className="mr-2 font-semibold text-[#169d8b]">{String(index + 1).padStart(2, "0")}.</span>

                  {question}

                </div>

              ))}

            </div>

          </section>

        )}

        <div className="mt-6 flex gap-4 rounded-[24px] border border-[#eadfbd] bg-[#fffbef] p-6">

          <div className="text-xl text-[#b7892d]">⚕</div>

          <div>

            <p className="text-[9px] font-bold tracking-[0.16em] text-[#a77b26]">MEDICATION SAFETY</p>

            <p className="mt-2 text-xs leading-6 text-[#766a4f]">

              {result?.medical_notice || "AuraHealth provides educational medication-safety information only. Do not start, stop, or change medicines based only on this tool; confirm concerns with a qualified healthcare professional or pharmacist."}

            </p>

          </div>

        </div>

      </section>

    </main>

  );
}

function DrugField({
  label,

  value,

  setValue,

  placeholder,
}: {
  label: string;

  value: string;

  setValue: (value: string) => void;

  placeholder: string;
}) {
  return (

    <div>

      <label className="mb-2 block text-xs font-semibold text-[#45636d]">{label}</label>

      <div className="relative">

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">💊</span>

        <input

          type="text"

          value={value}

          onChange={(e) => setValue(e.target.value)}

          placeholder={placeholder}

          className="w-full rounded-xl border border-[#d9e5e8] bg-[#fafcfc] py-3.5 pl-11 pr-4 text-sm text-[#294c57] outline-none transition placeholder:text-[#a2b1b6] focus:border-[#58bfae] focus:bg-white focus:ring-2 focus:ring-[#58bfae]/10"

        />

      </div>

    </div>

  );
}

function DrugResult({
  result,

  drug1,

  drug2,
}: {
  result: DrugSafetyResult;

  drug1: string;

  drug2: string;
}) {
  const status = result.status?.toLowerCase();

  const style =

    status === "interaction found"

      ? { panel: "border-[#efc4c4] bg-[#fff5f5]", badge: "border-[#eabcbc] bg-white text-[#b34f4f]", dot: "bg-[#d85d5d]" }

      : status === "no specific interaction found"

      ? { panel: "border-[#bfe5de] bg-[#f1faf8]", badge: "border-[#b7dfd7] bg-white text-[#168b7c]", dot: "bg-[#27b49e]" }

      : { panel: "border-[#ebddae] bg-[#fffbef]", badge: "border-[#e6d39b] bg-white text-[#967124]", dot: "bg-[#d2a43e]" };

  const warnings =

    result.important_warnings?.length ? result.important_warnings : result.warnings || [];

  return (

    <div className="space-y-5">

      <div className="flex flex-wrap items-center gap-2">

        <span className="rounded-xl border border-[#dce7e9] bg-[#f8fafb] px-4 py-2 text-xs font-semibold text-[#395a64]">{result.drug_1 || drug1}</span>

        <span className="text-[#9badb2]">+</span>

        <span className="rounded-xl border border-[#dce7e9] bg-[#f8fafb] px-4 py-2 text-xs font-semibold text-[#395a64]">{result.drug_2 || drug2}</span>

      </div>

      <div className={`rounded-[22px] border p-5 ${style.panel}`}>

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <p className="text-[8px] font-bold tracking-[0.16em] text-[#789099]">SAFETY REVIEW</p>

            <h2 className="mt-2 text-2xl font-semibold text-[#234752]">{result.status || "Assessment"}</h2>

          </div>

          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[9px] font-bold ${style.badge}`}>

            <span className={`h-2 w-2 rounded-full ${style.dot}`} />

            {result.status || "Insufficient Data"}

          </span>

        </div>

        {result.summary && <p className="mt-4 text-xs leading-6 text-[#58737c]">{result.summary}</p>}

      </div>

      <div className="grid grid-cols-2 gap-3">

        <LabelStatus name={result.drug_1 || drug1} found={!!result.drug_1_found} />

        <LabelStatus name={result.drug_2 || drug2} found={!!result.drug_2_found} />

      </div>

      {!!result.interaction_evidence?.length && (

        <EvidenceList title="Interaction evidence" items={result.interaction_evidence} />

      )}

      {!!warnings.length && (

        <div>

          <p className="mb-3 text-xs font-semibold text-[#9b7428]">Important warnings</p>

          <div className="space-y-2">

            {warnings.map((warning, index) => (

              <div key={index} className="flex gap-3 rounded-xl border border-[#eddfb9] bg-[#fffbf1] p-3 text-xs leading-5 text-[#766747]">

                <span className="text-[#c4912d]">!</span>

                <span>{warning}</span>

              </div>

            ))}

          </div>

        </div>

      )}

      {result.confidence && (

        <div className="flex items-center justify-between border-t border-[#e7eef0] pt-5">

          <span className="text-xs text-[#81969d]">Analysis confidence</span>

          <span className="rounded-full border border-[#bfe5de] bg-[#effaf8] px-3 py-1.5 text-[9px] font-semibold text-[#168b7c]">{result.confidence}</span>

        </div>

      )}

    </div>

  );
}

function LabelStatus({ name, found }: { name: string; found: boolean }) {
  return (

    <div className="rounded-xl border border-[#e0e9eb] bg-[#fafcfc] p-4">

      <p className="truncate text-xs font-semibold text-[#355660]">{name}</p>

      <p className={`mt-2 text-[9px] font-medium ${found ? "text-[#168f80]" : "text-[#a77b26]"}`}>

        {found ? "✓ FDA label found" : "No matching FDA label found"}

      </p>

    </div>

  );
}

function EvidenceList({ title, items }: { title: string; items: string[] }) {
  return (

    <div>

      <p className="mb-3 text-xs font-semibold text-[#385964]">{title}</p>

      <div className="space-y-2">

        {items.map((item, index) => (

          <div key={index} className="flex gap-3 rounded-xl border border-[#d5e9e5] bg-[#f6fbfa] p-4 text-xs leading-6 text-[#55716f]">

            <span className="font-semibold text-[#169d8b]">{String(index + 1).padStart(2, "0")}</span>

            <span>{item}</span>

          </div>

        ))}

      </div>

    </div>

  );
}
