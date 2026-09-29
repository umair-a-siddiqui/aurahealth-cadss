"use client";

import { motion } from "motion/react";

import {

  Activity,

  ArrowRight,

  BrainCircuit,

  ChevronRight,

  CircleCheck,

  Cross,

  FileScan,

  HeartPulse,

  Microscope,

  Pill,

  ShieldCheck,

  Sparkles,

  Stethoscope,

  TestTube2,

  Utensils,

  Zap,

} from "lucide-react";

const tools = [

  {

    number: "01",

    title: "Medicine Scanner",

    label: "AI MEDICINE VISION",

    description:

      "Scan medicine packaging and transform visible information into a clear, structured explanation.",

    href: "/medicine",

    icon: Pill,

  },

  {

    number: "02",

    title: "Clinical Triage",

    label: "SYMPTOM ASSESSMENT",

    description:

      "Organize symptoms, urgency indicators and care considerations through AI-assisted triage.",

    href: "/triage",

    icon: Stethoscope,

  },

  {

    number: "03",

    title: "Drug Safety",

    label: "MEDICATION EVIDENCE",

    description:

      "Compare medicines using available drug-label evidence and safety information.",

    href: "/drug-safety",

    icon: ShieldCheck,

  },

  {

    number: "04",

    title: "Metabolic Health",

    label: "HEALTH CALCULATOR",

    description:

      "Estimate energy requirements and personalized macronutrient targets.",

    href: "/metabolic",

    icon: Zap,

  },

  {

    number: "05",

    title: "Eat / Avoid",

    label: "NUTRITION GUIDANCE",

    description:

      "Explore practical food priorities and considerations for a health concern.",

    href: "/eat-avoid",

    icon: Utensils,

  },

  {

    number: "06",

    title: "Blood Compatibility",

    label: "TRANSFUSION SUPPORT",

    description:

      "Explore donor and recipient blood-group compatibility through deterministic logic.",

    href: "/blood",

    icon: HeartPulse,

  },

  {

    number: "07",

    title: "Lab Report AI",

    label: "LAB INTELLIGENCE",

    description:

      "Transform visible laboratory findings into structured, understandable information.",

    href: "/lab-report",

    icon: FileScan,

  },

];

export default function Home() {

  return (

    <main className="min-h-screen overflow-hidden bg-[#f5f9fb] text-[#102b3a]">

      {/* =====================================================

          NAVIGATION

      ====================================================== */}

      <motion.header

        initial={{ y: -30, opacity: 0 }}

        animate={{ y: 0, opacity: 1 }}

        transition={{ duration: 0.7 }}

        className="fixed left-0 right-0 top-0 z-50 transform-gpu border-b border-white/10 bg-[#082a3a]/90 backdrop-blur-2xl"

      >

        <div className="mx-auto flex h-[76px] max-w-[1450px] items-center justify-between px-5 sm:px-8 lg:px-12">

          <a href="/" className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#27d3b2] to-[#5ee4cf] shadow-[0_8px_30px_rgba(39,211,178,.18)]">

              <Cross className="h-5 w-5 text-[#073442]" />

              <motion.div

                animate={{

                  scale: [1, 1.16, 1],

                  opacity: [0.2, 0, 0.2],

                }}

                transition={{

                  duration: 2.5,

                  repeat: Infinity,

                }}

                className="absolute inset-[-5px] transform-gpu will-change-transform rounded-[18px] border border-[#5ee4cf]/40"

              />

            </div>

            <div>

              <div className="flex items-center gap-2">

                <span className="text-[17px] font-semibold tracking-tight text-white">

                  AuraHealth

                </span>

                <motion.span

                  animate={{ opacity: [0.35, 1, 0.35] }}

                  transition={{ duration: 1.6, repeat: Infinity }}

                  className="h-1.5 w-1.5 will-change-opacity rounded-full bg-[#5ee4cf]"

                />

              </div>

              <p className="text-[9px] font-medium tracking-[0.2em] text-white/40">

                CLINICAL INTELLIGENCE

              </p>

            </div>

          </a>

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] p-1 md:flex">

            <NavLink href="#overview">Overview</NavLink>

            <NavLink href="#departments">Health Tools</NavLink>

            <NavLink href="#workflow">How It Works</NavLink>

            <NavLink href="#safety">Safety</NavLink>

          </div>          <div className="flex items-center gap-2">
            <a
              href="/history"
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-xs font-medium text-white/80 transition hover:bg-white/[0.12]"
            >
              History
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="/profile"
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-xs font-medium text-white/80 transition hover:bg-white/[0.12]"
            >
              Patient Profile
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

        </div>

      </motion.header>

      {/* =====================================================

          DARK CLINICAL HERO

      ====================================================== */}

      <section

        id="overview"

        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#061e2c] via-[#082d3c] to-[#07404a]"

      >

        <ClinicalHeroBackground />

        <div className="relative z-10 mx-auto grid min-h-screen max-w-[1450px] items-center gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">

          {/* HERO COPY */}

          <motion.div

            initial={{ opacity: 0, x: -35 }}

            animate={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.9 }}

          >

            <motion.div

              initial={{ opacity: 0, y: 15 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.3 }}

              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#75ead7]/20 bg-[#75ead7]/[0.07] px-4 py-2"

            >

              <motion.span

                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}

                transition={{ duration: 1.7, repeat: Infinity }}

                className="h-1.5 w-1.5 transform-gpu will-change-transform rounded-full bg-[#6ce7d1]"

              />

              <span className="text-[10px] font-semibold tracking-[0.17em] text-[#9bf1e2]">

                AURAHEALTH SYSTEM READY

              </span>

            </motion.div>

            <h1 className="max-w-[700px] text-[3.4rem] font-medium leading-[0.99] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.3rem]">

              Health information,

              <span className="mt-2 block bg-gradient-to-r from-[#65e5ce] via-[#8eeada] to-[#7fd8ed] bg-clip-text text-transparent">

                intelligently connected.

              </span>

            </h1>

            <p className="mt-7 max-w-[610px] text-[15px] leading-7 text-[#b3ccd4] sm:text-base">

              A unified clinical decision-support environment for medicines,

              symptoms, laboratory reports, nutrition, metabolic health and

              blood compatibility.

            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              <motion.a

                href="#departments"

                whileHover={{ y: -3, scale: 1.02 }}

                whileTap={{ scale: 0.97 }}

                className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#43d7bb] to-[#67dfcd] px-6 py-3.5 text-sm font-semibold text-[#06313c] shadow-[0_15px_45px_rgba(67,215,187,.18)]"

              >

                Explore Health Tools

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

              </motion.a>

              <motion.a

                href="/profile"

                whileHover={{ y: -3 }}

                whileTap={{ scale: 0.97 }}

                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm text-white/75 backdrop-blur-xl"

              >

                <BrainCircuit className="h-4 w-4 text-[#77dfed]" />

                Create Health Profile

              </motion.a>

            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[11px] text-[#a5c4cc]">

              <TrustItem text="Decision support" />

              <TrustItem text="AI-assisted analysis" />

              <TrustItem text="Safety-aware" />

            </div>

          </motion.div>

          {/* LIVE CLINICAL VISUAL */}

          <motion.div

            initial={{ opacity: 0, scale: 0.94 }}

            animate={{ opacity: 1, scale: 1 }}

            transition={{ duration: 1, delay: 0.2 }}

            className="relative mx-auto w-full max-w-[650px] transform-gpu"

          >

            <ClinicalMonitor />

          </motion.div>

        </div>

        {/* TRANSITION INTO LIGHT HOSPITAL */}

        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent to-[#f5f9fb]" />

      </section>

      {/* =====================================================

          LIVE SYSTEM BAR

      ====================================================== */}

      <section className="relative z-20 mx-auto -mt-8 max-w-[1320px] px-5 sm:px-8">

        <motion.div

          initial={{ opacity: 0, y: 25 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.8 }}

          className="grid overflow-hidden rounded-2xl border border-[#d9e7eb] bg-white shadow-[0_18px_60px_rgba(18,67,83,.09)] sm:grid-cols-4"

        >

          <SystemMetric

            icon={Activity}

            value="Operational"

            label="System status"

            live

          />

          <SystemMetric

            icon={BrainCircuit}

            value="AI Assisted"

            label="Intelligence engine"

          />

          <SystemMetric

            icon={Microscope}

            value="7 Modules"

            label="Clinical tools"

          />

          <SystemMetric

            icon={ShieldCheck}

            value="Safety Layer"

            label="Decision support"

          />

        </motion.div>

      </section>

      {/* =====================================================

          HOSPITAL WORKSPACE

      ====================================================== */}

      <section

        id="departments"

        className="relative px-5 pb-28 pt-28 sm:px-8 lg:px-12"

      >

        <HospitalLightBackground />

        <div className="relative mx-auto max-w-[1450px]">

          <motion.div

            initial={{ opacity: 0, y: 30 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true, amount: 0.3 }}

            transition={{ duration: 0.7 }}

            className="mb-14 flex flex-col justify-between gap-7 lg:flex-row lg:items-end"

          >

            <div>

              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#0f9e8d]">

                <Cross className="h-3.5 w-3.5" />

                CLINICAL WORKSPACE

              </div>

              <h2 className="mt-5 max-w-[680px] text-4xl font-semibold tracking-[-0.04em] text-[#102f3d] sm:text-5xl">

                One hospital environment.

                <span className="block text-[#66828d]">

                  Seven intelligent departments.

                </span>

              </h2>

            </div>

            <p className="max-w-[450px] text-sm leading-7 text-[#66808b]">

              Choose the clinical tool relevant to your health information.

              Each module uses the same clear, safety-focused AuraHealth

              experience.

            </p>

          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {tools.map((tool, index) => (

              <ClinicalToolCard

                key={tool.title}

                tool={tool}

                index={index}

              />

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================

          LIVE ECG DIVIDER

      ====================================================== */}

      <section className="overflow-hidden border-y border-[#d9e8eb] bg-white py-5">

        <div className="mx-auto flex max-w-[1450px] items-center gap-6 px-5 sm:px-8 lg:px-12">

          <div className="flex shrink-0 items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f8f5]">

              <HeartPulse className="h-4 w-4 text-[#149d8d]" />

            </div>

            <div>

              <p className="text-[9px] font-bold tracking-[0.18em] text-[#73909a]">

                AURA HEALTH SIGNAL

              </p>

              <p className="text-xs font-semibold text-[#183b48]">

                System active

              </p>

            </div>

          </div>

          <div className="relative h-10 flex-1 overflow-hidden">

            <ECG />

          </div>

          <div className="hidden items-center gap-2 text-[10px] font-semibold text-[#169e8c] sm:flex">

            <motion.span

              animate={{ opacity: [0.3, 1, 0.3] }}

              transition={{ duration: 1.4, repeat: Infinity }}

              className="h-2 w-2 will-change-opacity rounded-full bg-[#28cbb4]"

            />

            READY

          </div>

        </div>

      </section>

      {/* =====================================================

          WORKFLOW

      ====================================================== */}

      <section

        id="workflow"

        className="relative bg-[#edf5f7] px-5 py-28 sm:px-8 lg:px-12"

      >

        <div className="mx-auto max-w-[1450px]">

          <motion.div

            initial={{ opacity: 0, y: 25 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center"

          >

            <p className="text-[10px] font-bold tracking-[0.2em] text-[#109c8b]">

              CLINICAL INTELLIGENCE FLOW

            </p>

            <h2 className="mx-auto mt-4 max-w-[700px] text-4xl font-semibold tracking-[-0.04em] text-[#123441]">

              Designed to make health information easier to understand.

            </h2>

          </motion.div>

          <div className="relative mt-16 grid gap-5 lg:grid-cols-4">

            <div className="absolute left-[12%] right-[12%] top-[39px] hidden h-px bg-gradient-to-r from-transparent via-[#9eddd4] to-transparent lg:block" />

            <WorkflowCard

              icon={FileScan}

              number="01"

              title="Provide"

              text="Enter symptoms, upload a report, scan medicine or provide health parameters."

              delay={0}

            />

            <WorkflowCard

              icon={BrainCircuit}

              number="02"

              title="Analyze"

              text="The relevant AuraHealth engine structures and processes the supplied information."

              delay={0.1}

            />

            <WorkflowCard

              icon={Sparkles}

              number="03"

              title="Understand"

              text="Results are presented in a clearer and more organized clinical format."

              delay={0.2}

            />

            <WorkflowCard

              icon={Stethoscope}

              number="04"

              title="Discuss"

              text="Use the information to prepare better questions for healthcare professionals."

              delay={0.3}

            />

          </div>

        </div>

      </section>

      {/* =====================================================

          SAFETY

      ====================================================== */}

      <section

        id="safety"

        className="bg-white px-5 py-24 sm:px-8 lg:px-12"

      >

        <motion.div

          initial={{ opacity: 0, y: 25 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[30px] border border-[#d8e9e7] bg-gradient-to-br from-[#f4fcfa] to-[#edf8fb] p-7 sm:p-10"

        >

          <motion.div

            animate={{ x: ["-100%", "500%"] }}

            transition={{

              duration: 8,

              repeat: Infinity,

              ease: "linear",

            }}

            className="absolute top-0 h-[2px] w-52 bg-gradient-to-r from-transparent via-[#3bd1ba] to-transparent"

          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex max-w-[850px] gap-5">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ddf6f0]">

                <ShieldCheck className="h-6 w-6 text-[#119a89]" />

              </div>

              <div>

                <p className="text-[9px] font-bold tracking-[0.2em] text-[#129b8b]">

                  MEDICAL SAFETY

                </p>

                <h3 className="mt-2 text-2xl font-semibold text-[#143844]">

                  Clinical decision support, not diagnosis.

                </h3>

                <p className="mt-3 text-sm leading-7 text-[#607d87]">

                  AuraHealth provides educational and decision-support

                  information. It does not replace professional medical advice,

                  diagnosis, emergency services or treatment.

                </p>

              </div>

            </div>

            <div className="flex w-fit items-center gap-3 rounded-full border border-[#cbe8e2] bg-white px-4 py-2.5">

              <motion.span

                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}

                transition={{ duration: 1.6, repeat: Infinity }}

                className="h-2 w-2 rounded-full bg-[#29c8ae]"

              />

              <span className="text-[10px] font-bold tracking-[0.13em] text-[#278d80]">

                SAFETY SYSTEM ACTIVE

              </span>

            </div>

          </div>

        </motion.div>

      </section>

      {/* =====================================================

          FOOTER

      ====================================================== */}

      <footer className="border-t border-[#dce8eb] bg-[#f7fafb] px-5 py-9 sm:px-8 lg:px-12">

        <div className="mx-auto flex max-w-[1450px] flex-col gap-5 text-[10px] tracking-[0.12em] text-[#79909a] sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3 font-semibold text-[#476773]">

            <Cross className="h-4 w-4 text-[#22aa98]" />

            AURAHEALTH CADSS

          </div>

          <span>CLINICAL DECISION SUPPORT SYSTEM</span>

          <span>HEALTH INFORMATION • INTELLIGENTLY ORGANIZED</span>

        </div>

      </footer>

    </main>

  );

}

/* =========================================================

   CLINICAL MONITOR

\========================================================= */

function ClinicalMonitor() {

  return (

    <div className="relative mx-auto min-h-[570px] w-full transform-gpu">

      {/* soft ambient hospital glow */}

      <motion.div

        animate={{

          scale: [0.95, 1.08, 0.95],

          opacity: [0.18, 0.32, 0.18],

        }}

        transition={{

          duration: 5,

          repeat: Infinity,

        }}

        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform rounded-full bg-[#5fe1d0]/20 blur-[100px]"

      />

      {/* main monitor */}

      <motion.div

        animate={{ y: [0, -7, 0] }}

        transition={{

          duration: 6,

          repeat: Infinity,

          ease: "easeInOut",

        }}

        className="absolute left-1/2 top-1/2 w-[90%] max-w-[540px] -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform overflow-hidden rounded-[30px] border border-white/15 bg-[#0b3542]/70 p-6 shadow-[0_35px_100px_rgba(0,0,0,.22)] backdrop-blur-2xl"

      >

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[9px] font-semibold tracking-[0.18em] text-[#79dece]">

              AURA CLINICAL MONITOR

            </p>

            <p className="mt-1 text-sm font-semibold text-white">

              Health Intelligence

            </p>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#65dfcd]/15 bg-[#65dfcd]/[0.07] px-3 py-1.5">

            <motion.span

              animate={{ opacity: [0.3, 1, 0.3] }}

              transition={{ duration: 1.5, repeat: Infinity }}

              className="h-1.5 w-1.5 will-change-opacity rounded-full bg-[#5de0ca]"

            />

            <span className="text-[8px] font-bold tracking-[0.14em] text-[#9aeade]">

              READY

            </span>

          </div>

        </div>

        {/* central health visualization */}

        <div className="relative mt-6 flex h-[245px] items-center justify-center overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#062834]/70">

          <div className="absolute inset-0 opacity-[0.12]">

            <div

              className="h-full w-full"

              style={{

                backgroundImage:

                  "linear-gradient(rgba(120,220,210,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(120,220,210,.2) 1px, transparent 1px)",

                backgroundSize: "28px 28px",

              }}

            />

          </div>

          <motion.div

            animate={{

              scale: [1, 1.06, 1],

            }}

            transition={{

              duration: 2,

              repeat: Infinity,

            }}

            className="relative z-10 flex h-[105px] w-[105px] transform-gpu will-change-transform items-center justify-center rounded-full border border-[#6be1d0]/25 bg-[#51d6c0]/[0.08]"

          >

            <motion.div

              animate={{

                scale: [1, 1.18, 1],

                opacity: [0.2, 0, 0.2],

              }}

              transition={{

                duration: 2,

                repeat: Infinity,

              }}

              className="absolute inset-[-18px] transform-gpu will-change-transform rounded-full border border-[#5bdac6]/20"

            />

            <HeartPulse className="h-10 w-10 text-[#72e4d3]" />

          </motion.div>

          {/* orbital medical indicators */}

          <FloatingClinicalIcon

            icon={Pill}

            position="left-[13%] top-[20%]"

            delay={0}

          />

          <FloatingClinicalIcon

            icon={TestTube2}

            position="right-[12%] top-[23%]"

            delay={0.5}

          />

          <FloatingClinicalIcon

            icon={Activity}

            position="left-[15%] bottom-[18%]"

            delay={1}

          />

          <FloatingClinicalIcon

            icon={Microscope}

            position="right-[14%] bottom-[18%]"

            delay={1.5}

          />

          {/* scan line */}

          <motion.div

            animate={{ y: [-120, 120, -120] }}

            transition={{

              duration: 5,

              repeat: Infinity,

              ease: "easeInOut",

            }}

            className="absolute left-[8%] right-[8%] h-px transform-gpu will-change-transform bg-gradient-to-r from-transparent via-[#68e2d1]/60 to-transparent"

          />

        </div>

        {/* real system statuses */}

        <div className="mt-4 grid grid-cols-3 gap-3">

          <MonitorStatus title="TOOLS" value="7 READY" />

          <MonitorStatus title="ENGINE" value="AI ACTIVE" />

          <MonitorStatus title="MODE" value="SUPPORT" />

        </div>

        {/* ECG */}

        <div className="mt-4 flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">

          <HeartPulse className="h-4 w-4 shrink-0 text-[#62decb]" />

          <div className="h-8 flex-1 overflow-hidden">

            <DarkECG />

          </div>

        </div>

      </motion.div>

      {/* FLOATING PANELS */}

      <FloatingPanel

        className="left-0 top-[15%]"

        label="CLINICAL TOOLS"

        value="7 available"

        delay={0}

      />

      <FloatingPanel

        className="right-0 top-[22%]"

        label="SYSTEM"

        value="Operational"

        delay={0.8}

      />

      <FloatingPanel

        className="bottom-[13%] left-[3%]"

        label="SAFETY"

        value="Enabled"

        delay={1.4}

      />

      <FloatingPanel

        className="bottom-[10%] right-[1%]"

        label="AI SUPPORT"

        value="Ready"

        delay={2}

      />

    </div>

  );

}

/* =========================================================

   CLINICAL TOOL CARD

\========================================================= */

function ClinicalToolCard({

  tool,

  index,

}: {

  tool: (typeof tools)[number];

  index: number;

}) {

  const Icon = tool.icon;

  return (

    <motion.a

      href={tool.href}

      initial={{ opacity: 0, y: 35 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true, amount: 0.15 }}

      transition={{

        duration: 0.55,

        delay: (index % 3) * 0.08,

      }}

      whileHover={{

        y: -8,

      }}

      className={`group relative min-h-[330px] transform-gpu overflow-hidden rounded-[26px] border border-[#dce9ec] bg-white p-7 shadow-[0_12px_40px_rgba(23,72,87,.055)] transition-colors duration-300 hover:border-[#a8ded6] ${

        index === 6 ? "xl:col-span-3 xl:min-h-[285px]" : ""

      }`}

    >

      {/* subtle clinical glow */}

      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#54d7c3]/0 blur-[60px] transition duration-500 group-hover:bg-[#54d7c3]/10" />

      {/* animated scan */}

      <motion.div

        initial={{ top: "-5%" }}

        whileHover={{ top: "105%" }}

        transition={{

          duration: 1.5,

          ease: "easeInOut",

        }}

        className="pointer-events-none absolute left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#46cdb8]/50 to-transparent"

      />

      <div className="relative flex items-start justify-between">

        <motion.div

          whileHover={{ scale: 1.08, rotate: 3 }}

          className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#eaf8f5]"

        >

          <Icon className="h-5 w-5 text-[#159c8a]" />

        </motion.div>

        <span className="font-mono text-[10px] font-semibold text-[#a2b5bc]">

          {tool.number}

        </span>

      </div>

      <div className="relative mt-9">

        <p className="text-[9px] font-bold tracking-[0.18em] text-[#19a491]">

          {tool.label}

        </p>

        <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.025em] text-[#173845]">

          {tool.title}

        </h3>

        <p className={`mt-4 text-sm leading-6 text-[#708892] ${index === 6 ? "max-w-[760px]" : "max-w-[430px]"}`}>

          {tool.description}

        </p>

      </div>

      <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between border-t border-[#edf2f3] pt-5">

        <div className="flex items-center gap-2">

          <motion.span

            animate={{

              opacity: [0.35, 1, 0.35],

            }}

            transition={{

              duration: 2,

              repeat: Infinity,

              delay: index * 0.15,

            }}

            className="h-1.5 w-1.5 rounded-full bg-[#31c8b1]"

          />

          <span className="text-[9px] font-semibold tracking-[0.13em] text-[#8ba1a9]">

            READY

          </span>

        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe8ea] bg-[#f8fbfc] transition duration-300 group-hover:border-[#a8ddd5] group-hover:bg-[#eaf8f5]">

          <ArrowRight className="h-3.5 w-3.5 text-[#76909a] transition duration-300 group-hover:translate-x-1 group-hover:text-[#149c8b]" />

        </div>

      </div>

    </motion.a>

  );

}

/* =========================================================

   WORKFLOW

\========================================================= */

function WorkflowCard({

  icon: Icon,

  number,

  title,

  text,

  delay,

}: {

  icon: React.ElementType;

  number: string;

  title: string;

  text: string;

  delay: number;

}) {

  return (

    <motion.div

      initial={{ opacity: 0, y: 30 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true }}

      transition={{

        duration: 0.6,

        delay,

      }}

      className="relative z-10 rounded-[24px] border border-[#d8e7ea] bg-white p-6 shadow-[0_12px_40px_rgba(20,70,85,.04)]"

    >

      <div className="flex items-center justify-between">

        <motion.div

          whileInView={{ scale: [0.8, 1.08, 1] }}

          viewport={{ once: true }}

          transition={{ delay: delay + 0.25 }}

          className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#edf8f6] bg-[#dff5f1]"

        >

          <Icon className="h-5 w-5 text-[#149d8b]" />

        </motion.div>

        <span className="font-mono text-[10px] text-[#9cafb6]">

          {number}

        </span>

      </div>

      <h3 className="mt-7 text-lg font-semibold text-[#193b47]">

        {title}

      </h3>

      <p className="mt-3 text-xs leading-6 text-[#708790]">

        {text}

      </p>

    </motion.div>

  );

}

/* =========================================================

   BACKGROUNDS

\========================================================= */

function ClinicalHeroBackground() {

  return (

    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* soft hospital illumination */}

      <motion.div

        animate={{

          x: [-80, 100, -80],

          y: [0, 30, 0],

        }}

        transition={{

          duration: 18,

          repeat: Infinity,

          ease: "easeInOut",

        }}

        className="absolute -left-40 top-20 h-[500px] w-[500px] transform-gpu will-change-transform rounded-full bg-[#4cd8c3]/10 blur-[130px]"

      />

      <motion.div

        animate={{

          x: [60, -80, 60],

        }}

        transition={{

          duration: 22,

          repeat: Infinity,

          ease: "easeInOut",

        }}

        className="absolute right-[-150px] top-[25%] h-[520px] w-[520px] transform-gpu will-change-transform rounded-full bg-[#62cfe4]/10 blur-[140px]"

      />

      {/* subtle medical architecture lines */}

      <div

        className="absolute inset-0 opacity-[0.09]"

        style={{

          backgroundImage:

            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",

          backgroundSize: "80px 80px",

          maskImage:

            "linear-gradient(to bottom, black, transparent 85%)",

        }}

      />

      {/* slow floating clinical lights */}

      {[

        ["12%", "28%"],

        ["30%", "70%"],

        ["50%", "18%"],

        ["70%", "68%"],

        ["86%", "30%"],

      ].map(([left, top], index) => (

        <motion.div

          key={index}

          style={{ left, top }}

          animate={{

            y: [0, -20, 0],

            opacity: [0.15, 0.55, 0.15],

          }}

          transition={{

            duration: 4 + index,

            repeat: Infinity,

            ease: "easeInOut",

          }}

          className="absolute h-1.5 w-1.5 transform-gpu will-change-transform rounded-full bg-[#9ce9df]"

        />

      ))}

    </div>

  );

}

function HospitalLightBackground() {

  return (

    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      <div className="absolute left-[-180px] top-[15%] h-[420px] w-[420px] rounded-full bg-[#bdeee6]/30 blur-[130px]" />

      <div className="absolute right-[-180px] top-[40%] h-[480px] w-[480px] rounded-full bg-[#cceef5]/35 blur-[140px]" />

      <div

        className="absolute inset-0 opacity-[0.22]"

        style={{

          backgroundImage:

            "linear-gradient(rgba(20,120,130,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,120,130,.04) 1px, transparent 1px)",

          backgroundSize: "70px 70px",

        }}

      />

    </div>

  );

}

/* =========================================================

   ECG

\========================================================= */

function ECG() {

  return (

    <motion.div

      animate={{ x: ["-50%", "0%"] }}

      transition={{

        duration: 4,

        repeat: Infinity,

        ease: "linear",

      }}

      className="flex w-[200%] transform-gpu will-change-transform"

    >

      {[0, 1, 2, 3].map((item) => (

        <svg

          key={item}

          viewBox="0 0 300 40"

          className="h-10 w-[300px] shrink-0"

          fill="none"

        >

          <path

            d="M0 20 H52 L64 20 L72 14 L80 27 L89 5 L99 34 L110 20 H158 L169 20 L177 15 L185 24 L193 20 H300"

            stroke="#29bda8"

            strokeWidth="1.5"

          />

        </svg>

      ))}

    </motion.div>

  );

}

function DarkECG() {

  return (

    <motion.div

      animate={{ x: ["-50%", "0%"] }}

      transition={{

        duration: 3.5,

        repeat: Infinity,

        ease: "linear",

      }}

      className="flex w-[200%] transform-gpu will-change-transform"

    >

      {[0, 1, 2, 3].map((item) => (

        <svg

          key={item}

          viewBox="0 0 220 35"

          className="h-8 w-[220px] shrink-0"

          fill="none"

        >

          <path

            d="M0 18 H40 L50 18 L58 11 L67 27 L76 4 L87 31 L98 18 H135 L145 18 L153 14 L161 22 L169 18 H220"

            stroke="rgba(101,225,207,.7)"

            strokeWidth="1.4"

          />

        </svg>

      ))}

    </motion.div>

  );

}

/* =========================================================

   SMALL COMPONENTS

\========================================================= */

function NavLink({

  href,

  children,

}: {

  href: string;

  children: React.ReactNode;

}) {

  return (

    <a

      href={href}

      className="rounded-full px-4 py-2 text-[11px] text-white/50 transition hover:bg-white/[0.07] hover:text-white"

    >

      {children}

    </a>

  );

}

function TrustItem({ text }: { text: string }) {

  return (

    <div className="flex items-center gap-2">

      <CircleCheck className="h-3.5 w-3.5 text-[#60d9c7]" />

      {text}

    </div>

  );

}

function SystemMetric({

  icon: Icon,

  value,

  label,

  live = false,

}: {

  icon: React.ElementType;

  value: string;

  label: string;

  live?: boolean;

}) {

  return (

    <div className="flex items-center gap-4 border-b border-[#e4edef] p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f8f5]">

        <Icon className="h-4 w-4 text-[#149c8b]" />

      </div>

      <div>

        <div className="flex items-center gap-2">

          {live && (

            <motion.span

              animate={{ opacity: [0.3, 1, 0.3] }}

              transition={{ duration: 1.5, repeat: Infinity }}

              className="h-1.5 w-1.5 will-change-opacity rounded-full bg-[#2bc6ae]"

            />

          )}

          <p className="text-xs font-semibold text-[#193b47]">

            {value}

          </p>

        </div>

        <p className="mt-1 text-[9px] text-[#8ba0a8]">

          {label}

        </p>

      </div>

    </div>

  );

}

function FloatingClinicalIcon({

  icon: Icon,

  position,

  delay,

}: {

  icon: React.ElementType;

  position: string;

  delay: number;

}) {

  return (

    <motion.div

      animate={{ y: [0, -8, 0] }}

      transition={{

        duration: 4,

        delay,

        repeat: Infinity,

        ease: "easeInOut",

      }}

      className={`absolute ${position} flex h-9 w-9 transform-gpu will-change-transform items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]`}

    >

      <Icon className="h-4 w-4 text-[#8be4d7]/70" />

    </motion.div>

  );

}

function MonitorStatus({

  title,

  value,

}: {

  title: string;

  value: string;

}) {

  return (

    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3">

      <p className="text-[7px] tracking-[0.15em] text-white/25">

        {title}

      </p>

      <p className="mt-1 text-[9px] font-semibold text-[#8be4d7]">

        {value}

      </p>

    </div>

  );

}

function FloatingPanel({

  className,

  label,

  value,

  delay,

}: {

  className: string;

  label: string;

  value: string;

  delay: number;

}) {

  return (

    <motion.div

      initial={{ opacity: 0, scale: 0.9 }}

      animate={{

        opacity: 1,

        scale: 1,

        y: [0, -8, 0],

      }}

      transition={{

        opacity: { delay: 0.8 + delay * 0.1 },

        scale: { delay: 0.8 + delay * 0.1 },

        y: {

          duration: 4.5 + delay,

          repeat: Infinity,

          ease: "easeInOut",

        },

      }}

      className={`absolute hidden transform-gpu will-change-transform rounded-xl border border-white/10 bg-[#0b3542]/80 px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,.14)] backdrop-blur-xl sm:block ${className}`}

    >

      <p className="text-[7px] tracking-[0.17em] text-white/30">

        {label}

      </p>

      <div className="mt-1.5 flex items-center gap-2">

        <span className="h-1.5 w-1.5 rounded-full bg-[#61dfcb]" />

        <p className="text-[9px] font-semibold text-[#a0eee2]">

          {value}

        </p>

      </div>

    </motion.div>

  );

}
