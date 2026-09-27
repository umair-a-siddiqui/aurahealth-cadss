"use client";

import { ChangeEvent, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type TestResult = {

  test_name: string;

  value: string;

  unit: string;

  reference_range: string;

  status: "Low" | "Normal" | "High" | "Unknown" | string;

  explanation: string;

};

type LabResult = {

  report_type?: string;

  patient_name?: string;

  report_date?: string;

  summary?: string;

  tests?: TestResult[];

  important_findings?: string[];

  questions_for_doctor?: string[];

  image_quality?: string;

  confidence?: string;

  medical_notice?: string;

};

export default function LabReportPage() {

  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [result, setResult] = useState<LabResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function handleFile(event: ChangeEvent<HTMLInputElement>) {

    const selected = event.target.files?.[0];

    if (!selected) return;

    setFile(selected);

    setResult(null);

    setError("");

    if (selected.type.startsWith("image/")) {

      setPreview(URL.createObjectURL(selected));

    } else {

      setPreview(null);

    }

  }

  async function analyzeReport() {

    if (!file) {

      setError("Please upload a laboratory report first.");

      return;

    }

    setLoading(true);

    setError("");

    setResult(null);

    try {

      const formData = new FormData();

      formData.append("report", file);

      const response = await fetch(

        `${API_BASE_URL}/lab-report/analyze`,

        {

          method: "POST",

          body: formData,

        }

      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(

          data.detail || "Could not analyze the laboratory report."

        );

      }

      setResult(data);

      try {
        const historyKey = "aurahealth_history";
        const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const history = Array.isArray(existing) ? existing : [];

        const reportTitle =
          data.report_type ||
          file.name ||
          "Laboratory report";

        const detectedTests = Array.isArray(data.tests) ? data.tests.length : 0;

        history.unshift({
          id: `lab-report-${Date.now()}`,
          module: "Lab Report AI",
          title: reportTitle,
          summary:
            data.summary ||
            `${detectedTests} laboratory test${detectedTests === 1 ? "" : "s"} detected.`,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
          historyKey,
          JSON.stringify(history.slice(0, 100))
        );
      } catch {
        // History saving must never interrupt a successful lab report analysis.
      }

    } catch (err) {

      setError(

        err instanceof Error

          ? err.message

          : "Something went wrong while analyzing the report."

      );

    } finally {

      setLoading(false);

    }

  }

  function statusStyle(status: string) {

    switch (status?.toLowerCase()) {

      case "normal":

        return "border-[#bfe5dc] bg-[#edf9f6] text-[#168b7c]";

      case "high":

        return "border-[#efc7ca] bg-[#fff2f3] text-[#b64c56]";

      case "low":

        return "border-[#ead9aa] bg-[#fff8e8] text-[#a47722]";

      default:

        return "border-[#dce6e8] bg-[#f5f8f9] text-[#788e95]";

    }

  }

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

            <p className="text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">AI DOCUMENT ANALYSIS</p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Lab Report AI</h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">

              Upload a laboratory report to organize visible results, compare values only with the reference ranges printed on the report, and explain the findings in clear language.

            </p>

          </div>

        </div>

      </header>

      <section className="mx-auto -mt-9 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">

        <div className="grid items-start gap-6 xl:grid-cols-[0.86fr_1.14fr]">

          <section className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

            <div className="border-b border-[#e8eff1] px-6 py-5">

              <p className="text-sm font-semibold text-[#183b47]">Laboratory Report</p>

              <p className="mt-1 text-[10px] text-[#8299a2]">PDF, JPG, PNG or WEBP • Maximum 10 MB</p>

            </div>

            <div className="p-6">

              <label className="group flex min-h-[310px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[22px] border border-dashed border-[#b9d7d4] bg-[#f7fbfa] p-5 text-center transition hover:border-[#6dbbad] hover:bg-[#f2faf8]">

                {preview ? (

                  <img src={preview} alt="Lab report preview" className="max-h-[360px] w-full rounded-xl object-contain" />

                ) : file ? (

                  <div>

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f7f4] text-2xl">📄</div>

                    <p className="mt-5 max-w-[300px] truncate text-sm font-semibold text-[#34545e]">{file.name}</p>

                    <p className="mt-2 text-[10px] text-[#8ca0a7]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                    <p className="mt-5 text-[10px] font-semibold text-[#168f80]">Click to choose another report</p>

                  </div>

                ) : (

                  <div>

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8f7f4] text-2xl text-[#168f80]">↑</div>

                    <p className="mt-5 text-sm font-semibold text-[#34545e]">Upload a lab report</p>

                    <p className="mt-2 text-xs text-[#879ba2]">Click to browse from your computer</p>

                    <div className="mt-5 inline-flex rounded-lg border border-[#dce9e8] bg-white px-3 py-2 text-[9px] font-medium text-[#779096]">

                      PDF · JPG · PNG · WEBP

                    </div>

                  </div>

                )}

                <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />

              </label>

              {file && (

                <div className="mt-4 flex items-center justify-between rounded-xl border border-[#dce8e8] bg-[#fafcfc] px-4 py-3">

                  <div className="min-w-0">

                    <p className="truncate text-xs font-semibold text-[#46636c]">{file.name}</p>

                    <p className="mt-1 text-[9px] text-[#8ba0a6]">Ready for analysis</p>

                  </div>

                  <span className="ml-4 h-2.5 w-2.5 shrink-0 rounded-full bg-[#27aa93]" />

                </div>

              )}

              <button onClick={analyzeReport} disabled={!file || loading}

                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#139f8d] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(19,159,141,.18)] transition hover:bg-[#108f80] disabled:cursor-not-allowed disabled:bg-[#c8d5d8] disabled:shadow-none">

                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Analyzing report...</> : <>Analyze Lab Report <span>→</span></>}

              </button>

              {error && (

                <div className="mt-4 rounded-2xl border border-[#efcaca] bg-[#fff6f6] p-4 text-xs leading-5 text-[#a05454]">

                  <span className="font-semibold">Analysis failed:</span> {error}

                </div>

              )}

            </div>

          </section>

          <section className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

            <div className="flex items-center justify-between border-b border-[#e8eff1] px-6 py-5">

              <div>

                <p className="text-sm font-semibold text-[#183b47]">Report Analysis</p>

                <p className="mt-1 text-[10px] text-[#8299a2]">Extracted findings and report context</p>

              </div>

              <span className={`rounded-full border px-3 py-1.5 text-[8px] font-bold tracking-[0.1em] ${

                result ? "border-[#bfe6df] bg-[#effaf8] text-[#168b7c]" : "border-[#e1e9eb] bg-[#f8fafb] text-[#91a3aa]"

              }`}>

                {loading ? "ANALYZING" : result ? "COMPLETE" : "STANDBY"}

              </span>

            </div>

            <div className="min-h-[570px] p-6">

              {loading ? (

                <div className="flex min-h-[510px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7f4]">

                    <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#159d8b]/20 border-t-[#159d8b]" />

                  </div>

                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Reading your report</h2>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                    AuraHealth is extracting visible laboratory values and the reference ranges printed on the document.

                  </p>

                </div>

              ) : !result ? (

                <div className="flex min-h-[510px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf7f5] text-3xl">🧪</div>

                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Your report analysis</h2>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                    Upload a readable laboratory report to extract values and organize them using the document&apos;s own printed reference ranges.

                  </p>

                  <div className="mt-7 grid w-full max-w-[420px] grid-cols-3 gap-2">

                    {["Extract", "Compare", "Explain"].map((item) => (

                      <div key={item} className="rounded-xl border border-[#e2ebed] bg-[#fafcfc] p-3 text-[9px] font-medium text-[#6f8991]">{item}</div>

                    ))}

                  </div>

                </div>

              ) : (

                <ReportOverview result={result} />

              )}

            </div>

          </section>

        </div>

        {result?.tests && result.tests.length > 0 && (

          <section className="mt-6 overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_14px_45px_rgba(23,70,84,.06)]">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8eff1] px-6 py-5">

              <div>

                <p className="text-sm font-semibold text-[#183b47]">Laboratory Values</p>

                <p className="mt-1 text-[10px] text-[#8299a2]">Status is based only on the reference range printed on the report</p>

              </div>

              <span className="rounded-full border border-[#dce7e9] bg-[#f8fafb] px-3 py-1.5 text-[9px] font-semibold text-[#718990]">

                {result.tests.length} tests detected

              </span>

            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

              {result.tests.map((test, index) => (

                <div key={`${test.test_name}-${index}`} className="rounded-2xl border border-[#e0eaec] bg-[#fafcfc] p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <p className="text-xs font-semibold text-[#4b6871]">{test.test_name}</p>

                      <div className="mt-2 flex flex-wrap items-baseline gap-2">

                        <span className="text-2xl font-semibold text-[#234752]">{test.value}</span>

                        <span className="text-[10px] text-[#8a9da3]">{test.unit}</span>

                      </div>

                    </div>

                    <span className={`shrink-0 rounded-full border px-3 py-1 text-[9px] font-semibold ${statusStyle(test.status)}`}>

                      {test.status || "Unknown"}

                    </span>

                  </div>

                  <div className="mt-5 border-t border-[#e6edef] pt-4">

                    <p className="text-[8px] font-bold tracking-[0.13em] text-[#91a2a8]">REPORT REFERENCE RANGE</p>

                    <p className="mt-2 text-xs font-medium text-[#536f77]">{test.reference_range || "Not provided"}</p>

                  </div>

                  {test.explanation && <p className="mt-4 text-[10px] leading-5 text-[#748b92]">{test.explanation}</p>}

                </div>

              ))}

            </div>

          </section>

        )}

        {result?.questions_for_doctor && result.questions_for_doctor.length > 0 && (

          <section className="mt-6 rounded-[26px] border border-[#dce8eb] bg-white p-6 shadow-[0_14px_45px_rgba(23,70,84,.06)]">

            <p className="text-[9px] font-bold tracking-[0.16em] text-[#168f80]">CLINICIAN DISCUSSION</p>

            <h2 className="mt-2 text-lg font-semibold text-[#294c57]">Questions you may discuss with a clinician</h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">

              {result.questions_for_doctor.map((question, index) => (

                <div key={index} className="flex gap-3 rounded-xl border border-[#e1eaec] bg-[#fafcfc] p-4 text-xs leading-6 text-[#617b83]">

                  <span className="font-semibold text-[#169d8b]">{String(index + 1).padStart(2, "0")}.</span>

                  <span>{question}</span>

                </div>

              ))}

            </div>

          </section>

        )}

        <div className="mt-6 flex gap-4 rounded-[24px] border border-[#eadfbd] bg-[#fffbef] p-6">

          <div className="text-xl text-[#b7892d]">⚕</div>

          <div>

            <p className="text-[9px] font-bold tracking-[0.16em] text-[#a77b26]">MEDICAL SAFETY</p>

            <p className="mt-2 text-xs leading-6 text-[#766a4f]">

              {result?.medical_notice || "AuraHealth provides educational clinical decision support and does not replace professional interpretation, diagnosis, or treatment. Discuss laboratory findings with a qualified healthcare professional."}

            </p>

          </div>

        </div>

      </section>

    </main>

  );

}

function ReportOverview({ result }: { result: LabResult }) {

  const visibleName = result.patient_name && result.patient_name !== "Not visible" ? result.patient_name : "";

  const visibleDate = result.report_date && result.report_date !== "Not visible" ? result.report_date : "";

  return (

    <div className="space-y-5">

      <div className="rounded-[22px] bg-gradient-to-br from-[#093b47] to-[#0b7169] p-6 text-white">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <p className="text-[8px] font-bold tracking-[0.17em] text-[#8de7da]">REPORT IDENTIFIED</p>

            <h2 className="mt-2 text-2xl font-semibold">{result.report_type || "Laboratory Report"}</h2>

            {(visibleName || visibleDate) && (

              <p className="mt-2 text-[10px] text-[#b9dcda]">

                {[visibleName, visibleDate].filter(Boolean).join(" • ")}

              </p>

            )}

          </div>

          {result.confidence && (

            <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[9px] font-semibold text-[#c4ebe5]">

              {result.confidence} confidence

            </span>

          )}

        </div>

        {result.image_quality && (

          <p className="mt-4 text-[9px] text-white/55">Document quality: {result.image_quality}</p>

        )}

      </div>

      {result.summary && (

        <div className="rounded-2xl border border-[#cfe8e4] bg-[#f3faf8] p-5">

          <p className="text-[8px] font-bold tracking-[0.15em] text-[#168f80]">REPORT SUMMARY</p>

          <p className="mt-3 text-xs leading-6 text-[#486970]">{result.summary}</p>

        </div>

      )}

      {!!result.important_findings?.length && (

        <div>

          <p className="text-xs font-semibold text-[#385964]">Important findings</p>

          <div className="mt-3 space-y-2">

            {result.important_findings.map((finding, index) => (

              <div key={index} className="flex gap-3 rounded-xl border border-[#eadfbd] bg-[#fffbef] p-4 text-xs leading-6 text-[#766747]">

                <span className="text-[#c4912d]">!</span>

                <span>{finding}</span>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>

  );

}
