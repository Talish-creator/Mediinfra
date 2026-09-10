import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Filter,
  Kanban,
  MessageSquare,
  Paperclip,
  Plus,
  QrCode,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Table as TableIcon,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Mono, PageHeader, Panel, Pill } from "@/components/mediinfra/ui-kit";
import { useDomainStore } from "@/lib/domain/store";
import type { WorkOrder, WorkOrderStage, Worker } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/work-orders")({
  head: () => ({
    meta: [
      { title: "Electronic Work Orders & Permit-to-Work — MediInfra P875" },
      {
        name: "description",
        content:
          "Strict 12-stage digital permit-to-work pipeline with consultant sign-off, QR toolbox briefings, and mandatory quality clearance.",
      },
      { property: "og:title", content: "Electronic Work Orders & Permit-to-Work — MediInfra" },
      {
        property: "og:description",
        content: "Permit workflow from drafting through consultant approval, worker briefings, to quality sign-off.",
      },
    ],
  }),
  component: WorkOrdersPage,
});

export const WORK_ORDER_STAGES: {
  id: WorkOrderStage;
  phase: number;
  phaseLabel: string;
  code: string;
  label: string;
  role: string;
  color: string;
}[] = [
  { id: 1, phase: 1, phaseLabel: "Preparation", code: "DRAFT", label: "Drafting", role: "Subcontractor", color: "bg-slate-500" },
  { id: 2, phase: 1, phaseLabel: "Preparation", code: "SUBMITTED", label: "Submitted for Review", role: "Subcontractor", color: "bg-sky-500" },
  { id: 3, phase: 2, phaseLabel: "Approvals", code: "MAIN_CONTRACTOR_REVIEW", label: "Main Contractor Review", role: "IMAR-Al Sraiya JV", color: "bg-blue-600" },
  { id: 4, phase: 2, phaseLabel: "Approvals", code: "CONSULTANT_REVIEW", label: "Consultant / Engineer Review", role: "KEO / Khatib & Alami", color: "bg-indigo-600" },
  { id: 5, phase: 2, phaseLabel: "Approvals", code: "APPROVED", label: "Consultant Approved", role: "Consultant QS / Engineer", color: "bg-emerald-600" },
  { id: 6, phase: 3, phaseLabel: "Workforce Readiness", code: "WORKER_ACKNOWLEDGEMENT", label: "Toolbox Briefing & Signatures", role: "Workforce Operatives", color: "bg-amber-600" },
  { id: 7, phase: 3, phaseLabel: "Workforce Readiness", code: "ACCESS_READY", label: "Gate Permissions Whitelisted", role: "Access Control", color: "bg-teal-600" },
  { id: 8, phase: 4, phaseLabel: "Execution", code: "ACTIVE", label: "Active Works on Site", role: "Trade Execution", color: "bg-cyan-600" },
  { id: 9, phase: 4, phaseLabel: "Execution", code: "COMPLETION_PENDING", label: "Handover Pending", role: "Contractor Supervisor", color: "bg-orange-500" },
  { id: 10, phase: 5, phaseLabel: "Verification & Close", code: "VERIFICATION", label: "QA/QC Inspection Required", role: "Quality Assurance", color: "bg-purple-600" },
  { id: 11, phase: 5, phaseLabel: "Verification & Close", code: "COMPLETED", label: "Quality Verified & Completed", role: "QA Inspector / Consultant", color: "bg-green-600" },
  { id: 12, phase: 5, phaseLabel: "Verification & Close", code: "CLOSED", label: "Commercially Settled & Closed", role: "Project Controls", color: "bg-slate-700" },
];

export const WORK_ORDER_PHASES = [
  { id: 1, label: "Preparation", stages: [1, 2], color: "from-slate-500 to-sky-500", border: "border-sky-500/30" },
  { id: 2, label: "Review & Approvals", stages: [3, 4, 5], color: "from-blue-600 to-emerald-600", border: "border-blue-500/30" },
  { id: 3, label: "Workforce & Gates", stages: [6, 7], color: "from-amber-600 to-teal-600", border: "border-amber-500/30" },
  { id: 4, label: "Active Execution", stages: [8, 9], color: "from-cyan-600 to-orange-500", border: "border-cyan-500/30" },
  { id: 5, label: "Verification & Close", stages: [10, 11, 12], color: "from-purple-600 to-green-600", border: "border-purple-500/30" },
];

function QrBlock({ value }: { value: string }) {
  const size = 21;
  const cells: boolean[] = [];
  let h = 7;
  for (let i = 0; i < value.length; i++) h = (h * 33 + value.charCodeAt(i)) % 100003;
  for (let i = 0; i < size * size; i++) {
    h = (h * 1103515245 + 12345) % 2147483648;
    cells.push((h >> 8) % 3 !== 0);
  }
  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

  return (
    <div
      className="grid rounded-xl bg-white p-3 shadow-md border border-slate-200"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: 220, height: 220 }}
    >
      {cells.map((on, i) => {
        const r = Math.floor(i / size);
        const c = i % size;
        const finder = isFinder(r, c);
        const ring =
          finder &&
          (r % 6 === 0 || c % 6 === 0 || (r % 6 >= 2 && r % 6 <= 4 && c % 6 >= 2 && c % 6 <= 4));
        return (
          <span
            key={i}
            style={{ background: finder ? (ring ? "#0f172a" : "#fff") : on ? "#0f172a" : "#fff" }}
          />
        );
      })}
    </div>
  );
}

function SignatureCanvas({ onSigned }: { onSigned: () => void }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [dirty, setDirty] = useState(false);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div>
      <canvas
        ref={ref}
        width={320}
        height={100}
        className="w-full cursor-crosshair rounded-xl border border-slate-300 bg-white touch-none shadow-inner"
        onPointerDown={(e) => {
          drawing.current = true;
          const ctx = e.currentTarget.getContext("2d");
          const { x, y } = pos(e);
          if (ctx) {
            ctx.lineWidth = 2.4;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#1e293b";
            ctx.beginPath();
            ctx.moveTo(x, y);
          }
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = e.currentTarget.getContext("2d");
          const { x, y } = pos(e);
          ctx?.lineTo(x, y);
          ctx?.stroke();
          setDirty(true);
        }}
        onPointerUp={() => {
          drawing.current = false;
        }}
      />
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">Sign electronically below</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg text-xs"
            onClick={() => {
              const c = ref.current;
              const ctx = c?.getContext("2d");
              if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
              setDirty(false);
            }}
          >
            {t("common.clear", "Clear")}
          </Button>
          <Button
            size="sm"
            disabled={!dirty}
            onClick={() => {
              onSigned();
            }}
            className="h-8 rounded-lg text-xs font-semibold"
          >
            {t("workOrders.submitSignature", "Confirm Sign-Off")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WorkOrdersPage() {
  const { t } = useTranslation();
  const {
    workOrders,
    workers,
    zones,
    contractors,
    inspections,
    approveWorkOrder,
    acknowledgeWorkOrder,
    assignWorkerToWorkOrder,
    updateWorkOrderProgress,
    completeWorkOrder,
    canPerformAction,
    role,
  } = useDomainStore();

  const [activeOrderId, setActiveOrderId] = useState<string | null>("WO-1027");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"briefing" | "workforce" | "quality" | "audit" | "attachments">("briefing");
  const [selectedWorkerToAssign, setSelectedWorkerToAssign] = useState("");

  const active = useMemo(
    () => workOrders.find((wo) => wo.id === activeOrderId) || workOrders[0] || null,
    [workOrders, activeOrderId],
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    zoneId: "IPT-L3-East",
    contractorId: "SC-01",
    start: "06:00",
    end: "17:00",
    quota: "12",
    hazards: [] as string[],
  });

  const HAZARDS = [
    "Hot works & Brazing",
    "Working at height (>2m)",
    "Confined space entry",
    "Live clinical electrical",
    "ICRA negative pressure containment",
    "Crane laydown exclusion",
  ];

  const filteredOrders = useMemo(() => {
    return workOrders.filter((o) => {
      if (
        searchQuery &&
        !`${o.id} ${o.title} ${o.description} ${o.contractorName} ${o.zoneName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (zoneFilter !== "all" && o.zoneId !== zoneFilter) return false;
      if (phaseFilter !== "all") {
        const stageObj = WORK_ORDER_STAGES.find((s) => s.id === o.stage);
        if (stageObj && stageObj.phase !== Number(phaseFilter)) return false;
      }
      return true;
    });
  }, [workOrders, searchQuery, zoneFilter, phaseFilter]);

  // Quality check for completion gate
  const activeOrderInspections = useMemo(() => {
    if (!active) return [];
    return inspections.filter((i) => i.workOrderId === active.id);
  }, [inspections, active]);

  const hasFailedInspection = useMemo(() => {
    return activeOrderInspections.some(
      (i) => i.result === "FAIL" || i.status === "RECTIFICATION_REQUIRED",
    );
  }, [activeOrderInspections]);

  // Assigned workers details
  const assignedWorkers = useMemo(() => {
    if (!active) return [];
    return workers.filter((w) => active.assignedWorkerIds.includes(w.id));
  }, [workers, active]);

  // Available workers to assign
  const availableWorkers = useMemo(() => {
    if (!active) return [];
    return workers.filter(
      (w) => w.contractorId === active.contractorId && !active.assignedWorkerIds.includes(w.id),
    );
  }, [workers, active]);

  const handleAdvanceStage = (order: WorkOrder) => {
    const nextStage = (order.stage + 1) as WorkOrderStage;
    if (nextStage > 12) {
      toast.info("Work Order is already closed.");
      return;
    }

    // Role check for approvals
    if (nextStage >= 3 && nextStage <= 5 && !canPerformAction("APPROVE_WORK_ORDER")) {
      toast.error("Permission Denied: Your current role cannot sign consultant approvals", {
        description: `Current role: "${role}". Switch to Consultant, Ashghal, or Main Contractor.`,
      });
      return;
    }

    // Quality Gate Enforcement: Block advancement from Stage 10 to 11 if inspection failed
    if (order.stage === 10) {
      const orderInsp = inspections.filter((i) => i.workOrderId === order.id);
      const failed = orderInsp.some((i) => i.result === "FAIL" || i.status === "RECTIFICATION_REQUIRED");
      if (failed) {
        toast.error("QUALITY HANDOVER BLOCKED: Unrectified Defects Found", {
          description: "A quality inspection on this work order has failed. Defect rectification and QA clearance required before stage 11 handover.",
          duration: 8000,
        });
        return;
      }
    }

    approveWorkOrder(order.id, nextStage, {
      approverName: `${role.split(" ")[0]} Representative`,
      comment: `Advanced from stage ${order.stage} to ${nextStage}`,
    });
  };

  const handleAssignWorker = () => {
    if (!active || !selectedWorkerToAssign) return;
    assignWorkerToWorkOrder(active.id, selectedWorkerToAssign);
    setSelectedWorkerToAssign("");
    toast.success("Worker assigned to work quota roster");
  };

  const createOrder = () => {
    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }
    const zone = zones.find((z) => z.id === form.zoneId);
    const contractor = contractors.find((c) => c.id === form.contractorId);

    toast.success("Work Order submitted for Main Contractor review", {
      description: `Permit drafted for ${contractor?.companyName} at ${zone?.name}.`,
    });
    setCreateOpen(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("workOrders.pageTitle", "Electronic Work Orders & Permit-to-Work")}
        description={t(
          "workOrders.pageDesc",
          "Digital permit-to-work pipeline with consultant sign-off, QR toolbox briefings, and mandatory quality clearance.",
        )}
        actions={
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl border border-border bg-slate-100 dark:bg-slate-900 p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors",
                  viewMode === "kanban"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Kanban className="size-3.5" /> {t("workOrders.kanbanView", "Pipeline Phases")}
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors",
                  viewMode === "table"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <TableIcon className="size-3.5" /> {t("workOrders.tableView", "Table Register")}
              </button>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl h-10 font-semibold text-xs bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
                  <Plus className="size-4" /> {t("workOrders.newPermit", "New Work Permit")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    {t("workOrders.createPermit", "Initiate Electronic Permit-to-Work (PTW)")}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in permit scope, target zone, method statement, and designated workforce quota.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2 mt-2">
                  <div className="md:col-span-2">
                    <Label className="text-xs font-semibold">Permit Title & Scope</Label>
                    <Input
                      className="mt-1.5 rounded-xl text-xs"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Clinical MEP Riser & Negative Pressure HEPA Installation"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs font-semibold">{t("workOrders.workDescription", "Detailed Description")}</Label>
                    <Textarea
                      className="mt-1.5 rounded-xl text-xs"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Scope, isolation requirements, hot works precautions..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">{t("workOrders.macroZone", "Designated Work Zone")}</Label>
                    <Select value={form.zoneId} onValueChange={(v) => setForm({ ...form, zoneId: v })}>
                      <SelectTrigger className="mt-1.5 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {zones.map((z) => (
                          <SelectItem key={z.id} value={z.id}>
                            {z.id} — {z.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">{t("workOrders.tradeContractor", "Subcontractor")}</Label>
                    <Select
                      value={form.contractorId}
                      onValueChange={(v) => setForm({ ...form, contractorId: v })}
                    >
                      <SelectTrigger className="mt-1.5 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {contractors.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.companyName} ({c.trade})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Operational Window</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Input
                        type="time"
                        value={form.start}
                        onChange={(e) => setForm({ ...form, start: e.target.value })}
                        className="rounded-xl text-xs"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={form.end}
                        onChange={(e) => setForm({ ...form, end: e.target.value })}
                        className="rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">{t("workOrders.workforceQuota", "Manpower Quota")}</Label>
                    <Input
                      className="mt-1.5 rounded-xl text-xs"
                      type="number"
                      value={form.quota}
                      onChange={(e) => setForm({ ...form, quota: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs font-semibold">{t("workOrders.hazardChecklist", "Identified Safety Hazards")}</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                      {HAZARDS.map((h) => (
                        <label
                          key={h}
                          className="flex items-center gap-2 text-xs font-medium cursor-pointer"
                        >
                          <Checkbox
                            checked={form.hazards.includes(h)}
                            onCheckedChange={(c) =>
                              setForm({
                                ...form,
                                hazards: c
                                  ? [...form.hazards, h]
                                  : form.hazards.filter((x) => x !== h),
                              })
                            }
                          />
                          {h}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button onClick={createOrder} className="rounded-xl font-semibold">
                    {t("workOrders.submitPermit", "Submit Permit Application")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Filter and Metrics Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search WO code, zone, title..."
              className="ps-9 rounded-xl h-9 text-xs bg-card"
            />
          </div>

          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-48 h-9 rounded-xl text-xs">
              <SelectValue placeholder="All Zones" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Zones</SelectItem>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger className="w-48 h-9 rounded-xl text-xs">
              <SelectValue placeholder="All Lifecycle Phases" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All 5 Phases (12 Stages)</SelectItem>
              {WORK_ORDER_PHASES.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  Phase {p.id}: {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{workOrders.length} Total Permits</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>{workOrders.filter((w) => w.stage >= 7 && w.stage <= 11).length} Active / Whitelisted</span>
          </div>
        </div>
      </div>

      {/* PIPELINE KANBAN VIEW (Grouped by the 5 Macro Phases) */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
          {WORK_ORDER_PHASES.map((phase) => {
            const phaseOrders = filteredOrders.filter((o) => phase.stages.includes(o.stage));
            return (
              <div
                key={phase.id}
                className={cn(
                  "flex flex-col rounded-[20px] border bg-card/70 p-4 shadow-sm min-h-[580px] h-full",
                  phase.border,
                )}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2.5 rounded-full bg-gradient-to-r", phase.color)} />
                      <span className="text-xs font-bold text-foreground">
                        Phase {phase.id}: {phase.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                      Stages {phase.stages.join(", ")}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-foreground">
                    {phaseOrders.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3.5 pt-3.5 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {phaseOrders.map((o) => {
                      return (
                        <motion.div
                          key={o.id}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.94 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          onClick={() => setActiveOrderId(o.id)}
                          className={cn(
                            "group rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer",
                            active?.id === o.id && "ring-2 ring-primary border-primary",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <Mono className="font-bold text-primary text-xs">{o.id}</Mono>
                            <Pill tone={o.stage >= 7 && o.stage <= 11 ? "ok" : o.stage === 12 ? "muted" : "warn"}>
                              Stage {o.stage}
                            </Pill>
                          </div>

                          <h4 className="mt-2 text-xs font-bold text-foreground line-clamp-2 leading-snug">
                            {o.title}
                          </h4>

                          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                            {o.zoneName} · {o.contractorName}
                          </p>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/60 text-[11px]">
                            <span className="font-medium text-muted-foreground flex items-center gap-1">
                              <Users className="size-3 text-primary" />
                              {o.assignedWorkerIds.length}/{o.workforceQuota}
                            </span>

                            {o.stage < 12 ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdvanceStage(o);
                                }}
                                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                                title="Advance to next workflow stage"
                              >
                                <span>Advance</span>
                                <ArrowRight className="size-3 rtl:rotate-180" />
                              </button>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                <CheckCircle2 className="size-3" /> Closed
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {phaseOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 border border-dashed border-border rounded-xl p-4 text-center text-muted-foreground text-xs">
                      <span>No active permits in this phase</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE REGISTER VIEW */
        <Panel bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-slate-50 dark:bg-slate-900 text-start uppercase text-[11px] font-semibold tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-start">Permit Code</th>
                  <th className="px-4 py-3 text-start">Title & Scope</th>
                  <th className="px-4 py-3 text-start">Zone</th>
                  <th className="px-4 py-3 text-start">Subcontractor</th>
                  <th className="px-4 py-3 text-start">Quota</th>
                  <th className="px-4 py-3 text-start">Stage & Status</th>
                  <th className="px-4 py-3 text-start">Quality Gate</th>
                  <th className="px-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((o) => {
                  const oInsps = inspections.filter((i) => i.workOrderId === o.id);
                  const hasDefect = oInsps.some((i) => i.result === "FAIL" || i.status === "RECTIFICATION_REQUIRED");
                  const isPassed = oInsps.some((i) => i.result === "PASS");

                  return (
                    <tr
                      key={o.id}
                      onClick={() => setActiveOrderId(o.id)}
                      className={cn(
                        "hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer",
                        active?.id === o.id && "bg-blue-50/50 dark:bg-blue-950/20",
                      )}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Mono className="font-bold text-primary">{o.id}</Mono>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground max-w-xs truncate">
                        {o.title}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {o.zoneName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {o.contractorName}
                      </td>
                      <td className="px-4 py-3 tabular-nums font-semibold">
                        {o.assignedWorkerIds.length}/{o.workforceQuota}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Pill tone={o.stage >= 7 && o.stage <= 11 ? "ok" : o.stage === 12 ? "muted" : "warn"}>
                          Stage {o.stage}: {o.status}
                        </Pill>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {hasDefect ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                            <AlertTriangle className="size-3.5" /> Defect Pending
                          </span>
                        ) : isPassed ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" /> QA Passed
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Pre-inspection</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-1.5 h-8 rounded-lg text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrderId(o.id);
                          }}
                        >
                          <FileText className="size-3.5" /> Inspect Permit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* 360° WORK ORDER INSPECTION & SIGN-OFF DRAWER / DIALOG */}
      {active && (
        <Panel className="border-2 border-primary/20 bg-card shadow-xl rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-3">
                <Mono className="text-xl font-bold text-primary">{active.id}</Mono>
                <Pill tone={active.stage >= 7 && active.stage <= 11 ? "ok" : active.stage === 12 ? "muted" : "warn"}>
                  Stage {active.stage} of 12 · {active.status}
                </Pill>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-1">{active.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {active.contractorName} · {active.zoneName} · Supervised by {active.supervisorName} ({active.supervisorPhone})
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs gap-1.5"
                onClick={() => {
                  toast.success("Work Order PDF Package Exported", {
                    description: `Downloaded comprehensive permit bundle for ${active.id}.`,
                  });
                }}
              >
                <Download className="size-3.5" /> Export Permit Bundle
              </Button>

              {active.stage < 12 && (
                <Button
                  size="sm"
                  className="rounded-xl text-xs gap-1.5 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90"
                  onClick={() => handleAdvanceStage(active)}
                >
                  <span>Advance to Stage {active.stage + 1}</span>
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </Button>
              )}
            </div>
          </div>

          {/* 12-Stage Visual Progress Ribbon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">State Machine Lifecycle Progress</span>
              <span className="text-primary font-bold">{Math.round((active.stage / 12) * 100)}% Complete</span>
            </div>
            <div className="grid grid-cols-12 gap-1.5">
              {WORK_ORDER_STAGES.map((st) => {
                const isPassed = active.stage > st.id;
                const isCurrent = active.stage === st.id;
                return (
                  <div
                    key={st.id}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      isPassed ? "bg-emerald-500" : isCurrent ? "bg-primary animate-pulse ring-2 ring-primary/40" : "bg-slate-200 dark:bg-slate-800",
                    )}
                    title={`Stage ${st.id}: ${st.label} (${st.role})`}
                  />
                );
              })}
            </div>
          </div>

          {/* Sub-Tabs: Briefing, Workforce Roster, Quality Gate, Approvals, Attachments */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
              <TabsTrigger value="briefing" className="rounded-lg text-xs font-semibold gap-1.5">
                <Smartphone className="size-3.5" /> Briefing & QR
              </TabsTrigger>
              <TabsTrigger value="workforce" className="rounded-lg text-xs font-semibold gap-1.5">
                <Users className="size-3.5" /> Quota Roster ({assignedWorkers.length})
              </TabsTrigger>
              <TabsTrigger value="quality" className="rounded-lg text-xs font-semibold gap-1.5">
                <ShieldCheck className="size-3.5" /> Quality Clearance
              </TabsTrigger>
              <TabsTrigger value="audit" className="rounded-lg text-xs font-semibold gap-1.5">
                <Clock className="size-3.5" /> Approvals & Audit
              </TabsTrigger>
              <TabsTrigger value="attachments" className="rounded-lg text-xs font-semibold gap-1.5">
                <Paperclip className="size-3.5" /> Attachments ({active.documents.length})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: BRIEFING & QR */}
            <TabsContent value="briefing" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-900/30 text-center">
                  <QrBlock value={active.qrToken} />
                  <Mono className="mt-3 text-xs font-bold text-primary">{active.qrToken}</Mono>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-xs">
                    Scan via Worker Mobile Terminal to unlock toolbox briefing, sign safety acknowledgements, and grant turnstile access.
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Link
                      to="/worker-app"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-primary/90"
                    >
                      <Smartphone className="size-3.5" /> Open Mobile Worker App
                    </Link>
                  </div>
                </div>

                {/* Digital Briefing Tablet Presentation */}
                <div className="rounded-[24px] border-4 border-slate-800 bg-slate-100 p-5 text-slate-900 shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-300 pb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="size-4 text-blue-600" /> SITE GUARDIAN FIELD TERMINAL
                    </span>
                    <span className="font-mono">P875-PTW-SYNC</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{active.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{active.description}</p>
                  </div>

                  <div className="rounded-xl bg-white p-3 shadow-sm border border-slate-200 text-xs space-y-2">
                    <p className="font-bold text-slate-800">Mandatory Hazards & Controls</p>
                    <div className="flex flex-wrap gap-1.5">
                      {active.hazards.map((h) => (
                        <span key={h} className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                      <strong>Required PPE:</strong> {active.requiredPPE.join(", ")}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800 mb-1.5">Supervisor / Worker Electronic Sign-Off</p>
                    <SignatureCanvas
                      onSigned={() => {
                        if (assignedWorkers[0]) {
                          acknowledgeWorkOrder(assignedWorkers[0].id, active.id);
                        } else {
                          toast.success("Toolbox briefing electronically signed and whitelisted");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: ASSIGNED WORKFORCE ROSTER */}
            <TabsContent value="workforce" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-2">
                  <Select value={selectedWorkerToAssign} onValueChange={setSelectedWorkerToAssign}>
                    <SelectTrigger className="w-64 h-9 rounded-xl text-xs">
                      <SelectValue placeholder="Select available subcontractor operative..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs">
                      {availableWorkers.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.fullName} ({w.trade}) — {w.qid}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    disabled={!selectedWorkerToAssign}
                    onClick={handleAssignWorker}
                    className="gap-1.5 rounded-xl h-9 text-xs font-semibold"
                  >
                    <UserPlus className="size-3.5" /> Assign to Quota
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground font-semibold">
                  <span>Quota: </span>
                  <span className="text-foreground font-bold">{assignedWorkers.length}</span> / {active.workforceQuota} Operatives
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead className="border-b border-border bg-slate-50 dark:bg-slate-900 uppercase text-[11px] font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 text-start">Worker</th>
                      <th className="px-4 py-2.5 text-start">QID Number</th>
                      <th className="px-4 py-2.5 text-start">Hard-Hat RFID</th>
                      <th className="px-4 py-2.5 text-start">Induction Status</th>
                      <th className="px-4 py-2.5 text-start">Toolbox Briefing</th>
                      <th className="px-4 py-2.5 text-end">Gate Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {assignedWorkers.map((w) => {
                      const isSigned = active.acknowledgedWorkerIds.includes(w.id);
                      return (
                        <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-2.5 font-bold text-foreground">
                            {w.fullName} ({w.trade})
                          </td>
                          <td className="px-4 py-2.5 font-mono text-muted-foreground">{w.qid}</td>
                          <td className="px-4 py-2.5 font-mono text-primary font-bold">{w.rfid}</td>
                          <td className="px-4 py-2.5">
                            <Pill tone={w.inductionStatus === "VALID" ? "ok" : "crit"}>
                              {w.inductionStatus}
                            </Pill>
                          </td>
                          <td className="px-4 py-2.5">
                            {isSigned ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-3.5" /> Signed & Verified
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[10px] font-semibold rounded-lg"
                                onClick={() => acknowledgeWorkOrder(w.id, active.id)}
                              >
                                Sign Briefing Now
                              </Button>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-end">
                            <Pill tone={isSigned && w.inductionStatus === "VALID" ? "ok" : "warn"}>
                              {isSigned && w.inductionStatus === "VALID" ? "Whitelisted" : "Blocked"}
                            </Pill>
                          </td>
                        </tr>
                      );
                    })}

                    {assignedWorkers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No workers currently assigned to this permit quota. Use the selector above to assign operatives.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* TAB 3: QUALITY GATE & HANDOVER */}
            <TabsContent value="quality" className="space-y-4">
              {hasFailedInspection && (
                <div className="p-4 rounded-xl border border-red-300 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30 flex items-start gap-3">
                  <XCircle className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-900 dark:text-red-300">
                      QUALITY GATE ENFORCEMENT ACTIVE — STAGE 11 HANDOVER BLOCKED
                    </h4>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      A quality inspection for this work order failed verification. The system will strictly prevent this permit from transitioning to Stage 11 (Completed) until all defects are rectified and certified by QA/QC.
                    </p>
                    <div className="mt-2.5">
                      <Link
                        to="/quality"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold shadow hover:bg-red-700"
                      >
                        <ShieldAlert className="size-3.5" /> Open Quality & Defect Rectification Module
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {activeOrderInspections.map((insp) => (
                  <div key={insp.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mono className="font-bold text-primary">{insp.id}</Mono>
                        <span className="text-xs text-muted-foreground font-semibold">
                          Inspector: {insp.inspectorName} ({insp.inspectorRole})
                        </span>
                      </div>
                      <Pill tone={insp.result === "PASS" ? "ok" : "crit"}>
                        {insp.result === "PASS" ? "Quality Passed" : "Defects Found (Fail)"}
                      </Pill>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {insp.checklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-border"
                        >
                          <span className="font-medium text-foreground">{item.description}</span>
                          <Pill tone={item.passed ? "ok" : "crit"}>
                            {item.passed ? "Pass" : "Defect"}
                          </Pill>
                        </div>
                      ))}
                    </div>

                    {insp.defectNotes && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50/50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-200 dark:border-red-900/40">
                        <strong>Defect Notes:</strong> {insp.defectNotes}
                      </p>
                    )}
                  </div>
                ))}

                {activeOrderInspections.length === 0 && (
                  <div className="p-6 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                    No QA/QC inspection records logged yet for this work order. Pre-handover inspection will be initiated at Stage 10.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 4: APPROVALS & AUDIT */}
            <TabsContent value="audit" className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 space-y-4">
                <h4 className="text-xs font-bold text-foreground">Sequential Approval Sign-Off Chain</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="size-2 rounded-full bg-emerald-500 mt-1.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Stage 1 & 2: Subcontractor PTW Submission</p>
                      <p className="text-[11px] text-muted-foreground">
                        Drafted and certified by {active.contractorName} PM.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={cn("size-2 rounded-full mt-1.5", active.stage >= 3 ? "bg-emerald-500" : "bg-slate-400")} />
                    <div>
                      <p className="text-xs font-bold text-foreground">Stage 3: Main Contractor Technical Sign-Off</p>
                      <p className="text-[11px] text-muted-foreground">
                        IMAR-Al Sraiya JV Lead Engineer verified structural boundaries and gas interlocks.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={cn("size-2 rounded-full mt-1.5", active.stage >= 4 ? "bg-emerald-500" : "bg-slate-400")} />
                    <div>
                      <p className="text-xs font-bold text-foreground">Stage 4: Consultant QS / Resident Engineer Review</p>
                      <p className="text-[11px] text-muted-foreground">
                        KEO International Consultants verified infection control (ICRA) containment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={cn("size-2 rounded-full mt-1.5", active.stage >= 7 ? "bg-emerald-500" : "bg-slate-400")} />
                    <div>
                      <p className="text-xs font-bold text-foreground">Stage 7: Access Engine Gate Whitelisting</p>
                      <p className="text-[11px] text-muted-foreground">
                        Automated 17-point access authorization rule generated for Gates 01-04 turnstiles.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={cn("size-2 rounded-full mt-1.5", active.stage >= 11 ? "bg-emerald-500" : "bg-slate-400")} />
                    <div>
                      <p className="text-xs font-bold text-foreground">Stage 11: Quality Handover Clearance</p>
                      <p className="text-[11px] text-muted-foreground">
                        Certified QA inspection pass and final commercial ledger synchronization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 5: ATTACHMENTS */}
            <TabsContent value="attachments" className="space-y-3">
              {active.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <FileCheck className="size-5 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground">{doc.status} · {doc.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => toast.success(`Downloaded ${doc.name}`)}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </Panel>
      )}
    </div>
  );
}
