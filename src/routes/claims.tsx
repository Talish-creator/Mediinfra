import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Receipt,
  CheckCircle2,
  DollarSign,
  Search,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

import { useDomainStore } from "@/lib/domain/store";
import type { ContractorClaim, ClaimStatus } from "@/lib/domain/types";
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

export const Route = createFileRoute("/claims")({
  component: ClaimsPage,
});

export function ClaimsPage() {
  const { t } = useTranslation();
  const { claims, contractors, approveContractorClaim } = useDomainStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredClaims = useMemo(() => {
    return claims.filter((cl: ContractorClaim) => {
      if (selectedStatus !== "ALL" && cl.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = cl.code.toLowerCase().includes(q);
        const matchCont = cl.contractorName.toLowerCase().includes(q);
        const matchPkg = cl.workPackageName.toLowerCase().includes(q);
        return matchCode || matchCont || matchPkg;
      }
      return true;
    });
  }, [claims, selectedStatus, searchQuery]);

  const totalClaimed = claims.reduce((acc, c) => acc + c.calculatedAmount, 0);
  const totalApproved = claims
    .filter((c) => c.status === "Approved" || c.status === "Payment Pending" || c.status === "Paid")
    .reduce((acc, c) => acc + c.calculatedAmount, 0);
  const pendingCount = claims.filter(
    (c) => c.status === "Submitted" || c.status === "Main Contractor Review" || c.status === "Consultant Review"
  ).length;

  const handleApproveClaim = (claim: ContractorClaim) => {
    approveContractorClaim(claim.id, "Consultant Quantity Surveyor", "Eng. Khalid Al-Sulaiti");
    toast.success(`Claim ${claim.code} approved and forwarded to Treasury.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subcontractor Commercial Claims"
        description="Progress payment applications backed by turnstile attendance logs, milestone inspections, and quantity surveyor certifications."
        badge={<Pill tone="cyan">Billing Ledger</Pill>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Total Applications"
          value={`QAR ${(totalClaimed / 1_000_000).toFixed(2)}M`}
          tone="cyan"
          sub="Cumulative Billed"
        />
        <KpiCard
          label="Approved Value"
          value={`QAR ${(totalApproved / 1_000_000).toFixed(2)}M`}
          tone="ok"
          sub="QS Certified"
        />
        <KpiCard
          label="Under Multi-Tier Review"
          value={pendingCount}
          tone={pendingCount > 0 ? "warn" : "ok"}
          sub="Consultant Verification"
        />
        <KpiCard
          label="Settled & Paid"
          value={claims.filter((c) => c.status === "Paid").length}
          tone="exec"
          sub="Bank Disbursed"
        />
      </div>

      {/* Filter Bar */}
      <Panel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by claim code, contractor, work package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[190px] bg-background">
                <SelectValue placeholder="Claim Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Main Contractor Review">Main Contractor Review</SelectItem>
                <SelectItem value="Consultant Review">Consultant Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Payment Pending">Payment Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
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

      {/* Claims List */}
      <Panel
        title="Payment Application Register"
        subtitle={`Showing ${filteredClaims.length} of ${claims.length} subcontractor payment certificates`}
        action={<Pill tone="cyan">{filteredClaims.length} Claims</Pill>}
      >
        <div className="space-y-4">
          {filteredClaims.map((cl: ContractorClaim) => (
            <div key={cl.id} className="p-5 rounded-2xl border bg-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Mono className="text-xs font-bold text-primary">{cl.code}</Mono>
                    <span className="text-xs text-muted-foreground font-mono">
                      Pkg: {cl.workPackageId}
                    </span>
                    <Pill tone={cl.status === "Paid" ? "ok" : cl.status === "Approved" ? "ok" : "warn"}>
                      {cl.status}
                    </Pill>
                  </div>
                  <h3 className="font-bold text-base text-foreground mt-1">
                    {cl.workPackageName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Contractor: <strong className="text-foreground">{cl.contractorName}</strong> • Billing Period: {cl.billingPeriod}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Claim Amount</span>
                  <Mono className="text-xl font-bold text-primary block">
                    QAR {cl.calculatedAmount.toLocaleString()}
                  </Mono>
                </div>
              </div>

              {/* Progress and man-hours details */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-muted/20 border text-xs">
                <div>
                  <span className="text-muted-foreground">Verified Man-Hours</span>
                  <p className="font-semibold font-mono mt-0.5">{cl.totalManHours.toLocaleString()} hrs</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Manpower Count</span>
                  <p className="font-semibold mt-0.5">{cl.totalManpowerCount} Workers</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Physical Progress</span>
                  <p className="font-semibold mt-0.5 text-emerald-600">{cl.verifiedProgressPercentage}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                <span>Supporting Documents: <strong>{cl.supportingDocumentCount} verified attachments</strong></span>
                {cl.status !== "Paid" && cl.status !== "Payment Pending" ? (
                  <Button size="sm" onClick={() => handleApproveClaim(cl)}>
                    Approve & Forward to Treasury
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Ready for Bank Disbursement
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
