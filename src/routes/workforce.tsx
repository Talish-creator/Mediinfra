import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Search,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Flame,
} from "lucide-react";

import { useDomainStore } from "@/lib/domain/store";
import type {
  InductionStatus,
  Worker,
  WorkerStatus,
  AttendanceRecord,
  LocationEvent,
  GateEvent,
  SafetyIncident,
  Timesheet,
  AuditLogEntry,
  WorkerDocument,
  SafetyInduction,
  WorkOrder,
} from "@/lib/domain/types";
import {
  Avatar,
  KpiCard,
  Mono,
  PageHeader,
  Panel,
  Pill,
} from "@/components/mediinfra/ui-kit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const Route = createFileRoute("/workforce")({
  component: WorkforcePage,
});

export function WorkforcePage() {
  const { t } = useTranslation();
  const {
    workers,
    contractors,
    workOrders,
    attendance,
    locationEvents,
    gateEvents,
    incidents,
    timesheets,
    auditLogs,
    workerDocuments,
    safetyInductions,
  } = useDomainStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContractor, setSelectedContractor] = useState<string>("ALL");
  const [selectedTrade, setSelectedTrade] = useState<string>("ALL");
  const [selectedInduction, setSelectedInduction] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>("W-0245");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileTab, setProfileTab] = useState("identity");

  // Filtered workers
  const filteredWorkers = useMemo(() => {
    return workers.filter((w: Worker) => {
      if (selectedContractor !== "ALL" && w.contractorId !== selectedContractor) return false;
      if (selectedTrade !== "ALL" && w.trade !== selectedTrade) return false;
      if (selectedInduction !== "ALL" && w.inductionStatus !== selectedInduction) return false;
      if (selectedStatus !== "ALL" && w.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = w.fullName.toLowerCase().includes(q) || (w.name && w.name.toLowerCase().includes(q));
        const matchId = w.id.toLowerCase().includes(q);
        const matchQid = w.qid.toLowerCase().includes(q);
        const matchRfid = w.rfid.toLowerCase().includes(q);
        const matchTrade = w.trade.toLowerCase().includes(q);
        const matchContractor = w.contractorName.toLowerCase().includes(q);
        return matchName || matchId || matchQid || matchRfid || matchTrade || matchContractor;
      }
      return true;
    });
  }, [workers, selectedContractor, selectedTrade, selectedInduction, selectedStatus, searchQuery]);

  // Unique trades for filter
  const tradeOptions = useMemo(() => {
    const set = new Set(workers.map((w: Worker) => w.trade));
    return Array.from(set).sort();
  }, [workers]);

  // Overall KPIs
  const kpiTotal = workers.length;
  const kpiOnSite = workers.filter((w: Worker) => w.status === "On Site").length;
  const kpiValidInduction = workers.filter((w: Worker) => w.inductionStatus === "VALID").length;
  const kpiAttention = workers.filter(
    (w: Worker) => w.inductionStatus === "EXPIRED" || w.inductionStatus === "NOT_COMPLETED"
  ).length;

  const selectedWorker = useMemo(
    () => workers.find((w: Worker) => w.id === selectedWorkerId),
    [workers, selectedWorkerId]
  );

  const workerDocs = useMemo(() => {
    if (!selectedWorkerId) return [];
    return workerDocuments.filter((d: WorkerDocument) => d.workerId === selectedWorkerId);
  }, [workerDocuments, selectedWorkerId]);

  const workerInductions = useMemo(() => {
    if (!selectedWorkerId) return [];
    return safetyInductions.filter((ind: SafetyInduction) => ind.workerId === selectedWorkerId);
  }, [safetyInductions, selectedWorkerId]);

  const workerWorkOrders = useMemo(() => {
    if (!selectedWorkerId) return [];
    return workOrders.filter((wo: WorkOrder) => wo.assignedWorkerIds.includes(selectedWorkerId));
  }, [workOrders, selectedWorkerId]);

  const workerAttendances = useMemo(() => {
    if (!selectedWorkerId) return [];
    return attendance
      .filter((a: AttendanceRecord) => a.workerId === selectedWorkerId)
      .sort((a: AttendanceRecord, b: AttendanceRecord) => b.timestamp.localeCompare(a.timestamp));
  }, [attendance, selectedWorkerId]);

  const workerGateEvents = useMemo(() => {
    if (!selectedWorkerId) return [];
    return gateEvents
      .filter((g: GateEvent) => g.workerId === selectedWorkerId)
      .sort((a: GateEvent, b: GateEvent) => b.timestamp.localeCompare(a.timestamp));
  }, [gateEvents, selectedWorkerId]);

  const workerLocation = useMemo(() => {
    if (!selectedWorkerId) return undefined;
    return locationEvents
      .filter((loc: LocationEvent) => loc.workerId === selectedWorkerId)
      .slice(-1)[0];
  }, [locationEvents, selectedWorkerId]);

  const workerIncidents = useMemo(() => {
    if (!selectedWorkerId) return [];
    return incidents.filter((inc: SafetyIncident) => inc.workerId === selectedWorkerId);
  }, [incidents, selectedWorkerId]);

  const workerTimesheets = useMemo(() => {
    if (!selectedWorkerId) return [];
    return timesheets.filter((ts: Timesheet) => ts.workerId === selectedWorkerId);
  }, [timesheets, selectedWorkerId]);

  const workerAudit = useMemo(() => {
    if (!selectedWorkerId) return [];
    return auditLogs.filter(
      (log: AuditLogEntry) => log.entityId === selectedWorkerId || log.description.includes(selectedWorkerId)
    );
  }, [auditLogs, selectedWorkerId]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Personnel & Workforce Management"
        description="Centralized digital biometric identity, induction certification, RFID whitelist, and 360° field activity ledger."
        badge={<Pill tone="ok">Project P875 Active</Pill>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Total Registered"
          value={kpiTotal}
          tone="cyan"
          sub="Hamad Hospital P875"
        />
        <KpiCard
          label="Currently On-Site"
          value={kpiOnSite}
          tone="ok"
          sub="RFID Active Whitelist"
        />
        <KpiCard
          label="Valid Induction"
          value={kpiValidInduction}
          tone="ok"
          sub="Full Gate Access"
        />
        <KpiCard
          label="Expired / Pending"
          value={kpiAttention}
          tone="crit"
          sub="Access Restricted"
        />
      </div>

      {/* Filter Toolbar */}
      <Panel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by worker name, QID, RFID tag, trade, contractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedContractor} onValueChange={setSelectedContractor}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Contractor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Contractors</SelectItem>
                {contractors.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTrade} onValueChange={setSelectedTrade}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="Trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Trades</SelectItem>
                {tradeOptions.map((tr) => (
                  <SelectItem key={tr} value={tr}>
                    {tr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedInduction} onValueChange={setSelectedInduction}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Induction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Inductions</SelectItem>
                <SelectItem value="VALID">Valid (Passed)</SelectItem>
                <SelectItem value="EXPIRING_SOON">Expiring Soon</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="NOT_COMPLETED">Not Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="On Site">On Site</SelectItem>
                <SelectItem value="Off Site">Off Site</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery ||
              selectedContractor !== "ALL" ||
              selectedTrade !== "ALL" ||
              selectedInduction !== "ALL" ||
              selectedStatus !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedContractor("ALL");
                  setSelectedTrade("ALL");
                  setSelectedInduction("ALL");
                  setSelectedStatus("ALL");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {/* Workforce Directory Table */}
      <Panel
        title="Personnel Directory"
        subtitle={`Showing ${filteredWorkers.length} of ${workers.length} registered personnel`}
        action={<Pill tone="cyan">{filteredWorkers.length} Workers</Pill>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Worker ID & Name</th>
                <th className="px-4 py-3">QID / Biometric</th>
                <th className="px-4 py-3">RFID Tag</th>
                <th className="px-4 py-3">Contractor</th>
                <th className="px-4 py-3">Trade</th>
                <th className="px-4 py-3">Induction</th>
                <th className="px-4 py-3">Site Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredWorkers.map((w) => {
                return (
                  <tr
                    key={w.id}
                    className={`hover:bg-muted/40 transition-colors cursor-pointer ${
                      selectedWorkerId === w.id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      setSelectedWorkerId(w.id);
                      setDrawerOpen(true);
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={w.fullName} size={32} />
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            {w.fullName}
                            {w.id === "W-0245" && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                                ANCHOR
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {w.id} • {w.name || w.fullName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Mono className="text-xs font-medium">{w.qid}</Mono>
                    </td>
                    <td className="px-4 py-3">
                      <Mono className="text-xs font-semibold text-primary">{w.rfid}</Mono>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-foreground">{w.contractorName}</p>
                      <p className="text-[11px] text-muted-foreground">{w.nationality}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-foreground">{w.trade}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        tone={
                          w.inductionStatus === "VALID"
                            ? "ok"
                            : w.inductionStatus === "EXPIRED"
                            ? "crit"
                            : "warn"
                        }
                      >
                        {w.inductionStatus}
                      </Pill>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            w.status === "On Site"
                              ? "bg-emerald-500 animate-pulse"
                              : w.status === "Suspended"
                              ? "bg-red-500"
                              : "bg-slate-400"
                          }`}
                        />
                        <span className="text-xs font-medium">{w.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWorkerId(w.id);
                          setDrawerOpen(true);
                        }}
                      >
                        Profile 360°
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 13-Tab 360° Profile Sheet Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0 flex flex-col bg-background">
          {selectedWorker ? (
            <div className="flex flex-col h-full">
              {/* Profile Header banner */}
              <div className="p-6 border-b bg-muted/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedWorker.fullName} size={54} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">
                          {selectedWorker.fullName}
                        </h2>
                        <Pill
                          tone={
                            selectedWorker.inductionStatus === "VALID"
                              ? "ok"
                              : selectedWorker.inductionStatus === "EXPIRED"
                              ? "crit"
                              : "warn"
                          }
                        >
                          Induction: {selectedWorker.inductionStatus}
                        </Pill>
                      </div>
                      <p className="text-sm font-arabic text-muted-foreground">
                        {selectedWorker.name || selectedWorker.fullName}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-mono">
                        <span>ID: {selectedWorker.id}</span>
                        <span>•</span>
                        <span>QID: {selectedWorker.qid}</span>
                        <span>•</span>
                        <span>RFID: {selectedWorker.rfid}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedWorker.status === "On Site"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : "bg-slate-500/10 text-slate-600 border border-slate-500/30"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          selectedWorker.status === "On Site" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                        }`}
                      />
                      {selectedWorker.status === "On Site" ? "CURRENTLY ON SITE" : selectedWorker.status}
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Today: {selectedWorker.hoursToday}h logged
                    </p>
                  </div>
                </div>
              </div>

              {/* 13 Tabs Navigation */}
              <Tabs
                value={profileTab}
                onValueChange={setProfileTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="border-b px-4 bg-muted/10 overflow-x-auto">
                  <TabsList className="h-11 bg-transparent p-0 gap-1 inline-flex w-max">
                    <TabsTrigger value="identity" className="text-xs">Identity</TabsTrigger>
                    <TabsTrigger value="qid-rfid" className="text-xs">QID & RFID</TabsTrigger>
                    <TabsTrigger value="contractor" className="text-xs">Contractor</TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs">Documents ({workerDocs.length})</TabsTrigger>
                    <TabsTrigger value="induction" className="text-xs">Induction ({workerInductions.length})</TabsTrigger>
                    <TabsTrigger value="work-orders" className="text-xs">Work Orders ({workerWorkOrders.length})</TabsTrigger>
                    <TabsTrigger value="attendance" className="text-xs">Attendance ({workerAttendances.length})</TabsTrigger>
                    <TabsTrigger value="location" className="text-xs">Location</TabsTrigger>
                    <TabsTrigger value="gates" className="text-xs">Gate Log ({workerGateEvents.length})</TabsTrigger>
                    <TabsTrigger value="safety" className="text-xs">Safety & AI ({workerIncidents.length})</TabsTrigger>
                    <TabsTrigger value="timesheets" className="text-xs">Timesheets ({workerTimesheets.length})</TabsTrigger>
                    <TabsTrigger value="commercial" className="text-xs">Commercial</TabsTrigger>
                    <TabsTrigger value="audit" className="text-xs">Audit Trail ({workerAudit.length})</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  {/* TAB 1: IDENTITY */}
                  <TabsContent value="identity" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Demographics & Bio</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl border">
                      <div>
                        <span className="text-xs text-muted-foreground">Full Legal Name</span>
                        <p className="font-semibold">{selectedWorker.fullName}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Employee Code</span>
                        <p className="font-semibold font-mono">{selectedWorker.employeeCode}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Nationality</span>
                        <p className="font-semibold">{selectedWorker.nationality}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Date Joined Project</span>
                        <p className="font-semibold">{selectedWorker.joinedDate}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Contact Phone</span>
                        <p className="font-semibold font-mono">{selectedWorker.phone}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Emergency Contact</span>
                        <p className="font-semibold font-mono">{selectedWorker.emergencyContact}</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: QID & RFID */}
                  <TabsContent value="qid-rfid" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Biometric & RFID Credential</h3>
                    <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border">
                      <div>
                        <span className="text-xs text-muted-foreground">Qatar ID (QID)</span>
                        <Mono className="font-bold text-sm block">{selectedWorker.qid}</Mono>
                        <span className="text-[11px] text-emerald-600 font-semibold">Verified Biometrics</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">EPC Gen2 RFID Tag</span>
                        <Mono className="font-bold text-sm text-primary block">{selectedWorker.rfid}</Mono>
                        <span className="text-[11px] text-emerald-600 font-semibold">Active in Gate Readers</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-xl bg-card">
                      <span className="text-xs font-semibold text-muted-foreground">BARCODE & TURNSTILE ENCODING</span>
                      <div className="mt-2 h-14 bg-muted flex items-center justify-center font-mono text-xs tracking-widest border rounded">
                        *||| | |||| | ||| {selectedWorker.rfid} ||| | |||*
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 3: CONTRACTOR */}
                  <TabsContent value="contractor" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Subcontractor Affiliation</h3>
                    <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border">
                      <div>
                        <span className="text-xs text-muted-foreground">Contractor Employer</span>
                        <p className="font-bold">{selectedWorker.contractorName}</p>
                        <span className="text-xs font-mono text-muted-foreground">{selectedWorker.contractorId}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Trade / Craft</span>
                        <p className="font-bold">{selectedWorker.trade}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Safety Violations</span>
                        <p className="font-semibold text-red-500">{selectedWorker.safetyViolationsCount}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Hours Logged Today</span>
                        <p className="font-bold font-mono text-primary">{selectedWorker.hoursToday} Hours</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 4: DOCUMENTS */}
                  <TabsContent value="documents" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Compliance Documents & Permits</h3>
                    {workerDocs.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No specific documents uploaded for this worker.</p>
                    ) : (
                      <div className="space-y-2">
                        {workerDocs.map((doc: WorkerDocument) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-xl bg-card">
                            <div className="flex items-center gap-3">
                              <FileCheck2 className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-semibold text-sm">{doc.documentType}</p>
                                <p className="text-xs text-muted-foreground font-mono">Ref: {doc.documentNumber}</p>
                              </div>
                            </div>
                            <div className="text-right text-xs">
                              <p className="text-muted-foreground">Expires: {doc.expiryDate}</p>
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                                {doc.verificationStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 5: INDUCTION */}
                  <TabsContent value="induction" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">HSE Safety Induction Certification</h3>
                    {workerInductions.length === 0 ? (
                      <div className="p-4 border rounded-xl bg-card space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-base">Hamad Hospital P875 Safety Induction</p>
                            <p className="text-xs text-muted-foreground">Certificate Expiry: {selectedWorker.inductionExpiry}</p>
                          </div>
                          <Pill
                            tone={
                              selectedWorker.inductionStatus === "VALID"
                                ? "ok"
                                : selectedWorker.inductionStatus === "EXPIRED"
                                ? "crit"
                                : "warn"
                            }
                          >
                            Status: {selectedWorker.inductionStatus}
                          </Pill>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {workerInductions.map((ind: SafetyInduction) => (
                          <div key={ind.id} className="p-4 border rounded-xl bg-card space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-base">{ind.trainingType}</p>
                                <p className="text-xs text-muted-foreground">Cert: {ind.certificateNumber}</p>
                              </div>
                              <Pill tone={ind.status === "VALID" ? "ok" : "crit"}>
                                {ind.status}
                              </Pill>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-xs bg-muted/20 p-3 rounded-lg border">
                              <div>
                                <span className="text-muted-foreground">Completed</span>
                                <p className="font-semibold mt-0.5">{ind.completedAt}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Expires</span>
                                <p className="font-semibold mt-0.5">{ind.expiresAt}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Score</span>
                                <p className="font-semibold mt-0.5 font-mono text-emerald-600">{ind.score}% (PASS)</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 6: WORK ORDERS */}
                  <TabsContent value="work-orders" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Assigned Work Orders & PTW</h3>
                    {workerWorkOrders.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No work orders currently assigned to this worker.</p>
                    ) : (
                      <div className="space-y-3">
                        {workerWorkOrders.map((wo: WorkOrder) => (
                          <div key={wo.id} className="p-4 border rounded-xl bg-card space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <Mono className="text-xs font-bold text-primary">{wo.id}</Mono>
                                <h4 className="font-semibold text-sm">{wo.title}</h4>
                              </div>
                              <Pill tone="ok">{wo.status}</Pill>
                            </div>
                            <p className="text-xs text-muted-foreground">{wo.scope}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                              <span>Zone: {wo.zoneName}</span>
                              <span>Scheduled: {wo.plannedStart}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 7: ATTENDANCE */}
                  <TabsContent value="attendance" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Turnstile Punch & Attendance History</h3>
                    <div className="space-y-2">
                      {workerAttendances.map((att: AttendanceRecord) => (
                        <div key={att.id} className="flex items-center justify-between p-3 border rounded-xl bg-card text-xs">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded font-bold ${att.direction === "IN" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"}`}>
                              {att.direction}
                            </span>
                            <div>
                              <p className="font-semibold">Turnstile Tap: {att.gateId}</p>
                              <p className="text-muted-foreground font-mono">Source: {att.source}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Mono className="font-semibold">{att.timestamp}</Mono>
                            <p className="text-muted-foreground">{att.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* TAB 8: LOCATION */}
                  <TabsContent value="location" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Live Biometric / RFID Location</h3>
                    {workerLocation ? (
                      <div className="p-4 border rounded-xl bg-card space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span className="font-bold text-sm">Zone: {workerLocation.zoneId}</span>
                          </div>
                          <Pill tone="ok" glow>Live Tracking</Pill>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs bg-muted/20 p-3 rounded-lg border">
                          <div>
                            <span className="text-muted-foreground">Coordinates</span>
                            <Mono className="font-bold block">X: {workerLocation.coordinates.x.toFixed(1)}m, Y: {workerLocation.coordinates.y.toFixed(1)}m</Mono>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Floor / Building</span>
                            <p className="font-semibold">{workerLocation.floorId} • {workerLocation.buildingId}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Heartbeat</span>
                            <Mono className="block">{workerLocation.timestamp}</Mono>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Detection Sensor</span>
                            <p className="font-semibold">{workerLocation.source}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Worker currently off-site or no active spatial coordinates logged.</p>
                    )}
                  </TabsContent>

                  {/* TAB 9: GATES */}
                  <TabsContent value="gates" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Gate Access Decisions & Diagnostic Logs</h3>
                    <div className="space-y-2">
                      {workerGateEvents.map((ev: GateEvent) => (
                        <div key={ev.id} className="p-3 border rounded-xl bg-card text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{ev.gateName} ({ev.lane})</span>
                            <Pill tone={ev.decision === "AUTHORIZED" || ev.decision === "OVERRIDE_AUTHORIZED" ? "ok" : "crit"}>
                              {ev.decision}
                            </Pill>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Direction: {ev.direction}</span>
                            <Mono>{ev.timestamp}</Mono>
                          </div>
                          {ev.denialMessage && (
                            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200/50">
                              Denial Reason: {ev.denialMessage}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* TAB 10: SAFETY */}
                  <TabsContent value="safety" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Safety AI Vision Citations & Incident Log</h3>
                    {workerIncidents.length === 0 ? (
                      <div className="p-6 text-center border rounded-xl bg-muted/10">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-semibold text-sm">Clean Safety Record</p>
                        <p className="text-xs text-muted-foreground">No active PPE violations or safety hazard citations reported.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {workerIncidents.map((inc: SafetyIncident) => (
                          <div key={inc.id} className="p-4 border rounded-xl bg-card space-y-2 border-red-200 dark:border-red-900/50">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                <Flame className="h-4 w-4" />
                                {inc.type}
                              </span>
                              <Pill tone={inc.status === "CLOSED" ? "ok" : "crit"}>{inc.status}</Pill>
                            </div>
                            <p className="text-xs text-muted-foreground">{inc.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                              <span>Zone: {inc.zoneName}</span>
                              <Mono>{inc.createdAt}</Mono>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 11: TIMESHEETS */}
                  <TabsContent value="timesheets" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Turnstile-Verified Timesheet Ledger</h3>
                    {workerTimesheets.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No timesheet records submitted yet for this worker.</p>
                    ) : (
                      <div className="space-y-2">
                        {workerTimesheets.map((ts: Timesheet) => (
                          <div key={ts.id} className="p-3 border rounded-xl bg-card text-xs flex items-center justify-between">
                            <div>
                              <p className="font-bold">Shift: {ts.date}</p>
                              <p className="text-muted-foreground">Regular: {ts.regularHours}h | Overtime: {ts.overtimeHours}h</p>
                            </div>
                            <div className="text-right">
                              <Mono className="font-bold text-primary">{ts.totalCost} QAR</Mono>
                              <Pill tone={ts.approvalStatus === "SUPERVISOR_APPROVED" ? "ok" : "warn"}>{ts.approvalStatus}</Pill>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 12: COMMERCIAL */}
                  <TabsContent value="commercial" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Commercial Labor Cost Attribution</h3>
                    <div className="p-4 border rounded-xl bg-card space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Contractor Billing Allocation</span>
                        <Mono className="font-bold text-primary">{selectedWorker.contractorName}</Mono>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs bg-muted/20 p-3 rounded-lg border">
                        <div>
                          <span className="text-muted-foreground">Hours Worked Today</span>
                          <p className="font-bold mt-0.5 font-mono">{selectedWorker.hoursToday}h</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hours This Week</span>
                          <p className="font-bold mt-0.5 font-mono">{selectedWorker.hoursThisWeek}h</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 13: AUDIT */}
                  <TabsContent value="audit" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Chronological Immutable Audit Log</h3>
                    {workerAudit.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No audit records directly linked to this worker ID.</p>
                    ) : (
                      <div className="space-y-2">
                        {workerAudit.map((log: AuditLogEntry) => (
                          <div key={log.id} className="p-3 border rounded-xl bg-card text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">{log.action}</span>
                              <Mono className="text-muted-foreground">{log.timestamp}</Mono>
                            </div>
                            <p className="text-muted-foreground">{log.description}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">Actor: {log.actor} ({log.role})</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
