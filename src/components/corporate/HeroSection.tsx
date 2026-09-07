import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  HardHat,
  LayoutDashboard,
  Play,
  Radio,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivePulse } from "@/components/mediinfra/ui-kit";

interface HeroSectionProps {
  onOpenDemo?: () => void;
  onOpenVideo?: () => void;
}

export function HeroSection({ onOpenDemo, onOpenVideo }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* Edge-to-edge background photography with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        {/* Modern dark gradient overlay with color tinting */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/95" />
        <div className="absolute inset-0 bg-radial from-blue-600/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center sm:text-start">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Value Proposition, Action Triggers */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Operational Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 backdrop-blur-md text-blue-300 text-xs font-semibold shadow-inner"
            >
              <LivePulse tone="ok" size="sm" />
              <span className="font-mono uppercase tracking-wider text-[11px]">
                {t("corporate.hero.statusLive")}
              </span>
            </motion.div>

            {/* Giant Modern Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]"
            >
              <span className="block">{t("corporate.hero.headlinePart1")}</span>
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                {t("corporate.hero.headlinePart2")}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal"
            >
              {t("corporate.hero.subtitle")}
            </motion.p>

            {/* Triple CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2"
            >
              <Button
                asChild
                size="lg"
                className="rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-600/30 transition-all gap-2 px-6 h-12"
              >
                <Link to="/command">
                  <LayoutDashboard className="size-4" />
                  <span>{t("corporate.hero.ctaExplore")}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>

              <Button
                onClick={onOpenDemo}
                size="lg"
                variant="outline"
                className="rounded-2xl font-semibold text-sm border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all px-6 h-12"
              >
                {t("corporate.hero.ctaDemo")}
              </Button>

              <Button
                onClick={onOpenVideo}
                size="lg"
                variant="ghost"
                className="rounded-2xl font-semibold text-sm text-slate-300 hover:text-white hover:bg-white/10 gap-2 h-12"
              >
                <div className="size-8 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400">
                  <Play className="size-3.5 ml-0.5" />
                </div>
                <span>{t("corporate.hero.ctaVideo")}</span>
              </Button>
            </motion.div>

            {/* Quick Metrics Ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-start"
            >
              <div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono">14</p>
                <p className="text-[11px] text-slate-400">{t("corporate.hero.activeSites")}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-blue-400 font-mono">18,400+</p>
                <p className="text-[11px] text-slate-400">{t("corporate.hero.realTimeWorkers")}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">0.4s</p>
                <p className="text-[11px] text-slate-400">{t("corporate.hero.rfidRate")}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating High-Impact Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[28px] blur-xl opacity-40 animate-pulse pointer-events-none" />

            <div className="relative rounded-3xl border border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-2xl overflow-hidden group">
              {/* Studio Window Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-white/10 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500/80" />
                  <span className="size-2.5 rounded-full bg-amber-500/80" />
                  <span className="size-2.5 rounded-full bg-emerald-500/80" />
                  <span className="font-mono text-[11px] text-slate-400 ml-2">
                    mediinfra-command.internal
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  LIVE 60FPS
                </span>
              </div>

              {/* Crisp preview image of the actual MediInfra Executive Command Center */}
              <div className="relative overflow-hidden aspect-[16/10] bg-slate-950">
                <img
                  src="/corporate/enterprise_command_center.png"
                  alt="MediInfra Executive Command Center"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Interactive HUD overlay badge on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-5">
                  <div className="flex items-center justify-between w-full">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">
                        P875 Hamad General Hospital Retrofit
                      </p>
                      <p className="text-[10px] text-slate-300 font-mono">
                        Zone 4 Inpatient Towers · 864 Active Workers
                      </p>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md gap-1"
                    >
                      <Link to="/command">
                        <span>Launch</span>
                        <ArrowRight className="size-3 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
