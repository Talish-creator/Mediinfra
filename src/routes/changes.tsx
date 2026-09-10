import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  GitPullRequest,
  CheckCircle2,
  DollarSign,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Clock,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { useDomainStore } from "@/lib/domain/store";
import type { ChangeRequest, ChangeStatus } from "@/lib/domain/types";
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

export const Route = createFileRoute("/changes")({
  component: ChangesPage,
});

export function ChangesPage() {
  const { t } = useTranslation();
  const { changeRequests, approveChangeRequest } = useDomainStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredChanges = useMemo(() => {
    return changeRequests.filter((cr: ChangeRequest) => {
      if (selectedStatus !== "ALL" && cr.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = cr.code.toLowerCase().includes(q);
        const matchTitle = cr.title.toLowerCase().includes(q);
        const matchCont = cr.contractorName.toLowerCase().includes(q);
        return matchCode || matchTitle || matchCont;
      }
      return true;
    });
  }, [changeRequests, selectedStatus, searchQuery]);

  const totalCostImpact = changeRequests.reduce((acc, cr) => acc + cr.costImpact, 0);
  const totalDaysImpact = changeRequests.reduce((acc, cr) => acc + cr.scheduleImpactDays, 0);
  const approvedCount = changeRequests.filter(
    (cr) => cr.status === "Approved" || cr.status === "Implemented" || cr.status === "Closed"
  ).length;

  const handleApprove = (cr: ChangeRequest) => {
    approveChangeRequest(cr.id, "Consultant Project Manager", "Eng. Khalid Al-Sulaiti");
    toast.success(`Change Request ${cr.code} approved in multi-tier governance.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Variation Orders & Change Management"
        description="Formal engineering change notices (ECN), scope amendments, cost impact assessments, and multi-tier client/consultant approvals."
        badge={<Pill tone="cyan">Contract Governance</Pill>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Total Variations"
          value={changeRequests.length}
          tone="cyan"
          sub="Scope Notices"
        />
        <KpiCard
          label="Cumulative Cost Impact"
          value={`+QAR ${(totalCostImpact / 1_000).toFixed(0)}k`}
          tone="warn"
          sub="Budget Variance"
        />
        <KpiCard
          label="Schedule Variance"
          value={`+${totalDaysImpact} Days`}
          tone="warn"
          sub="Critical Path Impact"
        />
        <KpiCard
          label="Approved Changes"
          value={approvedCount}
          tone="ok"
          sub="Client Sanctioned"
        />
      </div>

      {/* Filter Bar */}
      <Panel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by variation code, title, contractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[190px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Consultant Review">Consultant Review</SelectItem>
                <SelectItem value="Client Approval">Client Approval</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Implemented">Implemented</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || selectedStatus !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("ALL");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {/* Change Requests List */}
      <Panel
        title="Variation Order Register"
        subtitle={`Showing ${filteredChanges.length} of ${changeRequests.length} scope variation items`}
        action={<Pill tone="cyan">{filteredChanges.length} Changes</Pill>}
      >
        <div className="space-y-4">
          {filteredChanges.map((cr: ChangeRequest) => (
            <div key={cr.id} className="p-5 rounded-2xl border bg-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Mono className="text-xs font-bold text-primary">{cr.code}</Mono>
                    <span className="text-xs text-muted-foreground font-mono">
                      Pkg: {cr.workPackageId}
                    </span>
                    <Pill tone={cr.status === "Approved" || cr.status === "Implemented" ? "ok" : "warn"}>
                      {cr.status}
                    </Pill>
                  </div>
                  <h3 className="font-bold text-base text-foreground mt-1">
                    {cr.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Contractor: <strong className="text-foreground">{cr.contractorName}</strong> • Initiated by: {cr.requestedBy} ({cr.requesterRole})
                  </p>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-xs text-muted-foreground">Cost Impact</span>
                    <Mono className="text-lg font-bold text-primary block">
                      +QAR {cr.costImpact.toLocaleString()}
                    </Mono>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Schedule</span>
                    <Mono className="text-lg font-bold text-amber-600 block">
                      +{cr.scheduleImpactDays} Days
                    </Mono>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl border">
                <strong>Justification & Scope:</strong> {cr.description} ({cr.reason})
              </p>

              {/* Approval Chain */}
              <div className="pt-2 border-t">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Governance Approval Chain
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {cr.approvalChain.map((step, idx) => (
                    <div
                      key={idx}
                      className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        step.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-muted/40 text-muted-foreground border-border/60"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${step.status === "APPROVED" ? "bg-emerald-500" : "bg-slate-400"}`} />
                      <span>{step.role}: <strong>{step.approver}</strong> ({step.status})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                <span>Affected Zones: <strong>{cr.affectedZones.join(", ")}</strong></span>
                {cr.status !== "Approved" && cr.status !== "Implemented" ? (
                  <Button size="sm" onClick={() => handleApprove(cr)}>
                    Approve Next Tier
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Fully Sanctioned & Incorporated
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
