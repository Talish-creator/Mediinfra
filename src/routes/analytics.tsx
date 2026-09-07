import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

function csvExport() {
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
  toast.success("Payroll reconciliation timesheet exported (CSV)");
}

export function AnalyticsPage() {
  const [pdfOpen, setPdfOpen] = useState(false);

  const chart = SUBCONTRACTORS.map((s) => ({
    name: s.short,
    Planned: s.planned,
    Actual: s.present,
  }));

  const columns = [
    {
      key: "name",
      header: "Subcontractor",
      render: (s: (typeof SUBCONTRACTORS)[0]) => (
        <div>
          <span className="font-bold text-foreground">{s.name}</span>
          <span className="block text-[11px] text-muted-foreground">{s.trade}</span>
        </div>
      ),
    },
    { key: "planned", header: "Planned", sortable: true, align: "right" as const },
    { key: "present", header: "Actual (RFID)", sortable: true, align: "right" as const },
    {
      key: "variance",
      header: "Variance",
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
      header: "Billed Hours",
      sortable: true,
      align: "right" as const,
      render: (s: (typeof SUBCONTRACTORS)[0]) => (
        <Mono className="font-bold">{s.manHours.toLocaleString()} h</Mono>
      ),
    },
    {
      key: "ghostFlags",
      header: "Ghost Worker Audit",
      render: (s: (typeof SUBCONTRACTORS)[0]) => (
        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
          <CheckCircle2 className="size-3.5" /> 0 Flags (Verified)
        </span>
      ),
    },
    {
      key: "inductionValidity",
      header: "Safety Induction",
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
    <div className="space-y-6">
      <PageHeader
        title="Executive Manpower & Financial Analytics"
        description="Every billed man-hour is reconciled in real time against RFID turnstile passes. This audit-proof register forms the contractual baseline for monthly Ashghal and HMC labor certification."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              className="gap-2 h-9 rounded-xl font-semibold text-xs"
              onClick={() => setPdfOpen(true)}
            >
              <FileDown className="size-4" /> Export Ashghal Return (PDF)
            </Button>
            <Button
              variant="outline"
              className="gap-2 h-9 rounded-xl font-semibold text-xs"
              onClick={csvExport}
            >
              <FileSpreadsheet className="size-4" /> Payroll Timesheet (CSV)
            </Button>
          </div>
        }
      />

      {/* 4 Large Executive KPI Cards (42px) */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Contract Budget Allocation"
          value="QAR 285.4M"
          trend="+1.2%"
          trendLabel="within approved cashflow"
          status="On Budget"
          tone="cyan"
          spark={[240, 252, 260, 268, 274, 280, 285.4]}
        />
        <KpiCard
          label="Daily Billed Labor Cost"
          value="QAR 48.2K"
          trend="-3.4%"
          trendLabel="vs planned cap"
          status="Optimal"
          tone="ok"
          spark={[44, 46, 51, 53, 49, 47, 48.2]}
        />
        <KpiCard
          label="Manpower Burn Rate"
          value="94.2%"
          trend="-2.1%"
          trendLabel="under peak allowance"
          status="Controlled"
          tone="exec"
          spark={[88, 91, 93, 96, 95, 94.2]}
        />
        <KpiCard
          label="Site Productivity Index"
          value="1.08x"
          trend="+8.0%"
          trendLabel="above baseline"
          status="High Output"
          tone="ok"
          spark={[0.96, 0.99, 1.02, 1.05, 1.07, 1.08]}
        />
      </div>

      {/* 14-Day Forecast & Trend Analysis */}
      <Panel
        title="14-Day Manpower Forecast & RFID Trend"
        subtitle="Historical turnstile throughput vs 14-day lookahead staffing projections"
        action={
          <div className="flex items-center gap-2">
            <Pill tone="cyan">Confidence: 96.4%</Pill>
          </div>
        }
      >
        <div className="h-80 w-full min-h-[320px]">
          <ResponsiveContainer width="100%" height={320} minHeight={320}>
            <AreaChart data={FORECAST_DATA} margin={{ top: 12, right: 12, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F6FEB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1F6FEB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
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
                dataKey="actual"
                name="Actual RFID Attendance"
                stroke="#1F6FEB"
                strokeWidth={2.5}
                fill="url(#colorActual)"
                isAnimationActive={false}
                connectNulls={true}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                name="AI Projected Manpower"
                stroke="#16A34A"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#colorForecast)"
                isAnimationActive={false}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Grid of Planned vs Actual & Zone Dwell Times */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Planned vs Actual Labor Headcount"
          subtitle="Variance comparison across authorized trade contractors"
        >
          <div className="h-72 min-h-[280px]">
            <ResponsiveContainer width="100%" height={280} minHeight={280}>
              <BarChart data={chart} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <RBar
                  dataKey="Planned"
                  fill="#64748B"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={false}
                />
                <RBar
                  dataKey="Actual"
                  fill="#1F6FEB"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Zone Dwell-Time Distribution"
          subtitle="Average hours spent by workers per shift inside work zones"
        >
          <div className="h-72 min-h-[280px]">
            <ResponsiveContainer width="100%" height={280} minHeight={280}>
              <BarChart
                data={DWELL_DISTRIBUTION}
                layout="vertical"
                margin={{ top: 8, right: 16, bottom: 0, left: 40 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis
                  type="category"
                  dataKey="band"
                  width={130}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <RBar dataKey="hours" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {DWELL_DISTRIBUTION.map((d, i) => (
                    <Cell key={d.band} fill={i === 0 ? "#16A34A" : i > 1 ? "#F59E0B" : "#1F6FEB"} />
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
        searchPlaceholder="Search contractor name or trade…"
        searchKeys={["name", "trade"]}
        onExportCsv={csvExport}
      />

      {/* Daily Ashghal Labor Return PDF Modal */}
      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Daily Ashghal Labor Return — Preview
            </DialogTitle>
          </DialogHeader>
          <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-md">
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold uppercase tracking-widest text-slate-900/5">
              Ashghal · HMC Certified
            </span>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">
              State of Qatar · Public Works Authority (Ashghal)
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-950">
              Daily Labor Return Certification — {PROJECT.code}
            </h3>
            <p className="text-xs text-slate-600">
              {PROJECT.name} · {PROJECT.phase} · Consultant: {PROJECT.consultant}
            </p>

            <table className="mt-4 w-full text-xs">
              <thead className="border-b border-slate-300 text-left font-bold text-slate-800">
                <tr>
                  <th className="py-2">Contractor</th>
                  <th className="py-2 text-right">Planned</th>
                  <th className="py-2 text-right">Actual</th>
                  <th className="py-2 text-right">Man-Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SUBCONTRACTORS.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 font-medium">{s.name}</td>
                    <td className="py-2 text-right tabular-nums">{s.planned}</td>
                    <td className="py-2 text-right tabular-nums font-bold">{s.present}</td>
                    <td className="py-2 text-right tabular-nums">{s.manHours.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span>Ghost Worker Verification: 0 discrepancies</span>
              <span className="font-semibold text-emerald-700">Digital Seal: ASHGHAL-ELV-OK</span>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                toast.success("Ashghal Labor Return PDF queued for certified download");
                setPdfOpen(false);
              }}
              className="rounded-xl font-semibold text-xs"
            >
              Confirm & Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
