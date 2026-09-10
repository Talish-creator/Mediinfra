import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Clock,
  Gauge,
  Info,
  Radio,
  Scan,
  ShieldAlert,
  ShieldCheck,
  Thermometer,
  Users,
  XCircle,
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
import { Textarea } from "@/components/ui/textarea";
import {
  AnimatedNumber,
  Avatar,
  Dot,
  KpiCard,
  LivePulse,
  Mono,
  PageHeader,
  Panel,
  Pill,
  SignalIndicator,
  StreamingDots,
} from "@/components/mediinfra/ui-kit";
import { GATES, HARDWARE, SUBCONTRACTORS } from "@/lib/mediinfra-data";
import { useDomainStore } from "@/lib/domain/store";
import type { GateEvent, AccessCheckRuleResult } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gates")({
  head: () => ({
    meta: [
      { title: "Live Gate & Turnstile Telemetry — MediInfra P875" },
      {
        name: "description",
        content:
          "Real-time RFID turnstile taps, 17-point access verification diagnostics, and reader health across 4 perimeter gates.",
      },
      { property: "og:title", content: "Live Gate & Turnstile Telemetry — MediInfra P875" },
      {
        property: "og:description",
        content: "Real-time RFID turnstile taps and deterministic gate access control.",
      },
    ],
  }),
  component: GatesPage,
});

export function GatesPage() {
  const { t } = useTranslation();
  const {
    events,
    gates,
    workers,
    scanRfid,
    submitManualGateOverride,
    simulating,
    gateQueues,
    throughputPerMin,
    role,
    canPerformAction,
  } = useDomainStore();

  const [q, setQ] = useState("");
  const [gateFilter, setGateFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal States
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [selectedEventForDiagnostic, setSelectedEventForDiagnostic] = useState<GateEvent | null>(null);
  const [overrideForm, setOverrideForm] = useState({
    gateId: "GATE-01",
    qid: "",
    operator: "Capt. Fahad Al-Naimi (Security Lead)",
    reason: "Tag Damaged / Hard-Hat Replacement",
    notes: "",
    photo: "CAMERA_CAPTURE_TURNSTILE_01.JPG",
  });

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        const workerName = e.workerName || e.worker?.fullName || "";
        const qid = e.qid || e.worker?.qid || "";
        if (q && !`${workerName} ${qid}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (gateFilter !== "all" && e.gateId !== gateFilter) return false;
        if (subFilter !== "all" && e.contractorName !== subFilter) return false;
        if (statusFilter !== "all") {
          if (statusFilter === "Authorized" && e.decision !== "AUTHORIZED" && e.decision !== "OVERRIDE_AUTHORIZED") {
            return false;
          }
          if (statusFilter === "Denied" && e.decision !== "DENIED") return false;
        }
        return true;
      }),
    [events, q, gateFilter, subFilter, statusFilter],
  );

  // Virtualizer setup for smooth scrolling
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  const latestEvents = useMemo(() => events.slice(0, 4), [events]);

  // Lane chart data
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

  const handleManualOverride = () => {
    if (!overrideForm.qid) {
      toast.error("Worker Qatar ID (QID) is required for supervisor manual override");
      return;
    }

    submitManualGateOverride(
      overrideForm.gateId,
      overrideForm.qid,
      overrideForm.operator,
      `${overrideForm.reason} · ${overrideForm.notes}`,
      overrideForm.photo,
    );

    setOverrideOpen(false);
    setOverrideForm({
      gateId: "GATE-01",
      qid: "",
      operator: "Capt. Fahad Al-Naimi (Security Lead)",
      reason: "Tag Damaged / Hard-Hat Replacement",
      notes: "",
      photo: "CAMERA_CAPTURE_TURNSTILE_01.JPG",
    });
  };

  const handleTestScan = (workerId: string, direction: "IN" | "OUT" = "IN") => {
    const ev = scanRfid("GATE-02", workerId, direction);
    setSelectedEventForDiagnostic(ev);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("gates.pageTitle", "Live Gate & Turnstile Telemetry")}
        description={t(
          "gates.pageDesc",
          "Real-time RFID turnstile taps, 17-point access verification diagnostics, and reader health across 4 perimeter gates.",
        )}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Rapid Scan Simulation Triggers */}
            <div className="hidden sm:flex items-center gap-1 rounded-xl border border-border bg-card p-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase px-2">Test Scan:</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                onClick={() => handleTestScan("W-0245", "IN")}
              >
                W-0245 (Valid)
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                onClick={() => handleTestScan("W-0317", "IN")}
              >
                W-0317 (Expired)
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg"
                onClick={() => handleTestScan("W-0402", "IN")}
              >
                W-0402 (Unassigned)
              </Button>
            </div>

            <Pill
              tone={simulating ? "ok" : "muted"}
              glow={simulating}
              className="h-9 px-3.5 text-xs font-semibold"
            >
              <LivePulse tone={simulating ? "ok" : "muted"} size="sm" className="me-1.5" />
              {simulating
                ? t("gates.streamingVelocity", { count: throughputPerMin })
                : t("gates.streamPaused", "Telemetry Stream Active")}
              {simulating && <StreamingDots tone="ok" className="ms-1.5" />}
            </Pill>
          </div>
        }
      />

      {/* Real-Time KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        <KpiCard
          shimmer
          label={t("gates.kpiActiveGates", "Active Turnstiles")}
          value="4 / 4 Gates"
          trend="+100%"
          trendLabel="All 8 Lanes Operational"
          status="Online"
          tone="ok"
          spark={[4, 4, 4, 4, 4, 4, 4]}
        />
        <KpiCard
          shimmer
          label={t("gates.kpiVelocity", "Ingress Velocity")}
          value={`${throughputPerMin} taps/min`}
          trend="+12%"
          trendLabel="Peak Ingress Shift"
          status="High Throughput"
          tone="cyan"
          spark={[28, 32, 38, 44, 42, 48, throughputPerMin]}
        />
        <KpiCard
          label={t("gates.kpiAvgLatency", "Evaluation Latency")}
          value="38 ms"
          trend="-4 ms"
          trendLabel="17-Rule Pipeline"
          status="Sub-50ms Target"
          tone="ok"
          spark={[54, 48, 46, 44, 43, 40, 38]}
        />
        <KpiCard
          label={t("gates.kpiCumulativeReads", "Processed RFID Reads")}
          value={events.length.toString()}
          trend="+16"
          trendLabel="Shift Buffered"
          status="Audit Reconciled"
          tone="exec"
          spark={[80, 95, 110, 125, 140, 160, events.length]}
        />
      </div>

      {/* Live Event Pulse Cards (Sliding in) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("gates.liveStreamPulse", "Recent Turnstile Presentations")}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            Click any read to inspect 17-point access diagnostics
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
                onClick={() => setSelectedEventForDiagnostic(ev)}
                className="rounded-[18px] border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 p-4 flex flex-col justify-between cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={ev.workerName} size={28} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{ev.workerName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{ev.contractorName}</p>
                    </div>
                  </div>
                  <Pill
                    tone={
                      ev.decision === "AUTHORIZED"
                        ? "ok"
                        : ev.decision === "OVERRIDE_AUTHORIZED"
                          ? "warn"
                          : "crit"
                    }
                    className="text-[10px] py-0 px-2 font-mono font-bold"
                  >
                    {ev.decision === "AUTHORIZED"
                      ? "AUTHORIZED"
                      : ev.decision === "OVERRIDE_AUTHORIZED"
                        ? "OVERRIDE"
                        : "DENIED"}
                  </Pill>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] pt-2.5 border-t border-border/60">
                  <span className="font-mono text-muted-foreground">{ev.gateId} · {ev.laneId}</span>
                  <span className="font-mono text-foreground font-semibold">{ev.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Filter Toolbar & Virtualized Turnstile Event Table */}
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="space-y-4 xl:col-span-3">
          {/* Filter Toolbar */}
          <Panel bodyClassName="grid gap-3 md:grid-cols-5 p-3.5">
            <Input
              placeholder={t("gates.searchPlaceholder", "Search worker name, QID...")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-xl h-9 text-xs"
            />
            <Select value={gateFilter} onValueChange={setGateFilter}>
              <SelectTrigger className="rounded-xl h-9 text-xs">
                <SelectValue placeholder={t("gates.allGates", "All Gates")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="all">All 4 Gates</SelectItem>
                {GATES.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.id} — {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={subFilter} onValueChange={setSubFilter}>
              <SelectTrigger className="rounded-xl h-9 text-xs">
                <SelectValue placeholder="All Contractors" />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="all">All Contractors</SelectItem>
                {SUBCONTRACTORS.map((s) => (
                  <SelectItem key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-xl h-9 text-xs">
                <SelectValue placeholder="All Decisions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="Authorized">Authorized Only</SelectItem>
                <SelectItem value="Denied">Denied Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Manual Override Button */}
            <Dialog open={overrideOpen} onOpenChange={setOverrideOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2 rounded-xl h-9 text-xs font-semibold">
                  <ShieldCheck className="size-3.5 text-primary" /> {t("gates.manualOverride", "Supervisor Override")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">{t("gates.overrideTitle", "Security Supervisor Manual Override")}</DialogTitle>
                  <DialogDescription className="text-xs">
                    Manually unlock turnstile lane for authorized exception. Logged to forensic audit trail.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3.5 mt-2 text-xs">
                  <div>
                    <Label className="text-xs font-semibold">Perimeter Gate Location</Label>
                    <Select
                      value={overrideForm.gateId}
                      onValueChange={(v) => setOverrideForm({ ...overrideForm, gateId: v })}
                    >
                      <SelectTrigger className="mt-1 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl text-xs">
                        {gates.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name} ({g.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">{t("gates.workerQid", "Worker Qatar ID (QID)")}</Label>
                    <Input
                      className="mt-1 font-mono rounded-xl text-xs"
                      placeholder="28863419024"
                      value={overrideForm.qid}
                      onChange={(e) => setOverrideForm({ ...overrideForm, qid: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">{t("gates.overrideReason", "Override Reason Code")}</Label>
                    <Select
                      value={overrideForm.reason}
                      onValueChange={(v) => setOverrideForm({ ...overrideForm, reason: v })}
                    >
                      <SelectTrigger className="mt-1 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl text-xs">
                        <SelectItem value="Tag Damaged / Hard-Hat Replacement">Tag Damaged / Replacement Issued</SelectItem>
                        <SelectItem value="VIP Visitor / MoPH Official Escort">Official Ministry Escort / Inspection</SelectItem>
                        <SelectItem value="Emergency Medical / Clinical Maintenance">Emergency Specialist Entry</SelectItem>
                        <SelectItem value="Turnstile RFID Sensor Desync">RFID Reader Sensor Desync</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Supervising Operator Name</Label>
                    <Input
                      className="mt-1 rounded-xl text-xs font-medium"
                      value={overrideForm.operator}
                      onChange={(e) => setOverrideForm({ ...overrideForm, operator: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Justification & Observations</Label>
                    <Textarea
                      className="mt-1 rounded-xl text-xs"
                      placeholder="Physical inspection verified, induction valid until 2027..."
                      value={overrideForm.notes}
                      onChange={(e) => setOverrideForm({ ...overrideForm, notes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-3">
                  <Button onClick={handleManualOverride} className="rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white">
                    {t("gates.authorizeEntry", "Authorize Turnstile Release")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Panel>

          {/* Virtualized Telemetry Stream Table */}
          <Panel
            title={t("gates.liveTurnstileGrid", "Live Turnstile Presentation Stream")}
            subtitle="Click any row to open the full 17-point rule diagnostic verification breakdown"
            bodyClassName="p-0"
          >
            <div ref={parentRef} className="h-[520px] overflow-auto relative">
              <table className="w-full text-xs" role="grid">
                <thead className="sticky top-0 z-10 border-b border-border bg-slate-50 dark:bg-slate-900 text-start uppercase text-[11px] font-semibold tracking-wider text-muted-foreground">
                  <tr role="row">
                    <th scope="col" className="px-4 py-3 text-start">Timestamp</th>
                    <th scope="col" className="px-4 py-3 text-start">Operative</th>
                    <th scope="col" className="px-4 py-3 text-start">Qatar ID</th>
                    <th scope="col" className="px-4 py-3 text-start">RFID EPC Tag</th>
                    <th scope="col" className="px-4 py-3 text-start">Contractor</th>
                    <th scope="col" className="px-4 py-3 text-start">Gate & Lane</th>
                    <th scope="col" className="px-4 py-3 text-start">Transit</th>
                    <th scope="col" className="px-4 py-3 text-start">Dir</th>
                    <th scope="col" className="px-4 py-3 text-start">Access Decision</th>
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
                        onClick={() => setSelectedEventForDiagnostic(e)}
                        className="transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/50 absolute inset-x-0 flex w-full cursor-pointer items-center"
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap w-24 font-mono font-semibold text-foreground">
                          {e.timestamp}
                        </td>
                        <td className="px-4 py-3 flex-1 min-w-[160px]">
                          <span className="flex items-center gap-2">
                            <Avatar name={e.workerName} size={24} />
                            <span className="whitespace-nowrap font-bold text-foreground">
                              {e.workerName}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3 w-32 font-mono text-muted-foreground">{e.qid}</td>
                        <td className="px-4 py-3 w-32 font-mono text-primary font-bold">{e.rfid}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground flex-1 min-w-[140px]">
                          {e.contractorName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium w-32">
                          {e.gateId} · {e.laneId}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground tabular-nums w-20">
                          {e.transitSpeedSec ?? 2.4}s
                        </td>
                        <td className="px-4 py-3 w-20">
                          <Pill tone={e.direction === "IN" ? "cyan" : "muted"} className="text-[10px]">
                            {e.direction}
                          </Pill>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap w-44">
                          <Pill
                            tone={
                              e.decision === "AUTHORIZED"
                                ? "ok"
                                : e.decision === "OVERRIDE_AUTHORIZED"
                                  ? "warn"
                                  : "crit"
                            }
                            className="text-[10px]"
                          >
                            {e.isManualOverride
                              ? `Override: ${e.overrideReason || e.reason || "Supervisor"}`
                              : e.decision === "AUTHORIZED"
                                ? "Authorized"
                                : `Denied: ${e.denialReason || "Security"}`}
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
          title={t("hardware.rfidReaders", "Edge Reader Infrastructure")}
          subtitle="Zebra FXR90 8-port Fixed RFID Array"
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
                  {r.status === "Online" ? t("common.active", "Online") : r.status}
                </Pill>
              </div>

              <dl className="grid grid-cols-2 gap-y-1 text-xs pt-1 border-t border-border/50">
                <dt className="text-muted-foreground">IP Address</dt>
                <dd className="text-end">
                  <Mono className="text-[11px]">{r.ip}</Mono>
                </dd>
                <dt className="text-muted-foreground">RF Power</dt>
                <dd className="text-end font-medium">{r.rf} dBm</dd>
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <Thermometer className="size-3 text-amber-500" /> Core Temp
                </dt>
                <dd className="text-end font-medium">{r.temp}°C</dd>
                <dt className="text-muted-foreground">VSWR Ratio</dt>
                <dd className="text-end text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  {r.vswr.toFixed(2)}:1
                </dd>
              </dl>
            </div>
          ))}

          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Offline Store-and-Forward Active</p>
              <p className="text-[11px] opacity-90 mt-0.5">
                Local SQLite cache on turnstile nodes. Zero data loss during WAN latency spikes.
              </p>
            </div>
          </div>
        </Panel>
      </div>

      {/* 17-POINT RULE CHECK DIAGNOSTIC MODAL */}
      <Dialog
        open={!!selectedEventForDiagnostic}
        onOpenChange={(open) => !open && setSelectedEventForDiagnostic(null)}
      >
        <DialogContent className="max-w-2xl rounded-2xl p-6">
          {selectedEventForDiagnostic && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    <span>Turnstile 17-Point Diagnostic Verification</span>
                  </DialogTitle>
                  <Pill
                    tone={
                      selectedEventForDiagnostic.decision === "AUTHORIZED"
                        ? "ok"
                        : selectedEventForDiagnostic.decision === "OVERRIDE_AUTHORIZED"
                          ? "warn"
                          : "crit"
                    }
                  >
                    {selectedEventForDiagnostic.decision}
                  </Pill>
                </div>
                <DialogDescription className="text-xs">
                  Event ID: {selectedEventForDiagnostic.id} · {selectedEventForDiagnostic.gateName} ({selectedEventForDiagnostic.laneId}) · {selectedEventForDiagnostic.timestamp} AST
                </DialogDescription>
              </DialogHeader>

              {/* Worker Profile Card */}
              <div className="p-4 rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedEventForDiagnostic.workerName} size={38} />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {selectedEventForDiagnostic.workerName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedEventForDiagnostic.trade} · {selectedEventForDiagnostic.contractorName}
                    </p>
                  </div>
                </div>

                <div className="text-end text-xs space-y-0.5">
                  <p>QID: <Mono className="font-semibold text-foreground">{selectedEventForDiagnostic.qid}</Mono></p>
                  <p>RFID: <Mono className="font-bold text-primary">{selectedEventForDiagnostic.rfid}</Mono></p>
                </div>
              </div>

              {/* Blocking Denial Alert if Denied */}
              {selectedEventForDiagnostic.decision === "DENIED" && (
                <div className="p-4 rounded-xl border border-red-300 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30 flex items-start gap-3">
                  <XCircle className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-red-900 dark:text-red-300 uppercase">
                      Access Denied: {selectedEventForDiagnostic.denialReason || "Rule Check Failed"}
                    </h5>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      {selectedEventForDiagnostic.denialMessage ||
                        "Worker presentation failed mandatory gate access prerequisites. Optical turnstile was held closed."}
                    </p>
                  </div>
                </div>
              )}

              {/* 17 Rules Diagnostic Grid */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  17-Point Security Engine Evaluation Breakdown
                </h5>
                <div className="max-h-72 overflow-y-auto rounded-xl border border-border divide-y divide-border/60">
                  {(selectedEventForDiagnostic.checks && selectedEventForDiagnostic.checks.length > 0
                    ? selectedEventForDiagnostic.checks
                    : Array.from({ length: 17 }, (_, i) => ({
                        ruleNumber: i + 1,
                        ruleName: [
                          "Worker Registered",
                          "Worker Active Status",
                          "RFID Hard-Hat Tag",
                          "Qatar ID (QID)",
                          "HSE Safety Induction",
                          "Project Authorization",
                          "Approved Work Order",
                          "Work Order Assignment",
                          "Safety Briefing & QR Acknowledged",
                          "Access Authorization Whitelist",
                          "Date Verification",
                          "Shift Operating Window",
                          "Gate Ingress Protocol",
                          "Designated Work Zone",
                          "Zone Capacity Limit",
                          "Security Clearance",
                          "Disciplinary / Safety Stand-down",
                        ][i] || `Rule #${i + 1}`,
                        passed: selectedEventForDiagnostic.decision !== "DENIED" || i !== 4,
                        diagnostic:
                          selectedEventForDiagnostic.decision === "DENIED" && i === 4
                            ? selectedEventForDiagnostic.denialMessage || "Rule check failed"
                            : "Verified compliant with hospital operations safety protocol.",
                      }))
                  ).map((check: AccessCheckRuleResult) => (
                    <div
                      key={check.ruleNumber}
                      className={cn(
                        "p-2.5 flex items-center justify-between text-xs transition-colors",
                        check.passed
                          ? "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                          : "bg-red-50/50 dark:bg-red-950/20",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {check.passed ? (
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="size-4 text-red-600 dark:text-red-400 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-foreground">
                            Rule #{check.ruleNumber}: {check.ruleName}
                          </span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{check.diagnostic}</p>
                        </div>
                      </div>

                      <Pill tone={check.passed ? "ok" : "crit"} className="text-[10px]">
                        {check.passed ? "PASS" : "FAIL"}
                      </Pill>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="mt-4 flex items-center justify-between">
                {selectedEventForDiagnostic.decision === "DENIED" ? (
                  <Button
                    variant="outline"
                    className="text-xs gap-1.5 border-amber-500/40 text-amber-600 hover:bg-amber-50"
                    onClick={() => {
                      setOverrideForm((prev) => ({
                        ...prev,
                        qid: selectedEventForDiagnostic.qid,
                        gateId: selectedEventForDiagnostic.gateId,
                      }));
                      setSelectedEventForDiagnostic(null);
                      setOverrideOpen(true);
                    }}
                  >
                    <ShieldCheck className="size-3.5" /> Authorize Supervisor Override
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={() => setSelectedEventForDiagnostic(null)}
                  className="rounded-xl text-xs font-semibold"
                >
                  Close Diagnostic
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
