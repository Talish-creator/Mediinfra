import { createFileRoute } from "@tanstack/react-router";
import {
  Antenna,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  HardDrive,
  Network,
  Radio,
  RefreshCw,
  Tags,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Bar, Dot, KpiCard, Mono, PageHeader, Panel, Pill } from "@/components/mediinfra/ui-kit";
import { HARDWARE } from "@/lib/mediinfra-data";

export const Route = createFileRoute("/hardware")({
  head: () => ({
    meta: [
      { title: "ELV Hardware & Sensor Telemetry — MediInfra" },
      {
        name: "description",
        content:
          "Health of FXR90 readers, AN440 antennas, portal kits, edge gateways and industrial UPS units on P875.",
      },
      { property: "og:title", content: "ELV Hardware & Sensor Telemetry — MediInfra" },
      {
        property: "og:description",
        content: "Live ELV hardware inventory and network topology health.",
      },
    ],
  }),
  component: HardwarePage,
});

export function HardwarePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ELV Hardware & Sensor Telemetry"
        description="Physical low-current bill of quantities deployed across P875 Hamad General Hospital. Monitored via SNMP v3, Zebra IoT Connector, and on-premise industrial gateways."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-9 rounded-xl font-semibold text-xs"
            onClick={() =>
              toast.success("SNMP diagnostic scan poll completed across all 4 gate gateways")
            }
          >
            <RefreshCw className="size-3.5" /> Scan All Nodes
          </Button>
        }
      />

      {/* 4 Large KPI Cards (42px) */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Fixed UHF Readers"
          value="4 / 4"
          trend="100%"
          trendLabel="uptime"
          status="Operational"
          tone="cyan"
          spark={[4, 4, 4, 4, 4, 4, 4]}
          footer={
            <p className="text-[11px] text-muted-foreground">Zebra FXR90 8-port · IP67 Rugged</p>
          }
        />
        <KpiCard
          label="AN440 Antennas Online"
          value={`${HARDWARE.antennas.online} / ${HARDWARE.antennas.total}`}
          trend="1.08:1"
          trendLabel="optimal VSWR"
          status="Calibrated"
          tone="ok"
          spark={[32, 32, 32, 32, 32, 32]}
          footer={
            <p className="text-[11px] text-muted-foreground">Dual-polarity circular coverage</p>
          }
        />
        <KpiCard
          label="Hard-Hat RFID Tags"
          value={HARDWARE.tags.issued.toLocaleString()}
          trend="+18"
          trendLabel="tags issued today"
          status="86.4% Active"
          tone="exec"
          spark={[810, 825, 840, 850, 864]}
          footer={
            <p className="text-[11px] text-muted-foreground">136 reserve tags in site warehouse</p>
          }
        />
        <KpiCard
          label="UPS Power Autonomy"
          value="180 min"
          trend="100%"
          trendLabel="mains AC normal"
          status="Protected"
          tone="warn"
          spark={[100, 100, 100, 100, 100]}
          footer={<p className="text-[11px] text-muted-foreground">4x Schneider APC Smart-UPS</p>}
        />
      </div>

      {/* Readers and Edge Gateways Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Fixed RFID Readers (Zebra FXR90)"
          subtitle="Real-time RF transmit power, antenna matching, and thermal core telemetry"
          bodyClassName="space-y-3.5"
        >
          {HARDWARE.readers.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-4 transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Radio className="size-4 text-primary" /> {r.id} · {r.gate}
                </p>
                <Pill tone={r.status === "Online" ? "ok" : "warn"} className="text-[10px]">
                  <Dot tone={r.status === "Online" ? "ok" : "warn"} /> {r.status}
                </Pill>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs pt-2 border-t border-border/50">
                <div>
                  <span className="text-muted-foreground text-[11px] block">IP Address</span>
                  <Mono className="font-semibold text-foreground text-xs">{r.ip}</Mono>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">RF Power</span>
                  <Mono className="font-semibold text-foreground text-xs">{r.rf} dBm</Mono>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">Core Temp</span>
                  <Mono className="font-semibold text-foreground text-xs">{r.temp}°C</Mono>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">Antenna VSWR</span>
                  <Mono className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {r.vswr.toFixed(2)}:1
                  </Mono>
                </div>
              </div>
            </div>
          ))}
        </Panel>

        <Panel
          title="Edge Gateways & Industrial UPS"
          subtitle="On-premise store-and-forward buffers with lithium battery autonomy"
          bodyClassName="space-y-3.5"
        >
          {HARDWARE.gateways.map((g, i) => {
            const ups = HARDWARE.ups[i]!;
            return (
              <div
                key={g.id}
                className="rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-4 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Cpu className="size-4 text-primary" /> {g.id} — {g.gate}
                  </p>
                  <Pill tone={g.queue === 0 ? "ok" : "warn"} className="text-[10px]">
                    <HardDrive className="size-3 mr-1" /> {g.queue} unsynced
                  </Pill>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>Uplink: {g.uplink}</span>
                  <span>·</span>
                  <span>Disk Storage: {g.disk}% used</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs pt-2 border-t border-border/50">
                  <BatteryCharging className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="w-24 text-muted-foreground text-[11px] truncate">{ups.id}</span>
                  <div className="flex-1">
                    <Bar value={ups.battery} max={100} tone={ups.battery > 90 ? "ok" : "warn"} />
                  </div>
                  <Mono className="font-bold text-foreground text-xs">
                    {ups.battery}% ({ups.runtime}m)
                  </Mono>
                </div>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* Bottom Hardware Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Antenna Array Specification" subtitle={HARDWARE.antennas.model}>
          <p className="flex items-center gap-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            <Antenna className="size-6" /> {HARDWARE.antennas.online} / {HARDWARE.antennas.total}
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Dual-polarity circular coverage. 8 antennas per perimeter gate enclosure with RF
            shielding curtains to eliminate cross-lane stray reads.
          </p>
        </Panel>

        <Panel title="Macro-Zone Portal Kits" subtitle={HARDWARE.portals.model}>
          <p className="text-3xl font-bold text-primary">
            {HARDWARE.portals.online} / {HARDWARE.portals.total} Active
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Installed at clean-dirty hoarding chokepoints on IPT L2–L6 and OPT L1–L3 to track
            infection-control compliance and zone quotas.
          </p>
        </Panel>

        <Panel title="RFID Hard-Hat Population" subtitle={HARDWARE.tags.model}>
          <p className="flex items-center gap-2 text-3xl font-bold text-foreground">
            <Tags className="size-6 text-primary" /> {HARDWARE.tags.issued} Issued
          </p>
          <div className="mt-2.5">
            <Bar value={HARDWARE.tags.issued} max={HARDWARE.tags.total} tone="cyan" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            136 uncommissioned tags stored securely for subcontractor mob/demob.
          </p>
        </Panel>
      </div>

      {/* Network Topology */}
      <Panel
        title="Physical Site Network Topology"
        subtitle="10 Gbps redundant Cat6A backbone with dual-SIM 5G industrial failover"
      >
        <div className="grid-bg rounded-2xl border border-border p-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <div className="rounded-2xl border border-primary/30 bg-blue-50 dark:bg-blue-950/40 p-4 text-center shadow-sm">
              <Network className="mx-auto size-6 text-primary" />
              <p className="mt-2 font-bold text-foreground">P875 Core Switch</p>
              <Mono className="text-muted-foreground text-[11px]">10.87.5.1 · 48-Port PoE+</Mono>
            </div>
            <div className="hidden md:block h-px w-12 bg-primary/40" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HARDWARE.gateways.map((g) => (
                <div key={g.id} className="rounded-xl border border-border bg-card p-3 shadow-sm">
                  <p className="font-bold text-foreground text-xs">{g.gate}</p>
                  <Mono className="text-[11px] text-muted-foreground">{g.uplink}</Mono>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3.5" /> Primary Uplink OK
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
