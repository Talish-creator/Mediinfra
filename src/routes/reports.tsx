import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FileCheck,
  FileDown,
  FileText,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mono, PageHeader, Panel, Pill } from "@/components/mediinfra/ui-kit";
import { PROJECT, SUBCONTRACTORS } from "@/lib/mediinfra-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Audit & Compliance Reports — MediInfra" },
      {
        name: "description",
        content:
          "Ashghal and HMC compliance pack: labor returns, HSE incident logs, permit audits and access exception reports.",
      },
      { property: "og:title", content: "Audit & Compliance Reports — MediInfra" },
      {
        property: "og:description",
        content: "Branded compliance report pack for Ashghal and HMC.",
      },
    ],
  }),
  component: ReportsPage,
});

const REPORTS = [
  {
    id: "RPT-01",
    name: "Daily Labor Return (Ashghal Form LR-01)",
    period: "07 Sep 2026",
    owner: "Main Contractor",
    status: "Ready",
    hash: "0x8fa4c219e",
    size: "1.8 MB",
  },
  {
    id: "RPT-02",
    name: "HSE Incident & Near-Miss Register",
    period: "Week 36 (2026)",
    owner: "HSE Command",
    status: "Ready",
    hash: "0x3bc7120a1",
    size: "2.4 MB",
  },
  {
    id: "RPT-03",
    name: "Permit-to-Work Compliance Audit",
    period: "August 2026",
    owner: "KEO International",
    status: "Ready",
    hash: "0x77d19e42f",
    size: "3.1 MB",
  },
  {
    id: "RPT-04",
    name: "Turnstile Access Exception Log",
    period: "07 Sep 2026",
    owner: "Security Command",
    status: "3 exceptions",
    hash: "0x110fb2c4e",
    size: "940 KB",
  },
  {
    id: "RPT-05",
    name: "Infection Control (ICRA) Hoarding Audit",
    period: "Week 36 (2026)",
    owner: "HMC Facilities",
    status: "Ready",
    hash: "0x981ea33bc",
    size: "1.4 MB",
  },
  {
    id: "RPT-06",
    name: "Monthly Manpower Certification Return",
    period: "August 2026",
    owner: "Ashghal / HMC",
    status: "Signed",
    hash: "0x44d901ff8",
    size: "4.8 MB",
  },
];

export function ReportsPage() {
  const [preview, setPreview] = useState<(typeof REPORTS)[number] | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit & Compliance Reports"
        description="Tamper-evident, timestamped returns compiled continuously from RFID turnstile logs and digital work permit sign-offs. Designed for Qatar Civil Defence, Ashghal, and HMC executive audit."
        actions={
          <div className="flex items-center gap-2.5">
            <Pill tone="ok" className="h-9 px-3 text-xs">
              <ShieldCheck className="size-3.5 mr-1" /> Chain-of-Custody SHA-256 Hashing Active
            </Pill>
          </div>
        }
      />

      <Panel
        title="Enterprise Compliance Archive"
        subtitle="Cryptographically sealed daily and weekly compliance returns"
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-slate-50 dark:bg-slate-900 text-left uppercase text-[12px] font-semibold tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Report Ref</th>
                <th className="px-6 py-4">Document Title</th>
                <th className="px-6 py-4">Audit Period</th>
                <th className="px-6 py-4">Issuing Authority</th>
                <th className="px-6 py-4">Integrity Hash</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {REPORTS.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Mono className="text-primary font-bold">{r.id}</Mono>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground max-w-sm">{r.name}</td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{r.period}</td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap font-medium">
                    {r.owner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <Lock className="size-3 text-emerald-500" /> {r.hash}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Pill
                      tone={r.status === "Ready" || r.status === "Signed" ? "ok" : "warn"}
                      className="text-xs"
                    >
                      {r.status}
                    </Pill>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 h-8 rounded-xl text-xs font-semibold"
                      onClick={() => setPreview(r)}
                    >
                      <FileText className="size-3.5" /> Preview & Sign
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Preview Dialog */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-6 text-slate-900 shadow-md mt-2">
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold uppercase tracking-widest text-slate-900/5">
                Official Certified Copy
              </span>
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                Ashghal · Hamad Medical Corporation
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">{preview.name}</h3>
              <p className="text-xs text-slate-600">
                {PROJECT.code} — {PROJECT.name} · Period: {preview.period}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs border-t border-slate-200 pt-3">
                <dt className="text-slate-500 font-medium">Main Contractor</dt>
                <dd className="font-semibold text-slate-900">{PROJECT.contractor}</dd>
                <dt className="text-slate-500 font-medium">Supervising Consultant</dt>
                <dd className="font-semibold text-slate-900">{PROJECT.consultant}</dd>
                <dt className="text-slate-500 font-medium">Report Custodian</dt>
                <dd className="font-semibold text-slate-900">{preview.owner}</dd>
                <dt className="text-slate-500 font-medium">Active Trade Contractors</dt>
                <dd className="font-semibold text-slate-900">
                  {SUBCONTRACTORS.length} Contractors
                </dd>
                <dt className="text-slate-500 font-medium">Chain of Custody Hash</dt>
                <dd className="font-mono text-xs font-bold text-primary">{preview.hash}</dd>
              </dl>

              <p className="mt-5 text-[10px] text-slate-500 border-t border-slate-200 pt-3">
                Generated securely by MediInfra Command Platform v4.2.0-Enterprise. Derived from
                RFID turnstile telemetry and permit-to-work sign-offs; manual alterations
                prohibited.
              </p>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button
              className="gap-2 rounded-xl text-xs font-semibold"
              onClick={() => {
                toast.success(`${preview?.id} exported as cryptographic signed PDF`);
                setPreview(null);
              }}
            >
              <FileDown className="size-4" /> Download Signed Official PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
