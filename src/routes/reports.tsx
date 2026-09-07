import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
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
  const { t } = useTranslation();
  const [preview, setPreview] = useState<(typeof REPORTS)[number] | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("reports.title")}
        description={t("reports.pageDesc")}
        actions={
          <div className="flex items-center gap-2.5">
            <Pill tone="ok" glow className="h-9 px-3.5 text-xs font-medium">
              <ShieldCheck className="size-3.5 me-1.5 text-[#22C55E]" />{" "}
              {t("reports.chainCustodyActive")}
            </Pill>
          </div>
        }
      />

      <Panel
        title={t("reports.archiveTitle")}
        subtitle={t("reports.archiveSubtitle")}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 border-b border-[#0F172A]/[0.06] bg-[#F8FAFC] text-start uppercase text-[12px] font-semibold tracking-wider text-[#64748B]">
              <tr>
                <th className="px-6 py-4 text-start">{t("reports.colRef")}</th>
                <th className="px-6 py-4 text-start">{t("reports.colTitle")}</th>
                <th className="px-6 py-4 text-start">{t("reports.colPeriod")}</th>
                <th className="px-6 py-4 text-start">{t("reports.colAuthority")}</th>
                <th className="px-6 py-4 text-start">{t("reports.colHash")}</th>
                <th className="px-6 py-4 text-start">{t("common.status")}</th>
                <th className="px-6 py-4 text-end">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F172A]/[0.06]">
              {REPORTS.map((r) => {
                const localizedName = t(`reports.items.${r.id}.name`, r.name);
                const localizedOwner = t(`reports.items.${r.id}.owner`, r.owner);
                const localizedStatus = t(`reports.items.${r.id}.status`, r.status);

                return (
                  <tr key={r.id} className="hover:bg-[#F8FAFC]/90 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <Mono className="text-[#2563EB] font-bold">{r.id}</Mono>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#0F172A] max-w-sm text-start">
                      {localizedName}
                    </td>
                    <td className="px-6 py-4 text-[#64748B] whitespace-nowrap text-start">
                      {r.period}
                    </td>
                    <td className="px-6 py-4 text-[#64748B] whitespace-nowrap font-medium text-start">
                      {localizedOwner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <span className="flex items-center gap-1.5 font-mono text-xs text-[#64748B]">
                        <Lock className="size-3 text-[#22C55E]" /> {r.hash}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <Pill
                        tone={r.status === "Ready" || r.status === "Signed" ? "ok" : "warn"}
                        className="text-xs"
                      >
                        {localizedStatus}
                      </Pill>
                    </td>
                    <td className="px-6 py-4 text-end whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold bg-white border-[#0F172A]/10 hover:border-[#2563EB] hover:text-[#2563EB] shadow-sm transition-all"
                        onClick={() => setPreview(r)}
                      >
                        <FileText className="size-3.5" /> {t("reports.previewSign")}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Preview Dialog */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl rounded-[20px] p-6 border border-[#0F172A]/[0.08] shadow-[0_20px_50px_rgba(2,6,23,0.12)] bg-white text-start">
          <DialogHeader className="text-start">
            <DialogTitle className="text-xl font-bold text-[#0F172A]">
              {preview ? t(`reports.items.${preview.id}.name`, preview.name) : ""}
            </DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="relative overflow-hidden rounded-[18px] border border-[#0F172A]/[0.08] bg-[#F8FAFC]/60 p-6 text-[#0F172A] shadow-sm mt-2 text-start">
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl font-bold uppercase tracking-widest text-[#0F172A]/5 select-none text-center">
                {t("reports.officialCopy")}
              </span>
              <p className="text-[11px] uppercase tracking-widest text-[#64748B] font-bold">
                {t("reports.authorityHeader")}
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#0F172A]">
                {t(`reports.items.${preview.id}.name`, preview.name)}
              </h3>
              <p className="text-xs text-[#64748B]">
                {PROJECT.code} — {PROJECT.name} · {t("reports.periodLabel", { period: preview.period })}
              </p>

              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 text-xs border-t border-[#0F172A]/[0.08] pt-3.5">
                <dt className="text-[#64748B] font-medium">{t("reports.mainContractor")}</dt>
                <dd className="font-semibold text-[#0F172A]">{PROJECT.contractor}</dd>
                <dt className="text-[#64748B] font-medium">{t("reports.supervisingConsultant")}</dt>
                <dd className="font-semibold text-[#0F172A]">{PROJECT.consultant}</dd>
                <dt className="text-[#64748B] font-medium">{t("reports.reportCustodian")}</dt>
                <dd className="font-semibold text-[#0F172A]">
                  {t(`reports.items.${preview.id}.owner`, preview.owner)}
                </dd>
                <dt className="text-[#64748B] font-medium">{t("reports.activeContractors")}</dt>
                <dd className="font-semibold text-[#0F172A]">
                  {t("reports.contractorsCount", { count: SUBCONTRACTORS.length })}
                </dd>
                <dt className="text-[#64748B] font-medium">{t("reports.chainCustodyHash")}</dt>
                <dd className="font-mono text-xs font-bold text-[#2563EB]">{preview.hash}</dd>
              </dl>

              <p className="mt-5 text-[10px] text-[#64748B] border-t border-[#0F172A]/[0.08] pt-3">
                {t("reports.disclaimer")}
              </p>
            </div>
          )}
          <DialogFooter className="mt-4 flex sm:justify-end gap-2">
            <Button
              className="gap-2 h-11 px-5 rounded-xl text-xs font-semibold shadow-sm"
              onClick={() => {
                toast.success(
                  t("reports.toastExported", { id: preview?.id })
                );
                setPreview(null);
              }}
            >
              <FileDown className="size-4" /> {t("reports.downloadOfficialPdf")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
