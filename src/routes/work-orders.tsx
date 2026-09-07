import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
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
  Smartphone,
  Table as TableIcon,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

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
import { motion, AnimatePresence } from "framer-motion";
import { Mono, PageHeader, Panel, Pill } from "@/components/mediinfra/ui-kit";
import { SUBCONTRACTORS, WORK_ORDERS, ZONES, type WorkOrder } from "@/lib/mediinfra-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/work-orders")({
  head: () => ({
    meta: [
      { title: "Electronic Work Orders & Permit-to-Work — MediInfra" },
      {
        name: "description",
        content:
          "Digital permit-to-work pipeline with consultant sign-off, QR toolbox briefings and automatic turnstile grants.",
      },
      { property: "og:title", content: "Electronic Work Orders & Permit-to-Work — MediInfra" },
      {
        property: "og:description",
        content: "Permit workflow from drafting to automatic turnstile permission.",
      },
    ],
  }),
  component: WorkOrdersPage,
});

const STAGES = [
  { id: 1, name: "Drafting", label: "Subcontractor Drafting", color: "bg-slate-500" },
  { id: 2, name: "Contractor Review", label: "Main Contractor Review", color: "bg-blue-500" },
  { id: 3, name: "Consultant Sign-Off", label: "Consultant (Ashghal/HMC)", color: "bg-indigo-500" },
  { id: 4, name: "Toolbox Briefing", label: "Worker Toolbox & QR", color: "bg-amber-500" },
  { id: 5, name: "Turnstile Granted", label: "Access Permission Granted", color: "bg-emerald-500" },
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
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div>
      <canvas
        ref={ref}
        width={320}
        height={110}
        className="w-full cursor-crosshair rounded-xl border border-slate-300 bg-white touch-none shadow-inner"
        onPointerDown={(e) => {
          drawing.current = true;
          const ctx = e.currentTarget.getContext("2d");
          const { x, y } = pos(e);
          ctx?.beginPath();
          ctx?.moveTo(x, y);
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
        <span className="text-[11px] text-slate-500">Draw signature with finger or stylus</span>
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
            Clear
          </Button>
          <Button
            size="sm"
            disabled={!dirty}
            onClick={() => {
              onSigned();
              toast.success("Toolbox briefing electronically signed", {
                description: "Turnstile RFID whitelist synced across Gates 01–04.",
              });
            }}
            className="h-8 rounded-lg text-xs font-semibold"
          >
            Sign & Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(WORK_ORDERS);
  const [active, setActive] = useState<WorkOrder | null>(null);
  const [signed, setSigned] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"briefing" | "audit" | "attachments" | "comments">(
    "briefing",
  );

  const [form, setForm] = useState({
    description: "",
    zone: "IPT-L3-East",
    contractor: SUBCONTRACTORS[0]!.name,
    start: "06:00",
    end: "17:00",
    quota: "20",
    approver: "KEO International Consultants",
    hazards: [] as string[],
  });

  const HAZARDS = [
    "Hot works",
    "Working at height",
    "Confined space",
    "Live electrical",
    "ICRA infection control",
    "Crane lifts",
  ];

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.zone.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const createOrder = () => {
    if (!form.description) {
      toast.error("Work description is required");
      return;
    }
    const id = `WO-2026-P875-0${170 + orders.length}`;
    setOrders([
      {
        id,
        description: form.description,
        zone: form.zone,
        contractor: form.contractor,
        scheduled: `2026-09-09 ${form.start} → ${form.end}`,
        quota: Number(form.quota) || 0,
        signedOff: 0,
        status: "Main Contractor Review",
        stage: 2,
        hazards: form.hazards.length ? form.hazards : ["General construction"],
      },
      ...orders,
    ]);
    setCreateOpen(false);
    toast.success(`${id} submitted for main contractor review`);
  };

  const advanceStage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const nextStage = Math.min(5, o.stage + 1) as 1 | 2 | 3 | 4 | 5;
        const stageObj = STAGES.find((s) => s.id === nextStage);
        toast.success(`${o.id} promoted to ${stageObj?.name}`);
        const statusVal: WorkOrder["status"] =
          nextStage === 5
            ? "Fully Approved"
            : nextStage >= 3
              ? "Pending Consultant"
              : nextStage === 2
                ? "Main Contractor Review"
                : "Draft";
        return {
          ...o,
          stage: nextStage,
          status: statusVal,
          signedOff: nextStage === 5 ? o.quota : o.signedOff,
        };
      }),
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Electronic Work Orders & Permit-to-Work"
        description="Every work order traverses five gated verification steps. Turnstiles at Gates 01–04 deny perimeter access until both consultant clearance and the digital worker briefing are executed."
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
                <Kanban className="size-3.5" /> Kanban
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
                <TableIcon className="size-3.5" /> Table
              </button>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl h-10 font-semibold text-xs">
                  <Plus className="size-4" /> Create Work Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Create New Work Order</DialogTitle>
                  <DialogDescription>
                    P875 Hamad General Hospital retrofit permit submission.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2 mt-2">
                  <div className="md:col-span-2">
                    <Label className="text-xs font-semibold">Work description</Label>
                    <Textarea
                      className="mt-1.5 rounded-xl"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="e.g. IPT Level 4 chilled water riser replacement"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Macro zone</Label>
                    <Select value={form.zone} onValueChange={(v) => setForm({ ...form, zone: v })}>
                      <SelectTrigger className="mt-1.5 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {ZONES.map((z) => (
                          <SelectItem key={z.id} value={z.id}>
                            {z.id} — {z.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Trade contractor</Label>
                    <Select
                      value={form.contractor}
                      onValueChange={(v) => setForm({ ...form, contractor: v })}
                    >
                      <SelectTrigger className="mt-1.5 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {SUBCONTRACTORS.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Start time</Label>
                    <Input
                      className="mt-1.5 rounded-xl"
                      type="time"
                      value={form.start}
                      onChange={(e) => setForm({ ...form, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">End time</Label>
                    <Input
                      className="mt-1.5 rounded-xl"
                      type="time"
                      value={form.end}
                      onChange={(e) => setForm({ ...form, end: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Workforce Quota</Label>
                    <Input
                      className="mt-1.5 rounded-xl"
                      type="number"
                      value={form.quota}
                      onChange={(e) => setForm({ ...form, quota: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Consultant Approver</Label>
                    <Select
                      value={form.approver}
                      onValueChange={(v) => setForm({ ...form, approver: v })}
                    >
                      <SelectTrigger className="mt-1.5 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="KEO International Consultants">
                          KEO International Consultants
                        </SelectItem>
                        <SelectItem value="Khatib & Alami">Khatib &amp; Alami</SelectItem>
                        <SelectItem value="HMC Facilities Directorate">
                          HMC Facilities Directorate
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs font-semibold">Hazard Checklist</Label>
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
                  <Button onClick={createOrder} className="rounded-xl">
                    Submit Permit Application
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search work order ID, zone, or contractor…"
            className="pl-9 rounded-xl h-9 text-xs bg-card"
          />
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{filteredOrders.length}</span> permits
          in P875 register
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
          {STAGES.map((stage) => {
            const stageOrders = filteredOrders.filter((o) => o.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/30 p-4 shadow-sm min-h-[620px] h-full"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2.5 rounded-full", stage.color)} />
                    <span className="text-xs font-bold text-foreground truncate max-w-[130px]">
                      {stage.name}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3.5 pt-3.5 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {stageOrders.map((o) => (
                      <motion.div
                        key={o.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="group rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                        onClick={() => setActive(o)}
                      >
                        <div className="flex items-center justify-between">
                          <Mono className="font-bold text-primary text-xs">{o.id}</Mono>
                          <Pill
                            tone={o.stage === 5 ? "ok" : o.stage >= 3 ? "cyan" : "warn"}
                            className="text-[10px] py-0 px-1.5"
                          >
                            {o.zone}
                          </Pill>
                        </div>

                        <h3 className="mt-2 text-[14px] font-semibold text-foreground line-clamp-2 leading-snug">
                          {o.description}
                        </h3>

                        <div className="mt-2 text-[11px] text-muted-foreground">
                          <span>{o.contractor}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                          <span className="font-medium text-muted-foreground flex items-center gap-1">
                            <Users className="size-3" />
                            {o.signedOff}/{o.quota}
                          </span>
                          {o.stage < 5 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceStage(o.id);
                              }}
                              className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                              title="Advance to next stage"
                            >
                              Advance <ArrowRight className="size-3" />
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="size-3" /> Gate Active
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {stageOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border/70 rounded-xl p-4 text-center text-muted-foreground text-xs">
                      No permits in {stage.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <Panel bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-slate-50 dark:bg-slate-900 text-left uppercase text-[11px] font-semibold tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Work Order</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Contractor</th>
                  <th className="px-4 py-3">Scheduled Window</th>
                  <th className="px-4 py-3">Quota</th>
                  <th className="px-4 py-3">Stage & Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Mono className="font-bold text-primary">{o.id}</Mono>
                    </td>
                    <td className="px-4 py-3 font-medium max-w-xs">{o.description}</td>
                    <td className="px-4 py-3">
                      <Mono>{o.zone}</Mono>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {o.contractor}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap">
                      {o.scheduled}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-semibold">
                      {o.signedOff}/{o.quota}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={o.stage === 5 ? "ok" : o.stage >= 3 ? "cyan" : "warn"}>
                        Stage {o.stage}: {o.status}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5 h-8 rounded-lg text-xs"
                        onClick={() => setActive(o)}
                      >
                        <QrCode className="size-3.5" /> Inspection & QR
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* DETAIL, QR & AUDIT DIALOG */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl rounded-2xl p-6">
          {active && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <span>Permit Details</span>
                    <Mono className="text-primary font-bold">{active.id}</Mono>
                  </DialogTitle>
                  <Pill tone={active.stage === 5 ? "ok" : "warn"}>
                    Stage {active.stage} · {active.status}
                  </Pill>
                </div>
                <DialogDescription className="text-sm font-medium text-foreground mt-1">
                  {active.description}
                </DialogDescription>
              </DialogHeader>

              {/* Sub-tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as typeof activeTab)}
                className="mt-4"
              >
                <TabsList className="grid grid-cols-4 w-full rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
                  <TabsTrigger value="briefing" className="rounded-lg text-xs font-semibold">
                    <Smartphone className="size-3.5 mr-1.5" /> Briefing & QR
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="rounded-lg text-xs font-semibold">
                    <Clock className="size-3.5 mr-1.5" /> Audit History
                  </TabsTrigger>
                  <TabsTrigger value="attachments" className="rounded-lg text-xs font-semibold">
                    <Paperclip className="size-3.5 mr-1.5" /> Attachments
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="rounded-lg text-xs font-semibold">
                    <MessageSquare className="size-3.5 mr-1.5" /> Comments
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: BRIEFING & SIGNATURE */}
                <TabsContent value="briefing" className="mt-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/30">
                      <QrBlock value={active.id} />
                      <Mono className="mt-3 text-xs text-muted-foreground font-semibold">
                        Scan at morning muster · {active.zone}
                      </Mono>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 gap-1.5 rounded-xl text-xs"
                        onClick={() => toast.success("QR Token downloaded as high-res PNG")}
                      >
                        <Download className="size-3.5" /> Download Scanner Token
                      </Button>
                    </div>

                    {/* Tablet frame */}
                    <div className="rounded-[24px] border-4 border-slate-800 bg-slate-100 p-4 text-slate-900 shadow-xl">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 border-b border-slate-200 pb-2">
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="size-3.5" /> MediInfra Field App
                        </span>
                        <span className="font-mono">P875-MOBILE</span>
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-900">{active.description}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {active.contractor} · Quota: {active.quota} workers
                      </p>

                      <div className="mt-3 rounded-lg bg-white p-2.5 text-[11px] shadow-sm space-y-1.5">
                        <p className="font-bold text-slate-800">Identified Hazards & Controls</p>
                        <div className="flex flex-wrap gap-1">
                          {active.hazards.map((h) => (
                            <span
                              key={h}
                              className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                        <p className="text-slate-600 text-[10px] pt-1">
                          Mandatory PPE: Hard hat, eye protection, safety boots, high-vis vest.
                        </p>
                      </div>

                      <div className="mt-3">
                        <SignatureCanvas
                          onSigned={() => {
                            setSigned((s) => ({ ...s, [active.id]: true }));
                            setOrders((prev) =>
                              prev.map((o) =>
                                o.id === active.id
                                  ? { ...o, signedOff: o.quota, status: "Fully Approved", stage: 5 }
                                  : o,
                              ),
                            );
                            setActive((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    signedOff: prev.quota,
                                    status: "Fully Approved",
                                    stage: 5,
                                  }
                                : null,
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: AUDIT HISTORY */}
                <TabsContent value="audit" className="mt-4 space-y-3">
                  <div className="rounded-xl border border-border p-4 bg-slate-50/50 dark:bg-slate-900/20 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="size-2 rounded-full bg-emerald-500 mt-1.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground">Permit Initialized</p>
                        <p className="text-[11px] text-muted-foreground">
                          Drafted by {active.contractor} HSE Representative · 05:30 AST
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="size-2 rounded-full bg-blue-500 mt-1.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Main Contractor Approval Cleared
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Reviewed by IMAR-Al Sraiya JV Project Manager · 06:15 AST
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="size-2 rounded-full bg-indigo-500 mt-1.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          KEO Consultant Engineering Sign-Off
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Endorsed with conditions: ICRA barrier negative pressure verified · 07:00
                          AST
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="size-2 rounded-full bg-emerald-500 mt-1.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Automatic Turnstile Permission Sync
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {active.quota} RFID EPC credentials enabled at Gates 01–04.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 3: ATTACHMENTS */}
                <TabsContent value="attachments" className="mt-4 space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3">
                      <FileCheck className="size-5 text-primary" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Method_Statement_Rev03.pdf
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Signed by Ashghal Consultant · 4.2 MB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="size-5 text-amber-500" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Risk_Assessment_Matrix.pdf
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Approved by HSE Director · 1.8 MB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">
                      Download
                    </Button>
                  </div>
                </TabsContent>

                {/* TAB 4: COMMENTS */}
                <TabsContent value="comments" className="mt-4 space-y-3">
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1">
                        <span className="font-semibold text-foreground">
                          Eng. Tariq Al-Mansoor (KEO)
                        </span>
                        <span>06:45 AST</span>
                      </div>
                      <p>
                        Ensure dust suppression curtains remain sealed during core drilling near the
                        IPT L3 corridor.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment or consultant instruction…"
                      className="rounded-xl text-xs h-9"
                    />
                    <Button size="sm" className="rounded-xl text-xs">
                      Send
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
