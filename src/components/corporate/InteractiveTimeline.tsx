import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cpu,
  FileBarChart2,
  HardHat,
  LayoutDashboard,
  Radio,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function InteractiveTimeline() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      titleKey: "corporate.timeline.step1Title",
      descKey: "corporate.timeline.step1Desc",
      icon: HardHat,
      badge: "RFID Portal Ingress",
      accent: "bg-blue-600",
    },
    {
      num: "02",
      titleKey: "corporate.timeline.step2Title",
      descKey: "corporate.timeline.step2Desc",
      icon: ShieldCheck,
      badge: "Induction & QID Verify",
      accent: "bg-indigo-600",
    },
    {
      num: "03",
      titleKey: "corporate.timeline.step3Title",
      descKey: "corporate.timeline.step3Desc",
      icon: Boxes,
      badge: "3D BIM Twin Sync",
      accent: "bg-sky-600",
    },
    {
      num: "04",
      titleKey: "corporate.timeline.step4Title",
      descKey: "corporate.timeline.step4Desc",
      icon: Sparkles,
      badge: "Edge AI PPE Vision",
      accent: "bg-purple-600",
    },
    {
      num: "05",
      titleKey: "corporate.timeline.step5Title",
      descKey: "corporate.timeline.step5Desc",
      icon: Activity,
      badge: "Labor Burn & LR-01",
      accent: "bg-emerald-600",
    },
    {
      num: "06",
      titleKey: "corporate.timeline.step6Title",
      descKey: "corporate.timeline.step6Desc",
      icon: LayoutDashboard,
      badge: "Command Intelligence",
      accent: "bg-blue-700",
    },
  ];

  return (
    <section id="timeline" className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <Radio className="size-3.5" />
            <span>{t("corporate.timeline.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            From Worker Ingress to Executive Decision
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.timeline.sectionSubtitle")}
          </p>
        </div>

        {/* 6 Step Visual Process Pipeline */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 -translate-y-1/2 z-0 opacity-40" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => setActiveStep(idx)}
                  className={cn(
                    "p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4",
                    isActive
                      ? "bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-xl ring-2 ring-blue-500/20 -translate-y-2"
                      : "bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md",
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-400">
                        {s.num}
                      </span>
                      <div
                        className={cn(
                          "size-8 rounded-xl flex items-center justify-center text-white shadow-xs",
                          s.accent,
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {t(s.titleKey)}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t(s.descKey)}
                      </p>
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-fit">
                    {s.badge}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
