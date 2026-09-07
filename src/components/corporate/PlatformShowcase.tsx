import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Boxes,
  Cpu,
  Fingerprint,
  HardHat,
  Layers,
  LayoutDashboard,
  Radio,
  ScanLine,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PlatformShowcase() {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    {
      id: "command",
      title: "Executive Command Center",
      tag: "CORE CONSOLE",
      desc: "Live Qatar hospital telemetry aggregate. Multi-zone worker density heatmaps, optical portal lane throughput, and environmental particulate status.",
      image: "/corporate/enterprise_command_center.png",
      to: "/command",
      stats: [
        { label: "Shift Headcount", val: "864 Active" },
        { label: "Safety Score", val: "98.4%" },
        { label: "Critical Anomalies", val: "0 Active" },
      ],
    },
    {
      id: "twin",
      title: "Living Spatial 3D Digital Twin",
      tag: "BIM TELEMETRY",
      desc: "WebGL-powered interactive multi-wing hospital floorplans. Trade-coded moving worker avatars, path trails, and ICRA cleanroom restricted boundaries.",
      image: "/corporate/enterprise_digital_twin_upgraded.png",
      to: "/digital-twin",
      stats: [
        { label: "FPS Render Rate", val: "60 FPS WebGL" },
        { label: "BIM Levels", val: "B2 to L6 Active" },
        { label: "Restricted Geofences", val: "12 Enforced" },
      ],
    },
    {
      id: "gates",
      title: "High-Throughput UHF RFID Gates",
      tag: "IOT HARDWARE",
      desc: "Sub-second worker verification powered by Zebra FXR90 8-port portal antennas. Instant lane queuing, anti-passback violation alerts, and auto-sync.",
      image: "/corporate/enterprise_gates_upgraded.png",
      to: "/gates",
      stats: [
        { label: "Read Latency", val: "0.40 Seconds" },
        { label: "Throughput", val: "42 Workers/Min" },
        { label: "Passback Violations", val: "0 Blocked" },
      ],
    },
    {
      id: "safety-ai",
      title: "Edge AI Safety Vision & Broadcast Hub",
      tag: "NVIDIA JETSON",
      desc: "Real-time edge neural inference for PPE compliance (hard hats, high-vis vests), hazardous exclusion zones, and automated site PA speaker broadcasts.",
      image: "/corporate/enterprise_safety_ai.png",
      to: "/safety-ai",
      stats: [
        { label: "Inference Speed", val: "18ms Latency" },
        { label: "Edge Hardware", val: "Jetson AGX Orin" },
        { label: "Detection Accuracy", val: "99.4% Verified" },
      ],
    },
  ];

  const current = modules[activeModule] ?? modules[0]!;

  return (
    <section id="platform" className="py-20 sm:py-28 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800">
            <Cpu className="size-3.5" />
            <span>{t("corporate.platform.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Architecture of the Operating System
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t("corporate.platform.sectionSubtitle")}
          </p>
        </div>

        {/* 4 Core Architectural Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md space-y-2">
            <div className="size-10 rounded-2xl bg-blue-600/30 flex items-center justify-center text-blue-400 mb-4">
              <Radio className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {t("corporate.platform.feature1Title")}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t("corporate.platform.feature1Desc")}
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md space-y-2">
            <div className="size-10 rounded-2xl bg-purple-600/30 flex items-center justify-center text-purple-400 mb-4">
              <Sparkles className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {t("corporate.platform.feature2Title")}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t("corporate.platform.feature2Desc")}
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md space-y-2">
            <div className="size-10 rounded-2xl bg-emerald-600/30 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {t("corporate.platform.feature3Title")}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t("corporate.platform.feature3Desc")}
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md space-y-2">
            <div className="size-10 rounded-2xl bg-amber-600/30 flex items-center justify-center text-amber-400 mb-4">
              <Boxes className="size-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {t("corporate.platform.feature4Title")}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t("corporate.platform.feature4Desc")}
            </p>
          </div>
        </div>

        {/* Floating Studio Interactive Preview */}
        <div className="space-y-6">
          {/* Module Switcher Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {modules.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(idx)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border",
                  activeModule === idx
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 scale-105"
                    : "bg-slate-900/80 text-slate-400 border-white/10 hover:text-white hover:bg-slate-800",
                )}
              >
                {m.title}
              </button>
            ))}
          </div>

          {/* Studio Canvas Preview Box */}
          <div className="relative rounded-3xl border border-white/20 bg-slate-900/90 shadow-2xl overflow-hidden group">
            {/* Top Browser Window Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-500/70" />
                <span className="size-3 rounded-full bg-amber-500/70" />
                <span className="size-3 rounded-full bg-emerald-500/70" />
                <span className="font-mono text-xs text-slate-300 ms-3">
                  mediinfra.internal/module/{current.id}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                {current.tag}
              </span>
            </div>

            {/* Display Image & HUD overlays */}
            <div className="relative aspect-[16/9] lg:aspect-[21/9] bg-slate-950 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.id}
                  src={current.image}
                  alt={current.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Bottom HUD bar with stats & description */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {current.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {current.desc}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                  {current.stats.map((s, i) => (
                    <div key={i} className="text-center md:text-end">
                      <p className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                        {s.val}
                      </p>
                      <p className="text-[10px] text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
