import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Radio,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";

import { motion } from "framer-motion";
import { cardItemVariants, staggerContainerVariants } from "@/components/mediinfra/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Floorplan } from "@/components/mediinfra/Floorplan";
import {
  Avatar,
  Bar,
  Dot,
  KpiCard,
  LivePulse,
  Mono,
  PageHeader,
  Panel,
  Pill,
  StreamingDots,
} from "@/components/mediinfra/ui-kit";
import { GATES, MANPOWER_CURVE, SUBCONTRACTORS } from "@/lib/mediinfra-data";
import { useDomainStore } from "@/lib/domain/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/command")({
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

export function CommandCenter() {
  const { t } = useTranslation();
  const {
    events,
    headcount,
    throughputPerMin,
    gateQueues,
    workOrders,
    activeWorkOrdersCount,
    safetyScore,
    presentWorkers,
    incidents,
    auditLogs,
    contractors,
  } = useDomainStore();

  const [building, setBuilding] = useState<"IPT" | "OPT" | "ENG">("IPT");
  const [feedFilter, setFeedFilter] = useState<"all" | "gates" | "safety" | "permits">("all");

  const buildings = useMemo(
    () => [
      { id: "IPT" as const, label: t("dashboard.bldgIPT", "Inpatient Tower (IPT)"), count: 485, capacity: 560 },
      { id: "OPT" as const, label: t("dashboard.bldgOPT", "Outpatient Center (OPT)"), count: 242, capacity: 320 },
      { id: "ENG" as const, label: t("dashboard.bldgENG", "Central Engineering (ENG)"), count: 137, capacity: 180 },
    ],
    [t],
  );

  // Chronological Live Event Feed
  const unifiedEventFeed = useMemo(() => {
    const items: {
      id: string;
      time: string;
      category: "gates" | "safety" | "permits";
      title: string;
      description: string;
      tone: "ok" | "warn" | "crit" | "cyan";
      targetRoute: string;
    }[] = [];

    // 1. Turnstile Events
    events.slice(0, 15).forEach((e) => {
      items.push({
        id: e.id,
        time: e.timestamp || e.time,
        category: "gates",
        title: `${e.decision === "AUTHORIZED" ? "Access Authorized" : e.decision === "OVERRIDE_AUTHORIZED" ? "Supervisor Override" : "Access Denied"} · ${e.gateName || e.gateId}`,
        description: `${e.workerName || e.worker?.fullName} (${e.contractorName}) · QID: ${e.qid} · Lane: ${e.laneId || e.lane}`,
        tone: e.decision === "AUTHORIZED" ? "ok" : e.decision === "OVERRIDE_AUTHORIZED" ? "warn" : "crit",
        targetRoute: "/gates",
      });
    });

    // 2. HSE Incidents
    incidents.slice(0, 10).forEach((inc) => {
      items.push({
        id: inc.id,
        time: new Date(inc.createdAt).toLocaleTimeString("en-GB", { hour12: false }),
        category: "safety",
        title: `HSE Incident: ${inc.type} (${inc.severity})`,
        description: `${inc.description} · Zone: ${inc.zoneName}`,
        tone: inc.severity === "Critical" ? "crit" : inc.severity === "High" ? "warn" : "cyan",
        targetRoute: "/incidents",
      });
    });

    // 3. Work Orders
    workOrders.slice(0, 8).forEach((wo) => {
      items.push({
        id: wo.id,
        time: wo.actualStart ? new Date(wo.actualStart).toLocaleTimeString("en-GB", { hour12: false }) : "07:00:00",
        category: "permits",
        title: `PTW ${wo.id}: Stage ${wo.stage} (${wo.status})`,
        description: `${wo.title} · ${wo.contractorName} · Quota: ${wo.workforceQuota}`,
        tone: wo.stage >= 7 && wo.stage <= 11 ? "ok" : "cyan",
        targetRoute: "/work-orders",
      });
    });

    return items.filter((item) => feedFilter === "all" || item.category === feedFilter).slice(0, 20);
  }, [events, incidents, workOrders, feedFilter]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("dashboard.heroTitle", "Hospital Infrastructure & IoT Command Platform")}
        description={t(
          "dashboard.heroDesc",
          "Hamad General Hospital P875 — Real-time workforce telemetry, turnstile gates, and PTW operations.",
        )}
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/40 px-3.5 py-2 text-xs font-semibold text-primary dark:text-blue-300 shadow-sm">
              <LivePulse tone="cyan" size="sm" />
              <span>{t("dashboard.liveIngest", "Live 60 Hz Telemetry Ingest")}</span>
              <StreamingDots tone="cyan" />
            </div>
            <Link
              to="/digital-twin"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <Boxes className="size-3.5 text-primary" /> {t("dashboard.twin3D", "Digital Twin")}
            </Link>
            <Link
              to="/gates"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <ScanLine className="size-3.5" /> {t("dashboard.gateTelemetry", "Gates Telemetry")}
            </Link>
          </div>
        }
      />

      {/* 4 Interactive KPI Cards with Real Derived Telemetry & Deep Links */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch"
      >
        <motion.div variants={cardItemVariants}>
          <Link to="/workforce" className="block h-full group">
            <KpiCard
              shimmer
              label={t("dashboard.kpiHeadcountLabel", "Active Site Headcount")}
              value={headcount.toLocaleString()}
              trend="+4.2%"
              trendLabel={t("dashboard.kpiHeadcountTrendLabel", "vs yesterday shift")}
              status={t("dashboard.kpiHeadcountStatus", "Normal Operations")}
              tone="cyan"
              spark={[620, 690, 742, 802, 861, 890, 872, headcount]}
              footer={
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                  <span>{t("dashboard.kpiHeadcountTarget", "Shift Target: 850")}</span>
                  <span className="font-semibold text-primary group-hover:underline flex items-center gap-0.5">
                    View Workforce <ChevronRight className="size-3" />
                  </span>
                </div>
              }
            />
          </Link>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Link to="/gates" className="block h-full group">
            <KpiCard
              shimmer
              label={t("dashboard.kpiThroughputLabel", "Turnstile Velocity")}
              value={`${throughputPerMin} taps/min`}
              trend="+12%"
              trendLabel={t("dashboard.kpiThroughputTrendLabel", "Morning Ingress")}
              status={t("dashboard.kpiThroughputStatus", "Peak Flow")}
              tone="ok"
              spark={[8, 14, 30, 52, 41, 33, 29, throughputPerMin]}
              footer={
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                  <span>Peak: 48/min</span>
                  <span className="font-semibold text-primary group-hover:underline flex items-center gap-0.5">
                    Gate Telemetry <ChevronRight className="size-3" />
                  </span>
                </div>
              }
            />
          </Link>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Link to="/work-orders" className="block h-full group">
            <KpiCard
              label={t("dashboard.kpiWorkOrdersLabel", "Permit-to-Work (PTW)")}
              value={`${activeWorkOrdersCount} Active`}
              trend={`+${workOrders.filter((w) => w.stage >= 5).length}`}
              trendLabel="Approved permits"
              status="Field Execution"
              tone="exec"
              spark={[11, 12, 14, 15, 16, 17, 18, activeWorkOrdersCount]}
              footer={
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                  <span>{workOrders.length} Total Permits</span>
                  <span className="font-semibold text-primary group-hover:underline flex items-center gap-0.5">
                    Permit Register <ChevronRight className="size-3" />
                  </span>
                </div>
              }
            />
          </Link>
        </motion.div>

        <motion.div variants={cardItemVariants}>
          <Link to="/incidents" className="block h-full group">
            <KpiCard
              label={t("dashboard.kpiSafetyScoreLabel", "Safety & HSE Index")}
              value={`${safetyScore}%`}
              trend={`${incidents.filter((i) => i.status !== "CLOSED").length} Open`}
              trendLabel="Active Incidents"
              status="Zero Critical Harm"
              tone={safetyScore >= 95 ? "ok" : "warn"}
              spark={[97.1, 97.6, 98.2, 98.9, 98.4, 98.5, 98.3, safetyScore]}
              footer={
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                  <span>99.2% Induction Valid</span>
                  <span className="font-semibold text-primary group-hover:underline flex items-center gap-0.5">
                    Incident Desk <ChevronRight className="size-3" />
                  </span>
                </div>
              }
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Digital Twin Overview & Real-Time Gates Hub */}
      <div className="grid gap-6 xl:grid-cols-3 items-stretch">
        {/* Digital Twin Floorplan Panel */}
        <Panel
          className="xl:col-span-2 flex flex-col h-full"
          title={t("dashboard.twinPanelTitle", "Building Spatial Twin")}
          subtitle={t("dashboard.twinPanelSubtitle", "Real-time zone occupancy and geofenced hazard isolation")}
          action={
            <div className="flex items-center gap-2">
              <Pill tone="cyan" className="text-xs">
                <Dot tone="cyan" /> {t("dashboard.telemetryStreaming", "Mesh Active")}
              </Pill>
            </div>
          }
        >
          {/* Building Switcher */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
            <div className="flex gap-2">
              {buildings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBuilding(b.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
                    building === b.id
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span>{b.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-mono",
                      building === b.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-muted-foreground",
                    )}
                  >
                    {b.count}
                  </span>
                </button>
              ))}
            </div>

            <Link
              to="/digital-twin"
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              {t("dashboard.full3dExplorer", "Open Digital Twin")} <ArrowUpRight className="size-3.5 rtl:rotate-[-90deg]" />
            </Link>
          </div>

          <div className="flex-1">
            <Floorplan building={building} height={420} />
          </div>
        </Panel>

        {/* Real-Time Gates Hub */}
        <Panel
          title={t("dashboard.gateHubTitle", "Perimeter Portals")}
          subtitle={t("dashboard.gateHubSubtitle", "Zebra RFID turnstiles and optical lanes")}
          bodyClassName="space-y-3.5"
          action={
            <Link
              to="/gates"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              {t("common.details", "Details")} <ChevronRight className="size-3 rtl:rotate-180" />
            </Link>
          }
        >
          {GATES.map((gate) => {
            const queueCount = gateQueues[gate.id] ?? 0;
            const recent = events.filter((e) => e.gateId === gate.id).slice(0, 3);

            return (
              <div
                key={gate.id}
                className="rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-4 transition-all duration-150 hover:border-primary/40 hover:shadow-sm"
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
                  <div className="flex items-center gap-2">
                    {queueCount > 0 && (
                      <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                        {t("dashboard.inQueue", { count: queueCount })}
                      </span>
                    )}
                    <LivePulse tone="ok" size="sm" />
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

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                  <span className="text-muted-foreground font-medium">Recent Taps</span>
                  <div className="flex items-center gap-1.5">
                    {recent.length ? (
                      recent.map((e) => (
                        <span key={e.id} title={`${e.workerName} (${e.contractorName})`}>
                          <Avatar name={e.workerName} size={22} />
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">Listening for RFID...</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* CHRONOLOGICAL LIVE EVENT FEED (Section 36) */}
      <Panel
        title="Chronological Operational Event Feed"
        subtitle="Live unified stream connecting RFID turnstile scans, AI safety detections, permit advances, and forensic audit entries"
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setFeedFilter("all")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  feedFilter === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                All Feed
              </button>
              <button
                onClick={() => setFeedFilter("gates")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  feedFilter === "gates" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Turnstile Taps
              </button>
              <button
                onClick={() => setFeedFilter("safety")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  feedFilter === "safety" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                HSE Safety
              </button>
              <button
                onClick={() => setFeedFilter("permits")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  feedFilter === "permits" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                PTW Pipeline
              </button>
            </div>
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="divide-y divide-border/60 max-h-96 overflow-y-auto">
          {unifiedEventFeed.map((item) => (
            <div
              key={item.id}
              className="p-3.5 px-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="font-mono text-xs font-semibold text-muted-foreground w-16 shrink-0">
                  {item.time}
                </span>

                <span
                  className={cn(
                    "size-2.5 rounded-full shrink-0",
                    item.tone === "ok"
                      ? "bg-emerald-500"
                      : item.tone === "crit"
                        ? "bg-red-500"
                        : item.tone === "warn"
                          ? "bg-amber-500"
                          : "bg-blue-500",
                  )}
                />

                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
                </div>
              </div>

              <Link
                to={item.targetRoute as any}
                className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <span>Inspect</span>
                <ChevronRight className="size-3 rtl:rotate-180" />
              </Link>
            </div>
          ))}

          {unifiedEventFeed.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching events in selected filter category.
            </div>
          )}
        </div>
      </Panel>

      {/* Upgraded Manpower Curve with Recharts Gradient */}
      <Panel
        title={t("dashboard.manpowerCurveTitle", "Shift Manpower Mobilization vs Planned Schedule")}
        subtitle={t("dashboard.manpowerCurveSubtitle", "Correlation between biometric turnstile ingress and approved work package quotas")}
        action={
          <div className="flex items-center gap-2">
            <Pill tone="ok" className="text-xs">
              <CheckCircle2 className="size-3 me-1" /> {t("dashboard.correlation", "99.2% Correlation")}
            </Pill>
          </div>
        }
      >
        <div className="h-80 w-full min-h-[320px]">
          <ResponsiveContainer width="100%" height={320} minHeight={320}>
            <AreaChart data={MANPOWER_CURVE} margin={{ top: 16, right: 16, bottom: 0, left: -14 }}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradScheduled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(15, 23, 42, 0.05)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#64748B" }} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "#0F172A",
                  boxShadow: "0 12px 32px rgba(2,6,23,0.08)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#64748B" }} />
              <Area
                type="monotone"
                dataKey="scheduled"
                name={t("dashboard.scheduledManpower", "Approved Quota")}
                stroke="#7C3AED"
                strokeWidth={2.5}
                fill="url(#gradScheduled)"
              />
              <Area
                type="monotone"
                dataKey="actual"
                name={t("dashboard.actualAttendance", "Actual Ingress Taps")}
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#gradActual)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Subcontractor Breakdown Table */}
      <Panel
        title={t("dashboard.subcontractorTableTitle", "Active Trade Subcontractors")}
        subtitle={t("dashboard.subcontractorTableSubtitle", "Live site presence vs planned workforce quotas")}
        action={
          <Link
            to="/contractors"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            Manage Contractors <ArrowUpRight className="size-3.5 rtl:rotate-[-90deg]" />
          </Link>
        }
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-slate-50 dark:bg-slate-900 text-start uppercase text-[12px] font-semibold tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 text-start">{t("dashboard.thContractor", "Contractor Company")}</th>
                <th className="px-6 py-4 text-start">{t("dashboard.thTrade", "Specialist Trade")}</th>
                <th className="px-6 py-4 text-start">{t("dashboard.thPresentPlanned", "Present / Planned")}</th>
                <th className="px-6 py-4 text-start">{t("dashboard.thCapacity", "Mobilization")}</th>
                <th className="px-6 py-4 text-start">Safety Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {contractors.slice(0, 6).map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-foreground">{s.companyName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.trade}</td>
                  <td className="px-6 py-4 tabular-nums font-semibold">
                    {s.actualManpower} / {s.plannedManpower}
                  </td>
                  <td className="w-64 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Bar
                        value={s.actualManpower}
                        max={s.plannedManpower}
                        tone={s.actualManpower / s.plannedManpower > 0.9 ? "ok" : "warn"}
                      />
                      <Mono className="font-bold text-xs">
                        {Math.round((s.actualManpower / s.plannedManpower) * 100)}%
                      </Mono>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Pill tone={s.safetyScore >= 97 ? "ok" : "warn"} className="text-xs">
                      {s.safetyScore}% HSE
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
