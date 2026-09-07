import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Clock,
  Gauge,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Thermometer,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ResponsiveContainer,
  BarChart,
  Bar as RBar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnimatedNumber,
  Avatar,
  Dot,
  KpiCard,
  Mono,
  PageHeader,
  Panel,
  Pill,
} from "@/components/mediinfra/ui-kit";
import { GATES, HARDWARE, SUBCONTRACTORS, type Gate } from "@/lib/mediinfra-data";
import { makeEvent, useMediInfra, type GateEvent } from "@/lib/mediinfra-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gates")({
  head: () => ({
    meta: [
      { title: "Live Gate & Turnstile Telemetry — MediInfra" },
      {
        name: "description",
        content:
          "Real-time RFID turnstile taps, access decisions and reader health across 4 perimeter gates.",
      },
      { property: "og:title", content: "Live Gate & Turnstile Telemetry — MediInfra" },
      {
        property: "og:description",
        content: "Real-time RFID turnstile taps and gate access control.",
      },
    ],
  }),
  component: GatesPage,
});

export function GatesPage() {
  const { events, addEvent, simulating, gateQueues, throughputPerMin } = useMediInfra();
  const [q, setQ] = useState("");
  const [gate, setGate] = useState("all");
  const [sub, setSub] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [override, setOverride] = useState({ qid: "", reason: "Tag Damaged", photo: "" });

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (q && !`${e.worker.name} ${e.worker.qid}`.toLowerCase().includes(q.toLowerCase()))
          return false;
        if (gate !== "all" && e.gateId !== gate) return false;
        if (sub !== "all" && e.worker.employerId !== sub) return false;
        if (status !== "all" && !e.status.startsWith(status)) return false;
        return true;
      }),
    [events, q, gate, sub, status],
  );

  // Virtualizer setup for 60 FPS scrolling
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  const latestEvents = useMemo(() => events.slice(0, 4), [events]);

  // Compute lane utilization metrics
  const laneChartData = useMemo(() => {
    return GATES.map((g) => {
      const qCount = gateQueues[g.id] ?? 0;
      return {
        gate: g.id.replace("GATE-", "G"),
        lane1: g.lanes[0]?.throughput ?? 14,
        lane2: g.lanes[1]?.throughput ?? 12,
        queue: qCount,
      };
    });
  }, [gateQueues]);

  const submitOverride = () => {
    if (!override.qid || !override.photo) {
      toast.error("Photo attachment and worker QID are mandatory");
      return;
    }
    const base = makeEvent(99);
    addEvent({
      ...base,
      status: "Authorized",
      manual: true,
      reason: override.reason,
      worker: { ...base.worker, qid: override.qid },
    });
    toast.success("Manual security supervisor override logged", {
      description: `QID ${override.qid} · reason: ${override.reason}`,
    });
    setOpen(false);
    setOverride({ qid: "", reason: "Tag Damaged", photo: "" });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Gate & Turnstile Telemetry"
        description="Every optical turnstile tap across Gates 01–04 is evaluated against work orders, induction validity, and zone quotas in under 300 ms with edge SQLite caching."
        actions={
          <div className="flex items-center gap-2.5">
            <Pill tone={simulating ? "ok" : "muted"} className="h-9 px-3 text-xs">
              <Dot tone={simulating ? "ok" : "muted"} pulse={simulating} />
              {simulating ? `Streaming: ${throughputPerMin} taps/min` : "Stream paused"}
            </Pill>
          </div>
        }
      />

      {/* Real-Time KPI Cards (42px) */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        <KpiCard
          label="Active Optical Turnstiles"
          value="4 / 4"
          trend="+100%"
          trendLabel="all portals operational"
          status="Online"
          tone="ok"
          spark={[4, 4, 4, 4, 4, 4, 4]}
        />
        <KpiCard
          label="Telemetry Stream Velocity"
          value={`${throughputPerMin} taps/m`}
          trend="+12%"
          trendLabel="morning ingress flow"
          status="Nominal"
          tone="cyan"
          spark={[28, 32, 38, 44, 42, 48, throughputPerMin]}
        />
        <KpiCard
          label="Average Reader Latency"
          value="42 ms"
          trend="-4 ms"
          trendLabel="edge SQLite cache hit"
          status="Optimal"
          tone="ok"
          spark={[54, 48, 46, 44, 43, 42, 42]}
        />
        <KpiCard
          label="Cumulative Turnstile Reads"
          value={events.length}
          trend="+8"
          trendLabel="buffered in session"
          status="Live"
          tone="exec"
          spark={[80, 95, 110, 125, 140, 160, events.length]}
        />
      </div>

      {/* Live Event Pulse Bar (Latest 4 Turnstile Reads Sliding in with AnimatePresence) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Live Ingress/Egress Stream Pulse
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            {filtered.length} reads buffered
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          <AnimatePresence mode="popLayout">
            {latestEvents.map((ev) => (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "rounded-2xl border p-4 shadow-sm transition-all duration-200 flex flex-col justify-between",
                  ev.status.startsWith("Auth")
                    ? "border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                    : "border-red-200/80 bg-red-50/40 dark:border-red-900/50 dark:bg-red-950/20",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={ev.worker.name} size={30} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{ev.worker.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {ev.worker.employer}
                      </p>
                    </div>
                  </div>
                  <Pill
                    tone={ev.direction === "IN" ? "ok" : "cyan"}
                    className="text-[10px] py-0 px-2 font-mono font-bold"
                  >
                    {ev.direction === "IN" ? "IN" : "OUT"}
                  </Pill>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] pt-2.5 border-t border-border/50">
                  <span className="font-mono text-muted-foreground">{ev.gateId}</span>
                  <span className="font-mono text-foreground font-semibold">{ev.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Queue Visualizer & Lane Utilization Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {/* Real-Time Queue Visualizers for 4 Gates */}
        <Panel
          className="lg:col-span-2 flex flex-col h-full"
          title="Turnstile Portal Queues & Hardware Diagnostics"
          subtitle="Real-time worker queue density and optical lane transit velocity"
          action={
            <div className="flex items-center gap-2">
              <Pill tone="cyan" className="text-xs">
                <Dot tone="cyan" /> RFID Polling: 100 Hz
              </Pill>
            </div>
          }
        >
          <div className="grid gap-3.5 sm:grid-cols-2">
            {GATES.map((g) => {
              const qCount = gateQueues[g.id] ?? 0;
              const isBusy = qCount > 2;

              return (
                <div
                  key={g.id}
                  className="rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-foreground">
                        {g.id} — {g.name}
                      </span>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {g.reader} · {g.ip}
                      </p>
                    </div>
                    <Pill tone={isBusy ? "warn" : "ok"} className="text-[10px] font-mono font-bold">
                      {qCount} in queue
                    </Pill>
                  </div>

                  {/* Animated Worker Queue Avatars */}
                  <div className="flex items-center gap-1.5 py-1.5 px-2 rounded-xl bg-card border border-border/60 min-h-[38px]">
                    {qCount === 0 ? (
                      <span className="text-[11px] text-muted-foreground italic">
                        Turnstile clear · No queue delay
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: qCount }).map((_, i) => (
                          <span
                            key={i}
                            className="size-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] font-bold text-primary animate-pulse"
                          >
                            W{i + 1}
                          </span>
                        ))}
                        <span className="text-[10px] text-muted-foreground font-mono ml-1.5">
                          ~{(qCount * 2.8).toFixed(1)}s wait
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Lanes */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {g.lanes.map((l) => (
                      <div
                        key={l.id}
                        className="rounded-xl border border-border/60 bg-card p-2 text-xs flex items-center justify-between"
                      >
                        <span className="text-[11px] font-semibold text-foreground">
                          {l.id} ({l.dir})
                        </span>
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {l.throughput}/m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Lane Utilization Mini Chart */}
        <Panel
          title="Lane Utilization Comparison"
          subtitle="Ingress (Lane 1) vs Egress (Lane 2) flow"
        >
          <div className="h-64 min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={laneChartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="gate" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <RBar
                  dataKey="lane1"
                  name="Lane 1 (Ingress)"
                  fill="#1F6FEB"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
                <RBar
                  dataKey="lane2"
                  name="Lane 2 (Egress)"
                  fill="#64748B"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Main Filter Toolbar & Virtualized Turnstile Event Table */}
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="space-y-4 xl:col-span-3">
          {/* Filter Toolbar */}
          <Panel bodyClassName="grid gap-3 md:grid-cols-5 p-3.5">
            <Input
              placeholder="Search worker name or QID…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-xl h-9 text-xs"
            />
            <Select value={gate} onValueChange={setGate}>
              <SelectTrigger className="rounded-xl h-9 text-xs">
                <SelectValue placeholder="All Gates" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All 4 Gates</SelectItem>
                {GATES.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.id} — {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sub} onValueChange={setSub}>
              <SelectTrigger className="rounded-xl h-9 text-xs">
                <SelectValue placeholder="All Subcontractors" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Subcontractors</SelectItem>
                {SUBCONTRACTORS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl h-9 text-xs">
                <SelectValue placeholder="Access Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Access Statuses</SelectItem>
                <SelectItem value="Authorized">Authorized Only</SelectItem>
                <SelectItem value="Denied">Denied Only</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2 rounded-xl h-9 text-xs font-semibold">
                  <ShieldCheck className="size-3.5 text-primary" /> Security Override
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">Manual Security Override</DialogTitle>
                  <DialogDescription className="text-xs">
                    Recorded permanently in the Ashghal audit log with supervisor timestamp and
                    camera snapshot.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3.5 mt-2">
                  <div>
                    <Label htmlFor="qid" className="text-xs font-semibold">
                      Worker Qatar ID (QID)
                    </Label>
                    <Input
                      id="qid"
                      className="mt-1 font-mono rounded-xl text-xs"
                      placeholder="28xxxxxxxxx"
                      value={override.qid}
                      onChange={(e) => setOverride({ ...override, qid: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Authorized Justification</Label>
                    <Select
                      value={override.reason}
                      onValueChange={(v) => setOverride({ ...override, reason: v })}
                    >
                      <SelectTrigger className="mt-1 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Tag Damaged">Tag Physically Damaged</SelectItem>
                        <SelectItem value="VIP Visitor">VIP Client Delegations</SelectItem>
                        <SelectItem value="Emergency Response">Emergency Response Crew</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Verification Snapshot</Label>
                    <button
                      type="button"
                      onClick={() =>
                        setOverride({ ...override, photo: "CAM_SNAPSHOT_VERIFIED.jpg" })
                      }
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-5 text-xs text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                    >
                      <Camera className="size-4" />
                      {override.photo || "Click to snap live turnstile camera"}
                    </button>
                  </div>
                </div>
                <DialogFooter className="mt-3">
                  <Button onClick={submitOverride} className="rounded-xl text-xs font-semibold">
                    Authorize & Release Turnstile
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Panel>

          {/* Virtualized Telemetry Stream Table */}
          <Panel
            title="Real-Time Turnstile Event Stream"
            subtitle={`${filtered.length} reads buffered · EPC Gen2 RFID & Face Verification`}
            bodyClassName="p-0"
          >
            <div ref={parentRef} className="h-[520px] overflow-auto relative">
              <table className="w-full text-xs" role="grid">
                <thead className="sticky top-0 z-10 border-b border-border/80 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm text-left uppercase text-[11px] font-semibold tracking-wider text-muted-foreground">
                  <tr role="row">
                    <th scope="col" className="px-4 py-3">
                      Time
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Worker Details
                    </th>
                    <th scope="col" className="px-4 py-3">
                      QID
                    </th>
                    <th scope="col" className="px-4 py-3">
                      RFID EPC
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Contractor
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Gate & Lane
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Speed
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Dir
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Access Decision
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-border/60 relative"
                  style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const e = filtered[virtualRow.index];
                    if (!e) return null;

                    return (
                      <tr
                        key={e.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 absolute left-0 right-0 flex w-full"
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap w-24">
                          <Mono className="font-semibold text-foreground">{e.time}</Mono>
                        </td>
                        <td className="px-4 py-3 flex-1 min-w-[160px]">
                          <span className="flex items-center gap-2">
                            <Avatar name={e.worker.name} size={24} />
                            <span className="whitespace-nowrap font-bold text-foreground">
                              {e.worker.name}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3 w-32">
                          <Mono className="text-muted-foreground">{e.worker.qid}</Mono>
                        </td>
                        <td className="px-4 py-3 w-32">
                          <Mono className="text-primary font-bold">{e.worker.epc}</Mono>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground flex-1 min-w-[140px]">
                          {e.worker.employer}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium w-28">
                          {e.gateId} · {e.lane}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground tabular-nums w-20">
                          {e.transitSpeedSec ?? 2.4}s
                        </td>
                        <td className="px-4 py-3 w-20">
                          <Pill
                            tone={e.direction === "IN" ? "cyan" : "muted"}
                            className="text-[10px]"
                          >
                            {e.direction}
                          </Pill>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap w-36">
                          <Pill
                            tone={e.status === "Authorized" ? "ok" : "crit"}
                            className="text-[11px]"
                          >
                            {e.manual ? `Override: ${e.reason}` : e.status}
                          </Pill>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Reader Telemetry & Hardware Diagnostics Sidebar */}
        <Panel
          title="Reader Infrastructure"
          subtitle="Zebra FXR90 8-port Fixed Readers"
          bodyClassName="space-y-3.5"
        >
          {HARDWARE.readers.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-3.5 space-y-2 transition-all hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground">{r.id}</p>
                  <p className="text-[11px] text-muted-foreground">{r.gate}</p>
                </div>
                <Pill tone={r.status === "Online" ? "ok" : "warn"} className="text-[10px]">
                  <Dot tone={r.status === "Online" ? "ok" : "warn"} />
                  {r.status}
                </Pill>
              </div>

              <dl className="grid grid-cols-2 gap-y-1 text-xs pt-1 border-t border-border/50">
                <dt className="text-muted-foreground">IP Address</dt>
                <dd className="text-right">
                  <Mono className="text-[11px]">{r.ip}</Mono>
                </dd>
                <dt className="text-muted-foreground">RF Transmit</dt>
                <dd className="text-right font-medium">{r.rf} dBm</dd>
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <Thermometer className="size-3 text-amber-500" /> Core Temp
                </dt>
                <dd className="text-right font-medium">{r.temp}°C</dd>
                <dt className="text-muted-foreground">Antenna VSWR</dt>
                <dd className="text-right text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  {r.vswr.toFixed(2)}:1
                </dd>
              </dl>
            </div>
          ))}

          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Offline Resilience Active</p>
              <p className="text-[11px] opacity-90 mt-0.5">
                Local SQLite store-and-forward active. 0 unsynced packets. All worker credentials
                cached.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
