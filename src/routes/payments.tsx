import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  CheckCircle2,
  DollarSign,
  Search,
  Building,
  ShieldCheck,
  Download,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { useDomainStore } from "@/lib/domain/store";
import type { PaymentRecord, ContractorClaim } from "@/lib/domain/types";
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

export const Route = createFileRoute("/payments")({
  component: PaymentsPage,
});

export function PaymentsPage() {
  const { t } = useTranslation();
  const { payments, claims, disbursePayment } = useDomainStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((p: PaymentRecord) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = p.id.toLowerCase().includes(q);
        const matchBatch = p.treasuryBatchRef.toLowerCase().includes(q);
        const matchCont = p.contractorName.toLowerCase().includes(q);
        return matchId || matchBatch || matchCont;
      }
      return true;
    });
  }, [payments, searchQuery]);

  const totalPaid = payments
    .filter((p) => p.paymentStatus === "PROCESSED" || p.paymentStatus === "RECONCILED")
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingPayments = payments.filter((p) => p.paymentStatus === "PENDING_AUTHORIZATION");
  const pendingAmount = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  const handleDisburse = (claimId: string) => {
    disbursePayment(claimId);
    toast.success("Electronic fund transfer executed via QNB Corporate Gateway.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Treasury & Electronic Disbursements"
        description="Direct corporate bank integration with Qatar National Bank (QNB) for verified subcontractor claim settlements and automated reconciliation."
        badge={<Pill tone="ok">QNB Gateway Connected</Pill>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Total Settled"
          value={`QAR ${(totalPaid / 1_000_000).toFixed(2)}M`}
          tone="ok"
          sub="Bank Reconciled"
        />
        <KpiCard
          label="Pending Disbursement"
          value={`QAR ${(pendingAmount / 1_000).toFixed(0)}k`}
          tone={pendingAmount > 0 ? "warn" : "ok"}
          sub="Authorized Claims"
        />
        <KpiCard
          label="Payment Batches"
          value={payments.length}
          tone="cyan"
          sub="Corporate Transfers"
        />
        <KpiCard
          label="Audit Reconciliation"
          value="100%"
          tone="exec"
          sub="Turnstile-Matched"
        />
      </div>

      {/* Filter Bar */}
      <Panel>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by payment ID, batch reference, contractor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </Panel>

      {/* Payments Table */}
      <Panel
        title="Treasury Disbursement Journal"
        subtitle={`Showing ${filteredPayments.length} of ${payments.length} corporate transfer records`}
        action={<Pill tone="cyan">{filteredPayments.length} Batches</Pill>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Disbursement ID</th>
                <th className="px-4 py-3">Contractor Payee</th>
                <th className="px-4 py-3">Batch Reference</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Net Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Authorized By</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredPayments.map((p: PaymentRecord) => (
                <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <Mono className="text-xs font-bold text-primary">{p.id}</Mono>
                    <p className="text-[11px] text-muted-foreground font-mono">Claim: {p.claimId}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {p.contractorName}
                  </td>
                  <td className="px-4 py-3">
                    <Mono className="text-xs">{p.treasuryBatchRef}</Mono>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {p.paymentMethod}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm font-bold text-primary">
                    QAR {p.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={p.paymentStatus === "PROCESSED" || p.paymentStatus === "RECONCILED" ? "ok" : "warn"}>
                      {p.paymentStatus}
                    </Pill>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {p.authorizedBy}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.paymentStatus === "PENDING_AUTHORIZATION" ? (
                      <Button size="sm" onClick={() => handleDisburse(p.claimId)}>
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Disburse
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Settled
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
