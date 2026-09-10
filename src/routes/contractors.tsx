import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Users,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Search,
  Briefcase,
  FileCheck2,
  AlertTriangle,
  Receipt,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";

import { useDomainStore } from "@/lib/domain/store";
import type {
  Contractor,
  WorkPackage,
  WorkOrder,
  Worker,
  SafetyIncident,
  ContractorClaim,
  PaymentRecord,
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/contractors")({
  component: ContractorsPage,
});

export function ContractorsPage() {
  const { t } = useTranslation();
  const {
    contractors,
    workPackages,
    workOrders,
    workers,
    incidents,
    claims,
    payments,
  } = useDomainStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>("CONT-GC");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailTab, setDetailTab] = useState("overview");

  // Filtered contractors
  const filteredContractors = useMemo(() => {
    return contractors.filter((c: Contractor) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.companyName.toLowerCase().includes(q);
        const matchCode = c.code.toLowerCase().includes(q);
        const matchTrade = c.trade.toLowerCase().includes(q);
        const matchPerson = c.contactPerson.toLowerCase().includes(q);
        return matchName || matchCode || matchTrade || matchPerson;
      }
      return true;
    });
  }, [contractors, searchQuery]);

  // Overall KPIs
  const totalValue = contractors.reduce((acc: number, c: Contractor) => acc + c.contractValue, 0);
  const totalPlannedManpower = contractors.reduce((acc: number, c: Contractor) => acc + c.plannedManpower, 0);
  const totalActualManpower = contractors.reduce((acc: number, c: Contractor) => acc + c.actualManpower, 0);
  const avgSafetyScore =
    contractors.length > 0
      ? Math.round(contractors.reduce((acc: number, c: Contractor) => acc + c.safetyScore, 0) / contractors.length)
      : 0;

  const selectedContractor = useMemo(
    () => contractors.find((c: Contractor) => c.id === selectedContractorId),
    [contractors, selectedContractorId]
  );

  const contractorPackages = useMemo(() => {
    if (!selectedContractorId) return [];
    return workPackages.filter((wp: WorkPackage) => wp.contractorId === selectedContractorId);
  }, [workPackages, selectedContractorId]);

  const contractorWorkOrders = useMemo(() => {
    if (!selectedContractorId) return [];
    return workOrders.filter((wo: WorkOrder) => wo.contractorId === selectedContractorId);
  }, [workOrders, selectedContractorId]);

  const contractorWorkers = useMemo(() => {
    if (!selectedContractorId) return [];
    return workers.filter((w: Worker) => w.contractorId === selectedContractorId);
  }, [workers, selectedContractorId]);

  const contractorIncidents = useMemo(() => {
    if (!selectedContractorId) return [];
    return incidents.filter((inc: SafetyIncident) => inc.contractorId === selectedContractorId);
  }, [incidents, selectedContractorId]);

  const contractorClaims = useMemo(() => {
    if (!selectedContractorId) return [];
    return claims.filter((cl: ContractorClaim) => cl.contractorId === selectedContractorId);
  }, [claims, selectedContractorId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subcontractor Management"
        description="Prequalification compliance, trade packaging, manpower allocations, safety performance, and verified commercial billing."
        badge={<Pill tone="cyan">{contractors.length} Trade Partners</Pill>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Active Contracts"
          value={`QAR ${(totalValue / 1_000_000).toFixed(1)}M`}
          tone="cyan"
          sub="6 Specialized Packages"
        />
        <KpiCard
          label="Mobilized Workforce"
          value={`${totalActualManpower} / ${totalPlannedManpower}`}
          tone="ok"
          sub="Daily Deployment Rate"
        />
        <KpiCard
          label="Average Safety Index"
          value={`${avgSafetyScore}%`}
          tone="ok"
          sub="Zero Critical Non-conformances"
        />
        <KpiCard
          label="Approved Subcontractors"
          value={contractors.length}
          tone="exec"
          sub="100% QID & HSE Verified"
        />
      </div>

      {/* Search Bar */}
      <Panel>
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by contractor name, code, trade, contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          {searchQuery && (
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
              Reset
            </Button>
          )}
        </div>
      </Panel>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContractors.map((c: Contractor) => (
          <div
            key={c.id}
            className={`rounded-[18px] border bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
              selectedContractorId === c.id ? "border-primary ring-1 ring-primary" : "border-border/60"
            }`}
            onClick={() => {
              setSelectedContractorId(c.id);
              setDrawerOpen(true);
            }}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-primary font-bold">{c.code}</span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">{c.companyName}</h3>
                </div>
                <Pill tone={c.status === "Active" ? "ok" : "warn"}>{c.status}</Pill>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Specialized Trade:</span>
                  <span className="font-semibold text-foreground">{c.trade}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Contract Value:</span>
                  <Mono className="font-bold text-foreground">
                    QAR {c.contractValue.toLocaleString()}
                  </Mono>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Contact Lead:</span>
                  <span className="font-medium text-foreground">{c.contactPerson}</span>
                </div>
              </div>

              {/* Progress & Scores */}
              <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-3 text-center">
                <div className="bg-muted/30 p-2 rounded-xl border border-border/40">
                  <span className="text-[11px] text-muted-foreground">Safety Score</span>
                  <p
                    className={`text-base font-bold font-mono ${
                      c.safetyScore >= 90
                        ? "text-emerald-600"
                        : c.safetyScore >= 80
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {c.safetyScore}%
                  </p>
                </div>
                <div className="bg-muted/30 p-2 rounded-xl border border-border/40">
                  <span className="text-[11px] text-muted-foreground">Manpower</span>
                  <p className="text-base font-bold font-mono text-primary">
                    {c.actualManpower} / {c.plannedManpower}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress: {c.progress}%</span>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedContractorId(c.id);
                  setDrawerOpen(true);
                }}
              >
                View 360° Profile
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Contractor 360° Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0 flex flex-col bg-background">
          {selectedContractor ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b bg-muted/20">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-primary">
                      {selectedContractor.code} • {selectedContractor.id}
                    </span>
                    <h2 className="text-2xl font-bold text-foreground mt-0.5">
                      {selectedContractor.companyName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedContractor.trade} Subcontractor Package
                    </p>
                  </div>
                  <Pill tone={selectedContractor.status === "Active" ? "ok" : "warn"}>
                    {selectedContractor.status}
                  </Pill>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t text-xs">
                  <div>
                    <span className="text-muted-foreground">Contract Sum</span>
                    <Mono className="font-bold text-sm block">
                      QAR {selectedContractor.contractValue.toLocaleString()}
                    </Mono>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Billed To Date</span>
                    <Mono className="font-bold text-sm text-primary block">
                      QAR {selectedContractor.totalBilledAmount.toLocaleString()}
                    </Mono>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paid Amount</span>
                    <Mono className="font-bold text-sm text-emerald-600 block">
                      QAR {selectedContractor.totalPaidAmount.toLocaleString()}
                    </Mono>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                value={detailTab}
                onValueChange={setDetailTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="border-b px-4 bg-muted/10">
                  <TabsList className="h-11 bg-transparent p-0 gap-1 inline-flex">
                    <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                    <TabsTrigger value="packages" className="text-xs">
                      Work Packages ({contractorPackages.length})
                    </TabsTrigger>
                    <TabsTrigger value="work-orders" className="text-xs">
                      Work Orders ({contractorWorkOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="workforce" className="text-xs">
                      Workforce ({contractorWorkers.length})
                    </TabsTrigger>
                    <TabsTrigger value="claims" className="text-xs">
                      Claims & Billing ({contractorClaims.length})
                    </TabsTrigger>
                    <TabsTrigger value="safety" className="text-xs">
                      HSE ({contractorIncidents.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  {/* TAB 1: OVERVIEW */}
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Commercial & Contact Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl border">
                      <div>
                        <span className="text-xs text-muted-foreground">Authorized Representative</span>
                        <p className="font-semibold">{selectedContractor.contactPerson}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Phone Number</span>
                        <p className="font-semibold font-mono">{selectedContractor.phone}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Official Email</span>
                        <p className="font-semibold font-mono">{selectedContractor.email}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Cumulative Man-Hours</span>
                        <p className="font-semibold font-mono">{selectedContractor.totalManHours.toLocaleString()} Hours</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: WORK PACKAGES */}
                  <TabsContent value="packages" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Assigned Work Packages
                    </h3>
                    <div className="space-y-3">
                      {contractorPackages.map((wp: WorkPackage) => (
                        <div key={wp.id} className="p-4 border rounded-xl bg-card space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <Mono className="text-xs font-bold text-primary">{wp.id}</Mono>
                              <h4 className="font-semibold text-sm">{wp.name}</h4>
                            </div>
                            <Pill tone="ok">{wp.status}</Pill>
                          </div>
                          <p className="text-xs text-muted-foreground">{wp.description}</p>
                          <div className="flex items-center justify-between text-xs pt-2 border-t text-muted-foreground">
                            <span>Budget: QAR {wp.budget.toLocaleString()}</span>
                            <span>Progress: {wp.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* TAB 3: WORK ORDERS */}
                  <TabsContent value="work-orders" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Active Work Orders & Permits to Work
                    </h3>
                    <div className="space-y-3">
                      {contractorWorkOrders.map((wo: WorkOrder) => (
                        <div key={wo.id} className="p-4 border rounded-xl bg-card space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <Mono className="text-xs font-bold text-primary">{wo.id}</Mono>
                              <h4 className="font-semibold text-sm">{wo.title}</h4>
                            </div>
                            <Pill tone="ok">{wo.status}</Pill>
                          </div>
                          <p className="text-xs text-muted-foreground">{wo.scope}</p>
                          <div className="flex items-center justify-between text-xs pt-2 border-t text-muted-foreground">
                            <span>Assigned Workers: {wo.assignedWorkerIds.length}</span>
                            <span>Progress: {wo.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* TAB 4: WORKFORCE */}
                  <TabsContent value="workforce" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Assigned Labor Roster ({contractorWorkers.length})
                    </h3>
                    <div className="space-y-2">
                      {contractorWorkers.map((w: Worker) => (
                        <div key={w.id} className="p-3 border rounded-xl bg-card text-xs flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar name={w.fullName} size={30} />
                            <div>
                              <p className="font-semibold">{w.fullName}</p>
                              <p className="text-muted-foreground font-mono">{w.id} • {w.trade}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Pill tone={w.inductionStatus === "VALID" ? "ok" : "crit"}>
                              {w.inductionStatus}
                            </Pill>
                            <p className="text-muted-foreground mt-0.5">{w.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* TAB 5: CLAIMS */}
                  <TabsContent value="claims" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Contractor Payment Applications
                    </h3>
                    {contractorClaims.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No claims filed yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {contractorClaims.map((cl: ContractorClaim) => (
                          <div key={cl.id} className="p-4 border rounded-xl bg-card space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <Mono className="text-xs font-bold text-primary">{cl.code}</Mono>
                                <h4 className="font-semibold text-sm">Period: {cl.billingPeriod}</h4>
                              </div>
                              <Pill tone="ok">{cl.status}</Pill>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                              <div>
                                <span className="text-muted-foreground">Man-Hours Claimed</span>
                                <p className="font-bold">{cl.totalManHours} hrs</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Claim Amount</span>
                                <Mono className="font-bold text-primary">
                                  QAR {cl.calculatedAmount.toLocaleString()}
                                </Mono>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 6: SAFETY */}
                  <TabsContent value="safety" className="mt-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      HSE Safety Incidents & Performance
                    </h3>
                    {contractorIncidents.length === 0 ? (
                      <div className="p-6 text-center border rounded-xl bg-muted/10">
                        <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                        <p className="font-semibold text-sm">Exemplary HSE Record</p>
                        <p className="text-xs text-muted-foreground">Zero citations or active non-conformances on site.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {contractorIncidents.map((inc: SafetyIncident) => (
                          <div key={inc.id} className="p-4 border rounded-xl bg-card space-y-2 border-red-200 dark:border-red-900/50">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-red-600 dark:text-red-400">
                                {inc.type}
                              </span>
                              <Pill tone={inc.status === "CLOSED" ? "ok" : "crit"}>{inc.status}</Pill>
                            </div>
                            <p className="text-xs text-muted-foreground">{inc.description}</p>
                            <p className="text-[11px] text-muted-foreground font-mono">Date: {inc.createdAt}</p>
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
