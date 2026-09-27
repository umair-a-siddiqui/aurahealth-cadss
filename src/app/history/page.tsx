"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Clock3,
  Download,
  FileClock,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trash2,
  Utensils,
  TestTube2,
} from "lucide-react";

type HistoryItem = {
  id: string;
  module: string;
  title: string;
  summary?: string;
  createdAt: string;
};


const HISTORY_KEY = "aurahealth_history";

const MODULES = [
  { name: "Medicine Scanner", icon: Pill },
  { name: "Clinical Triage", icon: Stethoscope },
  { name: "Drug Safety", icon: ShieldCheck },
  { name: "Metabolic Health", icon: Activity },
  { name: "Eat / Avoid", icon: Utensils },
  { name: "Blood Compatibility", icon: HeartPulse },
  { name: "Lab Report AI", icon: TestTube2 },
];

function getIcon(module: string) {
  return MODULES.find((item) => item.name === module)?.icon ?? Sparkles;
}


export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, []);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? items
        : items.filter((item) => item.module === filter),
    [filter, items]
  );

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    setItems([]);
  }

  function generatePdfReport() {
    if (items.length === 0) return;

    window.print();
  }

  return (
    <main className="min-h-screen bg-[#f4f8fa] text-[#173b47]">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 14mm;
          }

          html,
          body {
            background: white !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <section className="hidden print:block print:bg-white print:text-[#173b47]">
        <div className="mb-6 rounded-[18px] bg-[#082c39] p-7 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#64ddcb] text-[#073743]">
              ✚
            </div>
            <div>
              <p className="text-sm font-semibold">AuraHealth</p>
              <p className="text-[8px] tracking-[0.16em] text-white/60">
                CLINICAL INTELLIGENCE
              </p>
            </div>
          </div>

          <p className="mt-7 text-[9px] font-bold tracking-[0.18em] text-[#83e7d9]">
            HEALTH ACTIVITY REPORT
          </p>
          <h1 className="mt-2 text-3xl font-semibold">AuraHealth Health Summary</h1>
          <p className="mt-3 text-xs text-white/70">
            Generated {new Date().toLocaleString()}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#dce8eb] bg-[#f8fbfb] p-4">
            <p className="text-[8px] font-bold tracking-[0.12em] text-[#8299a2]">
              SAVED ACTIVITIES
            </p>
            <p className="mt-2 text-xl font-semibold text-[#294c57]">{items.length}</p>
          </div>
          <div className="rounded-2xl border border-[#dce8eb] bg-[#f8fbfb] p-4">
            <p className="text-[8px] font-bold tracking-[0.12em] text-[#8299a2]">
              MODULES USED
            </p>
            <p className="mt-2 text-xl font-semibold text-[#294c57]">
              {new Set(items.map((item) => item.module)).size}
            </p>
          </div>
        </div>

        <div className="mb-3 text-[9px] font-bold tracking-[0.16em] text-[#168f80]">
          ACTIVITY TIMELINE
        </div>

        <div className="space-y-3">
          {items
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((item, index) => (
              <article
                key={`print-${item.id}`}
                className="break-inside-avoid rounded-2xl border border-[#e0eaec] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[8px] font-bold tracking-[0.13em] text-[#159c8a]">
                      {String(index + 1).padStart(2, "0")} · {item.module.toUpperCase()}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-[#31535d]">
                      {item.title}
                    </h3>
                  </div>
                  <time className="shrink-0 text-[8px] text-[#95a6ac]">
                    {new Date(item.createdAt).toLocaleString()}
                  </time>
                </div>

                {item.summary && (
                  <p className="mt-3 text-xs leading-6 text-[#708790]">
                    {item.summary}
                  </p>
                )}
              </article>
            ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#eadfbd] bg-[#fffbef] p-4 text-[9px] leading-5 text-[#766a4f]">
          <strong>Medical and privacy notice:</strong> This report is generated from
          AuraHealth&apos;s locally stored hackathon-demo activity. It is educational
          decision support only and is not a diagnosis, treatment plan, prescription,
          or secure electronic medical record.
        </div>
      </section>

      <div className="print:hidden">
      <nav className="border-b border-white/10 bg-[#082c39]">
        <div className="mx-auto flex h-[70px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#64ddcb] text-[#073743]">
              ✚
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AuraHealth</p>
              <p className="text-[8px] tracking-[0.16em] text-white/35">
                CLINICAL INTELLIGENCE
              </p>
            </div>
          </a>

          <a
            href="/"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[10px] font-medium text-white/65 transition hover:bg-white/[0.1] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </a>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-[#082b38] via-[#0a3947] to-[#0b5960] px-5 pb-20 pt-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">
            <FileClock className="h-3.5 w-3.5" />
            HEALTH ACTIVITY
          </div>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                AuraHealth History
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">
                A single timeline for clinical tools you use across AuraHealth.
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={generatePdfReport}
                className="flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/[0.09] px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/[0.14]"
              >
                <Download className="h-4 w-4" />
                Generate PDF Report
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto -mt-9 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">
          <div className="flex flex-col gap-4 border-b border-[#e8eff1] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#183b47]">
                Activity Timeline
              </p>
              <p className="mt-1 text-[10px] text-[#8299a2]">
                {items.length} saved{" "}
                {items.length === 1 ? "activity" : "activities"}
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex w-fit items-center gap-2 rounded-xl border border-[#efd9d9] bg-[#fff8f8] px-4 py-2.5 text-[10px] font-semibold text-[#b45d5d] transition hover:bg-[#fff1f1]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear History
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-[#edf2f3] p-4">
            {["All", ...MODULES.map((item) => item.name)].map((name) => (
              <button
                key={name}
                onClick={() => setFilter(name)}
                className={`shrink-0 rounded-full px-4 py-2 text-[9px] font-semibold transition ${
                  filter === name
                    ? "bg-[#123f4b] text-white"
                    : "border border-[#e0eaec] bg-[#f8fbfb] text-[#718990] hover:bg-[#edf7f5]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex min-h-[430px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#eaf8f5]">
                <Clock3 className="h-8 w-8 text-[#159c8a]" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-[#294b56]">
                {items.length === 0
                  ? "No health activity yet"
                  : "No activity in this category"}
              </h2>
              <p className="mt-3 max-w-md text-xs leading-6 text-[#718990]">
                {items.length === 0
                  ? "Your AuraHealth module activity will appear here after you use a connected health tool."
                  : "Choose another category to view saved activity."}
              </p>
              {items.length === 0 && (
                <a
                  href="/#departments"
                  className="mt-6 rounded-xl bg-[#159d8b] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#118c7d]"
                >
                  Explore Health Tools
                </a>
              )}
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              <div className="relative space-y-4 before:absolute before:bottom-5 before:left-[22px] before:top-5 before:w-px before:bg-[#dce9e8]">
                {filtered
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((item) => {
                    const Icon = getIcon(item.module);

                    return (
                      <article
                        key={item.id}
                        className="relative flex gap-4 rounded-2xl border border-[#e0eaec] bg-[#fbfdfd] p-4 sm:p-5"
                      >
                        <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d8ebe7] bg-[#eaf8f5]">
                          <Icon className="h-4 w-4 text-[#159c8a]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[9px] font-bold tracking-[0.13em] text-[#159c8a]">
                              {item.module.toUpperCase()}
                            </p>
                            <time className="text-[9px] text-[#95a6ac]">
                              {new Date(item.createdAt).toLocaleString()}
                            </time>
                          </div>

                          <h3 className="mt-2 text-sm font-semibold text-[#31535d]">
                            {item.title}
                          </h3>

                          {item.summary && (
                            <p className="mt-2 text-xs leading-6 text-[#708790]">
                              {item.summary}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4 rounded-[24px] border border-[#cfe7e3] bg-[#f3faf8] p-6">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#168f80]" />
          <div>
            <p className="text-[9px] font-bold tracking-[0.16em] text-[#168f80]">
              LOCAL DEMO HISTORY
            </p>
            <p className="mt-2 text-xs leading-6 text-[#6d858c]">
              History is stored locally in this browser for the hackathon demo.
              The generated report is created locally from that saved activity.
              AuraHealth History is not a secure electronic medical record and
              should not be used to store sensitive medical records.
            </p>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
