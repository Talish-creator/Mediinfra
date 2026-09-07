import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Radio,
  ScanLine,
  ShieldAlert,
  Users,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Floorplan } from "@/components/mediinfra/Floorplan";
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
import { GATES, MANPOWER_CURVE, SUBCONTRACTORS } from "@/lib/mediinfra-data";
import { useMediInfra } from "@/lib/mediinfra-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Command Center — MediInfra P875" },
      {
        name: "description",
        content:
          "Live headcount, turnstile throughput, work order execution and HSE score for Hamad General Hospital project P875.",
      },
      { property: "og:title", content: "Executive Command Center — MediInfra P875" },
      {
        property: "og:description",
        content: "Real-time hospital construction workforce and safety command dashboard.",
      },
    ],
  }),
  component: CommandCenter,
});

const BUILDINGS = [
  { id: "IPT", label: "IPT Inpatient Tower (L2–L6)", count: 485, capacity: 560 },
  { id: "OPT", label: "OPT Outpatient Tower (L1–L3)", count: 242, capacity: 320 },
  { id: "ENG", label: "Engineering & Services Plant", count: 137, capacity: 180 },
] as const;

export function CommandCenter() {
  const { events, headcount, throughputPerMin, gateQueues } = useMediInfra();
  const [building, setBuilding] = useState<"IPT" | "OPT" | "ENG">("IPT");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Safety & Workforce Command"
        description="P875 Hamad General Hospital expansion & retrofit. Real-time telemetry synchronized across optical turnstile readers, RFID digital twin zones, and Edge AI vision gateways."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/digital-twin"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Boxes className="size-3.5 text-primary" /> 3D Digital Twin
            </Link>
            <Link
              to="/gates"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ScanLine className="size-3.5" /> Gate Telemetry
            </Link>
          </div>
        }
      />

      {/* 4 Commercial Enterprise KPI Cards (42px) */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total On-Site Headcount"
          value={headcount.toLocaleString()}
          trend="+4.2%"
          trendLabel="vs 829 yesterday"
          status="86.4% Scheduled"
          tone="cyan"
          spark={[620, 690, 742, 802, 861, 890, 872, headcount]}
          footer={
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
              <span>Shift Target: 1,000 workers</span>
              <span className="font-semibold text-foreground">136 badges available</span>
            </div>
          }
        />
        <KpiCard
          label="Gate Turnstile Throughput"
          value={`${throughputPerMin}/min`}
          trend="+12%"
          trendLabel="avg 2.6s per pass"
          status="Optimal Flow"
          tone="ok"
          spark={[8, 14, 30, 52, 41, 33, 29, throughputPerMin]}
          footer={
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
              <span>Peak: 52/min at 06:15 AST</span>
              <span className="font-semibold text-foreground">All 4 Gates Operational</span>
            </div>
          }
        />
        <KpiCard
          label="Work Order Execution"
          value="18 Active"
          trend="+2"
          trendLabel="permits approved today"
          status="100% Turnstile Synced"
          tone="exec"
          spark={[11, 12, 14, 15, 16, 17, 18, 18]}
          footer={
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
              <span>2 in Consultant Review</span>
              <span className="font-semibold text-foreground">0 Expired</span>
            </div>
          }
        />
        <KpiCard
          label="HSE Safety Score"
          value="98.4%"
          trend="-0.2%"
          trendLabel="3 AI alerts resolved"
          status="Safe Operation"
          tone="warn"
          spark={[97.1, 97.6, 98.2, 98.9, 98.4, 98.5, 98.3, 98.4]}
          footer={
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
              <span>Lost Time Incidents: 0</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                100% Induction Rate
              </span>
            </div>
          }
        />
      </div>

      {/* Digital Twin Overview & Real-Time Gates Hub */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Digital Twin Floorplan Panel */}
        <Panel
          className="xl:col-span-2"
          title="Digital Twin — Live Worker Concentration Heatmap"
          subtitle="Real-time macro-zone occupancy computed from RFID portal reads and BLE mesh"
          action={
            <div className="flex items-center gap-2">
              <Pill tone="cyan" className="text-xs">
                <Dot tone="cyan" /> Telemetry Streaming
              </Pill>
            </div>
          }
        >
          <Tabs value={building} onValueChange={(v) => setBuilding(v as typeof building)}>
            <TabsList className="mb-4 flex-wrap rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
              {BUILDINGS.map((b) => (
                <TabsTrigger
                  key={b.id}
                  value={b.id}
                  className="rounded-lg text-xs font-semibold px-3 py-1.5"
                >
                  <span>{b.label}</span>
                  <span className="ml-2 rounded-full bg-white/70 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold text-muted-foreground">
                    {b.count}/{b.capacity}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {BUILDINGS.map((b) => (
              <TabsContent key={b.id} value={b.id} className="mt-0">
                <Floorplan building={b.id} height={520} />
              </TabsContent>
            ))}
          </Tabs>
        </Panel>

        {/* Real-Time Gate Status Hub */}
        <Panel
          title="Perimeter Access Gate Status"
          subtitle="4 optical turnstile portals · Zebra FXR90 Gen2 readers"
          action={
            <Link
              to="/gates"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="size-3" />
            </Link>
          }
          bodyClassName="space-y-3.5"
        >
          {GATES.map((gate) => {
            const recent = events.filter((e) => e.gateId === gate.id).slice(0, 3);
            const queueCount = gateQueues[gate.id] ?? 0;

            return (
              <div
                key={gate.id}
                className="rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-4 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {gate.id.replace("GATE-", "Gate ")} — {gate.name}
                    </p>
                    <Mono className="text-[11px] text-muted-foreground">
                      {gate.reader} · {gate.ip} · {gate.uptime}% uptime
                    </Mono>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {queueCount > 0 && (
                      <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                        {queueCount} in queue
                      </span>
                    )}
                    <span className="size-2 rounded-full bg-emerald-500 mi-pulse" />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {gate.lanes.map((lane) => (
                    <div
                      key={lane.id}
                      className="flex items-center justify-between rounded-xl border border-border/80 bg-card px-2.5 py-2 text-xs"
                    >
                      <span className="font-semibold text-[11px] text-foreground">
                        {lane.id} ({lane.dir})
                      </span>
                      <Pill
                        tone={lane.status === "Online" ? "ok" : "warn"}
                        className="text-[10px] py-0 px-1.5"
                      >
                        <Dot tone={lane.status === "Online" ? "ok" : "warn"} />
                        {lane.throughput}/min
                      </Pill>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Latest Taps:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {recent.length ? (
                      recent.map((e) => (
                        <span key={e.id} title={`${e.worker.name} (${e.worker.employer})`}>
                          <Avatar name={e.worker.name} size={22} />
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">listening…</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* Upgraded Manpower Curve with Recharts Gradient */}
      <Panel
        title="24-Hour Manpower Distribution Curve"
        subtitle="Scheduled contractual headcount vs actual RFID turnstile ingress over 24 hours (AST)"
        action={
          <div className="flex items-center gap-2">
            <Pill tone="ok" className="text-xs">
              <CheckCircle2 className="size-3 mr-1" /> 98.2% Correlation
            </Pill>
          </div>
        }
      >
        <div className="h-72 w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height={280} minHeight={280}>
            <AreaChart data={MANPOWER_CURVE} margin={{ top: 12, right: 12, bottom: 0, left: -14 }}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F6FEB" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1F6FEB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradScheduled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                interval={2}
              />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  fontSize: 12,
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="scheduled"
                name="Scheduled Manpower"
                stroke="#4F46E5"
                strokeWidth={2}
                fill="url(#gradScheduled)"
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Turnstile Attendance"
                stroke="#1F6FEB"
                strokeWidth={2.6}
                fill="url(#gradActual)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Subcontractor Breakdown Table */}
      <Panel
        title="Subcontractor Headcount & Permit Utilization"
        subtitle="On-site workers vs approved permit quotas for Tier-1 trade contractors"
        action={
          <Link
            to="/analytics"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Detailed Manpower Audit <ArrowUpRight className="size-3" />
          </Link>
        }
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-slate-50 dark:bg-slate-900 text-left uppercase text-[11px] font-semibold tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Contractor</th>
                <th className="px-5 py-3">Trade Package</th>
                <th className="px-5 py-3">Present / Planned</th>
                <th className="px-5 py-3">Capacity Utilization</th>
                <th className="px-5 py-3">Permits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {SUBCONTRACTORS.slice(0, 5).map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5 font-bold text-foreground">{s.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{s.trade}</td>
                  <td className="px-5 py-3.5 tabular-nums font-semibold">
                    {s.present} / {s.planned}
                  </td>
                  <td className="w-64 px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Bar
                        value={s.present}
                        max={s.planned}
                        tone={s.present / s.planned > 0.9 ? "ok" : "warn"}
                      />
                      <Mono className="font-bold text-xs">
                        {Math.round((s.present / s.planned) * 100)}%
                      </Mono>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Pill tone="cyan" className="text-xs">
                      {s.permits} Active
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
