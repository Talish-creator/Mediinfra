import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Cpu,
  Megaphone,
  Play,
  Radio,
  RefreshCw,
  ShieldAlert,
  ShieldX,
  Sparkles,
  UserCheck,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dot,
  LivePulse,
  Mono,
  PageHeader,
  Panel,
  Pill,
  ScanningLine,
  StreamingDots,
} from "@/components/mediinfra/ui-kit";
import { AI_CAMERAS, BROADCAST_LOG } from "@/lib/mediinfra-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/safety-ai")({
  head: () => ({
    meta: [
      { title: "Edge AI Safety Vision & Broadcast — MediInfra" },
      {
        name: "description",
        content:
          "Edge AI PPE detection, turnstile bypass alerts and automated bilingual loudspeaker broadcast log.",
      },
      { property: "og:title", content: "Edge AI Safety Vision & Broadcast — MediInfra" },
      {
        property: "og:description",
        content: "PPE detection and automated site loudspeaker broadcasts.",
      },
    ],
  }),
  component: SafetyAi,
});

export function SafetyAi() {
  const { t } = useTranslation();
  const [handled, setHandled] = useState<Record<string, string>>({});
  const [selectedCam, setSelectedCam] = useState<string>("CAM-01");
  const [fps, setFps] = useState(30);
  const [latency, setLatency] = useState(11.4);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick((v) => (v + 1) % 100);
      setFps(29 + Math.floor(Math.random() * 3));
      setLatency(parseFloat((11.2 + Math.random() * 0.6).toFixed(1)));
    }, 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("safetyAi.pageTitle")}
        description={t("safetyAi.pageDesc")}
        actions={
          <div className="flex items-center gap-2.5">
            <Pill tone="ok" glow className="h-9 px-3.5 text-xs font-semibold">
              <LivePulse tone="ok" size="sm" className="mr-1.5" /> {t("safetyAi.edgeNodesActive", { fps })}
            </Pill>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 rounded-xl text-xs"
              onClick={() =>
                toast.success(t("safetyAi.recalibrateSuccess"))
              }
            >
              <RefreshCw className="size-3.5" /> {t("safetyAi.recalibrate")}
            </Button>
          </div>
        }
      />

      {/* Edge Inference Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        <div className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.05)] hover:shadow-[0_20px_50px_rgba(2,6,23,0.08)] hover:-translate-y-0.5 transition-all duration-[180ms] ease-out flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-primary border border-blue-200/60 dark:border-blue-900/60">
            <Cpu className="size-5" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
              {t("safetyAi.edgeComputeUnit")}
            </p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">
              NVIDIA Jetson AGX Orin
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400">
              {t("safetyAi.edgeComputeSub")}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.05)] hover:shadow-[0_20px_50px_rgba(2,6,23,0.08)] hover:-translate-y-0.5 transition-all duration-[180ms] ease-out flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200/60 dark:border-emerald-900/60">
            <Activity className="size-5" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
              {t("safetyAi.kpiNeuralInference")}
            </p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white tabular-nums">
              {latency} ms
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {t("safetyAi.tensorRtSub")}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.05)] hover:shadow-[0_20px_50px_rgba(2,6,23,0.08)] hover:-translate-y-0.5 transition-all duration-[180ms] ease-out flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 border border-purple-200/60 dark:border-purple-900/60">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
              {t("safetyAi.activeAiModels")}
            </p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">YOLO-PPE + ByteTrack</p>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400">
              {t("safetyAi.activeModelsSub")}
            </p>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.05)] hover:shadow-[0_20px_50px_rgba(2,6,23,0.08)] hover:-translate-y-0.5 transition-all duration-[180ms] ease-out flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200/60 dark:border-amber-900/60">
            <Volume2 className="size-5" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
              {t("safetyAi.megaphoneArray")}
            </p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">
              {t("safetyAi.acousticBroadcast")}
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400">
              {t("safetyAi.languagesSub")}
            </p>
          </div>
        </div>
      </div>

      {/* Live AI Camera Feeds */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {AI_CAMERAS.map((cam) => {
          const isSelected = selectedCam === cam.id;
          return (
            <Panel
              key={cam.id}
              title={
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-primary" />
                  <span>{cam.name}</span>
                </div>
              }
              subtitle={`${cam.id} · 1080p RTSP · H.265 stream`}
              action={
                <Pill tone="ok" className="text-[10px]">
                  <Dot tone="ok" /> {t("common.active", "Online")}
                </Pill>
              }
              bodyClassName="p-4"
              className={cn(isSelected && "ring-2 ring-primary/40")}
            >
              {/* Synthetic Camera View with Real-time AI Overlays */}
              <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner group">
                {/* HUD Camera Header */}
                <div className="absolute top-2.5 start-2.5 end-2.5 z-20 flex items-center justify-between text-[10px] font-mono text-white/90">
                  <span className="flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                    <LivePulse tone="crit" size="sm" />
                    <span>{t("safetyAi.recLive")}</span>
                  </span>
                  <span className="rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                    {fps} FPS · {latency}ms
                  </span>
                </div>

                {/* Grid guidelines & Crosshair */}
                <div className="absolute inset-0 pointer-events-none opacity-25">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-500 border-r border-dashed" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-500 border-b border-dashed" />
                </div>

                {/* Live AI Scanning Beam */}
                <ScanningLine className="opacity-80" />

                {/* Animated AI Bounding Boxes */}
                {cam.detections.map((d, dIdx) => {
                  const isViolation = d.type === "crit";
                  const isWarning = d.type === "warn";
                  const boxBorder = isViolation
                    ? "border-red-500 text-red-500 bg-red-500/15 mi-breathe"
                    : isWarning
                      ? "border-amber-500 text-amber-500 bg-amber-500/15 mi-breathe"
                      : "border-emerald-400 text-emerald-400 bg-emerald-400/10";
                  const confidence = isViolation ? "99.2%" : isWarning ? "94.6%" : "98.7%";

                  return (
                    <div
                      key={d.id}
                      className={cn(
                        "absolute rounded border-2 transition-transform duration-700 pointer-events-none",
                        boxBorder,
                      )}
                      style={{
                        left: `${d.x}%`,
                        top: `${d.y}%`,
                        width: `${d.w}%`,
                        height: `${d.h}%`,
                        transform: `translate(${Math.sin(tick + dIdx) * 2}px, ${Math.cos(tick + dIdx) * 2}px)`,
                      }}
                    >
                      {/* Detection Tag */}
                      <span
                        className={cn(
                          "absolute -top-5 start-0 whitespace-nowrap rounded px-1.5 py-0.2 font-mono text-[9px] font-bold text-white shadow-sm flex items-center gap-1",
                          isViolation
                            ? "bg-red-600"
                            : isWarning
                              ? "bg-amber-600"
                              : "bg-emerald-600",
                        )}
                      >
                        <span>{d.label}</span>
                        <span className="opacity-90">{confidence}</span>
                      </span>

                      {/* Corner brackets */}
                      <span className="absolute top-0 start-0 size-1.5 border-t-2 border-s-2 border-white" />
                      <span className="absolute top-0 end-0 size-1.5 border-t-2 border-e-2 border-white" />
                      <span className="absolute bottom-0 start-0 size-1.5 border-b-2 border-s-2 border-white" />
                      <span className="absolute bottom-0 end-0 size-1.5 border-b-2 border-e-2 border-white" />
                    </div>
                  );
                })}

                {/* Bottom Stream Status */}
                <div className="absolute bottom-2.5 start-2.5 end-2.5 z-20 flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span className="rounded bg-black/60 px-2 py-0.5">FOV: 110° · H.265 CBR</span>
                  <span className="rounded bg-black/60 px-2 py-0.5 text-emerald-400">
                    {t("safetyAi.confidenceMin")}
                  </span>
                </div>
              </div>

              {/* Detections Chips */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cam.detections.map((d) => (
                  <Pill key={d.id} tone={d.type} className="text-[11px] font-medium">
                    {d.label}
                  </Pill>
                ))}
              </div>
            </Panel>
          );
        })}
      </div>

      {/* Automated Loudspeaker Broadcast Log */}
      <Panel
        title={t("safetyAi.broadcastLogTitle")}
        subtitle={t("safetyAi.broadcastLogSubtitle")}
        action={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <Radio className="size-3.5 text-emerald-500" /> {t("safetyAi.dispatchedSpeed")}
          </div>
        }
        bodyClassName="space-y-3"
      >
        {BROADCAST_LOG.map((b) => (
          <div
            key={b.ts}
            className="rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-4 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2.5">
                <Mono className="text-primary font-bold">[{b.ts}]</Mono>
                <Pill tone={b.severity} className="text-xs">
                  <Megaphone className="size-3 mr-1" /> {b.speaker}
                </Pill>
                <span className="text-xs font-semibold text-muted-foreground">{b.lang}</span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {t("safetyAi.triggerStream")}
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-foreground leading-relaxed">
              &ldquo;{b.text}&rdquo;
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
              {handled[b.ts] ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  <span>{handled[b.ts]}</span>
                </div>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-xl text-xs font-semibold"
                    onClick={() => {
                      setHandled((h) => ({ ...h, [b.ts]: t("safetyAi.ackSuccess") }));
                      toast.success(t("safetyAi.toastAck"));
                    }}
                  >
                    {t("safetyAi.btnAcknowledge")}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 rounded-xl text-xs font-semibold gap-1.5 bg-primary text-primary-foreground"
                    onClick={() => {
                      setHandled((h) => ({ ...h, [b.ts]: t("safetyAi.marshalSuccess") }));
                      toast.warning(t("safetyAi.toastMarshal"));
                    }}
                  >
                    <UserCheck className="size-3.5" /> {t("safetyAi.btnDispatchMarshal")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 gap-1.5"
                    onClick={() => {
                      setHandled((h) => ({ ...h, [b.ts]: t("safetyAi.fineSuccess") }));
                      toast.error(t("safetyAi.toastFine"));
                    }}
                  >
                    <ShieldX className="size-3.5" /> {t("safetyAi.btnLogFine")}
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
