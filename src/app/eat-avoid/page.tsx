"use client";

import { useState } from "react";

type FoodItem = {

  food: string;

  reason: string;

};

type EatAvoidResult = {

  condition: string;

  nutrition_focus: string;

  foods_to_prioritize: FoodItem[];

  foods_to_limit: FoodItem[];

  meal_ideas: string[];

  practical_tips: string[];

  important_considerations: string[];

  confidence: string;

  medical_notice: string;

};

export default function EatAvoidPage() {

  const [condition, setCondition] = useState("");

  const [age, setAge] = useState("");

  const [goal, setGoal] = useState("");

  const [dietaryPreferences, setDietaryPreferences] = useState("");

  const [additionalContext, setAdditionalContext] = useState("");

  const [result, setResult] = useState<EatAvoidResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const analyzeNutrition = async () => {

    setError("");

    setResult(null);

    if (!condition.trim()) {

      setError("Please enter a health condition or concern.");

      return;

    }

    const parsedAge = Number(age);

    if (!age || parsedAge < 1 || parsedAge > 120) {

      setError("Please enter a valid age.");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(

        "http://127.0.0.1:8000/eat-avoid/analyze",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            condition: condition.trim(),

            age: parsedAge,

            goal: goal.trim(),

            dietary_preferences: dietaryPreferences.trim(),

            additional_context: additionalContext.trim(),

          }),

        }

      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(

          data?.detail || "Unable to generate nutrition guidance."

        );

      }      setResult(data);

      try {
        const historyKey = "aurahealth_history";
        const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const history = Array.isArray(existing) ? existing : [];

        history.unshift({
          id: `eat-avoid-${Date.now()}`,
          module: "Eat / Avoid",
          title: data.condition || condition.trim() || "Nutrition guidance",
          summary:
            data.nutrition_focus ||
            `Nutrition guidance created for ${condition.trim()}.`,
          createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
          historyKey,
          JSON.stringify(history.slice(0, 100))
        );
      } catch {
        // History saving must never interrupt a successful nutrition result.
      }

    } catch (err) {

      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError("Unable to connect to AuraHealth backend.");

      }

    } finally {

      setLoading(false);

    }

  };

  const loadExample = () => {

    setCondition("High blood pressure");

    setAge("35");

    setGoal("Support heart health");

    setDietaryPreferences("Halal");

    setAdditionalContext("No food allergies provided");

    setResult(null);

    setError("");

  };

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

            <p className="text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">NUTRITION DECISION SUPPORT</p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Eat / Avoid</h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">

              Turn a health condition or concern into practical educational guidance on foods to prioritize, foods to limit, meal ideas and everyday considerations.

            </p>

          </div>

        </div>

      </header>

      <section className="mx-auto -mt-9 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">

        <div className="grid items-start gap-6 xl:grid-cols-[0.88fr_1.12fr]">

          <section className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

            <div className="flex items-center justify-between border-b border-[#e8eff1] px-6 py-5">

              <div>

                <p className="text-sm font-semibold text-[#183b47]">Nutrition Profile</p>

                <p className="mt-1 text-[10px] text-[#8299a2]">Tell AuraHealth what guidance you need</p>

              </div>

              <button type="button" onClick={loadExample}

                className="rounded-full border border-[#d7e6e5] bg-[#f4faf9] px-3 py-2 text-[9px] font-semibold text-[#168f80] transition hover:bg-[#eaf7f4]">

                Use Example

              </button>

            </div>

            <div className="p-6">

              <Field label="Health condition or concern">

                <input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="e.g. High blood pressure" className={inputClass} />

              </Field>

              <div className="mt-5">

                <Field label="Age">

                  <div className="relative">

                    <input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 35" className={inputClass} />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#9aacb2]">years</span>

                  </div>

                </Field>

              </div>

              <div className="mt-5">

                <Field label="Health goal" optional>

                  <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Support heart health" className={inputClass} />

                </Field>

              </div>

              <div className="mt-5">

                <Field label="Dietary preferences" optional>

                  <input value={dietaryPreferences} onChange={(e) => setDietaryPreferences(e.target.value)} placeholder="e.g. Halal, vegetarian" className={inputClass} />

                </Field>

              </div>

              <div className="mt-5">

                <Field label="Additional context" optional>

                  <textarea value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)}

                    placeholder="Food allergies, relevant information, preferences..." rows={4}

                    className={`${inputClass} resize-none`} />

                </Field>

              </div>

              {error && (

                <div className="mt-4 rounded-2xl border border-[#efcaca] bg-[#fff6f6] p-4 text-xs leading-5 text-[#a05454]">{error}</div>

              )}

              <button onClick={analyzeNutrition} disabled={loading}

                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#139f8d] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(19,159,141,.18)] transition hover:bg-[#108f80] disabled:cursor-not-allowed disabled:bg-[#c8d5d8] disabled:shadow-none">

                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Analyzing nutrition...</> : <>Analyze Nutrition <span>→</span></>}

              </button>

            </div>

          </section>

          <section className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]">

            <div className="flex items-center justify-between border-b border-[#e8eff1] px-6 py-5">

              <div>

                <p className="text-sm font-semibold text-[#183b47]">Nutrition Guidance</p>

                <p className="mt-1 text-[10px] text-[#8299a2]">Food priorities and practical considerations</p>

              </div>

              <span className={`rounded-full border px-3 py-1.5 text-[8px] font-bold tracking-[0.1em] ${

                result ? "border-[#bfe6df] bg-[#effaf8] text-[#168b7c]" : "border-[#e1e9eb] bg-[#f8fafb] text-[#91a3aa]"

              }`}>

                {loading ? "ANALYZING" : result ? "COMPLETE" : "STANDBY"}

              </span>

            </div>

            <div className="min-h-[620px] p-6">

              {loading ? (

                <div className="flex min-h-[550px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7f4]">

                    <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#159d8b]/20 border-t-[#159d8b]" />

                  </div>

                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Building nutrition guidance</h2>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                    Reviewing the information you provided. Guidance will appear as soon as the analysis is complete.

                  </p>

                </div>

              ) : !result ? (

                <div className="flex min-h-[550px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf7f5] text-3xl">🥗</div>

                  <h2 className="mt-6 text-lg font-semibold text-[#244853]">Your nutrition guidance</h2>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#7c929a]">

                    Enter a health concern and age to receive structured food guidance tailored to the information you provide.

                  </p>

                  <div className="mt-7 grid w-full max-w-[420px] grid-cols-3 gap-2">

                    {["Prioritize", "Limit", "Plan"].map((item) => (

                      <div key={item} className="rounded-xl border border-[#e2ebed] bg-[#fafcfc] p-3 text-[9px] font-medium text-[#6f8991]">{item}</div>

                    ))}

                  </div>

                </div>

              ) : (

                <NutritionResult result={result} onReset={() => setResult(null)} />

              )}

            </div>

          </section>

        </div>

        <div className="mt-6 flex gap-4 rounded-[24px] border border-[#eadfbd] bg-[#fffbef] p-6">

          <div className="text-xl text-[#b7892d]">⚕</div>

          <div>

            <p className="text-[9px] font-bold tracking-[0.16em] text-[#a77b26]">MEDICAL SAFETY</p>

            <p className="mt-2 text-xs leading-6 text-[#766a4f]">

              {result?.medical_notice || "AuraHealth provides educational nutrition decision support and does not replace individualized advice from a qualified healthcare professional."}

            </p>

          </div>

        </div>

      </section>

    </main>

  );

}

const inputClass =

  "w-full rounded-xl border border-[#d9e5e8] bg-[#fafcfc] px-4 py-3.5 text-sm text-[#294c57] outline-none transition placeholder:text-[#a2b1b6] focus:border-[#58bfae] focus:bg-white focus:ring-2 focus:ring-[#58bfae]/10";

function Field({

  label,

  optional = false,

  children,

}: {

  label: string;

  optional?: boolean;

  children: React.ReactNode;

}) {

  return (

    <div>

      <label className="mb-2 block text-xs font-semibold text-[#45636d]">

        {label} {optional && <span className="font-normal text-[#9aacb2]">(optional)</span>}

      </label>

      {children}

    </div>

  );

}

function NutritionResult({

  result,

  onReset,

}: {

  result: EatAvoidResult;

  onReset: () => void;

}) {

  return (

    <div className="space-y-6">

      <div className="rounded-[22px] bg-gradient-to-br from-[#093b47] to-[#0b7169] p-6 text-white">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <p className="text-[8px] font-bold tracking-[0.17em] text-[#8de7da]">NUTRITION ANALYSIS</p>

            <h2 className="mt-2 text-2xl font-semibold capitalize">{result.condition}</h2>

          </div>

          <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[9px] font-semibold text-[#c4ebe5]">

            {result.confidence} confidence

          </span>

        </div>

        <p className="mt-4 text-xs leading-6 text-[#c0dedd]">{result.nutrition_focus}</p>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <FoodColumn title="Foods to Prioritize" items={result.foods_to_prioritize || []} tone="green" />

        <FoodColumn title="Foods to Limit" items={result.foods_to_limit || []} tone="amber" />

      </div>

      {!!result.meal_ideas?.length && (

        <SimpleList title="Simple Meal Ideas" items={result.meal_ideas} marker="M" />

      )}

      {!!result.practical_tips?.length && (

        <SimpleList title="Practical Tips" items={result.practical_tips} marker="T" />

      )}

      {!!result.important_considerations?.length && (

        <div className="rounded-2xl border border-[#eadfbd] bg-[#fffbef] p-5">

          <p className="text-xs font-semibold text-[#9b7428]">Important considerations</p>

          <div className="mt-3 space-y-3">

            {result.important_considerations.map((item, index) => (

              <div key={index} className="flex gap-3 text-xs leading-6 text-[#766747]">

                <span className="text-[#c4912d]">!</span>

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

      )}

      <button onClick={onReset}

        className="w-full rounded-2xl border border-[#dce7e9] bg-[#fafcfc] px-5 py-3.5 text-xs font-semibold text-[#617b83] transition hover:bg-[#f3f8f9]">

        Start New Analysis

      </button>

    </div>

  );

}

function FoodColumn({

  title,

  items,

  tone,

}: {

  title: string;

  items: FoodItem[];

  tone: "green" | "amber";

}) {

  const green = tone === "green";

  return (

    <div>

      <div className="mb-3 flex items-center gap-2">

        <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold ${

          green ? "bg-[#e9f7f4] text-[#168f80]" : "bg-[#fff7e5] text-[#a77b26]"

        }`}>

          {green ? "✓" : "!"}

        </span>

        <p className={`text-xs font-semibold ${green ? "text-[#257c70]" : "text-[#9b7428]"}`}>{title}</p>

      </div>

      <div className="space-y-2">

        {items.map((item, index) => (

          <div key={index} className={`rounded-xl border p-4 ${

            green ? "border-[#d5e9e5] bg-[#f7fbfa]" : "border-[#eddfb9] bg-[#fffbf1]"

          }`}>

            <p className="text-xs font-semibold text-[#355660]">{item.food}</p>

            <p className="mt-2 text-[10px] leading-5 text-[#748b92]">{item.reason}</p>

          </div>

        ))}

      </div>

    </div>

  );

}

function SimpleList({ title, items, marker }: { title: string; items: string[]; marker: string }) {

  return (

    <div className="rounded-2xl border border-[#e0e9eb] bg-[#fafcfc] p-5">

      <div className="flex items-center gap-3">

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f7f4] text-[10px] font-bold text-[#168f80]">{marker}</span>

        <p className="text-xs font-semibold text-[#385964]">{title}</p>

      </div>

      <div className="mt-4 space-y-3">

        {items.map((item, index) => (

          <div key={index} className="flex gap-3 text-xs leading-6 text-[#617b83]">

            <span className="text-[#169d8b]">•</span>

            <span>{item}</span>

          </div>

        ))}

      </div>

    </div>

  );

}
