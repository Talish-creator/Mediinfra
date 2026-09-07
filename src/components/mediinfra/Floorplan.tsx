import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  Flame,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  Wind,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ZONES, type Zone } from "@/lib/mediinfra-data";
import { AnimatedNumber } from "./AnimatedNumber";
import { Mono, Pill } from "./ui-kit";

export function zoneTone(z: Zone) {
  const pct = z.count / z.capacity;
  if (z.restricted) return "crit" as const;
  if (pct >= 0.85) return "warn" as const;
  return "ok" as const;
}

function toneColor(t: "ok" | "warn" | "crit") {
  return t === "ok" ? "#16A34A" : t === "warn" ? "#F59E0B" : "#DC2626";
}

export type WorkerTrade = "mep" | "steel" | "hvac" | "fire";

const TRADE_COLORS: Record<WorkerTrade, { color: string; label: string }> = {
  mep: { color: "#38BDF8", label: "MEP Electrical" },
  steel: { color: "#FB923C", label: "Structural Steel" },
  hvac: { color: "#34D399", label: "HVAC & Ductwork" },
  fire: { color: "#F87171", label: "Fire & Safety" },
};

interface SimWorker {
  id: number;
  trade: WorkerTrade;
  x: number;
  y: number;
  trail: { x: number; y: number }[];
  vx: number;
  vy: number;
}

// Generate realistic initial workers for each zone
function generateZoneWorkers(zone: Zone, seed: number): SimWorker[] {
  const trades: WorkerTrade[] = ["mep", "steel", "hvac", "fire"];
  const count = Math.min(zone.count, 14);
  const workers: SimWorker[] = [];

  for (let i = 0; i < count; i++) {
    const p1 = (seed * 9301 + i * 49297) % 233280;
    const p2 = (p1 * 9301 + 49297) % 233280;
    const x = 14 + (p1 / 233280) * 72;
    const y = 20 + (p2 / 233280) * 60;
    const trade = (trades[(i + seed) % trades.length] ?? "mep") as WorkerTrade;

    workers.push({
      id: seed * 100 + i,
      trade,
      x,
      y,
      trail: [
        { x: x - 1.5, y: y - 1.0 },
        { x: x - 3.0, y: y - 2.0 },
      ],
      vx: (i % 2 === 0 ? 1 : -1) * (0.4 + (i % 3) * 0.2),
      vy: (i % 3 === 0 ? 1 : -1) * (0.3 + (i % 2) * 0.2),
    });
  }
  return workers;
}

export function Floorplan({
  building,
  intruded,
  onSelect,
  selectedId,
  height = 480,
  showHeatmap = true,
  showWorkers = true,
  showTrails = true,
  showGeofence = true,
}: {
  building: "IPT" | "OPT" | "ENG" | "SV";
  intruded?: boolean | undefined;
  onSelect?: ((z: Zone) => void) | undefined;
  selectedId?: string | undefined;
  height?: number | undefined;
  showHeatmap?: boolean;
  showWorkers?: boolean;
  showTrails?: boolean;
  showGeofence?: boolean;
}) {
  const { t } = useTranslation();
  const [hover, setHover] = useState<Zone | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const zones = useMemo(() => ZONES.filter((z) => z.building === building), [building]);

  // Persistent moving worker state across zones
  const [workersByZone, setWorkersByZone] = useState<Record<string, SimWorker[]>>(() => {
    const initial: Record<string, SimWorker[]> = {};
    zones.forEach((z, idx) => {
      initial[z.id] = generateZoneWorkers(z, idx + 1);
    });
    return initial;
  });

  // Smooth operational worker movement loop (60 FPS feel via periodic step)
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkersByZone((prev) => {
        const next: Record<string, SimWorker[]> = {};
        zones.forEach((z, zIdx) => {
          const currentList = prev[z.id] || generateZoneWorkers(z, zIdx + 1);
          next[z.id] = currentList.map((w) => {
            let nextX = w.x + w.vx;
            let nextY = w.y + w.vy;
            let nextVx = w.vx;
            let nextVy = w.vy;

            // Boundary bounce within zone bounds
            if (nextX < 12 || nextX > 88) {
              nextVx = -nextVx;
              nextX = Math.max(12, Math.min(88, nextX));
            }
            if (nextY < 20 || nextY > 80) {
              nextVy = -nextVy;
              nextY = Math.max(20, Math.min(80, nextY));
            }

            // Update trail history
            const nextTrail = [{ x: w.x, y: w.y }, w.trail[0] ?? { x: w.x, y: w.y }];

            return {
              ...w,
              x: nextX,
              y: nextY,
              vx: nextVx,
              vy: nextVy,
              trail: nextTrail,
            };
          });
        });
        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [zones]);

  // Pan controls
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with left mouse button when not clicking a button
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(2.4, parseFloat((s + 0.25).toFixed(2))));
  const zoomOut = () => setScale((s) => Math.max(0.75, parseFloat((s - 0.25).toFixed(2))));
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative select-none">
      {/* Interactive Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "grid-bg relative w-full overflow-hidden rounded-2xl border border-border bg-slate-950 shadow-inner",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ height }}
      >
        {/* Floating Zoom & Pan HUD */}
        <div className="absolute top-3 end-3 z-30 flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 p-1 backdrop-blur-md shadow-lg">
          <button
            type="button"
            title={t("floorplan.zoomIn")}
            onClick={zoomIn}
            className="flex size-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Plus className="size-3.5" />
          </button>
          <span className="px-1 text-[11px] font-mono font-bold text-slate-300 min-w-[42px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            title={t("floorplan.zoomOut")}
            onClick={zoomOut}
            className="flex size-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Minus className="size-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-700 mx-0.5" />
          <button
            type="button"
            title={t("floorplan.resetView")}
            onClick={resetView}
            className="flex size-7 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>

        {/* Spatial Transform Container */}
        <div
          className="absolute inset-0 transition-transform duration-75 ease-out origin-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          {/* Subtle architectural coordinate lines & axes */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute start-6 top-0 bottom-0 w-px bg-slate-700/60 border-e border-dashed border-slate-600" />
            <div className="absolute end-6 top-0 bottom-0 w-px bg-slate-700/60 border-e border-dashed border-slate-600" />
            <div className="absolute top-6 inset-x-0 h-px bg-slate-700/60 border-b border-dashed border-slate-600" />
            <div className="absolute bottom-6 inset-x-0 h-px bg-slate-700/60 border-b border-dashed border-slate-600" />
            <span className="absolute top-2 start-2 text-[10px] font-mono text-slate-500">
              {t("floorplan.gridElevation", { building })}
            </span>
            <span className="absolute bottom-2 end-2 text-[10px] font-mono text-slate-500">
              {t("floorplan.bimAnchors")}
            </span>
          </div>

          {/* Radar Scanning Line Sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#2563EB]/25 to-transparent mi-scanline" />
          </div>

          {/* Zones */}
          {zones.map((z, zoneIdx) => {
            const tone = zoneTone(z);
            const color = toneColor(tone);
            const flashing = intruded && z.restricted;
            const isSelected = selectedId === z.id;
            const pct = Math.round((z.count / z.capacity) * 100);
            const workers = workersByZone[z.id] || [];

            // Capacity SVG ring calculations
            const radius = 14;
            const circ = 2 * Math.PI * radius;
            const strokeDashoffset = circ - (pct / 100) * circ;

            return (
              <div
                key={z.id}
                onMouseEnter={() => setHover(z)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect?.(z)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(z);
                  }
                }}
                className={cn(
                  "group absolute rounded-2xl border text-left transition-all duration-300 hover:z-30 hover:scale-[1.015] hover:shadow-xl focus:outline-none overflow-hidden cursor-pointer",
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-slate-950 z-20 shadow-2xl"
                    : "border-slate-800/80 hover:border-slate-600",
                  flashing && "mi-siren ring-2 ring-red-500 animate-pulse",
                )}
                style={{
                  left: `${z.x}%`,
                  top: `${z.y}%`,
                  width: `${z.w}%`,
                  height: `${z.h}%`,
                  borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
                  background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, ${color} ${
                    z.restricted ? "25%" : "14%"
                  }, transparent), rgba(15, 23, 42, 0.94))`,
                  boxShadow: isSelected ? `0 0 28px -4px ${color}90` : undefined,
                }}
              >
                {/* Animated Density Heatmap Layer */}
                {showHeatmap && pct > 65 && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 mi-breathe transition-opacity duration-1000"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${color}60 0%, transparent 70%)`,
                    }}
                  />
                )}

                {/* Animated Geofence Perimeter Glow & Dashed Boundary */}
                {showGeofence && (
                  <svg className="absolute inset-0 size-full pointer-events-none">
                    <rect
                      x="1"
                      y="1"
                      width="98%"
                      height="98%"
                      rx="16"
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeDasharray={z.restricted || flashing ? "6 4" : "4 4"}
                      className={cn(
                        "opacity-30 group-hover:opacity-100 transition-opacity",
                        (z.restricted || flashing) && "mi-pulse stroke-red-500 opacity-80",
                      )}
                    />
                  </svg>
                )}

                {/* Live Worker Trails & Moving Avatars */}
                {showWorkers && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Trails */}
                    {showTrails && (
                      <svg className="absolute inset-0 size-full">
                        {workers.map((w) => {
                          const c = TRADE_COLORS[w.trade].color;
                          return (
                            <g key={`trail-${w.id}`}>
                              <line
                                x1={`${w.trail[1]?.x ?? w.x}%`}
                                y1={`${w.trail[1]?.y ?? w.y}%`}
                                x2={`${w.trail[0]?.x ?? w.x}%`}
                                y2={`${w.trail[0]?.y ?? w.y}%`}
                                stroke={c}
                                strokeWidth="1.2"
                                strokeOpacity="0.2"
                                strokeLinecap="round"
                              />
                              <line
                                x1={`${w.trail[0]?.x ?? w.x}%`}
                                y1={`${w.trail[0]?.y ?? w.y}%`}
                                x2={`${w.x}%`}
                                y2={`${w.y}%`}
                                stroke={c}
                                strokeWidth="1.8"
                                strokeOpacity="0.45"
                                strokeLinecap="round"
                              />
                            </g>
                          );
                        })}
                      </svg>
                    )}

                    {/* Moving Worker Dots */}
                    {workers.map((w) => {
                      const c = TRADE_COLORS[w.trade].color;
                      return (
                        <div
                          key={w.id}
                          className="absolute size-2.5 -ml-1.5 -mt-1.5 rounded-full transition-all duration-1000 ease-in-out shadow-sm"
                          style={{
                            left: `${w.x}%`,
                            top: `${w.y}%`,
                            backgroundColor: c,
                            boxShadow: `0 0 8px ${c}`,
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Zone Header Label */}
                <div className="relative z-10 p-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-100 tracking-tight">
                        {z.id}
                      </span>
                      {z.restricted && (
                        <span className="flex size-2 rounded-full bg-red-500 animate-ping" />
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                      <AnimatedNumber value={z.count} /> / {z.capacity} {t("floorplan.workers")}
                    </span>
                  </div>

                  {/* Capacity Radial Ring Dial */}
                  <div className="relative flex items-center justify-center size-8">
                    <svg className="size-8 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        className="stroke-slate-800"
                        strokeWidth="3.2"
                        fill="none"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r={radius}
                        stroke={color}
                        strokeWidth="3.2"
                        strokeDasharray={circ}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <span className="absolute text-[9px] font-bold text-slate-200 tabular-nums">
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Bottom Trade Badges & Status */}
                <div className="absolute bottom-2 inset-x-3 z-10 flex items-center justify-between text-[10px]">
                  <span className="truncate max-w-[130px] text-slate-300 font-medium">
                    {z.subs[0] ?? t("floorplan.restrictedZone")}
                  </span>
                  <span
                    className="size-2 rounded-full mi-pulse"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rich Zone Hover Inspector Card */}
      {hover && (
        <div className="pointer-events-none absolute bottom-4 start-4 z-40 w-84 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-md transition-all animate-in fade-in-0 duration-150">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div>
              <p className="text-sm font-bold text-foreground tracking-tight">{hover.label}</p>
              <p className="text-xs text-muted-foreground">
                {t("floorplan.building")} {hover.building} · {t("floorplan.level")} {hover.level} · {hover.wing} {t("floorplan.wing")}
              </p>
            </div>
            <Pill tone={zoneTone(hover)}>
              {hover.restricted ? t("floorplan.restricted") : `${hover.count}/${hover.capacity}`}
            </Pill>
          </div>

          <div className="mt-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("floorplan.workPermit")}</span>
              <Mono className="font-semibold text-primary">{hover.permit}</Mono>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("floorplan.foreman")}</span>
              <span className="font-medium text-foreground">{hover.foreman}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl border border-border/60 bg-slate-50/50 dark:bg-slate-900/50 p-2 text-center">
                <span className="text-[10px] text-muted-foreground block">{t("floorplan.airQuality")}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 mt-0.5">
                  <Wind className="size-3" /> {hover.dust}
                </span>
              </div>
              <div className="rounded-xl border border-border/60 bg-slate-50/50 dark:bg-slate-900/50 p-2 text-center">
                <span className="text-[10px] text-muted-foreground block">{t("floorplan.soundLevel")}</span>
                <span className="font-semibold text-foreground inline-flex items-center gap-1 mt-0.5">
                  <Volume2 className="size-3 text-muted-foreground" /> 64 dBA
                </span>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground block mb-1">{t("floorplan.activeSubcontractors")}</span>
              <div className="flex flex-wrap gap-1">
                {hover.subs.length ? (
                  hover.subs.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-foreground"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">{t("floorplan.noContractors")}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
