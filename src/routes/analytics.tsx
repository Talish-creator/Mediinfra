import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Bar as RBar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  Download,
  FileDown,
  FileSpreadsheet,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EnterpriseDataGrid,
  KpiCard,
  Mono,
  PageHeader,
  Panel,
  Pill,
} from "@/components/mediinfra/ui-kit";
import { DWELL_DISTRIBUTION, PROJECT, SUBCONTRACTORS } from "@/lib/mediinfra-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Subcontractor & Manpower Analytics — MediInfra" },
      {
        name: "description",
        content:
          "Audit-proof manpower reconciliation, labor variance and dwell-time analytics for project P875.",
      },
      { property: "og:title", content: "Subcontractor & Manpower Analytics — MediInfra" },
      {
        property: "og:description",
        content: "Planned vs actual manpower, billed man-hours and ghost-worker audit.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const FORECAST_DATA = [
  { day: "Aug 25", planned: 840, actual: 835, forecast: 835 },
  { day: "Aug 27", planned: 855, actual: 848, forecast: 848 },
  { day: "Aug 29", planned: 860, actual: 862, forecast: 862 },
  { day: "Aug 31", planned: 870, actual: 865, forecast: 865 },
  { day: "Sep 02", planned: 880, actual: 878, forecast: 878 },
  { day: "Sep 04", planned: 890, actual: 885, forecast: 885 },
  { day: "Sep 07 (Today)", planned: 900, actual: 864, forecast: 864 },
  { day: "Sep 09", planned: 910, forecast: 892 },
  { day: "Sep 11", planned: 920, forecast: 905 },
  { day: "Sep 13", planned: 935, forecast: 918 },
  { day: "Sep 15", planned: 940, forecast: 930 },
  { day: "Sep 17", planned: 950, forecast: 942 },
];

function csvExport(toastMsg: string) {
  const rows = [
    [
      "Contractor",
      "Trade",
      "Planned",
      "Actual (RFID)",
      "Variance %",
      "Billed Man-Hours",
      "Induction %",
      "Ghost Discrepancies",
    ],
    ...SUBCONTRACTORS.map((s) => [
      s.name,
      s.trade,
      String(s.planned),
      String(s.present),
      (((s.present - s.planned) / s.planned) * 100).toFixed(1),
      String(s.manHours),
      String(s.inductionValidity),
      String(s.ghostFlags),
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "P875-payroll-reconciliation-timesheet.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success(toastMsg);
}

export function AnalyticsPage() {
  const { t } = useTranslation();
  const [pdfOpen, setPdfOpen] = useState(false);

  const chart = SUBCONTRACTORS.map((s) => ({
    name: s.short,
    Planned: s.planned,
    Actual: s.present,
  }));

  const columns = [
    {
      key: "name",
      header: t("analytics.contractor"),
      render: (s: (typeof SUBCONTRACTORS)[0]) => (
        <div>
          <span className="font-bold text-foreground">{s.name}</span>
          <span className="block text-[11px] text-muted-foreground">{s.trade}</span>
        </div>
      ),
    },
    { key: "planned", header: t("analytics.planned"), sortable: true, align: "right" as const },
    { key: "present", header: t("analytics.actual"), sortable: true, align: "right" as const },
    {
      key: "variance",
      header: t("analytics.discrepancy"),
      align: "right" as const,
      render: (s: (typeof SUBCONTRACTORS)[0]) => {
        const v = ((s.present - s.planned) / s.planned) * 100;
        return (
          <Pill tone={v >= -6 ? "ok" : "warn"} className="text-xs">
            {v > 0 ? `+${v.toFixed(1)}%` : `${v.toFixed(1)}%`}
          </Pill>
        );
      },
    },
    {
      key: "manHours",
      header: t("analytics.actualHours"),
      sortable: true,
      align: "right" as const,
      render: (s: (typeof SUBCONTRACTORS)[0]) => (
        <Mono className="font-bold">{s.manHours.toLocaleString()} h</Mono>
      ),
    },
    {
      key: "ghostFlags",
      header: t("analytics.ghostWorkerAudit"),
      render: () => (
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
          <CheckCircle2 className="size-3.5" /> {t("analytics.ghostFlagsVerified")}
        </span>
      ),
    },
    {
      key: "inductionValidity",
      header: t("analytics.safetyInduction"),
      render: (s: (typeof SUBCONTRACTORS)[0]) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${s.inductionValidity}%` }}
            />
          </div>
          <Mono className="font-bold">{s.inductionValidity}%</Mono>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("analytics.pageTitle")}
        description={t("analytics.pageDesc")}
        actions={
          <div className="flex items-center gap-3">
            <Button
              className="gap-2 h-10 rounded-xl font-semibold text-xs"
              onClick={() => setPdfOpen(true)}
            >
              <FileDown className="size-4" /> {t("analytics.exportPdf")}
            </Button>
            <Button
              variant="outline"
              className="gap-2 h-10 rounded-xl font-semibold text-xs"
              onClick={() => csvExport(t("analytics.csvToast"))}
            >
              <FileSpreadsheet className="size-4" /> {t("analytics.exportCsv")}
            </Button>
          </div>
        }
      />

      {/* 4 Large Executive KPI Cards (42px) */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        <KpiCard
          label={t("analytics.kpiBudget")}
          value="QAR 285.4M"
          trend="+1.2%"
          trendLabel={t("analytics.kpiBudgetTrend")}
          status={t("analytics.kpiBudgetStatus")}
          tone="cyan"
          spark={[240, 252, 260, 268, 274, 280, 285.4]}
        />
        <KpiCard
          label={t("analytics.kpiDailyCost")}
          value="QAR 48.2K"
          trend="-3.4%"
          trendLabel={t("analytics.kpiDailyCostTrend")}
          status={t("analytics.kpiDailyCostStatus")}
          tone="ok"
          spark={[44, 46, 51, 53, 49, 47, 48.2]}
        />
        <KpiCard
          label={t("analytics.kpiBurnRate")}
          value="94.2%"
          trend="-2.1%"
          trendLabel={t("analytics.kpiBurnRateTrend")}
          status={t("analytics.kpiBurnRateStatus")}
          tone="exec"
          spark={[88, 91, 93, 96, 95, 94.2]}
        />
        <KpiCard
          label={t("analytics.kpiProductivity")}
          value="1.08x"
          trend="+8.0%"
          trendLabel={t("analytics.kpiProductivityTrend")}
          status={t("analytics.kpiProductivityStatus")}
          tone="ok"
          spark={[0.96, 0.99, 1.02, 1.05, 1.07, 1.08]}
        />
      </div>

      {/* 14-Day Forecast & Trend Analysis */}
      <Panel
        title={t("analytics.forecastTitle")}
        subtitle={t("analytics.forecastSubtitle")}
        action={
          <div className="flex items-center gap-2">
            <Pill tone="cyan">{t("analytics.confidence")}</Pill>
          </div>
        }
      >
        <div className="h-80 w-full min-h-[320px]">
          <ResponsiveContainer width="100%" height={320} minHeight={320}>
            <AreaChart data={FORECAST_DATA} margin={{ top: 12, right: 12, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="rgba(15, 23, 42, 0.05)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748B" }} />
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
                dataKey="actual"
                name={t("analytics.actual")}
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#colorActual)"
                isAnimationActive={true}
                connectNulls={true}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                name={t("analytics.forecast")}
                stroke="#22C55E"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#colorForecast)"
                isAnimationActive={true}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Grid of Planned vs Actual & Zone Dwell Times */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        <Panel
          className="flex flex-col h-full"
          title={t("analytics.plannedVsActual")}
          subtitle={t("analytics.plannedVsActualSub")}
        >
          <div className="h-72 min-h-[280px]">
            <ResponsiveContainer width="100%" height={280} minHeight={280}>
              <BarChart data={chart} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid
                  stroke="rgba(15, 23, 42, 0.05)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
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
                <RBar
                  dataKey="Planned"
                  name={t("analytics.planned")}
                  fill="#64748B"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={true}
                />
                <RBar
                  dataKey="Actual"
                  name={t("analytics.actual")}
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title={t("analytics.dwellTitle")}
          subtitle={t("analytics.dwellSubtitle")}
        >
          <div className="h-72 min-h-[280px]">
            <ResponsiveContainer width="100%" height={280} minHeight={280}>
              <BarChart
                data={DWELL_DISTRIBUTION}
                layout="vertical"
                margin={{ top: 8, right: 16, bottom: 0, left: 40 }}
              >
                <CartesianGrid
                  stroke="rgba(15, 23, 42, 0.05)"
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis
                  type="category"
                  dataKey="band"
                  width={130}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                />
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
                <RBar dataKey="hours" radius={[0, 6, 6, 0]} isAnimationActive={true}>
                  {DWELL_DISTRIBUTION.map((d, i) => (
                    <Cell key={d.band} fill={i === 0 ? "#22C55E" : i > 1 ? "#F59E0B" : "#2563EB"} />
                  ))}
                </RBar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Audit-Proof Enterprise Data Grid Table */}
      <EnterpriseDataGrid
        data={SUBCONTRACTORS}
        columns={columns}
        searchPlaceholder={t("analytics.searchSubcontractor")}
        searchKeys={["name", "trade"]}
        onExportCsv={() => csvExport(t("analytics.csvToast"))}
      />

      {/* Daily Ashghal Labor Return PDF Modal */}
      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t("analytics.pdfModalTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-md">
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold uppercase tracking-widest text-slate-900/5">
              {t("analytics.pdfWatermark")}
            </span>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">
              {t("analytics.pdfAuthority")}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-950">
              {t("analytics.pdfCertTitle", { code: PROJECT.code })}
            </h3>
            <p className="text-xs text-slate-600">
              {t("analytics.pdfCertSub", { name: PROJECT.name, phase: PROJECT.phase, consultant: PROJECT.consultant })}
            </p>

            <table className="mt-4 w-full text-xs">
              <thead className="border-b border-slate-300 text-start font-bold text-slate-800">
                <tr>
                  <th className="py-2 text-start">{t("analytics.contractor")}</th>
                  <th className="py-2 text-end">{t("analytics.planned")}</th>
                  <th className="py-2 text-end">{t("analytics.actual")}</th>
                  <th className="py-2 text-end">{t("analytics.actualHours")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SUBCONTRACTORS.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 font-medium">{s.name}</td>
                    <td className="py-2 text-end tabular-nums">{s.planned}</td>
                    <td className="py-2 text-end tabular-nums font-bold">{s.present}</td>
                    <td className="py-2 text-end tabular-nums">{s.manHours.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span>{t("analytics.pdfGhostVerif")}</span>
              <span className="font-semibold text-emerald-700">{t("analytics.pdfSeal")}</span>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                toast.success(t("analytics.pdfToast"));
                setPdfOpen(false);
              }}
              className="rounded-xl font-semibold text-xs"
            >
              {t("analytics.pdfConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
