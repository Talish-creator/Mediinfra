import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Plus,
  Filter,
  BadgeCheck,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

import { useDomainStore } from "@/lib/domain/store";
import type { QualityInspection, QualityChecklistItem } from "@/lib/domain/types";
import {
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

export const Route = createFileRoute("/quality")({
  component: QualityPage,
});

export function QualityPage() {
  const { t } = useTranslation();
  const { inspections, workOrders, submitQualityInspection } = useDomainStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredInspections = useMemo(() => {
    return inspections.filter((ins: QualityInspection) => {
      if (selectedResult !== "ALL" && ins.result !== selectedResult) return false;
      if (selectedStatus !== "ALL" && ins.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ins.workOrderTitle.toLowerCase().includes(q);
        const matchCont = ins.contractorName.toLowerCase().includes(q);
        const matchInsp = ins.inspectorName.toLowerCase().includes(q);
        const matchZone = ins.zoneName.toLowerCase().includes(q);
        return matchTitle || matchCont || matchInsp || matchZone;
      }
      return true;
    });
  }, [inspections, selectedResult, selectedStatus, searchQuery]);

  const kpiTotal = inspections.length;
  const kpiPassed = inspections.filter((i) => i.result === "PASS").length;
  const kpiDefects = inspections.reduce((acc, i) => acc + i.defectsCount, 0);
  const passRate = kpiTotal > 0 ? Math.round((kpiPassed / kpiTotal) * 100) : 100;

  const handleVerifyInspection = (ins: QualityInspection) => {
    submitQualityInspection({
      ...ins,
      status: "VERIFIED_AND_CLOSED",
      signedAt: new Date().toISOString(),
    });
    toast.success(`Inspection ${ins.id} verified and closed.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Assurance & Daily Verification"
        description="Daily QA/QC work verification checklists, consultant approvals, snag logs, and milestone quality sign-offs."
        badge={<Pill tone="ok">QA/QC System Active</Pill>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Total Inspections"
          value={kpiTotal}
          tone="cyan"
          sub="Project P875"
        />
        <KpiCard
          label="First-Time Pass Rate"
          value={`${passRate}%`}
          tone="ok"
          sub="Consultant Benchmark: 90%"
        />
        <KpiCard
          label="Active Defects"
          value={kpiDefects}
          tone={kpiDefects > 0 ? "warn" : "ok"}
          sub="Snag List Items"
        />
        <KpiCard
          label="Closed & Certified"
          value={inspections.filter((i) => i.status === "VERIFIED_AND_CLOSED").length}
          tone="exec"
          sub="QA Sign-Offs"
        />
      </div>

      {/* Filter Bar */}
      <Panel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by work order, contractor, inspector, zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedResult} onValueChange={setSelectedResult}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Results</SelectItem>
                <SelectItem value="PASS">Pass</SelectItem>
                <SelectItem value="CONDITIONAL_PASS">Conditional Pass</SelectItem>
                <SelectItem value="FAIL">Fail</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RECTIFICATION_REQUIRED">Rectification Req.</SelectItem>
                <SelectItem value="VERIFIED_AND_CLOSED">Verified & Closed</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || selectedResult !== "ALL" || selectedStatus !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedResult("ALL");
                  setSelectedStatus("ALL");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {/* Inspections List */}
      <Panel
        title="Inspection Checklists & Verification Records"
        subtitle={`Showing ${filteredInspections.length} of ${inspections.length} records`}
        action={<Pill tone="cyan">{filteredInspections.length} Reports</Pill>}
      >
        <div className="space-y-4">
          {filteredInspections.map((ins: QualityInspection) => (
            <div key={ins.id} className="p-5 rounded-2xl border bg-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Mono className="text-xs font-bold text-primary">{ins.id}</Mono>
                    <span className="text-xs text-muted-foreground font-mono">
                      Ref WO: {ins.workOrderId}
                    </span>
                    <Pill tone={ins.result === "PASS" ? "ok" : ins.result === "FAIL" ? "crit" : "warn"}>
                      {ins.result}
                    </Pill>
                    <Pill tone={ins.status === "VERIFIED_AND_CLOSED" ? "ok" : "warn"}>
                      {ins.status}
                    </Pill>
                  </div>
                  <h3 className="font-bold text-base text-foreground mt-1">
                    {ins.workOrderTitle}
                  </h3>
                </div>

                <div className="text-right text-xs">
                  <p className="font-semibold text-foreground">{ins.contractorName}</p>
                  <p className="text-muted-foreground">{ins.zoneName} • {ins.inspectionDate}</p>
                </div>
              </div>

              {/* Checklist items */}
              <div className="p-3 bg-muted/20 rounded-xl border space-y-2 text-xs">
                <span className="font-bold uppercase text-muted-foreground tracking-wider text-[11px] block">
                  Checklist Items ({ins.checklist.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ins.checklist.map((item: QualityChecklistItem) => (
                    <div key={item.id} className="flex items-center gap-2 p-1.5 rounded bg-background border">
                      {item.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      )}
                      <span className={item.passed ? "text-foreground" : "text-red-600 font-semibold"}>
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {ins.defectNotes && (
                <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                  <strong>Defect Observation:</strong> {ins.defectNotes}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                <span>Inspector: <strong className="text-foreground">{ins.inspectorName} ({ins.inspectorRole})</strong></span>
                {ins.status !== "VERIFIED_AND_CLOSED" ? (
                  <Button size="sm" onClick={() => handleVerifyInspection(ins)}>
                    Verify & Close Inspection
                  </Button>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Signed & Verified
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
