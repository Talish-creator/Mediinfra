import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Boxes,
  Cpu,
  FileBarChart2,
  HardHat,
  LayoutDashboard,
  ScanLine,
  Shield,
  ShieldAlert,
  Siren,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function SolutionsGrid() {
  const { t } = useTranslation();

  const solutions = [
    {
      id: "command-center",
      title: t("corporate.solutions.sol1Title"),
      desc: t("corporate.solutions.sol1Desc"),
      to: "/command",
      image: "/corporate/enterprise_command_center.png",
      tag: "CORE COMMAND",
      icon: LayoutDashboard,
    },
    {
      id: "digital-twin",
      title: t("corporate.solutions.sol2Title"),
      desc: t("corporate.solutions.sol2Desc"),
      to: "/digital-twin",
      image: "/corporate/enterprise_digital_twin_upgraded.png",
      tag: "SPATIAL 3D",
      icon: Boxes,
    },
    {
      id: "gate-telemetry",
      title: t("corporate.solutions.sol3Title"),
      desc: t("corporate.solutions.sol3Desc"),
      to: "/gates",
      image: "/corporate/enterprise_gates_upgraded.png",
      tag: "UHF RFID ACCESS",
      icon: ScanLine,
    },
    {
      id: "emergency-muster",
      title: t("corporate.solutions.sol4Title"),
      desc: t("corporate.solutions.sol4Desc"),
      to: "/muster",
      image: "/corporate/enterprise_muster_upgraded.png",
      tag: "CIVIL DEFENCE",
      icon: Siren,
    },
    {
      id: "edge-ai",
      title: t("corporate.solutions.sol5Title"),
      desc: t("corporate.solutions.sol5Desc"),
      to: "/safety-ai",
      image: "/corporate/enterprise_safety_ai.png",
      tag: "NVIDIA JETSON",
      icon: Sparkles,
    },
    {
      id: "reports-center",
      title: t("corporate.solutions.sol6Title"),
      desc: t("corporate.solutions.sol6Desc"),
      to: "/reports-center",
      image: "/corporate/enterprise_reports.png",
      tag: "STATUTORY AUDIT",
      icon: FileBarChart2,
    },
  ];

  return (
    <section id="solutions" className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <LayoutDashboard className="size-3.5" />
            <span>{t("corporate.solutions.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Integrated Enterprise Solutions Suite
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.solutions.sectionSubtitle")}
          </p>
        </div>

        {/* 6 Solutions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {solutions.map((sol, index) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={sol.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  {/* Card Image with Hover Zoom */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={sol.image}
                      alt={sol.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 text-white backdrop-blur-md border border-white/10">
                      {sol.tag}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Icon className="size-4" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {sol.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {sol.desc}
                    </p>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-6 pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 p-3"
                  >
                    <Link to={sol.to}>
                      <span>Explore in Command Center</span>
                      <ArrowRight className="size-3.5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
