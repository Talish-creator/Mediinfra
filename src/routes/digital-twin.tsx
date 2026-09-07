import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  Layers,
  RefreshCw,
  ShieldAlert,
  Users,
  Wind,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Floorplan, zoneTone } from "@/components/mediinfra/Floorplan";
import { Bar, Dot, LivePulse, Mono, PageHeader, Panel, Pill } from "@/components/mediinfra/ui-kit";
import { ZONES, type Zone } from "@/lib/mediinfra-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/digital-twin")({
  head: () => ({
    meta: [
      { title: "Building Digital Twin & Macro-Zones — MediInfra" },
      {
        name: "description",
        content:
          "Interactive hospital floorplan twin with live zone occupancy, permits and geo-fence intrusion control.",
      },
      { property: "og:title", content: "Building Digital Twin & Macro-Zones — MediInfra" },
      {
        property: "og:description",
        content: "Live hospital zone occupancy and virtual geo-fencing.",
      },
    ],
  }),
  component: DigitalTwin,
});

const BUILDINGS = [
  {
    id: "IPT",
    label: "IPT Inpatient Tower",
    levels: ["L2", "L3", "L4", "L5", "L6"],
    area: "42,000 m²",
  },
  { id: "OPT", label: "OPT Outpatient Tower", levels: ["L1", "L2", "L3"], area: "28,500 m²" },
  { id: "ENG", label: "Engineering & Plant", levels: ["GF", "B1"], area: "14,200 m²" },
  { id: "SV", label: "Services Yard & Staging", levels: ["GF"], area: "19,000 m²" },
] as const;

export function DigitalTwin() {
  const [building, setBuilding] = useState<"IPT" | "OPT" | "ENG" | "SV">("IPT");
  const [selected, setSelected] = useState<Zone | null>(null);
  const [intruded, setIntruded] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showWorkers, setShowWorkers] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [showGeofence, setShowGeofence] = useState(true);

  const zones = ZONES.filter((z) => z.building === building);

  const simulateIntrusion = () => {
    setIntruded(true);
    setBuilding("IPT");
    toast.error("UNAUTHORIZED WORKER IN NON-PERMIT ZONE", {
      description:
        "IPT Level 4 Air Handling Unit Room — geo-fence breach, HSE field marshal dispatched.",
      duration: 9000,
    });
    setTimeout(() => setIntruded(false), 12000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="3D/2D Building Digital Twin & Macro-Zones"
        description="BIM LOD-400 structural model paired with RFID portal gates and BLE spatial anchors. Tracks live contractor headcount, active work permits, and automated virtual geo-fences."
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/40 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm">
              <LivePulse tone="ok" size="sm" />
              <span>Spatial Mesh Active</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-10 rounded-xl font-semibold text-xs border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/60 dark:hover:bg-red-950/40"
              onClick={simulateIntrusion}
            >
              <AlertTriangle className="size-4" /> Simulate Zone Breach
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-10 rounded-xl font-semibold text-xs"
              onClick={() => toast.success("BIM LOD-400 digital twin geometry refreshed")}
            >
              <RefreshCw className="size-3.5" /> Sync BIM
            </Button>
          </div>
        }
      />

      {/* Building Switcher Pills */}
      <div className="flex flex-wrap gap-3">
        {BUILDINGS.map((b) => {
          const active = building === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setBuilding(b.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-150 shadow-sm hover:scale-[1.02] active:scale-[0.98]",
                active
                  ? "border-[#2563EB] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)]"
                  : "border-[#0F172A]/[0.08] dark:border-white/10 bg-white dark:bg-slate-900 text-[#64748B] dark:text-slate-400 hover:border-primary/50 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC]",
              )}
            >
              <Building2 className="size-4" />
              <span>{b.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-mono",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-400",
                )}
              >
                {b.levels.join(" · ")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Floorplan & Zone Register Layout */}
      <div className="grid gap-6 xl:grid-cols-3 items-stretch">
        <Panel
          className="xl:col-span-2 flex flex-col h-full"
          title={`${building} Spatial Micro-Grid`}
          subtitle="Hover any zone for contractor permits, air quality, and foreman contacts. Click to lock inspection."
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowWorkers(!showWorkers)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors border",
                  showWorkers
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-slate-100 dark:bg-slate-800 border-border text-muted-foreground",
                )}
              >
                Workers
              </button>
              <button
                type="button"
                onClick={() => setShowTrails(!showTrails)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors border",
                  showTrails
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-slate-100 dark:bg-slate-800 border-border text-muted-foreground",
                )}
              >
                Trails
              </button>
              <button
                type="button"
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors border",
                  showHeatmap
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                    : "bg-slate-100 dark:bg-slate-800 border-border text-muted-foreground",
                )}
              >
                Heatmap
              </button>
              <button
                type="button"
                onClick={() => setShowGeofence(!showGeofence)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors border",
                  showGeofence
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-100 dark:bg-slate-800 border-border text-muted-foreground",
                )}
              >
                Geofence
              </button>
            </div>
          }
        >
          <Floorplan
            building={building}
            intruded={intruded}
            onSelect={setSelected}
            selectedId={selected?.id}
            height={520}
            showHeatmap={showHeatmap}
            showWorkers={showWorkers}
            showTrails={showTrails}
            showGeofence={showGeofence}
          />
        </Panel>

        {/* Macro-Zone Register */}
        <Panel
          className="flex flex-col h-full"
          title="Macro-Zone Occupancy Register"
          subtitle="Real-time RFID headcount vs permissible capacity"
          bodyClassName="space-y-3 flex-1 flex flex-col justify-start"
        >
          {zones.map((z) => {
            const isSelected = selected?.id === z.id;
            const pct = Math.round((z.count / z.capacity) * 100);
            return (
              <button
                key={z.id}
                onClick={() => setSelected(z)}
                className={cn(
                  "w-full rounded-[18px] border p-4 text-left transition-all hover:border-primary/60 shadow-[0_12px_40px_rgba(2,6,23,0.05)]",
                  isSelected
                    ? "border-primary bg-blue-50/50 dark:bg-blue-950/20"
                    : "border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white">{z.id}</span>
                  <Pill tone={zoneTone(z)} className="text-[11px] py-0 px-2 font-mono font-bold">
                    {z.count}/{z.capacity} ({pct}%)
                  </Pill>
                </div>
                <p className="mt-1 text-xs font-medium text-[#64748B] dark:text-slate-400">
                  {z.label}
                </p>
                <div className="mt-2.5">
                  <Bar value={z.count} max={z.capacity} tone={zoneTone(z)} />
                </div>
              </button>
            );
          })}
        </Panel>
      </div>

      {/* Selected Zone Deep Dive */}
      {selected && (
        <Panel
          title={`Zone Detail — ${selected.id}`}
          subtitle={selected.label}
          action={
            <Pill tone={selected.restricted ? "crit" : "ok"} className="text-xs">
              {selected.restricted ? "Restricted / Non-Permit Zone" : "Permitted Works Active"}
            </Pill>
          }
        >
          <div className="grid gap-4 md:grid-cols-4 pt-1">
            <div className="rounded-xl border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-[#F8FAFC] dark:bg-slate-900/30 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                Active Permit
              </p>
              <Mono className="mt-1.5 block text-sm font-bold text-primary">{selected.permit}</Mono>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1">
                Gated under WO-0142
              </p>
            </div>

            <div className="rounded-xl border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-[#F8FAFC] dark:bg-slate-900/30 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                Responsible Foreman
              </p>
              <p className="mt-1 text-xs font-bold text-[#0F172A] dark:text-white">
                {selected.foreman}
              </p>
              <Mono className="text-[#64748B] dark:text-slate-400 text-xs mt-0.5">
                {selected.foremanPhone}
              </Mono>
            </div>

            <div className="rounded-xl border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-[#F8FAFC] dark:bg-slate-900/30 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                Authorized Contractors
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {selected.subs.length ? (
                  selected.subs.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-card border border-border px-2 py-0.5 text-[10px] font-semibold text-foreground"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">None permitted</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                IAQ & Dust Sensor
              </p>
              <p className="mt-1 text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Wind className="size-4 text-emerald-500" />
                <span>{selected.dust}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Complies with ICRA Class IV</p>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
