import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Smartphone,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  ShieldAlert,
  HardHat,
  PenTool,
  RotateCcw,
  Camera,
  Send,
  Radio,
  FileCheck2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { useDomainStore } from "@/lib/domain/store";
import type { Worker, WorkOrder, AttendanceRecord } from "@/lib/domain/types";
import { Avatar, Mono, PageHeader, Panel, Pill } from "@/components/mediinfra/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/worker-app")({
  component: WorkerAppPage,
});

export function WorkerAppPage() {
  const { t } = useTranslation();
  const {
    workers,
    workOrders,
    attendance,
    zones,
    gates,
    acknowledgeWorkOrder,
    scanRfid,
    submitIncident,
    updateWorkOrderProgress,
  } = useDomainStore();

  const [activeWorkerId, setActiveWorkerId] = useState<string>("W-0245");
  const [activeAppTab, setActiveAppTab] = useState<"badge" | "work" | "briefing" | "punch" | "hazard" | "progress">("badge");

  // Canvas ref for digital signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Form states for hazard report
  const [hazardZone, setHazardZone] = useState("ZONE-01");
  const [hazardType, setHazardType] = useState("Missing Safety Barrier / Edge Protection");
  const [hazardSeverity, setHazardSeverity] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [hazardDesc, setHazardDesc] = useState("");

  // Progress submission state
  const [progressValue, setProgressValue] = useState(65);
  const [progressNotes, setProgressNotes] = useState("");

  const currentWorker = useMemo(
    () => workers.find((w: Worker) => w.id === activeWorkerId) || workers[0]!,
    [workers, activeWorkerId]
  );

  const assignedWorkOrder = useMemo(() => {
    return workOrders.find((wo: WorkOrder) => wo.assignedWorkerIds.includes(currentWorker.id));
  }, [workOrders, currentWorker.id]);

  const recentPunches = useMemo(() => {
    return attendance
      .filter((a: AttendanceRecord) => a.workerId === currentWorker.id)
      .slice(-4)
      .reverse();
  }, [attendance, currentWorker.id]);

  const hasAcknowledged = useMemo(() => {
    if (!assignedWorkOrder) return false;
    return assignedWorkOrder.acknowledgedWorkerIds.includes(currentWorker.id);
  }, [assignedWorkOrder, currentWorker.id]);

  // Digital Signature Canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0]!.clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0]!.clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0]!.clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0]!.clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#2563EB";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSignBriefing = () => {
    if (!assignedWorkOrder) {
      toast.error("No active work order assigned to sign.");
      return;
    }
    const canvas = canvasRef.current;
    const dataUrl = canvas ? canvas.toDataURL() : undefined;
    acknowledgeWorkOrder(currentWorker.id, assignedWorkOrder.id, dataUrl);
    toast.success("Safety Briefing signed and logged to immutable audit trail!");
    setActiveAppTab("work");
  };

  const handlePunchClock = (direction: "IN" | "OUT") => {
    const gate = gates[0]!;
    scanRfid(gate.id, currentWorker.id, direction);
    toast.success(`Turnstile punch ${direction} registered successfully!`);
  };

  const handleHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardDesc.trim()) {
      toast.error("Please enter hazard observation details.");
      return;
    }
    const zoneObj = zones.find((z) => z.id === hazardZone);
    submitIncident({
      source: "MANUAL_REPORT",
      workerId: currentWorker.id,
      workerName: currentWorker.fullName,
      contractorId: currentWorker.contractorId,
      contractorName: currentWorker.contractorName,
      zoneId: hazardZone,
      zoneName: zoneObj?.name || hazardZone,
      type: hazardType,
      severity: hazardSeverity,
      description: `[Worker Mobile Report] ${hazardDesc}`,
      status: "OPEN",
    });
    setHazardDesc("");
    toast.success("HSE incident reported. Field safety marshals alerted.");
    setActiveAppTab("badge");
  };

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedWorkOrder) return;
    updateWorkOrderProgress(assignedWorkOrder.id, progressValue, progressNotes);
    toast.success(`Work Order progress updated to ${progressValue}%`);
    setProgressNotes("");
    setActiveAppTab("work");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Mobile Worker Field Terminal"
        description="Responsive handheld terminal for site personnel: digital biometric badge, permit briefing, digital signatures, turnstile clocking, and hazard reporting."
        badge={<Pill tone="cyan">Mobile Edge PWA</Pill>}
      />

      {/* Worker Persona Switcher */}
      <div className="bg-muted/40 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Active Field Device Profile:
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Select value={activeWorkerId} onValueChange={setActiveWorkerId}>
            <SelectTrigger className="w-[280px] bg-background font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="W-0245">Tariq Al-Mansoor (W-0245, Anchor)</SelectItem>
              <SelectItem value="W-0317">Bilal Ahmed (W-0317, Expired Ind.)</SelectItem>
              <SelectItem value="W-0402">Farhan Khan (W-0402, Unassigned)</SelectItem>
              {workers.slice(3, 8).map((w: Worker) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.fullName} ({w.id}, {w.trade})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Device Frame Simulation */}
      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-[38px] border-4 border-slate-800 dark:border-slate-700 bg-card shadow-2xl overflow-hidden flex flex-col min-h-[720px]">
          {/* Mobile Top Bar */}
          <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between text-xs shrink-0 select-none">
            <span className="font-mono font-semibold">07:22</span>
            <div className="w-16 h-4 bg-slate-800 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Subheader info in App */}
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={currentWorker.fullName} size={38} />
              <div>
                <p className="font-bold text-sm text-foreground">{currentWorker.fullName}</p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {currentWorker.id} • {currentWorker.trade}
                </p>
              </div>
            </div>
            <Pill tone={currentWorker.inductionStatus === "VALID" ? "ok" : "crit"}>
              {currentWorker.inductionStatus}
            </Pill>
          </div>

          {/* App Navigation Icons */}
          <div className="grid grid-cols-6 border-b text-[10px] font-semibold bg-muted/40 text-center py-2 shrink-0">
            <button
              onClick={() => setActiveAppTab("badge")}
              className={`p-1.5 flex flex-col items-center gap-1 transition-colors ${
                activeAppTab === "badge" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>Badge</span>
            </button>
            <button
              onClick={() => setActiveAppTab("work")}
              className={`p-1.5 flex flex-col items-center gap-1 transition-colors ${
                activeAppTab === "work" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <HardHat className="h-4 w-4" />
              <span>PTW</span>
            </button>
            <button
              onClick={() => setActiveAppTab("briefing")}
              className={`p-1.5 flex flex-col items-center gap-1 transition-colors ${
                activeAppTab === "briefing" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <PenTool className="h-4 w-4" />
              <span>Sign</span>
            </button>
            <button
              onClick={() => setActiveAppTab("punch")}
              className={`p-1.5 flex flex-col items-center gap-1 transition-colors ${
                activeAppTab === "punch" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Clock</span>
            </button>
            <button
              onClick={() => setActiveAppTab("hazard")}
              className={`p-1.5 flex flex-col items-center gap-1 transition-colors ${
                activeAppTab === "hazard" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Hazard</span>
            </button>
            <button
              onClick={() => setActiveAppTab("progress")}
              className={`p-1.5 flex flex-col items-center gap-1 transition-colors ${
                activeAppTab === "progress" ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Progress</span>
            </button>
          </div>

          {/* App Body Content */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* TAB 1: DIGITAL BADGE */}
            {activeAppTab === "badge" && (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl border bg-gradient-to-b from-primary/5 to-transparent space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                    Project P875 Digital Gate Pass
                  </span>

                  {/* QR Code Container */}
                  <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-md border flex flex-col items-center justify-center">
                    <QrCode className="w-36 h-36 text-slate-900" />
                    <Mono className="text-[10px] text-slate-600 font-bold mt-1">
                      {currentWorker.rfid}
                    </Mono>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground">{currentWorker.fullName}</h3>
                    <p className="text-xs text-muted-foreground">{currentWorker.contractorName}</p>
                    <Mono className="text-xs font-semibold text-primary mt-1">
                      QID: {currentWorker.qid}
                    </Mono>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-bold text-emerald-600">
                      {currentWorker.status === "On Site" ? "ON SITE" : currentWorker.status}
                    </span>
                  </div>
                </div>

                {assignedWorkOrder ? (
                  <div className="p-3 border rounded-xl bg-card text-left space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{assignedWorkOrder.id}</span>
                      <Pill tone="ok">{assignedWorkOrder.status}</Pill>
                    </div>
                    <p className="font-semibold text-foreground">{assignedWorkOrder.title}</p>
                    <p className="text-muted-foreground">Zone: {assignedWorkOrder.zoneName}</p>
                  </div>
                ) : (
                  <div className="p-3 border rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs">
                    No active work order assigned for today's shift.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WORK ORDER */}
            {activeAppTab === "work" && (
              <div className="space-y-4">
                {assignedWorkOrder ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-2xl bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <Mono className="text-xs font-bold text-primary">{assignedWorkOrder.id}</Mono>
                        <Pill tone="ok">{assignedWorkOrder.status}</Pill>
                      </div>
                      <h3 className="font-bold text-base text-foreground">{assignedWorkOrder.title}</h3>
                      <p className="text-xs text-muted-foreground">{assignedWorkOrder.scope}</p>
                    </div>

                    <div className="p-4 border rounded-2xl bg-card space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Required PPE Checklist
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {assignedWorkOrder.requiredPPE.map((ppe: string) => (
                          <div key={ppe} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium text-[11px]">{ppe}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border rounded-2xl bg-amber-500/10 border-amber-500/30 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Identified Site Hazards</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {assignedWorkOrder.hazards.map((h: string) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>

                    {!hasAcknowledged && (
                      <Button
                        className="w-full"
                        onClick={() => setActiveAppTab("briefing")}
                      >
                        Proceed to Sign Safety Briefing
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center border rounded-2xl bg-muted/20">
                    <HardHat className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-sm">No Active Assignment</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check in with site supervisor or wait for shift allocation.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BRIEFING & SIGNATURE */}
            {activeAppTab === "briefing" && (
              <div className="space-y-4">
                <div className="p-4 border rounded-2xl bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">Daily Toolbox Safety Briefing</h3>
                    {hasAcknowledged && <Pill tone="ok">Acknowledged</Pill>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    I confirm that I have attended the site briefing for Hamad Hospital P875, inspected my PPE, understood the emergency evacuation path, and agree to abide by all Qatari OSHA / HMC safety regulations.
                  </p>

                  <div className="pt-2 border-t space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Digital Signature Touchpad:
                    </span>
                    <div className="border-2 border-dashed border-primary/40 rounded-xl overflow-hidden bg-white dark:bg-slate-950 touch-none">
                      <canvas
                        ref={canvasRef}
                        width={340}
                        height={120}
                        className="w-full cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearSignature}
                        className="text-xs"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Clear Pad
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSignBriefing}
                        disabled={hasAcknowledged}
                      >
                        {hasAcknowledged ? "Signed & Verified" : "Submit Signature"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PUNCH CLOCK */}
            {activeAppTab === "punch" && (
              <div className="space-y-4 text-center">
                <div className="p-6 border rounded-2xl bg-card space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Live Telemetry Clock</span>
                    <Mono className="text-3xl font-bold text-primary block">
                      {new Date().toLocaleTimeString("en-GB")}
                    </Mono>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-16 rounded-xl"
                      onClick={() => handlePunchClock("IN")}
                    >
                      PUNCH IN
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="font-bold h-16 rounded-xl border-2"
                      onClick={() => handlePunchClock("OUT")}
                    >
                      PUNCH OUT
                    </Button>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Connected to Gate 02 (Main North RFID Turnstile)
                  </p>
                </div>

                {/* Recent Punch Activity */}
                <div className="space-y-2 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Recent Turnstile Logs
                  </span>
                  {recentPunches.map((a: AttendanceRecord) => (
                    <div
                      key={a.id}
                      className="p-3 border rounded-xl bg-card text-xs flex items-center justify-between"
                    >
                      <span className="font-bold">{a.direction} — {a.gateId}</span>
                      <Mono className="text-muted-foreground">{a.timestamp}</Mono>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: REPORT HAZARD */}
            {activeAppTab === "hazard" && (
              <form onSubmit={handleHazardSubmit} className="space-y-4">
                <div className="p-4 border rounded-2xl bg-card space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Report On-Site Safety Hazard</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-muted-foreground font-medium block mb-1">Zone Location</label>
                      <Select value={hazardZone} onValueChange={setHazardZone}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((z) => (
                            <SelectItem key={z.id} value={z.id}>
                              {z.name} ({z.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-muted-foreground font-medium block mb-1">Hazard Category</label>
                      <Select value={hazardType} onValueChange={setHazardType}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Missing Safety Barrier / Edge Protection">
                            Missing Barrier / Edge Protection
                          </SelectItem>
                          <SelectItem value="Exposed Electrical Wiring">Exposed Wiring</SelectItem>
                          <SelectItem value="PPE Non-Compliance">PPE Non-Compliance</SelectItem>
                          <SelectItem value="Scaffolding Instability">Scaffolding Instability</SelectItem>
                          <SelectItem value="Hazardous Gas / Fume Leak">Gas / Chemical Odor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-muted-foreground font-medium block mb-1">Severity</label>
                      <Select value={hazardSeverity} onValueChange={(v) => setHazardSeverity(v as any)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical (Immediate Stop Work)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-muted-foreground font-medium block mb-1">
                        Observation Notes
                      </label>
                      <Textarea
                        placeholder="Describe the hazard observation..."
                        value={hazardDesc}
                        onChange={(e) => setHazardDesc(e.target.value)}
                        className="h-20 bg-background"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Transmit Incident Alert
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 6: PROGRESS SUBMISSION */}
            {activeAppTab === "progress" && (
              <form onSubmit={handleProgressSubmit} className="space-y-4">
                <div className="p-4 border rounded-2xl bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">Submit Work Order Progress</h3>
                    <Mono className="text-sm font-bold text-primary">{progressValue}%</Mono>
                  </div>

                  <Slider
                    value={[progressValue]}
                    onValueChange={(vals) => setProgressValue(vals[0]!)}
                    min={0}
                    max={100}
                    step={5}
                  />

                  <div className="space-y-2 text-xs">
                    <label className="text-muted-foreground font-medium block">
                      Shift Execution Summary
                    </label>
                    <Textarea
                      placeholder="Conduits laid in Corridor 02, rough-in boxes aligned..."
                      value={progressNotes}
                      onChange={(e) => setProgressNotes(e.target.value)}
                      className="h-24 bg-background"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <FileCheck2 className="h-4 w-4 mr-2" />
                    Submit Verified Progress
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
