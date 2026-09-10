import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Layers,
  MapPin,
  Shield,
  Users,
  CheckCircle2,
  ChevronRight,
  FolderTree,
  Building,
  HardHat,
} from "lucide-react";

import { useDomainStore } from "@/lib/domain/store";
import type { Building as BuildingType, Floor, Zone, Contractor } from "@/lib/domain/types";
import {
  KpiCard,
  Mono,
  PageHeader,
  Panel,
  Pill,
} from "@/components/mediinfra/ui-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

export function ProjectsPage() {
  const { t } = useTranslation();
  const {
    project,
    buildings,
    floors,
    zones,
    contractors,
    workers,
    workOrders,
  } = useDomainStore();

  const [activeTab, setActiveTab] = useState<"hierarchy" | "facilities" | "zones">("hierarchy");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("BLD-SURG");

  const selectedBuildingFloors = floors.filter((f: Floor) => f.buildingId === selectedBuildingId);
  const selectedBuildingZones = zones.filter((z: Zone) => z.buildingId === selectedBuildingId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project & Organizational Structure"
        description="Multi-tier governance hierarchy, contractual relationships, and facility spatial zone directory for Hamad Hospital P875."
        badge={<Pill tone="cyan">Project Code: {project.code}</Pill>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label="Project Name"
          value={project.name.split(" ")[0] || "Hamad"}
          tone="cyan"
          sub="HMC Expansion P875"
        />
        <KpiCard
          label="Buildings"
          value={buildings.length}
          tone="ok"
          sub={`${floors.length} Levels Defined`}
        />
        <KpiCard
          label="Controlled Zones"
          value={zones.length}
          tone="ok"
          sub="Geofenced & Monitored"
        />
        <KpiCard
          label="Main Contractor"
          value="UCC Holding"
          tone="exec"
          sub="EPC Turnkey Operator"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="hierarchy">Organization</TabsTrigger>
          <TabsTrigger value="facilities">Buildings & Levels</TabsTrigger>
          <TabsTrigger value="zones">Zones & Hazards</TabsTrigger>
        </TabsList>

        {/* TAB 1: ORGANIZATION HIERARCHY */}
        <TabsContent value="hierarchy" className="space-y-6 mt-6">
          <Panel
            title="Multi-Tier Contractual & Command Hierarchy"
            subtitle="Client → Consultant → Main Contractor → Trade Subcontractors → Supervised Crews"
          >
            <div className="space-y-6">
              {/* Level 1: Client */}
              <div className="p-4 rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Client / Employer</span>
                      <h3 className="text-lg font-bold text-foreground">{project.client}</h3>
                    </div>
                  </div>
                  <Pill tone="cyan">Project Owner</Pill>
                </div>
              </div>

              {/* Level 2: Consultant */}
              <div className="ml-6 pl-6 border-l-2 border-primary/40 space-y-4">
                <div className="p-4 rounded-xl border bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Supervising Consultant</span>
                        <h3 className="text-base font-bold text-foreground">{project.consultant}</h3>
                      </div>
                    </div>
                    <Pill tone="exec">Engineering Oversight</Pill>
                  </div>
                </div>

                {/* Level 3: Main Contractor */}
                <div className="ml-6 pl-6 border-l-2 border-primary/40 space-y-4">
                  <div className="p-4 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HardHat className="h-6 w-6 text-emerald-600" />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Main EPC Contractor</span>
                          <h3 className="text-base font-bold text-foreground">{project.mainContractor}</h3>
                        </div>
                      </div>
                      <Pill tone="ok">Site Command</Pill>
                    </div>
                  </div>

                  {/* Level 4: Trade Subcontractors */}
                  <div className="ml-6 pl-6 border-l-2 border-primary/40 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      Approved Trade Subcontractors ({contractors.length})
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {contractors.map((c: Contractor) => (
                        <div key={c.id} className="p-3 border rounded-xl bg-card text-xs flex items-center justify-between">
                          <div>
                            <span className="font-bold text-foreground">{c.companyName}</span>
                            <p className="text-muted-foreground font-mono">{c.code} • {c.trade}</p>
                          </div>
                          <Pill tone={c.status === "Active" ? "ok" : "warn"}>{c.status}</Pill>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 2: FACILITIES & LEVELS */}
        <TabsContent value="facilities" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Building Selection Sidebar */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Project Facilities ({buildings.length})
              </span>
              <div className="space-y-2">
                {buildings.map((b: BuildingType) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBuildingId(b.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      selectedBuildingId === b.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card hover:bg-muted/40 border-border/60"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-mono font-bold block">{b.code}</span>
                      <p className="font-semibold text-sm">{b.name}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            {/* Building Levels Detail */}
            <div className="md:col-span-3 space-y-6">
              {buildings.find((b: BuildingType) => b.id === selectedBuildingId) && (
                <Panel
                  title={buildings.find((b: BuildingType) => b.id === selectedBuildingId)?.name}
                  subtitle={`Total Floors: ${buildings.find((b: BuildingType) => b.id === selectedBuildingId)?.totalFloors} | Gross Area: ${buildings.find((b: BuildingType) => b.id === selectedBuildingId)?.totalArea}`}
                >
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Floor Levels & Permit Density
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedBuildingFloors.map((f: Floor) => (
                        <div key={f.id} className="p-4 border rounded-xl bg-card space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold text-primary">{f.level}</span>
                            <Pill tone="cyan">{f.activePermitsCount} Permits</Pill>
                          </div>
                          <h4 className="font-bold text-sm text-foreground">{f.name}</h4>
                          <p className="text-xs text-muted-foreground">ID: {f.id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: ZONES & HAZARDS */}
        <TabsContent value="zones" className="space-y-6 mt-6">
          <Panel
            title="Spatial Geofenced Zones & Operational Hazard Matrix"
            subtitle="Turnstile readers, BLE mesh sensors, and automated evacuation perimeter containment"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Zone ID & Name</th>
                    <th className="px-4 py-3">Building / Floor</th>
                    <th className="px-4 py-3">Zone Type</th>
                    <th className="px-4 py-3">Hazard Level</th>
                    <th className="px-4 py-3">Occupancy</th>
                    <th className="px-4 py-3">Designated Supervisor</th>
                    <th className="px-4 py-3">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {zones.map((z: Zone) => (
                    <tr key={z.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">
                        <Mono className="text-xs font-bold text-primary block">{z.id}</Mono>
                        <span>{z.name}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {z.buildingId} • {z.level}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium">{z.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Pill
                          tone={
                            z.hazardLevel === "Critical"
                              ? "crit"
                              : z.hazardLevel === "High"
                              ? "warn"
                              : "ok"
                          }
                        >
                          {z.hazardLevel}
                        </Pill>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold">
                          {z.currentOccupancy} / {z.capacity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {z.supervisorName || "Assigned HSE Officer"}
                      </td>
                      <td className="px-4 py-3">
                        <Pill tone={z.restricted ? "warn" : "ok"}>
                          {z.restricted ? "Restricted PTW" : "Standard"}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
