import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  FileCheck2,
  HardHat,
  Radio,
  ScanLine,
  Shield,
  ShieldCheck,
  Siren,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StorySection {
  id: string;
  tagKey: string;
  titleKey: string;
  descKey: string;
  points: string[];
  ctaKey: string;
  ctaTo: string;
  image: string;
  icon: typeof Boxes;
  reverse: boolean;
  accent: string;
}

export function ImageStorytelling() {
  const { t } = useTranslation();

  const sections: StorySection[] = [
    {
      id: "smart-hospitals",
      tagKey: "corporate.storytelling.smartHospitals.tag",
      titleKey: "corporate.storytelling.smartHospitals.title",
      descKey: "corporate.storytelling.smartHospitals.desc",
      points: [
        t("corporate.storytelling.smartHospitals.point1"),
        t("corporate.storytelling.smartHospitals.point2"),
        t("corporate.storytelling.smartHospitals.point3"),
      ],
      ctaKey: "corporate.storytelling.smartHospitals.cta",
      ctaTo: "/command",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1600&q=85",
      icon: HardHat,
      reverse: false,
      accent: "from-blue-600 to-indigo-600",
    },
    {
      id: "digital-twin",
      tagKey: "corporate.storytelling.digitalTwin.tag",
      titleKey: "corporate.storytelling.digitalTwin.title",
      descKey: "corporate.storytelling.digitalTwin.desc",
      points: [
        t("corporate.storytelling.digitalTwin.point1"),
        t("corporate.storytelling.digitalTwin.point2"),
        t("corporate.storytelling.digitalTwin.point3"),
      ],
      ctaKey: "corporate.storytelling.digitalTwin.cta",
      ctaTo: "/digital-twin",
      image: "/corporate/enterprise_digital_twin_upgraded.png",
      icon: Boxes,
      reverse: true,
      accent: "from-sky-600 to-blue-600",
    },
    {
      id: "ai-vision",
      tagKey: "corporate.storytelling.aiVision.tag",
      titleKey: "corporate.storytelling.aiVision.title",
      descKey: "corporate.storytelling.aiVision.desc",
      points: [
        t("corporate.storytelling.aiVision.point1"),
        t("corporate.storytelling.aiVision.point2"),
        t("corporate.storytelling.aiVision.point3"),
      ],
      ctaKey: "corporate.storytelling.aiVision.cta",
      ctaTo: "/safety-ai",
      image: "/corporate/enterprise_safety_ai.png",
      icon: Sparkles,
      reverse: false,
      accent: "from-purple-600 to-indigo-600",
    },
    {
      id: "rfid-tracking",
      tagKey: "corporate.storytelling.rfidTracking.tag",
      titleKey: "corporate.storytelling.rfidTracking.title",
      descKey: "corporate.storytelling.rfidTracking.desc",
      points: [
        t("corporate.storytelling.rfidTracking.point1"),
        t("corporate.storytelling.rfidTracking.point2"),
        t("corporate.storytelling.rfidTracking.point3"),
      ],
      ctaKey: "corporate.storytelling.rfidTracking.cta",
      ctaTo: "/gates",
      image: "/corporate/enterprise_gates_upgraded.png",
      icon: ScanLine,
      reverse: true,
      accent: "from-emerald-600 to-teal-600",
    },
    {
      id: "emergency-muster",
      tagKey: "corporate.storytelling.emergencyMuster.tag",
      titleKey: "corporate.storytelling.emergencyMuster.title",
      descKey: "corporate.storytelling.emergencyMuster.desc",
      points: [
        t("corporate.storytelling.emergencyMuster.point1"),
        t("corporate.storytelling.emergencyMuster.point2"),
        t("corporate.storytelling.emergencyMuster.point3"),
      ],
      ctaKey: "corporate.storytelling.emergencyMuster.cta",
      ctaTo: "/muster",
      image: "/corporate/enterprise_muster_upgraded.png",
      icon: Siren,
      reverse: false,
      accent: "from-red-600 to-rose-600",
    },
    {
      id: "analytics",
      tagKey: "corporate.storytelling.analytics.tag",
      titleKey: "corporate.storytelling.analytics.title",
      descKey: "corporate.storytelling.analytics.desc",
      points: [
        t("corporate.storytelling.analytics.point1"),
        t("corporate.storytelling.analytics.point2"),
        t("corporate.storytelling.analytics.point3"),
      ],
      ctaKey: "corporate.storytelling.analytics.cta",
      ctaTo: "/reports-center",
      image: "/corporate/enterprise_analytics.png",
      icon: Activity,
      reverse: true,
      accent: "from-blue-600 to-cyan-600",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <Sparkles className="size-3.5" />
            <span>{t("corporate.storytelling.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Engineered for Zero-Tolerance Healthcare Environments
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.storytelling.sectionSubtitle")}
          </p>
        </div>

        {/* Alternating Storytelling Rows */}
        <div className="space-y-24 sm:space-y-32">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center",
                  sec.reverse && "lg:grid-flow-dense",
                )}
              >
                {/* Visual Imagery Side */}
                <div
                  className={cn(
                    "lg:col-span-7 relative group",
                    sec.reverse && "lg:col-start-6",
                  )}
                >
                  <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-900 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                    {/* Aspect-Ratio Frame */}
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={sec.image}
                        alt={t(sec.titleKey)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>

                    {/* Subtle Overlay Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Narrative Text Side */}
                <div
                  className={cn(
                    "lg:col-span-5 space-y-6",
                    sec.reverse && "lg:col-start-1",
                  )}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Icon className="size-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{t(sec.tagKey)}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                    {t(sec.titleKey)}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t(sec.descKey)}
                  </p>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {sec.points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <Button
                      asChild
                      className="rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all gap-2"
                    >
                      <Link to={sec.ctaTo}>
                        <span>{t(sec.ctaKey)}</span>
                        <ArrowRight className="size-3.5 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
