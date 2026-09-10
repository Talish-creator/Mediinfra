import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Clock,
  CheckCircle2,
  DollarSign,
  Search,
  Filter,
  Check,
  Calendar,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { useDomainStore } from "@/lib/domain/store";
import type { Timesheet } from "@/lib/domain/types";
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

export const Route = createFileRoute("/timesheets")({
  component: TimesheetsPage,
});

export function TimesheetsPage() {
  const { t } = useTranslation();
  const { timesheets, contractors, approveTimesheet } = useDomainStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContractor, setSelectedContractor] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredTimesheets = useMemo(() => {
    return timesheets.filter((ts: Timesheet) => {
      if (selectedContractor !== "ALL" && ts.contractorId !== selectedContractor) return false;
      if (selectedStatus !== "ALL" && ts.approvalStatus !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ts.workerName.toLowerCase().includes(q);
        const matchCont = ts.contractorName.toLowerCase().includes(q);
        const matchWo = ts.workOrderId.toLowerCase().includes(q);
        return matchName || matchCont || matchWo;
      }
      return true;
    });
  }, [timesheets, selectedContractor, selectedStatus, searchQuery]);

  const totalRegularHours = timesheets.reduce((acc, t) => acc + t.regularHours, 0);
  const totalOvertimeHours = timesheets.reduce((acc, t) => acc + t.overtimeHours, 0);
  const totalBillableCost = timesheets.reduce((acc, t) => acc + t.totalCost, 0);
  const pendingCount = timesheets.filter((t) => t.approvalStatus === "PENDING_SUPERVISOR").length;

  const handleApprove = (id: string) => {
    approveTimesheet(id, "Supervisor Signature: Approved on Turnstile Record");
    toast.success(`Timesheet ${id} verified and approved for billing.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Turnstile-Verified Timesheets"
        description="Immutable daily timesheets synthesized from RFID gate turnstile events, calculating regular and overtime billable hours."
        badge={<Pill tone="cyan">RFID Automated Clocking</Pill>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Total Hours Verified"
          value={`${totalRegularHours + totalOvertimeHours} hrs`}
          tone="cyan"
          sub="Turnstile Matched"
        />
        <KpiCard
          label="Overtime Premium"
          value={`${totalOvertimeHours} hrs`}
          tone="warn"
          sub="1.5x Qatari Labor Code"
        />
        <KpiCard
          label="Verified Labor Value"
          value={`QAR ${totalBillableCost.toLocaleString()}`}
          tone="ok"
          sub="Payable to Subcontractors"
        />
        <KpiCard
          label="Pending Sign-Off"
          value={pendingCount}
          tone={pendingCount > 0 ? "warn" : "ok"}
          sub="Supervisor Review"
        />
      </div>

      {/* Filter Bar */}
      <Panel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by worker name, contractor, work order..."
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[190px] bg-background">
                <SelectValue placeholder="Approval Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING_SUPERVISOR">Pending Supervisor</SelectItem>
                <SelectItem value="SUPERVISOR_APPROVED">Supervisor Approved</SelectItem>
                <SelectItem value="COMMERCIAL_VERIFIED">Commercial Verified</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || selectedContractor !== "ALL" || selectedStatus !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedContractor("ALL");
                  setSelectedStatus("ALL");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {/* Timesheet Table */}
      <Panel
        title="Shift Timesheet Ledger"
        subtitle={`Showing ${filteredTimesheets.length} of ${timesheets.length} verified attendance records`}
        action={<Pill tone="cyan">{filteredTimesheets.length} Timesheets</Pill>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Worker & Contractor</th>
                <th className="px-4 py-3">Shift Date</th>
                <th className="px-4 py-3">Turnstile Punch (IN/OUT)</th>
                <th className="px-4 py-3">Regular Hours</th>
                <th className="px-4 py-3">Overtime</th>
                <th className="px-4 py-3">Hourly Rate</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTimesheets.map((ts: Timesheet) => (
                <tr key={ts.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={ts.workerName} size={30} />
                      <div>
                        <p className="font-semibold text-foreground">{ts.workerName}</p>
                        <p className="text-xs text-muted-foreground">{ts.contractorName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium">{ts.date}</span>
                    <p className="text-[11px] text-muted-foreground font-mono">{ts.workOrderId}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <span className="text-emerald-600">{ts.entryTime}</span> →{" "}
                    <span className="text-blue-600">{ts.exitTime}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold">
                    {ts.regularHours}h
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {ts.overtimeHours > 0 ? (
                      <span className="text-amber-600 font-bold">+{ts.overtimeHours}h</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    QAR {ts.hourlyRate}/hr
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                    QAR {ts.totalCost.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={ts.approvalStatus === "SUPERVISOR_APPROVED" ? "ok" : "warn"}>
                      {ts.approvalStatus}
                    </Pill>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ts.approvalStatus === "PENDING_SUPERVISOR" ? (
                      <Button size="sm" onClick={() => handleApprove(ts.id)}>
                        Approve
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
