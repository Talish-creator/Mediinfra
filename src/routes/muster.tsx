import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Send, Siren, ShieldCheck, AlertTriangle, CheckCircle2, UserX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  Bar,
  Dot,
  KpiCard,
  LivePulse,
  Mono,
  PageHeader,
  Panel,
  Pill,
  StreamingDots,
} from "@/components/mediinfra/ui-kit";
import { MISSING_PERSONNEL, MUSTER_POINTS } from "@/lib/mediinfra-data";
import { useMediInfra } from "@/lib/mediinfra-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/muster")({
  head: () => ({
    meta: [
      { title: "Life Safety & Emergency Muster — MediInfra" },
      {
        name: "description",
        content:
          "Emergency evacuation command with live muster counts and a missing-personnel manifest for Civil Defence.",
      },
      { property: "og:title", content: "Life Safety & Emergency Muster — MediInfra" },
      {
        property: "og:description",
        content: "Live evacuation accounting and missing personnel triage.",
      },
    ],
  }),
  component: MusterPage,
});

export function MusterPage() {
  const { t } = useTranslation();
  const { emergency, startEmergency, standDown, accounted } = useMediInfra();
  const total = 864;
  const missing = Math.max(0, total - accounted);
  const [search, setSearch] = useState("");

  const filteredMissing = MISSING_PERSONNEL.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.employer.toLowerCase().includes(search.toLowerCase()) ||
      w.lastSeen.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("muster.pageTitle")}
        description={t("muster.pageDesc")}
        actions={
          <div className="flex items-center gap-2.5">
            <Pill tone={emergency ? "crit" : "ok"} className="h-9 px-3 text-xs">
              <Dot tone={emergency ? "crit" : "ok"} pulse={emergency} />
              {emergency ? t("muster.alarmActive") : t("muster.linkArmed")}
            </Pill>
          </div>
        }
      />

      {/* Emergency Status Banner */}
      <div
        className={cn(
          "rounded-[18px] border p-6 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 shadow-[0_12px_40px_rgba(2,6,23,0.05)]",
          emergency
            ? "border-red-500 bg-red-500/10 mi-siren"
            : "border-emerald-200/60 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl shadow-sm",
              emergency ? "bg-red-600 text-white animate-bounce" : "bg-emerald-600 text-white",
            )}
          >
            {emergency ? <Siren className="size-7" /> : <ShieldCheck className="size-7" />}
          </div>
          <div>
            <p
              className={cn(
                "text-lg font-bold uppercase tracking-wider",
                emergency
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-700 dark:text-emerald-300",
              )}
            >
              {emergency
                ? t("muster.bannerActive")
                : t("muster.bannerNormal")}
            </p>
            <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400 font-medium">
              {emergency
                ? t("muster.bannerSubActive")
                : t("muster.bannerSubNormal")}
            </p>
          </div>
        </div>

        <div>
          {emergency ? (
            <Button
              variant="outline"
              onClick={standDown}
              className="h-11 px-5 rounded-xl font-semibold text-xs border-[#0F172A]/[0.08] dark:border-white/10 hover:bg-card"
            >
              {t("muster.restoreGates")}
            </Button>
          ) : (
            <Button
              className="h-11 px-5 rounded-xl gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold text-xs shadow-sm hover:shadow-[0_8px_20px_rgba(239,68,68,0.25)] transition-all hover:-translate-y-0.5 active:translate-y-0"
              onClick={startEmergency}
            >
              <Siren className="size-4" /> {t("muster.initiateAlarmBtn")}
            </Button>
          )}
        </div>
      </div>

      {/* 3 Large KPI Cards (42px) */}
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        <KpiCard
          shimmer={emergency}
          label={t("muster.kpiTotalOnSite")}
          value={total.toLocaleString()}
          sub={t("muster.kpiTotalSub")}
          status={t("muster.kpiTotalStatus")}
          tone="cyan"
          spark={[780, 810, 835, 850, 860, 864]}
        />
        <KpiCard
          shimmer={emergency}
          label={t("muster.kpiAccounted")}
          value={emergency ? accounted.toLocaleString() : 0}
          sub={t("muster.kpiAccountedSub")}
          status={emergency ? `${Math.round((accounted / total) * 100)}% Safe` : t("muster.standingBy")}
          tone="ok"
          spark={emergency ? [0, 180, 390, 580, 720, accounted] : [0, 0, 0, 0, 0]}
        />
        <KpiCard
          shimmer={emergency}
          label={t("muster.kpiMissing")}
          value={emergency ? missing.toLocaleString() : total.toLocaleString()}
          sub={emergency ? t("muster.kpiMissingActiveSub") : t("muster.kpiMissingIdleSub")}
          status={emergency ? `${missing} Remaining` : t("muster.preAlarmBaseline")}
          tone="crit"
          spark={emergency ? [864, 684, 474, 284, 144, missing] : [864, 864, 864, 864]}
        />
      </div>

      {/* Muster Points Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {MUSTER_POINTS.map((m) => {
          const share = emergency ? Math.round((accounted * m.accounted) / 831) : 0;
          return (
            <Panel
              key={m.id}
              className="flex flex-col h-full"
              title={t("muster.musterStation", { id: m.id })}
              subtitle={m.name}
              action={
                <Pill tone={emergency ? "ok" : "muted"} glow={emergency} className="text-xs">
                  <LivePulse tone={emergency ? "ok" : "muted"} size="sm" className="mr-1.5" />
                  MSTR-{m.id}-01
                </Pill>
              }
              bodyClassName="flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold tabular-nums text-foreground">{share}</p>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {t("muster.expectedCount", { count: m.accounted })}
                  </span>
                </div>
                <div className="mt-3">
                  <Bar value={share} max={m.accounted} tone="ok" />
                </div>
              </div>
              <p className="mt-4 text-[12px] text-muted-foreground flex items-center gap-1.5 font-medium pt-3 border-t border-border/40">
                <CheckCircle2 className="size-3.5 text-emerald-500" /> {t("muster.antennaActive")}
              </p>
            </Panel>
          );
        })}
      </div>

      {/* Missing Personnel Triage Register */}
      <Panel
        title={t("muster.unaccountedManifestTitle")}
        subtitle={t("muster.unaccountedManifestSubtitle")}
        action={
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={t("muster.searchMissing")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-72 rounded-xl border border-input bg-background px-3.5 text-xs outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              size="sm"
              className="gap-2 h-10 rounded-xl font-semibold text-xs"
              onClick={() =>
                toast.success(t("muster.manifestTransmitted"), {
                  description: t("muster.manifestDesc", { count: missing || MISSING_PERSONNEL.length }),
                })
              }
            >
              <Send className="size-3.5 rtl:rotate-180" /> {t("muster.transmitCivilDefence")}
            </Button>
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="max-h-[460px] overflow-auto">
          <table className="w-full text-sm" role="grid">
            <thead className="sticky top-0 z-10 border-b border-[#0F172A]/[0.06] dark:border-white/[0.06] bg-[#F8FAFC] dark:bg-slate-900 text-start uppercase text-[12px] font-semibold tracking-wider text-[#64748B] dark:text-slate-400">
              <tr role="row">
                <th className="px-6 py-4 text-start">{t("muster.colWorker")}</th>
                <th className="px-6 py-4 text-start">{t("muster.colEmployer")}</th>
                <th className="px-6 py-4 text-start">{t("muster.colTrade")}</th>
                <th className="px-6 py-4 text-start">{t("muster.colLastRead")}</th>
                <th className="px-6 py-4 text-start">{t("muster.colTriage")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F172A]/[0.05] dark:divide-white/[0.06]">
              {filteredMissing.map((w) => (
                <tr
                  key={w.id}
                  className="hover:bg-[#F8FAFC]/90 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={w.name} size={32} />
                      <div>
                        <p className="font-bold text-[#0F172A] dark:text-white text-sm">{w.name}</p>
                        <Mono className="text-[11px] text-[#64748B] dark:text-slate-400">
                          QID: {w.qid}
                        </Mono>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#64748B] dark:text-slate-400">{w.employer}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-[#0F172A] dark:text-white">
                      {w.trade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Mono className="font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 px-2.5 py-1 rounded-full">
                      {w.lastSeen}
                    </Mono>
                  </td>
                  <td className="px-6 py-4">
                    <Pill tone="crit" className="text-xs font-semibold">
                      <UserX className="size-3 me-1" /> {t("muster.unaccounted")}
                    </Pill>
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
