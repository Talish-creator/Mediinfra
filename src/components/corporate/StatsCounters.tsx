import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Activity,
  Building,
  Camera,
  Cpu,
  Radio,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatedNumber } from "@/components/mediinfra/ui-kit";

export function StatsCounters() {
  const { t } = useTranslation();

  const stats = [
    {
      id: "hospitals",
      val: 14,
      suffix: "",
      decimals: 0,
      label: t("corporate.stats.hospitalsLabel"),
      icon: Building,
      accent: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "workers",
      val: 18400,
      suffix: "+",
      decimals: 0,
      label: t("corporate.stats.workersLabel"),
      icon: Users,
      accent: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "cameras",
      val: 420,
      suffix: "",
      decimals: 0,
      label: t("corporate.stats.camerasLabel"),
      icon: Camera,
      accent: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "events",
      val: 4.2,
      suffix: "M+",
      decimals: 1,
      label: t("corporate.stats.eventsLabel"),
      icon: Radio,
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "uptime",
      val: 99.99,
      suffix: "%",
      decimals: 2,
      label: t("corporate.stats.uptimeLabel"),
      icon: ShieldCheck,
      accent: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Ambient background mesh */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 text-center">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="space-y-2"
              >
                <div className="mx-auto size-10 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300 mb-3">
                  <Icon className="size-5" />
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-mono text-white">
                  <AnimatedNumber value={item.val} decimals={item.decimals} />
                  <span>{item.suffix}</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-[160px] mx-auto">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
