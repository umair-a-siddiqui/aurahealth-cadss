"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  HeartPulse,
  Pill,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type Profile = {
  name: string;
  age: string;
  sex: string;
  bloodType: string;
  height: string;
  weight: string;
  allergies: string;
  conditions: string;
  medicines: string;
};

const EMPTY_PROFILE: Profile = {
  name: "",
  age: "",
  sex: "",
  bloodType: "",
  height: "",
  weight: "",
  allergies: "",
  conditions: "",
  medicines: "",
};

const STORAGE_KEY = "aurahealth_patient_profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing) setProfile({ ...EMPTY_PROFILE, ...JSON.parse(existing) });
    } catch {
      // Ignore invalid local browser data and start with a clean profile.
    } finally {
      setLoaded(true);
    }
  }, []);

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  function saveProfile(event: FormEvent) {
    event.preventDefault();

    const age = Number(profile.age);
    const height = Number(profile.height);
    const weight = Number(profile.weight);

    if (profile.age && (age < 1 || age > 120)) return;
    if (profile.height && (height < 40 || height > 250)) return;
    if (profile.weight && (weight < 2 || weight > 400)) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
  }

  function clearProfile() {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(EMPTY_PROFILE);
    setSaved(false);
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8fa]">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#159d8b]/20 border-t-[#159d8b]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fa] text-[#173b47]">
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
          <p className="text-[9px] font-bold tracking-[0.2em] text-[#83e7d9]">
            PERSONAL HEALTH CONTEXT
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Patient Profile
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3ccd3]">
            Keep essential health information in one private profile for a more
            connected AuraHealth experience.
          </p>
        </div>
      </header>

      <section className="mx-auto -mt-9 max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <form
            onSubmit={saveProfile}
            className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.08)]"
          >
            <div className="flex items-center justify-between border-b border-[#e8eff1] px-6 py-5">
              <div>
                <p className="text-sm font-semibold text-[#183b47]">
                  Health Information
                </p>
                <p className="mt-1 text-[10px] text-[#8299a2]">
                  Stored only in this browser for this version
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8f5]">
                <UserRound className="h-4 w-4 text-[#159c8a]" />
              </div>
            </div>

            <div className="space-y-7 p-6">
              <div>
                <SectionTitle number="01" title="Basic information" />
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <input
                      name="name"
                      value={profile.name}
                      onChange={updateField}
                      placeholder="Enter full name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Age">
                    <input
                      name="age"
                      type="number"
                      min="1"
                      max="120"
                      value={profile.age}
                      onChange={updateField}
                      placeholder="e.g. 25"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Sex">
                    <select
                      name="sex"
                      value={profile.sex}
                      onChange={updateField}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Prefer not to say</option>
                    </select>
                  </Field>

                  <Field label="Blood type">
                    <select
                      name="bloodType"
                      value={profile.bloodType}
                      onChange={updateField}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      {["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"].map(
                        (type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        )
                      )}
                    </select>
                  </Field>
                </div>
              </div>

              <div className="border-t border-[#e9eff1] pt-7">
                <SectionTitle number="02" title="Body measurements" />
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Height (cm)">
                    <input
                      name="height"
                      type="number"
                      min="40"
                      max="250"
                      value={profile.height}
                      onChange={updateField}
                      placeholder="e.g. 175"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Weight (kg)">
                    <input
                      name="weight"
                      type="number"
                      min="2"
                      max="400"
                      step="0.1"
                      value={profile.weight}
                      onChange={updateField}
                      placeholder="e.g. 70"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-[#e9eff1] pt-7">
                <SectionTitle number="03" title="Clinical context" />
                <div className="mt-4 space-y-4">
                  <Field label="Allergies">
                    <textarea
                      name="allergies"
                      value={profile.allergies}
                      onChange={updateField}
                      rows={3}
                      placeholder="e.g. Penicillin, peanuts — or None known"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Existing medical conditions">
                    <textarea
                      name="conditions"
                      value={profile.conditions}
                      onChange={updateField}
                      rows={3}
                      placeholder="e.g. Hypertension, diabetes — or None known"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Current medicines">
                    <textarea
                      name="medicines"
                      value={profile.medicines}
                      onChange={updateField}
                      rows={3}
                      placeholder="Medicine names and strengths, if known"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#e9eff1] pt-6 sm:flex-row">
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#139f8d] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(19,159,141,.18)] transition hover:bg-[#108f80]"
                >
                  <Save className="h-4 w-4" />
                  Save Health Profile
                </button>

                <button
                  type="button"
                  onClick={clearProfile}
                  className="rounded-2xl border border-[#dce7e9] bg-white px-5 py-4 text-xs font-semibold text-[#748b92] transition hover:bg-[#f7fafb]"
                >
                  Clear
                </button>
              </div>

              {saved && (
                <div className="flex items-center gap-3 rounded-2xl border border-[#bfe6df] bg-[#effaf8] p-4 text-xs font-medium text-[#168b7c]">
                  <CheckCircle2 className="h-4 w-4" />
                  Profile saved successfully in this browser.
                </div>
              )}
            </div>
          </form>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-[26px] border border-[#dce8eb] bg-white shadow-[0_18px_55px_rgba(23,70,84,.07)]">
              <div className="bg-gradient-to-br from-[#093b47] to-[#0b7169] p-6 text-white">
                <p className="text-[8px] font-bold tracking-[0.17em] text-[#8de7da]">
                  PROFILE OVERVIEW
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08]">
                    <UserRound className="h-7 w-7 text-[#a5ebe1]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xl font-semibold">
                      {profile.name || "Your Health Profile"}
                    </p>
                    <p className="mt-1 text-[10px] text-[#b9dcda]">
                      {[profile.age && `${profile.age} years`, profile.sex]
                        .filter(Boolean)
                        .join(" • ") || "Add your basic health information"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-[#e8eff1]">
                <ProfileMetric
                  icon={HeartPulse}
                  label="Blood"
                  value={profile.bloodType || "—"}
                />
                <ProfileMetric
                  icon={Activity}
                  label="Height"
                  value={profile.height ? `${profile.height} cm` : "—"}
                />
                <ProfileMetric
                  icon={Activity}
                  label="Weight"
                  value={profile.weight ? `${profile.weight} kg` : "—"}
                />
              </div>

              <div className="space-y-4 p-6">
                <SummaryRow
                  icon={ShieldCheck}
                  title="Allergies"
                  value={profile.allergies || "Not provided"}
                />
                <SummaryRow
                  icon={HeartPulse}
                  title="Medical conditions"
                  value={profile.conditions || "Not provided"}
                />
                <SummaryRow
                  icon={Pill}
                  title="Current medicines"
                  value={profile.medicines || "Not provided"}
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#cfe7e3] bg-[#f3faf8] p-6">
              <p className="text-[9px] font-bold tracking-[0.16em] text-[#168f80]">
                LOCAL PROFILE
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[#294c57]">
                Simple and private for the hackathon build
              </h2>
              <p className="mt-3 text-xs leading-6 text-[#6d858c]">
                This version stores your profile in this browser using local
                storage. It is not sent to the AuraHealth backend when you save
                it.
              </p>
            </div>

            <div className="flex gap-4 rounded-[24px] border border-[#eadfbd] bg-[#fffbef] p-6">
              <div className="text-xl text-[#b7892d]">⚕</div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.16em] text-[#a77b26]">
                  MEDICAL SAFETY
                </p>
                <p className="mt-2 text-xs leading-6 text-[#766a4f]">
                  Keep profile information accurate and current. AuraHealth is
                  educational clinical decision support and does not replace
                  professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#dbe7e9] bg-[#fafcfc] px-4 py-3 text-sm text-[#284b56] outline-none transition placeholder:text-[#a5b4b9] focus:border-[#72c9bc] focus:bg-white focus:ring-4 focus:ring-[#159d8b]/[0.06]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold text-[#607a83]">
        {label}
      </span>
      {children}
    </label>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[9px] font-bold text-[#18a18e]">
        {number}
      </span>
      <h2 className="text-sm font-semibold text-[#31535d]">{title}</h2>
    </div>
  );
}

function ProfileMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-[#e8eff1] p-4 text-center last:border-r-0">
      <Icon className="mx-auto h-4 w-4 text-[#159c8a]" />
      <p className="mt-2 text-sm font-semibold text-[#31535d]">{value}</p>
      <p className="mt-1 text-[8px] font-medium tracking-[0.1em] text-[#95a6ac]">
        {label.toUpperCase()}
      </p>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf8f6]">
        <Icon className="h-4 w-4 text-[#159c8a]" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-semibold text-[#718990]">{title}</p>
        <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[#405f68]">
          {value}
        </p>
      </div>
    </div>
  );
}
