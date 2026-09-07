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
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Radio,
  ScanLine,
  ShieldAlert,
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

export function CommandCenter() {
  const { t } = useTranslation();
  const { events, headcount, throughputPerMin, gateQueues } = useMediInfra();
  const [building, setBuilding] = useState<"IPT" | "OPT" | "ENG">("IPT");

  const buildings = useMemo(
    () => [
      { id: "IPT" as const, label: t("dashboard.bldgIPT"), count: 485, capacity: 560 },
      { id: "OPT" as const, label: t("dashboard.bldgOPT"), count: 242, capacity: 320 },
      { id: "ENG" as const, label: t("dashboard.bldgENG"), count: 137, capacity: 180 },
    ],
    [t],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("dashboard.heroTitle")}
        description={t("dashboard.heroDesc")}
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/40 px-3.5 py-2 text-xs font-semibold text-primary dark:text-blue-300 shadow-sm">
              <LivePulse tone="cyan" size="sm" />
              <span>{t("dashboard.liveIngest")}</span>
              <StreamingDots tone="cyan" />
            </div>
            <Link
              to="/digital-twin"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <Boxes className="size-3.5 text-primary" /> {t("dashboard.twin3D")}
            </Link>
            <Link
              to="/gates"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <ScanLine className="size-3.5" /> {t("dashboard.gateTelemetry")}
            </Link>
          </div>
        }
      />

      {/* 4 Commercial Enterprise KPI Cards (42px) with Framer Motion Stagger */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch"
      >
        <motion.div variants={cardItemVariants}>
          <KpiCard
            shimmer
            label={t("dashboard.kpiHeadcountLabel")}
            value={headcount.toLocaleString()}
            trend="+4.2%"
            trendLabel={t("dashboard.kpiHeadcountTrendLabel")}
            status={t("dashboard.kpiHeadcountStatus")}
            tone="cyan"
            spark={[620, 690, 742, 802, 861, 890, 872, headcount]}
            footer={
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                <span>{t("dashboard.kpiHeadcountTarget")}</span>
                <span className="font-semibold text-foreground">{t("dashboard.kpiHeadcountBadges")}</span>
              </div>
            }
          />
        </motion.div>
        <motion.div variants={cardItemVariants}>
          <KpiCard
            shimmer
            label={t("dashboard.kpiThroughputLabel")}
            value={`${throughputPerMin}/min`}
            trend="+12%"
            trendLabel={t("dashboard.kpiThroughputTrendLabel")}
            status={t("dashboard.kpiThroughputStatus")}
            tone="ok"
            spark={[8, 14, 30, 52, 41, 33, 29, throughputPerMin]}
            footer={
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                <span>{t("dashboard.kpiThroughputPeak")}</span>
                <span className="font-semibold text-foreground">{t("dashboard.kpiThroughputOperational")}</span>
              </div>
            }
          />
        </motion.div>
        <motion.div variants={cardItemVariants}>
          <KpiCard
            label={t("dashboard.kpiWorkOrdersLabel")}
            value={t("dashboard.kpiWorkOrdersActive")}
            trend="+2"
            trendLabel={t("dashboard.kpiWorkOrdersTrendLabel")}
            status={t("dashboard.kpiWorkOrdersStatus")}
            tone="exec"
            spark={[11, 12, 14, 15, 16, 17, 18, 18]}
            footer={
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                <span>{t("dashboard.kpiWorkOrdersReview")}</span>
                <span className="font-semibold text-foreground">{t("dashboard.kpiWorkOrdersExpired")}</span>
              </div>
            }
          />
        </motion.div>
        <motion.div variants={cardItemVariants}>
          <KpiCard
            label={t("dashboard.kpiSafetyScoreLabel")}
            value="98.4%"
            trend="-0.2%"
            trendLabel={t("dashboard.kpiSafetyScoreTrendLabel")}
            status={t("dashboard.kpiSafetyScoreStatus")}
            tone="warn"
            spark={[97.1, 97.6, 98.2, 98.9, 98.4, 98.5, 98.3, 98.4]}
            footer={
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-1">
                <span>{t("dashboard.kpiSafetyScoreIncidents")}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {t("dashboard.kpiSafetyScoreInduction")}
                </span>
              </div>
            }
          />
        </motion.div>
      </motion.div>

      {/* Digital Twin Overview & Real-Time Gates Hub */}
      <div className="grid gap-6 xl:grid-cols-3 items-stretch">
        {/* Digital Twin Floorplan Panel */}
        <Panel
          className="xl:col-span-2 flex flex-col h-full"
          title={t("dashboard.twinPanelTitle")}
          subtitle={t("dashboard.twinPanelSubtitle")}
          action={
            <div className="flex items-center gap-2">
              <Pill tone="cyan" className="text-xs">
                <Dot tone="cyan" /> {t("dashboard.telemetryStreaming")}
              </Pill>
            </div>
          }
        >
          <Tabs
            value={building}
            onValueChange={(v) => setBuilding(v as typeof building)}
            className="flex-1 flex flex-col"
          >
            <TabsList className="mb-4 flex-wrap rounded-xl bg-slate-100 dark:bg-slate-900 p-1 shrink-0">
              {buildings.map((b) => (
                <TabsTrigger
                  key={b.id}
                  value={b.id}
                  className="rounded-lg text-xs font-semibold px-3 py-1.5"
                >
                  <span>{b.label}</span>
                  <span className="ms-2 rounded-full bg-white/70 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold text-muted-foreground">
                    {b.count}/{b.capacity}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {buildings.map((b) => (
              <TabsContent key={b.id} value={b.id} className="mt-0 flex-1 flex flex-col">
                <Floorplan building={b.id} height={540} />
              </TabsContent>
            ))}
          </Tabs>
        </Panel>

        {/* Real-Time Gate Status Hub */}
        <Panel
          className="flex flex-col h-full"
          title={t("dashboard.perimeterGateStatus")}
          subtitle={t("dashboard.perimeterGateDesc")}
          action={
            <Link
              to="/gates"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {t("dashboard.viewAll")} <ChevronRight className="size-3 rtl:rotate-180" />
            </Link>
          }
          bodyClassName="space-y-4 flex-1 flex flex-col justify-between"
        >
          {GATES.map((gate) => {
            const recent = events.filter((e) => e.gateId === gate.id).slice(0, 3);
            const queueCount = gateQueues[gate.id] ?? 0;

            return (
              <div
                key={gate.id}
                className="rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-4 transition-all duration-150 hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(2,6,23,0.04)] hover:-translate-y-0.5"
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

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {t("dashboard.latestTaps")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {recent.length ? (
                      recent.map((e) => (
                        <span key={e.id} title={`${e.worker.name} (${e.worker.employer})`}>
                          <Avatar name={e.worker.name} size={22} />
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">{t("dashboard.listening")}</span>
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
        title={t("dashboard.manpowerCurveTitle")}
        subtitle={t("dashboard.manpowerCurveSubtitle")}
        action={
          <div className="flex items-center gap-2">
            <Pill tone="ok" className="text-xs">
              <CheckCircle2 className="size-3 me-1" /> {t("dashboard.correlation")}
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
                name={t("dashboard.scheduledManpower")}
                stroke="#7C3AED"
                strokeWidth={2.5}
                fill="url(#gradScheduled)"
              />
              <Area
                type="monotone"
                dataKey="actual"
                name={t("dashboard.actualAttendance")}
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
        title={t("dashboard.subcontractorTableTitle")}
        subtitle={t("dashboard.subcontractorTableSubtitle")}
        action={
          <Link
            to="/analytics"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            {t("dashboard.detailedAudit")} <ArrowUpRight className="size-3.5 rtl:rotate-[-90deg]" />
          </Link>
        }
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-slate-50 dark:bg-slate-900 text-start uppercase text-[12px] font-semibold tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 text-start">{t("dashboard.thContractor")}</th>
                <th className="px-6 py-4 text-start">{t("dashboard.thTrade")}</th>
                <th className="px-6 py-4 text-start">{t("dashboard.thPresentPlanned")}</th>
                <th className="px-6 py-4 text-start">{t("dashboard.thCapacity")}</th>
                <th className="px-6 py-4 text-start">{t("dashboard.thPermits")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {SUBCONTRACTORS.slice(0, 5).map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-foreground">{s.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.trade}</td>
                  <td className="px-6 py-4 tabular-nums font-semibold">
                    {s.present} / {s.planned}
                  </td>
                  <td className="w-64 px-6 py-4">
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
                  <td className="px-6 py-4">
                    <Pill tone="cyan" className="text-xs">
                      {t("dashboard.permitsActive", { count: s.permits })}
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
