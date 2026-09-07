import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  DollarSign,
  Download,
  Eye,
  FileCheck2,
  FileDown,
  FileSpreadsheet,
  FileText,
  Filter,
  HardHat,
  Layers,
  Lock,
  Mail,
  Pause,
  Play,
  Printer,
  Radio,
  RefreshCw,
  ScanLine,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatedNumber } from "@/components/mediinfra/AnimatedNumber";
import { Dot, LivePulse, Mono, PageHeader, Panel, Pill, StreamingDots } from "@/components/mediinfra/ui-kit";
import { PROJECT, SUBCONTRACTORS } from "@/lib/mediinfra-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports-center")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics Center — MediInfra" },
      {
        name: "description",
        content:
          "Executive business intelligence hub: multi-subsystem telemetry analytics, custom report builder, workforce productivity, and statutory compliance dossiers.",
      },
      { property: "og:title", content: "Reports & Analytics Center — MediInfra" },
      {
        property: "og:description",
        content:
          "Executive analytics dashboard and automated reporting center for Qatar hospital infrastructure.",
      },
    ],
  }),
  component: ReportsCenterPage,
});

// Realistic Mock Telemetry Datasets
const WORKFORCE_TREND_DATA = [
  { day: "01 Sep", planned: 820, actual: 814, forecast: 815, billedHours: 6512 },
  { day: "02 Sep", planned: 830, actual: 828, forecast: 825, billedHours: 6624 },
  { day: "03 Sep", planned: 840, actual: 845, forecast: 840, billedHours: 6760 },
  { day: "04 Sep", planned: 840, actual: 838, forecast: 840, billedHours: 6704 },
  { day: "05 Sep", planned: 850, actual: 856, forecast: 852, billedHours: 6848 },
  { day: "06 Sep", planned: 850, actual: 852, forecast: 850, billedHours: 6816 },
  { day: "07 Sep", planned: 860, actual: 864, forecast: 862, billedHours: 6912 },
];

const SAFETY_TREND_DATA = [
  { day: "Mon", ppeRate: 98.2, nearMisses: 2, safeActs: 48 },
  { day: "Tue", ppeRate: 98.6, nearMisses: 1, safeActs: 52 },
  { day: "Wed", ppeRate: 97.9, nearMisses: 3, safeActs: 45 },
  { day: "Thu", ppeRate: 99.1, nearMisses: 0, safeActs: 61 },
  { day: "Fri", ppeRate: 98.4, nearMisses: 1, safeActs: 54 },
  { day: "Sat", ppeRate: 98.8, nearMisses: 0, safeActs: 58 },
  { day: "Sun", ppeRate: 99.4, nearMisses: 0, safeActs: 64 },
];

const PERMIT_USAGE_DATA = [
  { category: "Hot Work", active: 14, cleared: 38, pending: 2 },
  { category: "Confined Space", active: 8, cleared: 22, pending: 1 },
  { category: "Working at Height", active: 16, cleared: 45, pending: 3 },
  { category: "Electrical Isolation", active: 6, cleared: 19, pending: 0 },
  { category: "Excavation / Trench", active: 4, cleared: 12, pending: 0 },
];

const GATE_ACTIVITY_DATA = [
  { time: "06:00", ingress: 142, egress: 12 },
  { time: "07:00", ingress: 384, egress: 24 },
  { time: "08:00", ingress: 210, egress: 38 },
  { time: "10:00", ingress: 45, egress: 52 },
  { time: "12:00", ingress: 68, egress: 84 },
  { time: "14:00", ingress: 32, egress: 112 },
  { time: "16:00", ingress: 18, egress: 340 },
  { time: "17:00", ingress: 8, egress: 196 },
];

const FINANCIAL_EXPENSES_DATA = [
  { month: "Apr", budget: 6.8, actual: 6.4 },
  { month: "May", budget: 7.2, actual: 6.9 },
  { month: "Jun", budget: 7.5, actual: 7.3 },
  { month: "Jul", budget: 8.0, actual: 7.8 },
  { month: "Aug", budget: 8.2, actual: 8.1 },
  { month: "Sep (Proj)", budget: 8.5, actual: 8.3 },
];

const TRADE_DISTRIBUTION = [
  { trade: "Electrical MEP", count: 228, percentage: "26.4%", color: "#2563EB" },
  { trade: "Structural Steel", count: 162, percentage: "18.8%", color: "#F59E0B" },
  { trade: "Medical Gas", count: 141, percentage: "16.3%", color: "#14B8A6" },
  { trade: "HVAC & Ducts", count: 118, percentage: "13.7%", color: "#10B981" },
  { trade: "Civil & Joinery", count: 123, percentage: "14.2%", color: "#8B5CF6" },
  { trade: "Life Safety & HSE", count: 92, percentage: "10.6%", color: "#EF4444" },
];

const ZONE_OCCUPANCY_DATA = [
  { zone: "IPT-L2 Inpatient East", current: 164, capacity: 180, rate: 91, status: "Near Quota" },
  { zone: "IPT-L3 Inpatient West", current: 148, capacity: 175, rate: 84, status: "Normal" },
  { zone: "IPT-L4 AHU Utility Core", current: 42, capacity: 45, rate: 93, status: "Restricted" },
  { zone: "OPT-L1 Primary Lobby", current: 98, capacity: 150, rate: 65, status: "Normal" },
  { zone: "OPT-L2 Specialist Clinics", current: 112, capacity: 140, rate: 80, status: "Normal" },
  { zone: "ICRA Hoarding Enclosure", current: 36, capacity: 40, rate: 90, status: "Negative Press." },
];

export function ReportsCenterPage() {
  const { t } = useTranslation();

  // Period Selector State
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "q3" | "ytd">("month");

  // Executive Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<"workforce" | "productivity" | "safety" | "permits" | "gates">("workforce");

  // Report Generator Form State
  const [genFilters, setGenFilters] = useState({
    dateRange: "30d",
    department: "all",
    contractor: "all",
    zone: "all",
    workerType: "all",
    gate: "all",
    safetyLevel: "all",
    status: "all",
    format: "pdf",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    id: string;
    name: string;
    period: string;
    hash: string;
    size: string;
  } | null>(null);

  // Scheduled Reports State
  const [scheduledItems, setScheduledItems] = useState([
    {
      id: "SCH-01",
      name: "Daily Morning Labor Return (Ashghal LR-01)",
      frequency: "Daily at 06:00 AM",
      recipients: "eng.nuaimi@ashghal.gov.qa, dir.hse@hmc.org.qa",
      nextRun: "Tomorrow, 06:00 AM",
      active: true,
    },
    {
      id: "SCH-02",
      name: "Weekly HSE Incident & Jetson AI Safety Audit",
      frequency: "Weekly (Every Thursday 16:00)",
      recipients: "safety.lead@keoic.com, qcd.inspect@moi.gov.qa",
      nextRun: "Thu 10 Sep, 16:00",
      active: true,
    },
    {
      id: "SCH-03",
      name: "Monthly Executive Financial Burn & Timesheet Reconciler",
      frequency: "Monthly (1st Day at 08:00 AM)",
      recipients: "cfo.projects@ashghal.gov.qa, finance@imar.qa",
      nextRun: "01 Oct 2026, 08:00",
      active: true,
    },
  ]);

  // Recent Generated Reports State
  const [searchRecent, setSearchRecent] = useState("");
  const [recentReports, setRecentReports] = useState([
    {
      id: "REP-901",
      name: "P875 Daily Labor Return — Ashghal Form LR-01",
      generatedBy: "System Cron (Automated)",
      time: "07 Sep 2026 · 06:00",
      format: "PDF",
      hash: "3a7b...18f2",
      size: "2.4 MB",
    },
    {
      id: "REP-902",
      name: "Week 36 Subcontractor Progress & Dwell Times",
      generatedBy: "Eng. Mubarak Al-Nuaimi",
      time: "06 Sep 2026 · 17:30",
      format: "XLSX",
      hash: "8f21...91c4",
      size: "4.8 MB",
    },
    {
      id: "REP-903",
      name: "August 2026 Executive HSE & Safety Review",
      generatedBy: "Dr. Aisha Al-Sulaiti",
      time: "01 Sep 2026 · 09:15",
      format: "PDF",
      hash: "55bc...409a",
      size: "6.2 MB",
    },
    {
      id: "REP-904",
      name: "Turnstile RFID Ingress Telemetry Raw Dataset",
      generatedBy: "Graham Henderson (KEO)",
      time: "31 Aug 2026 · 18:45",
      format: "CSV",
      hash: "e440...771b",
      size: "18.4 MB",
    },
    {
      id: "REP-905",
      name: "Permit-to-Work High-Risk Sign-Off Ledger",
      generatedBy: "Security Command",
      time: "28 Aug 2026 · 14:20",
      format: "PDF",
      hash: "19b8...312e",
      size: "3.1 MB",
    },
  ]);

  // Filtered Recent Reports
  const filteredRecentReports = useMemo(() => {
    const q = searchRecent.trim().toLowerCase();
    if (!q) return recentReports;
    return recentReports.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.generatedBy.toLowerCase().includes(q) ||
        r.hash.toLowerCase().includes(q),
    );
  }, [recentReports, searchRecent]);

  // Report Generator Execution
  const handleGenerateReport = () => {
    setIsGenerating(true);
    toast.loading(t("reportsCenter.generator.generatingToast"), { id: "gen-report" });

    setTimeout(() => {
      setIsGenerating(false);
      toast.success(t("reportsCenter.generator.generatedToast"), { id: "gen-report" });

      const newId = `REP-${Math.floor(100 + Math.random() * 900)}`;
      const newDoc = {
        id: newId,
        name: `Custom Synthesis Pack (${genFilters.department.toUpperCase()}) — ${PROJECT.code}`,
        generatedBy: "Current Session User",
        time: "Just now",
        format: genFilters.format.toUpperCase(),
        hash: "9b4c..." + Math.random().toString(16).slice(2, 6),
        size: "3.2 MB",
      };
      setRecentReports((prev) => [newDoc, ...prev]);

      setPreviewDoc({
        id: newId,
        name: newDoc.name,
        period: "01 Sep – 07 Sep 2026",
        hash: newDoc.hash,
        size: newDoc.size,
      });
      setPreviewOpen(true);
    }, 1200);
  };

  // Instant Download Action
  const handleDownloadDossier = (name: string, size: string) => {
    toast.success(t("reportsCenter.exportCenter.downloadToast", { name, size }), {
      icon: <Download className="size-4 text-emerald-500" />,
    });
  };

  // Instant Email Dispatch Action
  const handleEmailDossier = () => {
    toast.success(t("reportsCenter.exportCenter.emailedToast"), {
      icon: <Mail className="size-4 text-blue-500" />,
    });
  };

  // Toggle Scheduled Item
  const handleToggleSchedule = (id: string) => {
    setScheduledItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
    toast.info("Schedule recurrence status updated.");
  };

  // Delete Recent Report
  const handleDeleteReport = (id: string) => {
    setRecentReports((prev) => prev.filter((r) => r.id !== id));
    toast.info(t("reportsCenter.recent.deleteToast"));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-foreground overflow-x-hidden selection:bg-blue-500/20">
      {/* Background Ambience Gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-500/8 via-indigo-500/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-10 sm:space-y-12">
        {/* =========================================================================
            SECTION 1: HERO HEADER & EXECUTIVE CONTROL BAR
           ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border/80">
            {/* Left Title & Project Info */}
            <div className="space-y-2 text-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/80 dark:bg-blue-950/50 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                <Dot tone="ok" />
                <span className="font-mono tracking-wide uppercase">
                  {t("reportsCenter.heroTag")}
                </span>
                <span>·</span>
                <span className="text-[11px] font-mono opacity-80">{PROJECT.code} {PROJECT.phase}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
                {t("reportsCenter.heroTitle")}
              </h1>

              <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 max-w-2xl leading-relaxed">
                {t("reportsCenter.heroSubtitle")}
              </p>
            </div>

            {/* Right Action Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-1 shadow-sm">
                {(["today", "week", "month", "q3", "ytd"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      selectedPeriod === p
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    {t(`reportsCenter.period${p.charAt(0).toUpperCase() + p.slice(1)}` as any)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="rounded-xl font-medium cursor-pointer flex items-center gap-2 shadow-sm text-xs h-10 px-4 flex-1 sm:flex-initial"
                >
                  <Sparkles className="size-4" />
                  <span>{t("reportsCenter.generateReport")}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDownloadDossier("All Telemetry Data", "18.4 MB")}
                  className="rounded-xl font-medium cursor-pointer border-border/80 bg-white dark:bg-slate-900 shadow-sm text-xs h-10 px-4"
                >
                  <FileDown className="size-4" />
                  <span className="hidden sm:inline">{t("reportsCenter.exportAll")}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Context Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-border/60 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" />
                <span className="text-foreground font-semibold">{PROJECT.name}</span>
              </div>
              <span className="hidden md:inline">·</span>
              <div className="hidden md:flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>07 Sep 2026 (Shift 02 · 14:00–22:00)</span>
              </div>
            </div>

            <div className="flex items-center gap-4 ms-auto">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                <Dot tone="ok" />
                Data Ingestion: 99.9% Uptime
              </span>
              <span>·</span>
              <span>Latency: 11.4ms</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: QUICK METRICS (8 HIGH-DENSITY KPI CARDS)
           ========================================================================= */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Workers */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{t("reportsCenter.quickMetrics.totalWorkers")}</span>
                <span className="size-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                  <Users className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
                  <AnimatedNumber value={864} />
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="size-3.5" />
                  +2.8%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                <span>vs 840 planned</span>
                <span className="text-emerald-600 font-semibold">{t("reportsCenter.quickMetrics.optimal")}</span>
              </div>
            </div>

            {/* Card 2: Safety Score */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{t("reportsCenter.quickMetrics.safetyScore")}</span>
                <span className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
                  <AnimatedNumber value={98.4} decimals={1} />%
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="size-3.5" />
                  +0.6%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                <span>0 lost-time injuries</span>
                <span className="text-emerald-600 font-semibold">{t("reportsCenter.quickMetrics.compliant")}</span>
              </div>
            </div>

            {/* Card 3: Work Orders */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{t("reportsCenter.quickMetrics.workOrders")}</span>
                <span className="size-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                  <FileText className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
                  <AnimatedNumber value={48} />
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-blue-600">
                  14 high-risk
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                <span>32 verified cleared</span>
                <span className="text-primary font-semibold">{t("reportsCenter.quickMetrics.onTrack")}</span>
              </div>
            </div>

            {/* Card 4: Completed Tasks */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{t("reportsCenter.quickMetrics.completedTasks")}</span>
                <span className="size-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                  <CheckCircle2 className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
                  186 <span className="text-sm text-muted-foreground font-normal">/ 210</span>
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 font-mono">
                  88.6%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                <span>+12 today</span>
                <span className="text-emerald-600 font-semibold">{t("reportsCenter.quickMetrics.optimal")}</span>
              </div>
            </div>

            {/* Card 5: Labor Cost */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{t("reportsCenter.quickMetrics.laborCost")}</span>
                <span className="size-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center">
                  <DollarSign className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#0F172A] dark:text-white">
                  QAR <AnimatedNumber value={285420} />
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  <ArrowDownRight className="size-3.5" />
                  -1.4%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                <span>Daily burn rate</span>
                <span className="text-emerald-600 font-semibold">Under Budget</span>
              </div>
            </div>

            {/* Card 6: Attendance */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{t("reportsCenter.quickMetrics.todayAttendance")}</span>
                <span className="size-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                  <Clock className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
                  <AnimatedNumber value={96.8} decimals={1} />%
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="size-3.5" />
                  +1.2%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                <span>68 contractors</span>
                <span className="text-emerald-600 font-semibold">0 Ghost Flags</span>
              </div>
            </div>

            {/* Card 7: RFID Ingress */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{t("reportsCenter.quickMetrics.rfidEvents")}</span>
                <span className="size-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 flex items-center justify-center">
                  <Radio className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
                  <AnimatedNumber value={14892} />
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-cyan-600 font-mono">
                  38/min
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                <span>All 4 gates active</span>
                <span className="text-cyan-600 font-semibold">100% Ingest</span>
              </div>
            </div>

            {/* Card 8: Emergency Incidents */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>{t("reportsCenter.quickMetrics.emergencyEvents")}</span>
                <span className="size-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                  <Siren className="size-4" />
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0F172A] dark:text-white">
                  0 <span className="text-xs text-emerald-600 font-medium">Clean Record</span>
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 font-mono">
                  QCD Ready
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
                <span>Last drill: 2m 45s</span>
                <span className="text-emerald-600 font-semibold">Grade A</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: EXECUTIVE PERFORMANCE DASHBOARD (INTERACTIVE RECHARTS)
           ========================================================================= */}
        <section className="rounded-3xl border border-border/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/80 pb-5">
            <div className="text-start space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                <span>{t("reportsCenter.dashboard.title")}</span>
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                {t("reportsCenter.dashboard.subtitle")}
              </p>
            </div>

            {/* Chart View Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(
                [
                  { key: "workforce", label: t("reportsCenter.dashboard.tabWorkforce") },
                  { key: "productivity", label: t("reportsCenter.dashboard.tabProductivity") },
                  { key: "safety", label: t("reportsCenter.dashboard.tabSafety") },
                  { key: "permits", label: t("reportsCenter.dashboard.tabPermits") },
                  { key: "gates", label: t("reportsCenter.dashboard.tabGates") },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    activeTab === tab.key
                      ? "bg-white dark:bg-slate-900 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="h-80 sm:h-96 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "workforce" ? (
                <AreaChart data={WORKFORCE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[750, 900]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#FFF",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name={t("reportsCenter.dashboard.actualManpower")}
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                  />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    name={t("reportsCenter.dashboard.plannedManpower")}
                    stroke="#94A3B8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorPlanned)"
                  />
                </AreaChart>
              ) : activeTab === "productivity" ? (
                <BarChart data={WORKFORCE_TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#FFF",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  <Bar dataKey="billedHours" name={t("reportsCenter.dashboard.billedHours")} fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : activeTab === "safety" ? (
                <LineChart data={SAFETY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[95, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#FFF",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  <Line type="monotone" dataKey="ppeRate" name={t("reportsCenter.dashboard.ppeComplianceRate")} stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="nearMisses" name={t("reportsCenter.dashboard.nearMissRate")} stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              ) : activeTab === "permits" ? (
                <BarChart data={PERMIT_USAGE_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" horizontal={false} />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis dataKey="category" type="category" stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#FFF",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  <Bar dataKey="active" name="Active Permits" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="cleared" name="Cleared Permits" stackId="a" fill="#10B981" radius={[0, 6, 6, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={GATE_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#FFF",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  <Area type="monotone" dataKey="ingress" name={t("reportsCenter.dashboard.gateIngress")} stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
                  <Area type="monotone" dataKey="egress" name={t("reportsCenter.dashboard.gateEgress")} stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: EXECUTIVE REPORT BUILDER (CROSS-SUBSYSTEM GENERATOR)
           ========================================================================= */}
        <section className="rounded-3xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-br from-white via-blue-50/20 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-start space-y-1">
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 text-xs font-semibold text-primary">
              <FileCheck2 className="size-3.5" />
              <span>{t("reportsCenter.generator.title")}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("reportsCenter.generator.subtitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filter 1: Date Range */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-semibold text-foreground">
                {t("reportsCenter.generator.dateRange")}
              </label>
              <select
                value={genFilters.dateRange}
                onChange={(e) => setGenFilters({ ...genFilters, dateRange: e.target.value })}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="today">Today (07 Sep 2026)</option>
                <option value="7d">Last 7 Days (Week 36)</option>
                <option value="30d">Month-to-Date (September)</option>
                <option value="q3">Q3 2026 Quarter Return</option>
              </select>
            </div>

            {/* Filter 2: Department */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-semibold text-foreground">
                {t("reportsCenter.generator.department")}
              </label>
              <select
                value={genFilters.department}
                onChange={(e) => setGenFilters({ ...genFilters, department: e.target.value })}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">{t("reportsCenter.generator.allDepartments")}</option>
                <option value="mep">MEP Electrical Engineering</option>
                <option value="civil">Structural & Civil Works</option>
                <option value="hvac">HVAC & Mechanical Systems</option>
                <option value="hse">HSE & Life Safety Command</option>
                <option value="medgas">Medical Gas Infrastructure</option>
              </select>
            </div>

            {/* Filter 3: Subcontractor */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-semibold text-foreground">
                {t("reportsCenter.generator.contractor")}
              </label>
              <select
                value={genFilters.contractor}
                onChange={(e) => setGenFilters({ ...genFilters, contractor: e.target.value })}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">{t("reportsCenter.generator.allContractors")}</option>
                {SUBCONTRACTORS.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name} ({sc.short})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 4: Macro-Zone */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-semibold text-foreground">
                {t("reportsCenter.generator.zone")}
              </label>
              <select
                value={genFilters.zone}
                onChange={(e) => setGenFilters({ ...genFilters, zone: e.target.value })}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">{t("reportsCenter.generator.allZones")}</option>
                <option value="wing-a">Wing A · Inpatient Tower</option>
                <option value="wing-b">Wing B · ICU & Surgical</option>
                <option value="icra">ICRA Infection Hoarding Barrier</option>
                <option value="core">Central Utility Plant & AHU</option>
              </select>
            </div>

            {/* Filter 5: Worker Type */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-semibold text-foreground">
                {t("reportsCenter.generator.workerType")}
              </label>
              <select
                value={genFilters.workerType}
                onChange={(e) => setGenFilters({ ...genFilters, workerType: e.target.value })}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">{t("reportsCenter.generator.allWorkerTypes")}</option>
                <option value="direct">Direct Main Contractor</option>
                <option value="subcontractor">Approved Subcontractor</option>
                <option value="specialist">Specialist Medical Consultant</option>
                <option value="officer">Civil Defence / HSE Marshal</option>
              </select>
            </div>

            {/* Filter 6: Ingress Gate */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-semibold text-foreground">
                {t("reportsCenter.generator.gate")}
              </label>
              <select
                value={genFilters.gate}
                onChange={(e) => setGenFilters({ ...genFilters, gate: e.target.value })}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">{t("reportsCenter.generator.allGates")}</option>
                <option value="gate-01">Gate 01 — North Pedestrian Turnstiles</option>
                <option value="gate-02">Gate 02 — South Logistics Portal</option>
                <option value="gate-03">Gate 03 — East Subcontractor Turnstiles</option>
                <option value="gate-04">Gate 04 — Emergency Evacuation Lane</option>
              </select>
            </div>

            {/* Filter 7: Safety Severity */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-semibold text-foreground">
                {t("reportsCenter.generator.safetyLevel")}
              </label>
              <select
                value={genFilters.safetyLevel}
                onChange={(e) => setGenFilters({ ...genFilters, safetyLevel: e.target.value })}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">{t("reportsCenter.generator.allSafetyLevels")}</option>
                <option value="l1">Level 1 · Observation Only</option>
                <option value="l2">Level 2 · HSE Corrective Advisory</option>
                <option value="l3">Level 3 · Immediate Gate Revocation</option>
              </select>
            </div>

            {/* Filter 8: Output Format */}
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-semibold text-foreground">
                {t("reportsCenter.generator.outputFormat")}
              </label>
              <div className="flex items-center gap-2">
                {[
                  { id: "pdf", label: "PDF (Sealed)" },
                  { id: "xlsx", label: "Excel" },
                  { id: "csv", label: "CSV" },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setGenFilters({ ...genFilters, format: fmt.id })}
                    className={cn(
                      "flex-1 h-9 rounded-xl text-xs font-semibold transition-all border cursor-pointer",
                      genFilters.format === fmt.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-input hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-border/60">
            <Button
              variant="outline"
              onClick={() => {
                setPreviewDoc({
                  id: "PRV-MOCK",
                  name: `P875 Consolidated Telemetry Dossier (${genFilters.department.toUpperCase()})`,
                  period: "01 Sep – 07 Sep 2026",
                  hash: "0xfa49...10b",
                  size: "2.8 MB",
                });
                setPreviewOpen(true);
              }}
              className="rounded-xl text-xs font-medium cursor-pointer flex items-center gap-2"
            >
              <Eye className="size-4" />
              <span>{t("reportsCenter.generator.previewBtn")}</span>
            </Button>

            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="rounded-xl text-xs font-medium cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="size-4" />
              <span>{t("reportsCenter.generator.generateBtn")}</span>
            </Button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: FINANCIAL ANALYTICS & LABOR COST (CARDS & CHARTS)
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-start space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
              <DollarSign className="size-5 text-emerald-600" />
              <span>{t("reportsCenter.financial.title")}</span>
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              {t("reportsCenter.financial.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Financial Summary Cards */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
                <div className="text-xs text-muted-foreground font-medium">
                  {t("reportsCenter.financial.budgetUsed")}
                </div>
                <div className="text-2xl font-extrabold font-mono text-primary">
                  QAR 32.8M <span className="text-xs text-muted-foreground font-normal">/ QAR 42.0M</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "78.4%" }} />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>78.4% Spent</span>
                  <span className="text-emerald-600 font-semibold">QAR 9.2M Left</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
                <div className="text-xs text-muted-foreground font-medium">
                  {t("reportsCenter.financial.avgWorkerCost")}
                </div>
                <div className="text-2xl font-extrabold font-mono text-emerald-600">
                  QAR 330.30 <span className="text-xs text-muted-foreground font-normal">/ man-day</span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  Calculated based on 8.2h average dwell time and Qatar labor standard overtime rates.
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
                <div className="text-xs font-semibold text-foreground mb-1">
                  {t("reportsCenter.financial.costPerZone")}
                </div>
                {ZONE_OCCUPANCY_DATA.slice(0, 3).map((z) => (
                  <div key={z.zone} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                    <span className="text-muted-foreground truncate max-w-[140px]">{z.zone}</span>
                    <span className="font-mono font-semibold text-foreground">
                      QAR {(z.current * 330).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Expense Chart */}
            <div className="lg:col-span-8 rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("reportsCenter.financial.monthlyExpenses")} (Million QAR)
                </h3>
                <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  1.4% Under Baseline
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FINANCIAL_EXPENSES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        border: "none",
                        borderRadius: "12px",
                        color: "#FFF",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                    <Bar dataKey="budget" name="Approved Budget" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual Incurred" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: SAFETY ANALYTICS & JETSON AI TELEMETRY
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-start space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
              <ShieldAlert className="size-5 text-teal-600" />
              <span>{t("reportsCenter.safety.title")}</span>
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              {t("reportsCenter.safety.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
              <div className="text-xs text-muted-foreground font-medium">{t("reportsCenter.safety.ppeCompliance")}</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-600">99.4%</div>
              <p className="text-[11px] text-muted-foreground">Classified across 14,892 ingress camera snapshots</p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
              <div className="text-xs text-muted-foreground font-medium">{t("reportsCenter.safety.aiDetections")}</div>
              <div className="text-3xl font-extrabold font-mono text-teal-600">4,120</div>
              <p className="text-[11px] text-muted-foreground">Hard-hat, high-vis vest, and eye protection neural checks</p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
              <div className="text-xs text-muted-foreground font-medium">{t("reportsCenter.safety.emergencyDrills")}</div>
              <div className="text-3xl font-extrabold font-mono text-blue-600">4 / 4 Passed</div>
              <p className="text-[11px] text-muted-foreground">QCD audited fire evacuation drills with 100% headcount</p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
              <div className="text-xs text-muted-foreground font-medium">{t("reportsCenter.safety.riskScore")}</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-600">Low (0.12)</div>
              <p className="text-[11px] text-muted-foreground">Zero lost-time incidents (LTI) in the last 180 work days</p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: WORKFORCE ANALYTICS & SUBCONTRACTOR COMPARISON
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-start space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
              <Users className="size-5 text-indigo-600" />
              <span>{t("reportsCenter.workforce.title")}</span>
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              {t("reportsCenter.workforce.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Trade Distribution Bar */}
            <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-foreground text-start">
                {t("reportsCenter.workforce.tradeDistribution")}
              </h3>
              <div className="space-y-3">
                {TRADE_DISTRIBUTION.map((t) => (
                  <div key={t.trade} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span>{t.trade}</span>
                      <span className="font-mono text-muted-foreground">
                        {t.count} workers ({t.percentage})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: t.percentage, backgroundColor: t.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subcontractor Performance Table */}
            <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="space-y-1 text-start mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("reportsCenter.workforce.contractorComparison")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Audited planned vs. actual daily manpower and permit-to-work compliance
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="pb-3 text-start">Contractor</th>
                      <th className="pb-3 text-center">Planned</th>
                      <th className="pb-3 text-center">Present</th>
                      <th className="pb-3 text-center">Attendance</th>
                      <th className="pb-3 text-end">Man-Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {SUBCONTRACTORS.map((sc) => {
                      const pct = Math.round((sc.present / sc.planned) * 100);
                      return (
                        <tr key={sc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 text-start font-semibold text-foreground">
                            {sc.name}
                            <span className="block text-[10px] text-muted-foreground font-mono">{sc.trade}</span>
                          </td>
                          <td className="py-2.5 text-center font-mono text-muted-foreground">{sc.planned}</td>
                          <td className="py-2.5 text-center font-mono font-bold text-foreground">{sc.present}</td>
                          <td className="py-2.5 text-center">
                            <span className={cn("px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold", pct >= 95 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300")}>
                              {pct}%
                            </span>
                          </td>
                          <td className="py-2.5 text-end font-mono text-muted-foreground">
                            {sc.manHours.toLocaleString()}h
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: DIGITAL TWIN SPATIAL & ZONE ANALYTICS
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-start space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
              <Layers className="size-5 text-purple-600" />
              <span>{t("reportsCenter.digitalTwin.title")}</span>
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              {t("reportsCenter.digitalTwin.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ZONE_OCCUPANCY_DATA.map((zone) => (
              <div
                key={zone.zone}
                className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 text-start"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                    {zone.zone}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      zone.rate >= 90
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60",
                    )}
                  >
                    {zone.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <div className="text-xl font-bold text-[#0F172A] dark:text-white">
                    {zone.current} <span className="text-xs text-muted-foreground font-normal">/ {zone.capacity} max</span>
                  </div>
                  <span className="text-xs font-semibold text-primary">{zone.rate}%</span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", zone.rate >= 90 ? "bg-amber-500" : "bg-primary")}
                    style={{ width: `${zone.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: EXECUTIVE EXPORT DOSSIER CENTER (8 CARDS)
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-start space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
              <FileDown className="size-5 text-primary" />
              <span>{t("reportsCenter.exportCenter.title")}</span>
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              {t("reportsCenter.exportCenter.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "d1", title: t("reportsCenter.exportCenter.dossier1"), desc: t("reportsCenter.exportCenter.dossier1Desc"), format: "PDF", size: "2.4 MB" },
              { id: "d2", title: t("reportsCenter.exportCenter.dossier2"), desc: t("reportsCenter.exportCenter.dossier2Desc"), format: "XLSX", size: "4.8 MB" },
              { id: "d3", title: t("reportsCenter.exportCenter.dossier3"), desc: t("reportsCenter.exportCenter.dossier3Desc"), format: "PDF", size: "6.2 MB" },
              { id: "d4", title: t("reportsCenter.exportCenter.dossier4"), desc: t("reportsCenter.exportCenter.dossier4Desc"), format: "PDF", size: "3.5 MB" },
              { id: "d5", title: t("reportsCenter.exportCenter.dossier5"), desc: t("reportsCenter.exportCenter.dossier5Desc"), format: "PDF", size: "2.9 MB" },
              { id: "d6", title: t("reportsCenter.exportCenter.dossier6"), desc: t("reportsCenter.exportCenter.dossier6Desc"), format: "XLSX", size: "5.1 MB" },
              { id: "d7", title: t("reportsCenter.exportCenter.dossier7"), desc: t("reportsCenter.exportCenter.dossier7Desc"), format: "PDF", size: "3.8 MB" },
              { id: "d8", title: t("reportsCenter.exportCenter.dossier8"), desc: t("reportsCenter.exportCenter.dossier8Desc"), format: "CSV", size: "18.4 MB" },
            ].map((dossier) => (
              <div
                key={dossier.id}
                className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-start group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="size-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-primary flex items-center justify-center">
                      <FileText className="size-4" />
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-muted-foreground px-2 py-0.5 rounded-md">
                      {dossier.format} · {dossier.size}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                      {dossier.title}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {dossier.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border/60 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPreviewDoc({
                        id: dossier.id,
                        name: dossier.title,
                        period: "August – September 2026",
                        hash: "0x8fa..." + Math.random().toString(16).slice(2, 6),
                        size: dossier.size,
                      });
                      setPreviewOpen(true);
                    }}
                    className="flex-1 text-[11px] h-8 rounded-lg cursor-pointer"
                  >
                    <Eye className="size-3 me-1" />
                    <span>{t("reportsCenter.exportCenter.previewAction")}</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleDownloadDossier(dossier.title, dossier.size)}
                    className="h-8 px-2.5 rounded-lg cursor-pointer text-xs"
                    aria-label="Download dossier"
                  >
                    <Download className="size-3.5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEmailDossier}
                    className="h-8 px-2.5 rounded-lg cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                    aria-label="Email dossier"
                  >
                    <Mail className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: SCHEDULED RECURRING REPORTS
           ========================================================================= */}
        <section className="rounded-3xl border border-border/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-4">
            <div className="text-start space-y-1">
              <h2 className="text-lg font-bold text-foreground">
                {t("reportsCenter.scheduled.title")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("reportsCenter.scheduled.subtitle")}
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => toast.info("Configuring automated SMTP / Webhook dispatch scheduler...")}
              className="rounded-xl text-xs font-medium cursor-pointer"
            >
              + {t("reportsCenter.scheduled.newScheduleBtn")}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-3 text-start">{t("reportsCenter.scheduled.colReport")}</th>
                  <th className="pb-3 text-start">{t("reportsCenter.scheduled.colFrequency")}</th>
                  <th className="pb-3 text-start hidden md:table-cell">{t("reportsCenter.scheduled.colRecipients")}</th>
                  <th className="pb-3 text-start">{t("reportsCenter.scheduled.colNextRun")}</th>
                  <th className="pb-3 text-center">{t("reportsCenter.scheduled.colStatus")}</th>
                  <th className="pb-3 text-end">{t("reportsCenter.scheduled.colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {scheduledItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-foreground text-start">
                      {item.name}
                    </td>
                    <td className="py-3 font-mono text-muted-foreground text-start">
                      {item.frequency}
                    </td>
                    <td className="py-3 font-mono text-muted-foreground text-start hidden md:table-cell max-w-xs truncate">
                      {item.recipients}
                    </td>
                    <td className="py-3 font-mono text-muted-foreground text-start">
                      {item.nextRun}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono",
                          item.active
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                        )}
                      >
                        {item.active ? t("reportsCenter.scheduled.active") : t("reportsCenter.scheduled.paused")}
                      </span>
                    </td>
                    <td className="py-3 text-end">
                      <button
                        onClick={() => handleToggleSchedule(item.id)}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {item.active ? t("reportsCenter.scheduled.pauseBtn") : t("reportsCenter.scheduled.resumeBtn")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: RECENT GENERATED REPORTS LEDGER
           ========================================================================= */}
        <section className="rounded-3xl border border-border/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-4">
            <div className="text-start space-y-1">
              <h2 className="text-lg font-bold text-foreground">
                {t("reportsCenter.recent.title")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("reportsCenter.recent.subtitle")}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchRecent}
                onChange={(e) => setSearchRecent(e.target.value)}
                placeholder={t("reportsCenter.recent.searchPlaceholder")}
                className="w-full h-9 ps-9 pe-3 rounded-xl border border-input bg-background text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-3 text-start">{t("reportsCenter.recent.colName")}</th>
                  <th className="pb-3 text-start">{t("reportsCenter.recent.colGeneratedBy")}</th>
                  <th className="pb-3 text-start">{t("reportsCenter.recent.colTime")}</th>
                  <th className="pb-3 text-center">{t("reportsCenter.recent.colFormat")}</th>
                  <th className="pb-3 text-center">{t("reportsCenter.recent.colHash")}</th>
                  <th className="pb-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredRecentReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-foreground text-start">
                      {rep.name}
                    </td>
                    <td className="py-3 text-muted-foreground text-start">
                      {rep.generatedBy}
                    </td>
                    <td className="py-3 font-mono text-muted-foreground text-start">
                      {rep.time}
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-foreground">
                        {rep.format}
                      </span>
                    </td>
                    <td className="py-3 text-center font-mono text-[11px] text-muted-foreground">
                      {rep.hash}
                    </td>
                    <td className="py-3 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setPreviewDoc({ ...rep, period: rep.time });
                            setPreviewOpen(true);
                          }}
                          className="p-1 text-muted-foreground hover:text-primary rounded cursor-pointer"
                          aria-label="Preview"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadDossier(rep.name, rep.size)}
                          className="p-1 text-muted-foreground hover:text-emerald-600 rounded cursor-pointer"
                          aria-label="Download"
                        >
                          <Download className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(rep.id)}
                          className="p-1 text-muted-foreground hover:text-rose-600 rounded cursor-pointer"
                          aria-label="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =========================================================================
            SECTION 12: PREDICTIVE AI OPERATIONAL INSIGHTS
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-start space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
              <Sparkles className="size-5 text-amber-500" />
              <span>{t("reportsCenter.insights.title")}</span>
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              {t("reportsCenter.insights.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                id: "i1",
                text: t("reportsCenter.insights.insight1"),
                tag: t("reportsCenter.insights.insight1Tag"),
                icon: TrendingUp,
                color: "text-emerald-600",
                bg: "bg-emerald-50 dark:bg-emerald-950/50",
              },
              {
                id: "i2",
                text: t("reportsCenter.insights.insight2"),
                tag: t("reportsCenter.insights.insight2Tag"),
                icon: ShieldCheck,
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-950/50",
              },
              {
                id: "i3",
                text: t("reportsCenter.insights.insight3"),
                tag: t("reportsCenter.insights.insight3Tag"),
                icon: Cpu,
                color: "text-amber-600",
                bg: "bg-amber-50 dark:bg-amber-950/50",
              },
              {
                id: "i4",
                text: t("reportsCenter.insights.insight4"),
                tag: t("reportsCenter.insights.insight4Tag"),
                icon: DollarSign,
                color: "text-teal-600",
                bg: "bg-teal-50 dark:bg-teal-950/50",
              },
              {
                id: "i5",
                text: t("reportsCenter.insights.insight5"),
                tag: t("reportsCenter.insights.insight5Tag"),
                icon: Siren,
                color: "text-rose-600",
                bg: "bg-rose-50 dark:bg-rose-950/50",
              },
            ].map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 text-start flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cn("size-8 rounded-xl flex items-center justify-center", insight.bg, insight.color)}>
                        <Icon className="size-4" />
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md font-mono bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                        {insight.tag}
                      </span>
                    </div>

                    <p className="text-xs text-[#0F172A] dark:text-slate-200 leading-relaxed font-medium">
                      "{insight.text}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Neural Model: Jetson-V8</span>
                    <span className="text-emerald-600 font-semibold font-mono">Confidence: 98.2%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =========================================================================
          SECTION 13: EXECUTIVE REPORT PREVIEW MODAL DIALOG
         ========================================================================= */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-slate-950 border-border">
          <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-border text-start">
            <div className="flex items-center justify-between pe-6">
              <DialogTitle className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                <span>{previewDoc?.name}</span>
              </DialogTitle>
              <span className="text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-1 rounded-md border border-blue-200/60">
                {previewDoc?.hash}
              </span>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {t("reportsCenter.preview.subtitle")}
            </DialogDescription>
          </DialogHeader>

          {/* PDF Visual Simulator Sheet */}
          <div className="relative p-6 sm:p-10 max-h-[70vh] overflow-y-auto bg-[#FAFAFA] dark:bg-slate-900/40 text-start space-y-6 select-none font-sans">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10 rotate-[-25deg]">
              <span className="text-4xl sm:text-6xl font-black font-mono tracking-widest text-slate-900 dark:text-white">
                {t("reportsCenter.preview.watermark")}
              </span>
            </div>

            {/* Official Document Letterhead */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 dark:border-slate-100 gap-4">
              <div>
                <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  State of Qatar · Public Works Authority
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Ashghal Building Affairs · Healthcare Projects Division
                </div>
              </div>
              <div className="text-end font-mono text-xs text-slate-600 dark:text-slate-400">
                <div>Project Code: <span className="font-bold text-foreground">{PROJECT.code}</span></div>
                <div>Issued: <span className="font-bold text-foreground">07 Sep 2026</span></div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {t("reportsCenter.preview.summaryHeading")}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-border">
                {t("reportsCenter.preview.summaryBody")}
              </p>
            </div>

            {/* Metrics Overview Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {t("reportsCenter.preview.metricsHeading")}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-border">
                  <div className="text-[10px] text-muted-foreground uppercase">Peak Manpower</div>
                  <div className="text-lg font-bold font-mono text-primary">864 on-site</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-border">
                  <div className="text-[10px] text-muted-foreground uppercase">Safety Score</div>
                  <div className="text-lg font-bold font-mono text-emerald-600">98.4%</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-border">
                  <div className="text-[10px] text-muted-foreground uppercase">LTI Free Hours</div>
                  <div className="text-lg font-bold font-mono text-teal-600">148,200h</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-border">
                  <div className="text-[10px] text-muted-foreground uppercase">Permits Cleared</div>
                  <div className="text-lg font-bold font-mono text-purple-600">48 / 48</div>
                </div>
              </div>
            </div>

            {/* Signatures & Stamps */}
            <div className="pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 font-mono text-xs text-slate-500">
                  [Digitally Verified SHA-256 Token]
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {t("reportsCenter.preview.consultantSign")}
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 font-mono text-xs text-slate-500">
                  [Ashghal Electronic Seal Validated]
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {t("reportsCenter.preview.directorSign")}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-border flex flex-row items-center justify-between sm:justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info("Sending document payload to network printer...");
                window.print();
              }}
              className="rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>{t("reportsCenter.preview.printBtn")}</span>
            </Button>

            <Button
              size="sm"
              onClick={() => {
                handleDownloadDossier(previewDoc?.name ?? "Report", previewDoc?.size ?? "3.2 MB");
                setPreviewOpen(false);
              }}
              className="rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>{t("reportsCenter.preview.downloadPdfBtn")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
