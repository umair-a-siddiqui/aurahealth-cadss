"use client";

import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const BLOOD_TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

type Result = {

  blood_type: string;

  can_give_to: string[];

  can_receive_from: string[];

  warning: string;

};

export default function BloodCompatibility() {

  const [selected, setSelected] = useState("O+");

  const [result, setResult] = useState<Result | null>(null);

  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<"give" | "receive">("give");

  const [error, setError] = useState("");

  async function checkBlood(type: string) {

    setSelected(type);

    setLoading(true);

    setError("");

    try {

      const response = await fetch(

        `${API_BASE_URL}/blood/compatibility?type=${encodeURIComponent(type)}`

      );

      if (!response.ok) {

        throw new Error("Unable to check blood compatibility.");

      }

      const data = await response.json();
      setResult(data);

      try {
        const historyKey = "aurahealth_history";
        const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const history = Array.isArray(existing) ? existing : [];

        history.unshift({
          id: `blood-${Date.now()}`,
          module: "Blood Compatibility",
          title: `${data.blood_type || type} blood compatibility`,
          summary: `Can give to: ${(data.can_give_to || []).join(", ")} • Can receive from: ${(data.can_receive_from || []).join(", ")}`,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
          historyKey,
          JSON.stringify(history.slice(0, 100))
        );
      } catch {
        // History saving must never interrupt a successful compatibility check.
      }

    } catch {

      setResult(null);

      setError("Could not check compatibility. Make sure the AuraHealth backend is running.");

    } finally {

      setLoading(false);

    }

  }

  const compatible =

    mode === "give"

      ? result?.can_give_to ?? []

      : result?.can_receive_from ?? [];

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

            <p className="text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">TRANSFUSION REFERENCE</p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Blood Compatibility</h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">

              Explore ABO and Rh red-cell donation and receiving compatibility in a clear clinical reference.

            </p>

          </div>

        </div>

      </header>

      <section className="mx-auto -mt-9 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">

        <div className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

          <div className="flex flex-col gap-4 border-b border-[#e8eff1] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold text-[#183b47]">Compatibility Explorer</p>

              <p className="mt-1 text-[10px] text-[#8299a2]">Select a blood type and choose a compatibility direction</p>

            </div>

            <div className="flex w-fit rounded-xl border border-[#dce7e9] bg-[#f7fafb] p-1">

              <button

                onClick={() => setMode("give")}

                className={`rounded-lg px-4 py-2 text-[10px] font-semibold transition ${

                  mode === "give" ? "bg-[#139f8d] text-white shadow-sm" : "text-[#728990]"

                }`}

              >

                Can Give To

              </button>

              <button

                onClick={() => setMode("receive")}

                className={`rounded-lg px-4 py-2 text-[10px] font-semibold transition ${

                  mode === "receive" ? "bg-[#139f8d] text-white shadow-sm" : "text-[#728990]"

                }`}

              >

                Can Receive From

              </button>

            </div>

          </div>

          <div className="p-6 sm:p-8">

            <p className="text-[9px] font-bold tracking-[0.15em] text-[#849aa1]">SELECT BLOOD TYPE</p>

            <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-8">

              {BLOOD_TYPES.map((type) => (

                <button

                  key={type}

                  onClick={() => checkBlood(type)}

                  className={`min-h-[70px] rounded-2xl border text-lg font-semibold transition ${

                    selected === type

                      ? "border-[#dfaaaa] bg-[#fff3f3] text-[#b84d55] shadow-[0_8px_22px_rgba(184,77,85,.08)]"

                      : "border-[#dfe9eb] bg-[#fafcfc] text-[#49666f] hover:border-[#9dcfc7] hover:bg-[#f4faf9]"

                  }`}

                >

                  {type}

                </button>

              ))}

            </div>

            {error && (

              <div className="mt-5 rounded-2xl border border-[#efcaca] bg-[#fff6f6] p-4 text-xs leading-5 text-[#a05454]">

                {error}

              </div>

            )}

            {loading ? (

              <div className="flex min-h-[390px] flex-col items-center justify-center text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7f4]">

                  <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#159d8b]/20 border-t-[#159d8b]" />

                </div>

                <h2 className="mt-6 text-lg font-semibold text-[#244853]">Checking compatibility</h2>

                <p className="mt-2 text-xs text-[#7c929a]">Retrieving the red-cell compatibility reference.</p>

              </div>

            ) : !result ? (

              <div className="flex min-h-[390px] flex-col items-center justify-center text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff2f2] text-3xl">🩸</div>

                <h2 className="mt-6 text-lg font-semibold text-[#244853]">Choose a blood type</h2>

                <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                  Select one of the eight blood groups above to view its red-cell compatibility.

                </p>

              </div>

            ) : (

              <CompatibilityResult

                result={result}

                compatible={compatible}

                mode={mode}

              />

            )}

          </div>

        </div>

        <div className="mt-6 flex gap-4 rounded-[24px] border border-[#eadfbd] bg-[#fffbef] p-6">

          <div className="text-xl text-[#b7892d]">⚕</div>

          <div>

            <p className="text-[9px] font-bold tracking-[0.16em] text-[#a77b26]">TRANSFUSION SAFETY</p>

            <p className="mt-2 text-xs leading-6 text-[#766a4f]">

              This tool is an educational red-cell compatibility reference. Actual transfusions require professional blood typing, antibody screening, cross-matching, and clinical assessment. Always follow qualified blood-bank and healthcare guidance.

            </p>

          </div>

        </div>

      </section>

    </main>

  );

}

function CompatibilityResult({

  result,

  compatible,

  mode,

}: {

  result: Result;

  compatible: string[];

  mode: "give" | "receive";

}) {

  return (

    <div className="mt-8">

      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">

        <div className="flex flex-col items-center justify-center rounded-[24px] bg-gradient-to-br from-[#8d333e] to-[#c8525d] p-8 text-center text-white">

          <p className="text-[8px] font-bold tracking-[0.17em] text-white/55">SELECTED BLOOD TYPE</p>

          <div className="mt-5 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/[0.1] text-4xl font-semibold shadow-[0_16px_40px_rgba(73,15,24,.2)]">

            {result.blood_type}

          </div>

          <p className="mt-5 text-xs text-white/65">

            {mode === "give" ? "Red-cell donor reference" : "Red-cell recipient reference"}

          </p>

        </div>

        <div className="rounded-[24px] border border-[#e0eaec] bg-[#fafcfc] p-6">

          <p className="text-[8px] font-bold tracking-[0.15em] text-[#83989f]">COMPATIBILITY PATHWAY</p>

          <h2 className="mt-2 text-lg font-semibold text-[#294c57]">

            {mode === "give"

              ? `${result.blood_type} can donate red cells to`

              : `${result.blood_type} can receive red cells from`}

          </h2>

          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">

            {BLOOD_TYPES.map((type) => {

              const isCompatible = compatible.includes(type);

              return (

                <div

                  key={type}

                  className={`flex min-h-[58px] items-center justify-center rounded-xl border text-sm font-semibold ${

                    isCompatible

                      ? "border-[#b9dfd8] bg-[#eaf8f5] text-[#168b7c]"

                      : "border-[#e7edef] bg-white text-[#b1bec2]"

                  }`}

                >

                  {type}

                </div>

              );

            })}

          </div>

          <div className="mt-5 rounded-2xl border border-[#cfe8e4] bg-[#f1faf8] p-4">

            <p className="text-[9px] font-bold tracking-[0.12em] text-[#168f80]">COMPATIBLE BLOOD TYPES</p>

            <p className="mt-2 text-sm font-semibold text-[#315b61]">

              {compatible.length ? compatible.join("  •  ") : "No compatibility data available"}

            </p>

          </div>

        </div>

      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">

        <InfoCard title="Reference" text="ABO + Rh blood group" />

        <InfoCard title="Component" text="Red blood cells" />

        <InfoCard title="Clinical step" text="Cross-match required" />

      </div>

      {result.warning && (

        <div className="mt-5 rounded-2xl border border-[#e3e9eb] bg-[#f9fbfc] p-4 text-xs leading-6 text-[#6c838b]">

          {result.warning}

        </div>

      )}

    </div>

  );

}

function InfoCard({ title, text }: { title: string; text: string }) {

  return (

    <div className="rounded-2xl border border-[#e0eaec] bg-white p-4">

      <p className="text-[8px] font-bold tracking-[0.13em] text-[#91a2a8]">{title.toUpperCase()}</p>

      <p className="mt-2 text-xs font-semibold text-[#45636d]">{text}</p>

    </div>

  );

}
