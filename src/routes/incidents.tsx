import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Search,
  Plus,
  ArrowRight,
  Filter,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";

import { useDomainStore } from "@/lib/domain/store";
import type { SafetyIncident, IncidentStatus } from "@/lib/domain/types";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/incidents")({
  component: IncidentsPage,
});

export function IncidentsPage() {
  const { t } = useTranslation();
  const {
    incidents,
    zones,
    contractors,
    workers,
    submitIncident,
    updateIncidentStatus,
    emitBroadcast,
  } = useDomainStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedZone, setSelectedZone] = useState<string>("ALL");
  const [newIncidentOpen, setNewIncidentOpen] = useState(false);

  // Form states for new incident
  const [formType, setFormType] = useState("PPE Non-Compliance");
  const [formSeverity, setFormSeverity] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [formZone, setFormZone] = useState("ZONE-01");
  const [formDesc, setFormDesc] = useState("");

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc: SafetyIncident) => {
      if (selectedStatus !== "ALL" && inc.status !== selectedStatus) return false;
      if (selectedSeverity !== "ALL" && inc.severity !== selectedSeverity) return false;
      if (selectedZone !== "ALL" && inc.zoneId !== selectedZone) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchType = inc.type.toLowerCase().includes(q);
        const matchDesc = inc.description.toLowerCase().includes(q);
        const matchWorker = inc.workerName ? inc.workerName.toLowerCase().includes(q) : false;
        const matchZone = inc.zoneName.toLowerCase().includes(q);
        return matchType || matchDesc || matchWorker || matchZone;
      }
      return true;
    });
  }, [incidents, selectedStatus, selectedSeverity, selectedZone, searchQuery]);

  const kpiOpen = incidents.filter((i) => i.status === "OPEN").length;
  const kpiAction = incidents.filter(
    (i) => i.status === "ACKNOWLEDGED" || i.status === "ASSIGNED" || i.status === "ACTION_IN_PROGRESS"
  ).length;
  const kpiClosed = incidents.filter((i) => i.status === "CLOSED").length;
  const kpiCritical = incidents.filter((i) => i.severity === "Critical").length;

  const handleAdvanceStatus = (inc: SafetyIncident) => {
    const nextStatusMap: Record<IncidentStatus, IncidentStatus> = {
      OPEN: "ACKNOWLEDGED",
      ACKNOWLEDGED: "ASSIGNED",
      ASSIGNED: "ACTION_IN_PROGRESS",
      ACTION_IN_PROGRESS: "CORRECTIVE_ACTION",
      CORRECTIVE_ACTION: "VERIFICATION",
      VERIFICATION: "CLOSED",
      CLOSED: "CLOSED",
    };
    const next = nextStatusMap[inc.status];
    if (next && next !== inc.status) {
      updateIncidentStatus(inc.id, next, {
        assignedTo: "HSE Field Marshal Tariq",
        correctiveAction: "Immediate rectification enforced, worker counseled on OSHA protocol.",
      });
      toast.success(`Incident ${inc.id} advanced to ${next}`);
    }
  };

  const handleBroadcastAlert = (inc: SafetyIncident) => {
    emitBroadcast(
      inc.zoneId,
      `HSE Alert in ${inc.zoneName}: ${inc.type}. All personnel review safety compliance immediately.`,
      inc.severity === "Critical" ? "crit" : "warn"
    );
    toast.success(`Public address audio broadcast dispatched to speakers in ${inc.zoneName}`);
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc.trim()) {
      toast.error("Please provide an incident description.");
      return;
    }
    const zoneObj = zones.find((z) => z.id === formZone);
    submitIncident({
      source: "MANUAL_REPORT",
      zoneId: formZone,
      zoneName: zoneObj?.name || formZone,
      type: formType,
      severity: formSeverity,
      description: formDesc,
      status: "OPEN",
    });
    setFormDesc("");
    setNewIncidentOpen(false);
    toast.success("New HSE incident created successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Safety & HSE Incident Management"
          description="Real-time vision detections, geofence breaches, turnstile bypass alerts, and full 7-stage HSE corrective lifecycle."
          badge={<Pill tone="crit">{kpiOpen} Open Hazards</Pill>}
        />

        <Dialog open={newIncidentOpen} onOpenChange={setNewIncidentOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white shrink-0">
              <Plus className="h-4 w-4 mr-1.5" />
              Report New Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <ShieldAlert className="h-5 w-5" />
                Report Safety Incident / Hazard
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateIncident} className="space-y-4 pt-2">
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Zone Location</label>
                  <Select value={formZone} onValueChange={setFormZone}>
                    <SelectTrigger>
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
                  <label className="font-semibold text-muted-foreground block mb-1">Hazard Category</label>
                  <Select value={formType} onValueChange={setFormType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PPE Non-Compliance">PPE Non-Compliance</SelectItem>
                      <SelectItem value="Unauthorized Zone Entry">Unauthorized Zone Entry</SelectItem>
                      <SelectItem value="Exposed Electrical Conduits">Exposed Electrical Conduits</SelectItem>
                      <SelectItem value="Scaffolding Instability">Scaffolding Instability</SelectItem>
                      <SelectItem value="Hot Works Near Combustibles">Hot Works Near Combustibles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Severity Level</label>
                  <Select value={formSeverity} onValueChange={(v) => setFormSeverity(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Observation Description</label>
                  <Textarea
                    placeholder="Details of the hazard, workers involved, immediate risks..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="h-24"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                Submit Safety Incident
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Open Incidents"
          value={kpiOpen}
          tone="crit"
          sub="Requires HSE Triage"
        />
        <KpiCard
          label="Action In Progress"
          value={kpiAction}
          tone="warn"
          sub="Mitigation Active"
        />
        <KpiCard
          label="Verified & Closed"
          value={kpiClosed}
          tone="ok"
          sub="Resolved This Month"
        />
        <KpiCard
          label="Critical Severity"
          value={kpiCritical}
          tone={kpiCritical > 0 ? "crit" : "ok"}
          sub="Stop-Work Potential"
        />
      </div>

      {/* Filter Bar */}
      <Panel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by incident type, description, worker, zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
                <SelectItem value="ACTION_IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="CORRECTIVE_ACTION">Corrective Action</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-[170px] bg-background">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Zones</SelectItem>
                {zones.map((z) => (
                  <SelectItem key={z.id} value={z.id}>
                    {z.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery || selectedStatus !== "ALL" || selectedSeverity !== "ALL" || selectedZone !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("ALL");
                  setSelectedSeverity("ALL");
                  setSelectedZone("ALL");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {/* Incidents List */}
      <Panel
        title="Active Incident Lifecycle Ledger"
        subtitle={`Showing ${filteredIncidents.length} of ${incidents.length} reported events`}
        action={<Pill tone="cyan">{filteredIncidents.length} Events</Pill>}
      >
        <div className="space-y-4">
          {filteredIncidents.map((inc: SafetyIncident) => (
            <div
              key={inc.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                inc.severity === "Critical"
                  ? "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60"
                  : "bg-card border-border/60"
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Mono className="text-xs font-bold text-primary">{inc.id}</Mono>
                  <Pill tone={inc.severity === "Critical" ? "crit" : inc.severity === "High" ? "warn" : "ok"}>
                    {inc.severity}
                  </Pill>
                  <Pill tone={inc.status === "CLOSED" ? "ok" : "warn"}>{inc.status}</Pill>
                  <span className="text-xs text-muted-foreground font-mono">Source: {inc.source}</span>
                </div>

                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  {inc.type}
                  {inc.workerName && (
                    <span className="text-xs font-normal text-muted-foreground">
                      (Worker: {inc.workerName})
                    </span>
                  )}
                </h3>

                <p className="text-xs text-muted-foreground">{inc.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>Location: <strong className="text-foreground">{inc.zoneName}</strong></span>
                  <span>Reported: <Mono>{inc.createdAt}</Mono></span>
                  {inc.assignedTo && <span>Assigned: <strong className="text-foreground">{inc.assignedTo}</strong></span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleBroadcastAlert(inc)}
                  title="Trigger PA Loudspeaker announcement in this zone"
                >
                  <Megaphone className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  PA Broadcast
                </Button>

                {inc.status !== "CLOSED" && (
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAdvanceStatus(inc)}
                  >
                    Advance Stage
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
