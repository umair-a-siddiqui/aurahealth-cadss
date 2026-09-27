"use client";

import { ChangeEvent, ElementType, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronRight,
  Cross,
  Eye,
  FileImage,
  Info,
  Layers3,
  LoaderCircle,
  Pill,
  ScanLine,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type MedicineResult = {
  medicine_name: string;
  active_ingredients: string[];
  strength: string;
  dosage_form: string;
  main_use: string;
  manufacturer: string;
  expiry_date: string;
  batch_number: string;
  warnings: string[];
  image_quality: string;
  confidence: string;
  medical_notice: string;
};

export default function MedicineScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<MedicineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function loadFile(selected: File | undefined) {
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid medicine image.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError("");
  }

  function selectFile(e: ChangeEvent<HTMLInputElement>) {
    loadFile(e.target.files?.[0]);
    e.target.value = "";
  }

  function removeFile() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");
  }

  async function scanMedicine() {
    if (!file) {
      setError("Please select a medicine image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/medicine/scan`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "AuraHealth could not analyze this medicine image. Please try again."
        );
      }

      // No artificial delay: show the result as soon as the API returns.
      setResult(data);

      // Save a lightweight activity entry for the AuraHealth History page.
      try {
        const historyKey = "aurahealth_history";
        const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const history = Array.isArray(existing) ? existing : [];

        history.unshift({
          id: `medicine-${Date.now()}`,
          module: "Medicine Scanner",
          title: data.medicine_name || "Medicine scan",
          summary: [
            data.active_ingredients?.length
              ? `Ingredient: ${data.active_ingredients.join(", ")}`
              : "",
            data.strength && data.strength !== "Not visible"
              ? `Strength: ${data.strength}`
              : "",
          ]
            .filter(Boolean)
            .join(" • "),
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 100)));
      } catch {
        // History saving must never interrupt a successful medicine scan.
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to AuraHealth AI."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f8fa] text-[#173b47]">
      <TopNavigation />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#082b38] via-[#0a3947] to-[#0b5960] px-5 pb-24 pt-28 sm:px-8 lg:px-12">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#58d7c4]/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#7ed9e8]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1320px]">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/55 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Health Tools
          </a>

          <div className="mt-8 max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#78e2d3]/20 bg-[#78e2d3]/10">
                <Pill className="h-5 w-5 text-[#83e7d9]" />
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">
                  AURAHEALTH VISION
                </p>
                <p className="mt-1 text-[10px] text-white/45">
                  Medicine package analysis
                </p>
              </div>
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Medicine Scanner
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">
              Upload a clear medicine package image. AuraHealth organizes visible
              medicine information into a concise clinical report.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="grid items-start gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]"
          >
            <PanelHeader
              icon={ScanLine}
              title="Medicine Image"
              subtitle="Upload a clear package photo"
              status={file ? "IMAGE READY" : "AWAITING IMAGE"}
              active={!!file}
            />

            <div className="p-5 sm:p-7">
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  loadFile(e.dataTransfer.files?.[0]);
                }}
                className={`relative flex min-h-[390px] cursor-pointer items-center justify-center overflow-hidden rounded-[22px] border transition duration-200 ${
                  dragging
                    ? "border-[#2bbba5] bg-[#eefaf7]"
                    : preview
                      ? "border-[#d4e3e6] bg-[#f5f8f9]"
                      : "border-dashed border-[#cbdde1] bg-[#f9fbfc] hover:border-[#72cfc1] hover:bg-[#f4faf9]"
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectFile}
                  className="hidden"
                />

                {!preview ? (
                  <div className="max-w-[360px] px-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#d8e9e6] bg-white shadow-sm">
                      <Upload className="h-7 w-7 text-[#1ca28f]" />
                    </div>
                    <h2 className="mt-6 text-lg font-semibold text-[#193e4a]">
                      Upload medicine image
                    </h2>
                    <p className="mt-3 text-xs leading-6 text-[#748d96]">
                      Choose or drag a JPG, PNG or WEBP image of the box, bottle
                      or blister pack.
                    </p>
                    <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-xl bg-[#123f4b] px-5 py-3 text-xs font-semibold text-white">
                      <FileImage className="h-4 w-4" />
                      Choose Image
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <img
                      src={preview}
                      alt="Medicine preview"
                      className="max-h-full max-w-full rounded-xl object-contain shadow-[0_14px_35px_rgba(20,55,65,.12)]"
                    />

                    {loading && (
                      <>
                        <motion.div
                          animate={{ top: ["6%", "92%", "6%"] }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="pointer-events-none absolute left-5 right-5"
                        >
                          <div className="h-px bg-[#25c4ac] shadow-[0_0_14px_2px_rgba(37,196,172,.5)]" />
                          <div className="h-10 bg-gradient-to-b from-[#25c4ac]/10 to-transparent" />
                        </motion.div>

                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2 shadow-sm backdrop-blur">
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#169d8b]" />
                          <span className="whitespace-nowrap text-[9px] font-semibold text-[#356c67]">
                            Analyzing medicine...
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </label>

              {file && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#e0e9eb] bg-[#fafcfc] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f7f4]">
                    <FileImage className="h-4 w-4 text-[#169d8b]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#31535e]">
                      {file.name}
                    </p>
                    <p className="mt-1 text-[9px] text-[#91a4aa]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      removeFile();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dce7e9] bg-white text-[#859aa1] transition hover:text-[#c55757] disabled:opacity-40"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <motion.button
                whileTap={file && !loading ? { scale: 0.99 } : {}}
                onClick={scanMedicine}
                disabled={!file || loading}
                className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#139f8d] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(19,159,141,.18)] transition hover:bg-[#108f80] disabled:cursor-not-allowed disabled:bg-[#c8d5d8] disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Analyzing medicine...
                  </>
                ) : (
                  <>
                    <ScanLine className="h-4 w-4" />
                    Scan Medicine
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-2xl border border-[#efcaca] bg-[#fff6f6] p-4"
                  >
                    <div className="flex gap-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#cc5959]" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#9d4c4c]">
                          Analysis unavailable
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#a96363]">
                          {error}
                        </p>
                        {file && (
                          <button
                            type="button"
                            onClick={scanMedicine}
                            className="mt-3 text-[10px] font-semibold text-[#168f80] hover:underline"
                          >
                            Try again
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]"
          >
            <PanelHeader
              icon={ShieldCheck}
              title="Medicine Report"
              subtitle="Structured visible information"
              status={
                result ? "COMPLETE" : loading ? "ANALYZING" : "STANDBY"
              }
              active={!!result || loading}
            />

            <div className="min-h-[560px] p-5 sm:p-7">
              <AnimatePresence mode="wait">
                {loading ? (
                  <LoadingPanel key="loading" />
                ) : result ? (
                  <ResultPanel key="result" result={result} />
                ) : (
                  <EmptyPanel key="empty" hasImage={!!file} />
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pb-20 sm:px-8 lg:px-12">
        <div className="flex gap-4 rounded-[24px] border border-[#d8e7e5] bg-[#f3faf8] p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ddf4ef]">
            <ShieldCheck className="h-5 w-5 text-[#159b89]" />
          </div>
          <div>
            <p className="text-[9px] font-bold tracking-[0.16em] text-[#159987]">
              MEDICAL SAFETY
            </p>
            <p className="mt-2 max-w-5xl text-xs leading-6 text-[#617d86]">
              {result?.medical_notice ??
                "AuraHealth provides educational decision support only. Confirm medicine information using the original packaging or with a qualified healthcare professional."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoadingPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[500px] flex-col items-center justify-center text-center"
    >
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7f4]">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-[#55cdbb]/40"
        />
        <ScanLine className="h-7 w-7 text-[#169d8b]" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-[#244853]">
        Analyzing medicine
      </h3>
      <p className="mt-2 max-w-[360px] text-xs leading-6 text-[#7c929a]">
        Reading visible package information. Results will appear as soon as the
        analysis is complete.
      </p>
      <div className="mt-6 flex items-center gap-2 text-[9px] font-semibold tracking-[0.12em] text-[#55958c]">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        AURAHEALTH VISION
      </div>
    </motion.div>
  );
}

function EmptyPanel({ hasImage }: { hasImage: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[500px] flex-col items-center justify-center text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf7f5]">
        {hasImage ? (
          <ScanLine className="h-7 w-7 text-[#169d8b]" />
        ) : (
          <Pill className="h-7 w-7 text-[#169d8b]" />
        )}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-[#244853]">
        {hasImage ? "Ready to scan" : "Medicine report"}
      </h3>
      <p className="mt-2 max-w-[360px] text-xs leading-6 text-[#7c929a]">
        {hasImage
          ? "Your image is ready. Select Scan Medicine to begin analysis."
          : "Upload a medicine package image to begin."}
      </p>

      <div className="mt-7 grid w-full max-w-[420px] grid-cols-3 gap-2">
        <Capability icon={Eye} label="Visible text" />
        <Capability icon={Layers3} label="Package data" />
        <Capability icon={ShieldCheck} label="Safety aware" />
      </div>
    </motion.div>
  );
}

function ResultPanel({ result }: { result: MedicineResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="rounded-[22px] bg-gradient-to-br from-[#093b47] to-[#0b7169] p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#8ce8da]" />
              <p className="text-[8px] font-bold tracking-[0.17em] text-[#8de7da]">
                IDENTIFIED MEDICINE
              </p>
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
              {result.medicine_name || "Medicine"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#c4e0df]">
              {result.active_ingredients?.length
                ? result.active_ingredients.join(", ")
                : "Ingredient not visible"}
              {result.strength &&
                result.strength !== "Not visible" &&
                ` • ${result.strength}`}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 text-right">
            <p className="text-[7px] tracking-[0.14em] text-white/40">
              CONFIDENCE
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#a5eee3]">
              {result.confidence || "Not stated"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultInfo title="Dosage Form" value={result.dosage_form} icon={Pill} />
        <ResultInfo title="Manufacturer" value={result.manufacturer} icon={Box} />
        <ResultInfo title="Expiry Date" value={result.expiry_date} icon={Eye} />
        <ResultInfo
          title="Batch Number"
          value={result.batch_number}
          icon={Layers3}
        />
      </div>

      <div className="rounded-2xl border border-[#e0eaec] bg-[#f9fbfc] p-5">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-[#159d8b]" />
          <p className="text-[8px] font-bold tracking-[0.15em] text-[#789099]">
            COMMON / MAIN USE
          </p>
        </div>
        <p className="mt-3 text-xs leading-6 text-[#486670]">
          {result.main_use || "Not available"}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#e0eaec] bg-white p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf8f5]">
          <Eye className="h-4 w-4 text-[#159d8b]" />
        </div>
        <div>
          <p className="text-[8px] font-bold tracking-[0.14em] text-[#8ca0a7]">
            IMAGE QUALITY
          </p>
          <p className="mt-1 text-xs font-semibold text-[#31535e]">
            {result.image_quality || "Not stated"}
          </p>
        </div>
      </div>

      {result.warnings?.length > 0 && (
        <div className="rounded-2xl border border-[#f0dfb1] bg-[#fffbef] p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#c69227]" />
            <p className="text-xs font-semibold text-[#8d6b25]">
              Safety & Image Warnings
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {result.warnings.map((warning, index) => (
              <div
                key={`${warning}-${index}`}
                className="flex gap-2.5 text-xs leading-5 text-[#776541]"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d3a746]" />
                {warning}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TopNavigation() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#082c39]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#64ddcb]">
            <Cross className="h-4 w-4 text-[#073743]" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">AuraHealth</span>
            <p className="text-[8px] tracking-[0.16em] text-white/35">
              CLINICAL INTELLIGENCE
            </p>
          </div>
        </a>

        <a
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[10px] font-medium text-white/65 transition hover:bg-white/[0.1] hover:text-white"
        >
          All Tools
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  subtitle,
  status,
  active,
}: {
  icon: ElementType;
  title: string;
  subtitle: string;
  status: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#e8eff1] px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f8f5]">
          <Icon className="h-4 w-4 text-[#149d8b]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#183b47]">{title}</h2>
          <p className="mt-0.5 text-[10px] text-[#8299a2]">{subtitle}</p>
        </div>
      </div>

      <div
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
          active
            ? "border-[#bfe6df] bg-[#effaf8]"
            : "border-[#e1e9eb] bg-[#f8fafb]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active ? "bg-[#29c3ac]" : "bg-[#a9b9be]"
          }`}
        />
        <span
          className={`text-[7px] font-bold tracking-[0.12em] ${
            active ? "text-[#168c7c]" : "text-[#91a3aa]"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function ResultInfo({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[#e0eaec] bg-[#f9fbfc] p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f7f4]">
        <Icon className="h-3.5 w-3.5 text-[#169c8a]" />
      </div>
      <p className="mt-4 text-[8px] font-bold tracking-[0.13em] text-[#91a3aa]">
        {title.toUpperCase()}
      </p>
      <p className="mt-1.5 break-words text-xs font-semibold leading-5 text-[#34545e]">
        {value || "Not visible"}
      </p>
    </div>
  );
}

function Capability({
  icon: Icon,
  label,
}: {
  icon: ElementType;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-[#e2ebed] bg-[#fafcfc] px-2 py-3">
      <Icon className="mx-auto h-3.5 w-3.5 text-[#58aa9e]" />
      <p className="mt-2 text-[8px] font-medium text-[#7e949c]">{label}</p>
    </div>
  );
}
