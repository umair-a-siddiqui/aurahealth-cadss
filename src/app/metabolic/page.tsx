"use client";

import { FormEvent, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Result = {

  bmr: number;

  tdee: number;

  daily_targets: {

    protein_g: number;

    carbohydrates_g: number;

    fat_g: number;

  };

  note: string;

};

export default function MetabolicHealth() {

  const [result, setResult] = useState<Result | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function calculate(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();

    setLoading(true);

    setError("");

    const form = new FormData(e.currentTarget);

    const body = {

      age: Number(form.get("age")),

      sex: form.get("sex"),

      height_cm: Number(form.get("height")),

      weight_kg: Number(form.get("weight")),

      activity_level: form.get("activity"),

    };

    try {

      const response = await fetch(

        `${API_BASE_URL}/metabolic/calculate`,

        {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify(body),

        }

      );

      if (!response.ok) throw new Error();
      const data: Result = await response.json();
      setResult(data);

      try {
        const historyKey = "aurahealth_history";
        const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const history = Array.isArray(existing) ? existing : [];

        history.unshift({
          id: `metabolic-${Date.now()}`,
          module: "Metabolic Health",
          title: "Metabolic health calculation",
          summary: `BMR ${data.bmr} kcal/day • TDEE ${data.tdee} kcal/day`,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
          historyKey,
          JSON.stringify(history.slice(0, 100))
        );
      } catch {
        // History saving must never interrupt a successful calculation.
      }
    } catch {

      setError("Could not calculate your results. Make sure the backend is running.");

    } finally {

      setLoading(false);

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

            <p className="text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">METABOLIC INTELLIGENCE</p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Metabolic Health</h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">

              Estimate resting energy, daily energy expenditure and practical macronutrient targets from your basic health profile.

            </p>

          </div>

        </div>

      </header>

      <section className="mx-auto -mt-9 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">

        <div className="grid items-start gap-6 xl:grid-cols-[0.88fr_1.12fr]">

          <form onSubmit={calculate} className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

            <div className="border-b border-[#e8eff1] px-6 py-5">

              <p className="text-sm font-semibold text-[#183b47]">Health Profile</p>

              <p className="mt-1 text-[10px] text-[#8299a2]">Enter your details to calculate estimated daily needs</p>

            </div>

            <div className="p-6">

              <div className="grid gap-4 sm:grid-cols-2">

                <Field label="Age">

                  <div className="relative">

                    <input required min="15" max="100" name="age" type="number" placeholder="25" className={inputClass} />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#9aacb2]">years</span>

                  </div>

                </Field>

                <Field label="Sex">

                  <select required name="sex" className={inputClass}>

                    <option value="male">Male</option>

                    <option value="female">Female</option>

                  </select>

                </Field>

              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <Field label="Height">

                  <div className="relative">

                    <input required min="100" max="250" name="height" type="number" placeholder="175" className={inputClass} />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#9aacb2]">cm</span>

                  </div>

                </Field>

                <Field label="Weight">

                  <div className="relative">

                    <input required min="25" max="300" step="0.1" name="weight" type="number" placeholder="70" className={inputClass} />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#9aacb2]">kg</span>

                  </div>

                </Field>

              </div>

              <div className="mt-5">

                <Field label="Activity Level">

                  <select name="activity" className={inputClass}>

                    <option value="sedentary">Sedentary</option>

                    <option value="light">Lightly Active</option>

                    <option value="moderate">Moderately Active</option>

                    <option value="active">Active</option>

                    <option value="very_active">Very Active</option>

                  </select>

                </Field>

              </div>

              <div className="mt-5 rounded-2xl border border-[#e0e9eb] bg-[#fafcfc] p-4">

                <p className="text-[8px] font-bold tracking-[0.14em] text-[#8ca0a7]">WHAT AURAHEALTH CALCULATES</p>

                <div className="mt-3 grid grid-cols-3 gap-2">

                  {["BMR", "TDEE", "Macros"].map((item) => (

                    <div key={item} className="rounded-xl bg-[#eef8f6] px-2 py-3 text-center text-[9px] font-semibold text-[#388377]">{item}</div>

                  ))}

                </div>

              </div>

              <button disabled={loading}

                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#139f8d] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(19,159,141,.18)] transition hover:bg-[#108f80] disabled:cursor-not-allowed disabled:bg-[#c8d5d8] disabled:shadow-none">

                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Calculating targets...</> : <>Calculate Health Targets <span>→</span></>}

              </button>

              {error && (

                <div className="mt-4 rounded-2xl border border-[#efcaca] bg-[#fff6f6] p-4 text-xs leading-5 text-[#a05454]">{error}</div>

              )}

            </div>

          </form>

          <section className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

            <div className="flex items-center justify-between border-b border-[#e8eff1] px-6 py-5">

              <div>

                <p className="text-sm font-semibold text-[#183b47]">Metabolic Results</p>

                <p className="mt-1 text-[10px] text-[#8299a2]">Estimated energy and macronutrient targets</p>

              </div>

              <span className={`rounded-full border px-3 py-1.5 text-[8px] font-bold tracking-[0.1em] ${

                result ? "border-[#bfe6df] bg-[#effaf8] text-[#168b7c]" : "border-[#e1e9eb] bg-[#f8fafb] text-[#91a3aa]"

              }`}>

                {loading ? "CALCULATING" : result ? "COMPLETE" : "STANDBY"}

              </span>

            </div>

            <div className="min-h-[555px] p-6">

              {loading ? (

                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7f4]">

                    <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#159d8b]/20 border-t-[#159d8b]" />

                  </div>

                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Calculating your estimates</h2>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                    AuraHealth is calculating your energy requirements and daily targets.

                  </p>

                </div>

              ) : !result ? (

                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf7f5] text-3xl text-[#169d8b]">⚡</div>

                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Your metabolic profile</h2>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                    Complete your health profile to calculate estimated BMR, TDEE and daily macronutrient targets.

                  </p>

                  <div className="mt-7 grid w-full max-w-[420px] grid-cols-3 gap-2">

                    {["Energy", "Activity", "Nutrition"].map((item) => (

                      <div key={item} className="rounded-xl border border-[#e2ebed] bg-[#fafcfc] p-3 text-[9px] font-medium text-[#6f8991]">{item}</div>

                    ))}

                  </div>

                </div>

              ) : (

                <ResultView result={result} />

              )}

            </div>

          </section>

        </div>

        <div className="mt-6 flex gap-4 rounded-[24px] border border-[#eadfbd] bg-[#fffbef] p-6">

          <div className="text-xl text-[#b7892d]">⚕</div>

          <div>

            <p className="text-[9px] font-bold tracking-[0.16em] text-[#a77b26]">MEDICAL NOTICE</p>

            <p className="mt-2 text-xs leading-6 text-[#766a4f]">

              These values are estimates for educational decision support and are not a medical prescription. Individual requirements may differ.

            </p>

          </div>

        </div>

      </section>

    </main>

  );

}

const inputClass =

  "w-full rounded-xl border border-[#d9e5e8] bg-[#fafcfc] px-4 py-3.5 text-sm text-[#294c57] outline-none transition placeholder:text-[#a2b1b6] focus:border-[#58bfae] focus:bg-white focus:ring-2 focus:ring-[#58bfae]/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {

  return (

    <label>

      <span className="mb-2 block text-xs font-semibold text-[#45636d]">{label}</span>

      {children}

    </label>

  );

}

function ResultView({ result }: { result: Result }) {

  return (

    <div>

      <div className="rounded-[22px] bg-gradient-to-br from-[#093b47] to-[#0b7169] p-6 text-white">

        <p className="text-[8px] font-bold tracking-[0.17em] text-[#8de7da]">ESTIMATED DAILY ENERGY</p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">

          <div>

            <p className="text-4xl font-semibold tracking-[-0.04em]">{result.tdee}</p>

            <p className="mt-1 text-xs text-[#b9dcda]">kcal / day TDEE</p>

          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3">

            <p className="text-[8px] tracking-[0.14em] text-white/45">RESTING ENERGY</p>

            <p className="mt-1 text-lg font-semibold">{result.bmr} <span className="text-[10px] font-normal text-white/50">kcal/day</span></p>

          </div>

        </div>

      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">

        <MetricCard title="BMR" value={result.bmr} unit="kcal/day" text="Estimated energy used at rest" />

        <MetricCard title="TDEE" value={result.tdee} unit="kcal/day" text="Estimated total daily expenditure" />

      </div>

      <div className="mt-6">

        <p className="text-xs font-semibold text-[#385964]">Daily macronutrient targets</p>

        <div className="mt-3 grid grid-cols-3 gap-3">

          <Macro label="Protein" value={result.daily_targets.protein_g} marker="P" />

          <Macro label="Carbs" value={result.daily_targets.carbohydrates_g} marker="C" />

          <Macro label="Fat" value={result.daily_targets.fat_g} marker="F" />

        </div>

      </div>

      <div className="mt-6 rounded-2xl border border-[#cfe8e4] bg-[#f3faf8] p-5">

        <p className="text-[8px] font-bold tracking-[0.15em] text-[#168f80]">CALCULATION NOTE</p>

        <p className="mt-3 text-xs leading-6 text-[#486970]">{result.note}</p>

      </div>

    </div>

  );

}

function MetricCard({

  title,

  value,

  unit,

  text,

}: {

  title: string;

  value: number;

  unit: string;

  text: string;

}) {

  return (

    <div className="rounded-2xl border border-[#e0eaec] bg-[#f9fbfc] p-5">

      <p className="text-[8px] font-bold tracking-[0.14em] text-[#81979e]">{title}</p>

      <p className="mt-3 text-2xl font-semibold text-[#234752]">

        {value}<span className="ml-1 text-[9px] font-normal text-[#8da0a6]">{unit}</span>

      </p>

      <p className="mt-2 text-[10px] leading-5 text-[#789098]">{text}</p>

    </div>

  );

}

function Macro({ label, value, marker }: { label: string; value: number; marker: string }) {

  return (

    <div className="rounded-2xl border border-[#e0eaec] bg-[#fafcfc] p-4 text-center">

      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f7f4] text-[10px] font-bold text-[#168f80]">{marker}</div>

      <p className="mt-3 text-xl font-semibold text-[#284d57]">{value}g</p>

      <p className="mt-1 text-[9px] text-[#83979e]">{label}</p>

    </div>

  );

}
