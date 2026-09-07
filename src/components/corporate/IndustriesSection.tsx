import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building,
  CheckCircle2,
  HardHat,
  HeartPulse,
  Landmark,
  Plane,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function IndustriesSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("hospitals");

  const industries = [
    {
      id: "hospitals",
      label: t("corporate.industries.tab1"),
      icon: HeartPulse,
      title: t("corporate.industries.ind1Title"),
      desc: t("corporate.industries.ind1Desc"),
      benefits: [
        t("corporate.industries.ind1Benefit1"),
        t("corporate.industries.ind1Benefit2"),
        t("corporate.industries.ind1Benefit3"),
      ],
      caseStudy: t("corporate.industries.ind1Case"),
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85",
      badge: "ICRA CLASS IV CONTAINMENT",
    },
    {
      id: "government",
      label: t("corporate.industries.tab2"),
      icon: Landmark,
      title: t("corporate.industries.ind2Title"),
      desc: t("corporate.industries.ind2Desc"),
      benefits: [
        t("corporate.industries.ind2Benefit1"),
        t("corporate.industries.ind2Benefit2"),
        t("corporate.industries.ind2Benefit3"),
      ],
      caseStudy: t("corporate.industries.ind2Case"),
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1600&q=85",
      badge: "ASHGHAL APPROVED FRAMEWORK",
    },
    {
      id: "aviation",
      label: t("corporate.industries.tab3"),
      icon: Plane,
      title: t("corporate.industries.ind3Title"),
      desc: t("corporate.industries.ind3Desc"),
      benefits: [
        t("corporate.industries.ind3Benefit1"),
        t("corporate.industries.ind3Benefit2"),
        t("corporate.industries.ind3Benefit3"),
      ],
      caseStudy: t("corporate.industries.ind3Case"),
      image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1600&q=85",
      badge: "AIRSIDE STERILE SECURITY",
    },
    {
      id: "construction",
      label: t("corporate.industries.tab4"),
      icon: HardHat,
      title: t("corporate.industries.ind4Title"),
      desc: t("corporate.industries.ind4Desc"),
      benefits: [
        t("corporate.industries.ind4Benefit1"),
        t("corporate.industries.ind4Benefit2"),
        t("corporate.industries.ind4Benefit3"),
      ],
      caseStudy: t("corporate.industries.ind4Case"),
      image: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1600&q=85",
      badge: "TIER-1 EPC CONSORTIUMS",
    },
    {
      id: "smart-cities",
      label: t("corporate.industries.tab5"),
      icon: Building,
      title: t("corporate.industries.ind5Title"),
      desc: t("corporate.industries.ind5Desc"),
      benefits: [
        t("corporate.industries.ind5Benefit1"),
        t("corporate.industries.ind5Benefit2"),
        t("corporate.industries.ind5Benefit3"),
      ],
      caseStudy: t("corporate.industries.ind5Case"),
      image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=85",
      badge: "DISTRICT IOT MESH",
    },
  ];

  const current = industries.find((i) => i.id === activeTab) ?? industries[0]!;

  return (
    <section id="industries" className="py-20 sm:py-28 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            <Building className="size-3.5" />
            <span>{t("corporate.industries.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Specialized Solutions by Industry
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.industries.sectionSubtitle")}
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex justify-center overflow-x-auto pb-2">
          <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex gap-1 sm:gap-2">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveTab(ind.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0",
                    activeTab === ind.id
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{ind.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Industry Showcase Card */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-10 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Image side */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 shadow-md">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-950/80 text-white backdrop-blur-md border border-white/10">
                  {current.badge}
                </div>
              </div>

              {/* Text side */}
              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {current.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {current.desc}
                </p>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Institutional Capabilities:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {current.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Case Study Callout Box */}
                <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 space-y-1">
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                    Proven Deployment:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {current.caseStudy}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
