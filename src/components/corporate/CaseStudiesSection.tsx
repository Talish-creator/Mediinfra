import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building,
  CheckCircle2,
  FileCheck2,
  HeartPulse,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CaseStudy {
  id: string;
  titleKey: string;
  categoryKey: string;
  descKey: string;
  results: string[];
  image: string;
  fullNarrative: string[];
}

export function CaseStudiesSection() {
  const { t } = useTranslation();
  const [activeStory, setActiveStory] = useState<CaseStudy | null>(null);

  const stories: CaseStudy[] = [
    {
      id: "hamad",
      titleKey: "corporate.caseStudies.cs1Title",
      categoryKey: "corporate.caseStudies.cs1Category",
      descKey: "corporate.caseStudies.cs1Desc",
      results: [
        t("corporate.caseStudies.cs1Result1"),
        t("corporate.caseStudies.cs1Result2"),
        t("corporate.caseStudies.cs1Result3"),
      ],
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85",
      fullNarrative: [
        "Hamad General Hospital is Qatar's primary tertiary care facility. A $450 million phased retrofit required replacing 24 AHUs, central medical gas lines, and structural MEP directly above active Level 3 surgical suites and pediatric ICUs.",
        "MediInfra deployed 4 Zebra FXR90 UHF RFID turnstile portals at contractor access risers and integrated wireless differential pressure sensors across ICRA Class IV containment hoardings.",
        "Over 14 months of construction, zero containment breaches were recorded, and contractor billing was reconciled with 100% precision via automated Ashghal Form LR-01 returns.",
      ],
    },
    {
      id: "lusail",
      titleKey: "corporate.caseStudies.cs2Title",
      categoryKey: "corporate.caseStudies.cs2Category",
      descKey: "corporate.caseStudies.cs2Desc",
      results: [
        t("corporate.caseStudies.cs2Result1"),
        t("corporate.caseStudies.cs2Result2"),
        t("corporate.caseStudies.cs2Result3"),
      ],
      image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=85",
      fullNarrative: [
        "The Lusail Medical City project spans 4 specialized medical towers with 4,200 daily workers from 8 primary Tier-1 subcontractors.",
        "The general contractor deployed MediInfra's 3D BIM Digital Twin and NVIDIA Jetson Edge AI cameras to monitor high-risk elevated works, crane swing radii, and muster assembly points.",
        "The project achieved 180 consecutive incident-free days and passed all Qatar Civil Defence full-scale evacuation simulations with muster triage completed in under 3 minutes.",
      ],
    },
    {
      id: "sidra",
      titleKey: "corporate.caseStudies.cs3Title",
      categoryKey: "corporate.caseStudies.cs3Category",
      descKey: "corporate.caseStudies.cs3Desc",
      results: [
        t("corporate.caseStudies.cs3Result1"),
        t("corporate.caseStudies.cs3Result2"),
        t("corporate.caseStudies.cs3Result3"),
      ],
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1600&q=85",
      fullNarrative: [
        "Sidra Outpatient Specialized Clinics required strict credential segregation and real-time noise/particulate management during a surgical suite expansion.",
        "MediInfra implemented RFID credentials with anti-passback verification, providing real-time data streams to clinical safety directors and contractor foremen.",
        "The facility achieved 100% compliance with Qatar Personal Data Protection Law No. 13 of 2016 and automated all statutory workforce submissions.",
      ],
    },
  ];

  return (
    <section id="case-studies" className="py-20 sm:py-28 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <Award className="size-3.5" />
            <span>{t("corporate.caseStudies.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transforming Hospital Construction Safety
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.caseStudies.sectionSubtitle")}
          </p>
        </div>

        {/* 3 Case Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={item.image}
                    alt={t(item.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 text-blue-400 backdrop-blur-md border border-white/10">
                    {t(item.categoryKey)}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(item.descKey)}
                  </p>

                  {/* Quantified Metrics Badges */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    {item.results.map((res, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5 shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button
                  onClick={() => setActiveStory(item)}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl text-xs font-semibold border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
                >
                  <span>{t("corporate.caseStudies.readStory")}</span>
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Full Story Modal */}
      <Dialog open={!!activeStory} onOpenChange={(open) => !open && setActiveStory(null)}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {activeStory && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {t(activeStory.categoryKey)}
                </span>
                <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {t(activeStory.titleKey)}
                </DialogTitle>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-950">
                <img
                  src={activeStory.image}
                  alt={t(activeStory.titleKey)}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                {activeStory.results.map((r, i) => (
                  <div key={i}>
                    <p className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {r}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeStory.fullNarrative.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setActiveStory(null)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  Close Story
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
