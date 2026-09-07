import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Send, Siren, ShieldCheck, AlertTriangle, CheckCircle2, UserX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  Bar,
  Dot,
  KpiCard,
  Mono,
  PageHeader,
  Panel,
  Pill,
} from "@/components/mediinfra/ui-kit";
import { MISSING_PERSONNEL, MUSTER_POINTS } from "@/lib/mediinfra-data";
import { useMediInfra } from "@/lib/mediinfra-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/muster")({
  head: () => ({
    meta: [
      { title: "Life Safety & Emergency Muster — MediInfra" },
      {
        name: "description",
        content:
          "Emergency evacuation command with live muster counts and a missing-personnel manifest for Civil Defence.",
      },
      { property: "og:title", content: "Life Safety & Emergency Muster — MediInfra" },
      {
        property: "og:description",
        content: "Live evacuation accounting and missing personnel triage.",
      },
    ],
  }),
  component: MusterPage,
});

export function MusterPage() {
  const { emergency, startEmergency, standDown, accounted } = useMediInfra();
  const total = 864;
  const missing = Math.max(0, total - accounted);
  const [search, setSearch] = useState("");

  const filteredMissing = MISSING_PERSONNEL.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.employer.toLowerCase().includes(search.toLowerCase()) ||
      w.lastSeen.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Life Safety & Emergency Evacuation Muster"
        description="High-frequency RFID muster stations at Points A, B and C reconcile evacuated personnel against the morning ingress register. Real-time manifests transmit directly to Qatar Civil Defence and the HMC Disaster Center."
        actions={
          <div className="flex items-center gap-2.5">
            <Pill tone={emergency ? "crit" : "ok"} className="h-9 px-3 text-xs">
              <Dot tone={emergency ? "crit" : "ok"} pulse={emergency} />
              {emergency ? "EVACUATION ALARM ACTIVE" : "Civil Defence Link Armed"}
            </Pill>
          </div>
        }
      />

      {/* Emergency Status Banner */}
      <div
        className={cn(
          "rounded-2xl border p-6 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 shadow-sm",
          emergency
            ? "border-red-500 bg-red-500/10 mi-siren"
            : "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl shadow-sm",
              emergency ? "bg-red-600 text-white animate-bounce" : "bg-emerald-600 text-white",
            )}
          >
            {emergency ? <Siren className="size-7" /> : <ShieldCheck className="size-7" />}
          </div>
          <div>
            <p
              className={cn(
                "text-lg font-bold uppercase tracking-wider",
                emergency
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-700 dark:text-emerald-300",
              )}
            >
              {emergency
                ? "SITE-WIDE EMERGENCY EVACUATION IN PROGRESS"
                : "NORMAL SITE OPERATION — ALL ACCESS GATES MONITORED"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              {emergency
                ? "Fail-safe optical turnstiles opened · Acoustic sirens broadcasting · Exterior muster points streaming"
                : "Continuous RFID perimeter accounting · Qatar Civil Defence integration verified online"}
            </p>
          </div>
        </div>

        <div>
          {emergency ? (
            <Button
              variant="outline"
              onClick={standDown}
              className="h-10 rounded-xl font-bold text-xs border-slate-300 dark:border-slate-700 hover:bg-card"
            >
              Stand Down Alarm & Restore Gates
            </Button>
          ) : (
            <Button
              className="h-10 rounded-xl gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30"
              onClick={startEmergency}
            >
              <Siren className="size-4" /> INITIATE EMERGENCY EVACUATION ALARM
            </Button>
          )}
        </div>
      </div>

      {/* 3 Large KPI Cards (42px) */}
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        <KpiCard
          label="Site Population at Alarm"
          value={total.toLocaleString()}
          sub="Workers verified inside the perimeter"
          status="Ingress Locked"
          tone="cyan"
          spark={[780, 810, 835, 850, 860, 864]}
        />
        <KpiCard
          label="Safely Accounted For"
          value={emergency ? accounted.toLocaleString() : 0}
          sub="Scanned at muster readers A / B / C"
          status={emergency ? `${Math.round((accounted / total) * 100)}% Safe` : "Standing By"}
          tone="ok"
          spark={emergency ? [0, 180, 390, 580, 720, accounted] : [0, 0, 0, 0, 0]}
        />
        <KpiCard
          label="Missing / Unaccounted Personnel"
          value={emergency ? missing.toLocaleString() : total.toLocaleString()}
          sub={emergency ? "Active search teams dispatched" : "Awaiting alarm trigger"}
          status={emergency ? `${missing} Remaining` : "Pre-Alarm Baseline"}
          tone="crit"
          spark={emergency ? [864, 684, 474, 284, 144, missing] : [864, 864, 864, 864]}
        />
      </div>

      {/* Muster Points Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {MUSTER_POINTS.map((m) => {
          const share = emergency ? Math.round((accounted * m.accounted) / 831) : 0;
          return (
            <Panel
              key={m.id}
              className="flex flex-col h-full"
              title={`Muster Station ${m.id}`}
              subtitle={m.name}
              action={
                <Pill tone={emergency ? "ok" : "muted"} className="text-xs">
                  <Dot tone={emergency ? "ok" : "muted"} pulse={emergency} />
                  MSTR-{m.id}-01
                </Pill>
              }
              bodyClassName="flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold tabular-nums text-foreground">{share}</p>
                  <span className="text-xs text-muted-foreground font-semibold">
                    / {m.accounted} expected
                  </span>
                </div>
                <div className="mt-3">
                  <Bar value={share} max={m.accounted} tone="ok" />
                </div>
              </div>
              <p className="mt-4 text-[12px] text-muted-foreground flex items-center gap-1.5 font-medium pt-3 border-t border-border/40">
                <CheckCircle2 className="size-3.5 text-emerald-500" /> Antenna beam active · 99.8%
                capture rate
              </p>
            </Panel>
          );
        })}
      </div>

      {/* Missing Personnel Triage Register */}
      <Panel
        title="Missing Personnel Triage Register"
        subtitle="Last known work zone derived from final portal RFID read — synchronized for Civil Defence rescue squads"
        action={
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search missing worker, trade, or zone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-72 rounded-xl border border-input bg-background px-3.5 text-xs outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              size="sm"
              className="gap-2 h-10 rounded-xl font-semibold text-xs"
              onClick={() =>
                toast.success("Emergency Evacuation Manifest Transmitted", {
                  description: `${missing || MISSING_PERSONNEL.length} personnel profiles dispatched to Qatar Civil Defence & HMC Disaster Operations.`,
                })
              }
            >
              <Send className="size-3.5" /> Transmit to Civil Defence
            </Button>
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="max-h-[460px] overflow-auto">
          <table className="w-full text-sm" role="grid">
            <thead className="sticky top-0 z-10 border-b border-border/80 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm text-left uppercase text-[12px] font-semibold tracking-wider text-muted-foreground">
              <tr role="row">
                <th className="px-6 py-4">Worker Profile</th>
                <th className="px-6 py-4">Subcontractor Employer</th>
                <th className="px-6 py-4">Assigned Trade</th>
                <th className="px-6 py-4">Last RFID Portal Read</th>
                <th className="px-6 py-4">Triage Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredMissing.map((w) => (
                <tr
                  key={w.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={w.name} size={32} />
                      <div>
                        <p className="font-bold text-foreground text-sm">{w.name}</p>
                        <Mono className="text-[11px] text-muted-foreground">QID: {w.qid}</Mono>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{w.employer}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-foreground">
                      {w.trade}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Mono className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                      {w.lastSeen}
                    </Mono>
                  </td>
                  <td className="px-5 py-3">
                    <Pill tone="crit" className="text-xs font-semibold">
                      <UserX className="size-3 mr-1" /> Unaccounted
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
