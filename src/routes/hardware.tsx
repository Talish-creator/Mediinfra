import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Antenna,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  HardDrive,
  Network,
  Radio,
  RefreshCw,
  Tags,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Bar,
  Dot,
  KpiCard,
  LivePulse,
  Mono,
  PageHeader,
  Panel,
  Pill,
  SignalIndicator,
  StreamingDots,
} from "@/components/mediinfra/ui-kit";
import { HARDWARE } from "@/lib/mediinfra-data";

export const Route = createFileRoute("/hardware")({
  head: () => ({
    meta: [
      { title: "ELV Hardware & Sensor Telemetry — MediInfra" },
      {
        name: "description",
        content:
          "Health of FXR90 readers, AN440 antennas, portal kits, edge gateways and industrial UPS units on P875.",
      },
      { property: "og:title", content: "ELV Hardware & Sensor Telemetry — MediInfra" },
      {
        property: "og:description",
        content: "Live ELV hardware inventory and network topology health.",
      },
    ],
  }),
  component: HardwarePage,
});

export function HardwarePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("hardware.pageTitle")}
        description={t("hardware.pageDesc")}
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/70 dark:bg-emerald-950/40 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm">
              <LivePulse tone="ok" size="sm" />
              <span>{t("hardware.snmpActive")}</span>
              <SignalIndicator bars={4} activeBars={4} tone="ok" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-10 rounded-xl font-semibold text-xs"
              onClick={() =>
                toast.success(t("hardware.scanSuccess"))
              }
            >
              <RefreshCw className="size-3.5" /> {t("hardware.scanNodes")}
            </Button>
          </div>
        }
      />

      {/* 4 Large KPI Cards (42px) */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        <KpiCard
          label={t("hardware.kpiFixedReaders")}
          value="4 / 4"
          trend="100%"
          trendLabel={t("dashboard.kpiTurnstilesStatus", "uptime")}
          status={t("common.normal", "Operational")}
          tone="cyan"
          spark={[4, 4, 4, 4, 4, 4, 4]}
          footer={
            <p className="text-[11px] text-muted-foreground">{t("hardware.kpiReadersSub")}</p>
          }
        />
        <KpiCard
          label={t("hardware.kpiAntennas")}
          value={`${HARDWARE.antennas.online} / ${HARDWARE.antennas.total}`}
          trend="1.08:1"
          trendLabel={t("hardware.optimalVswr")}
          status={t("hardware.calibrated")}
          tone="ok"
          spark={[32, 32, 32, 32, 32, 32]}
          footer={
            <p className="text-[11px] text-muted-foreground">{t("hardware.kpiAntennasSub")}</p>
          }
        />
        <KpiCard
          label={t("hardware.hardHatTags")}
          value={HARDWARE.tags.issued.toLocaleString()}
          trend="+18"
          trendLabel={t("hardware.tagsIssuedToday")}
          status={t("hardware.tagsActiveStatus")}
          tone="exec"
          spark={[810, 825, 840, 850, 864]}
          footer={
            <p className="text-[11px] text-muted-foreground">{t("hardware.tagsWarehouse")}</p>
          }
        />
        <KpiCard
          label={t("hardware.kpiUpsHealth")}
          value="180 min"
          trend="100%"
          trendLabel={t("hardware.mainsAcNormal")}
          status={t("hardware.protected")}
          tone="warn"
          spark={[100, 100, 100, 100, 100]}
          footer={<p className="text-[11px] text-muted-foreground">{t("hardware.upsModel")}</p>}
        />
      </div>

      {/* Readers and Edge Gateways Panels */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        <Panel
          className="flex flex-col h-full"
          title={t("hardware.fixedReadersTitle")}
          subtitle={t("hardware.readerDiagnosticsSubtitle")}
          bodyClassName="space-y-4 flex-1 flex flex-col justify-between"
        >
          {HARDWARE.readers.map((r) => (
            <div
              key={r.id}
              className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-5 shadow-[0_12px_40px_rgba(2,6,23,0.05)] hover:shadow-[0_20px_50px_rgba(2,6,23,0.08)] hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-white">
                  <Radio className="size-4 text-primary" /> {r.id} · {r.gate}
                </p>
                <Pill
                  tone={r.status === "Online" ? "ok" : "warn"}
                  glow={r.status === "Online"}
                  className="text-[10px]"
                >
                  <LivePulse
                    tone={r.status === "Online" ? "ok" : "warn"}
                    size="sm"
                    className="me-1"
                  />{" "}
                  {r.status}
                </Pill>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs pt-2.5 border-t border-[#0F172A]/[0.05] dark:border-white/[0.06]">
                <div>
                  <span className="text-[#64748B] dark:text-slate-400 text-[11px] block">
                    {t("hardware.ipAddress")}
                  </span>
                  <Mono className="font-semibold text-[#0F172A] dark:text-white text-xs">
                    {r.ip}
                  </Mono>
                </div>
                <div>
                  <span className="text-[#64748B] dark:text-slate-400 text-[11px] block">
                    {t("hardware.rfPower")}
                  </span>
                  <Mono className="font-semibold text-[#0F172A] dark:text-white text-xs">
                    {r.rf} dBm
                  </Mono>
                </div>
                <div>
                  <span className="text-[#64748B] dark:text-slate-400 text-[11px] block">
                    {t("hardware.coreTemp")}
                  </span>
                  <Mono className="font-semibold text-[#0F172A] dark:text-white text-xs">
                    {r.temp}°C
                  </Mono>
                </div>
                <div>
                  <span className="text-[#64748B] dark:text-slate-400 text-[11px] block">
                    {t("hardware.vswr")}
                  </span>
                  <Mono className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {r.vswr.toFixed(2)}:1
                  </Mono>
                </div>
              </div>
            </div>
          ))}
        </Panel>

        <Panel
          className="flex flex-col h-full"
          title={t("hardware.edgeGatewaysUps")}
          subtitle={t("hardware.edgeGatewaysSub")}
          bodyClassName="space-y-4 flex-1 flex flex-col justify-between"
        >
          {HARDWARE.gateways.map((g, i) => {
            const ups = HARDWARE.ups[i]!;
            return (
              <div
                key={g.id}
                className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-5 shadow-[0_12px_40px_rgba(2,6,23,0.05)] transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-white">
                    <Cpu className="size-4 text-primary" /> {g.id} — {g.gate}
                  </p>
                  <Pill tone={g.queue === 0 ? "ok" : "warn"} className="text-[10px]">
                    <HardDrive className="size-3 me-1" /> {t("hardware.unsynced", { count: g.queue })}
                  </Pill>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#64748B] dark:text-slate-400">
                  <span>{t("hardware.uplink")}: {g.uplink}</span>
                  <span>·</span>
                  <span>{t("hardware.diskStorage", { percent: g.disk })}</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs pt-2.5 border-t border-[#0F172A]/[0.05] dark:border-white/[0.06]">
                  <BatteryCharging className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="w-24 text-[#64748B] dark:text-slate-400 text-[11px] truncate">
                    {ups.id}
                  </span>
                  <div className="flex-1">
                    <Bar value={ups.battery} max={100} tone={ups.battery > 90 ? "ok" : "warn"} />
                  </div>
                  <Mono className="font-bold text-[#0F172A] dark:text-white text-xs">
                    {ups.battery}% ({ups.runtime}m)
                  </Mono>
                </div>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* Bottom Hardware Distribution */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        <Panel
          className="flex flex-col h-full"
          title={t("hardware.antennaSpec")}
          subtitle={HARDWARE.antennas.model}
        >
          <p className="flex items-center gap-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            <Antenna className="size-6" /> {HARDWARE.antennas.online} / {HARDWARE.antennas.total}
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {t("hardware.antennaDesc")}
          </p>
        </Panel>

        <Panel title={t("hardware.macroPortals")} subtitle={HARDWARE.portals.model}>
          <p className="text-3xl font-bold text-primary">
            {t("hardware.activeCount", { count: HARDWARE.portals.online, total: HARDWARE.portals.total })}
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {t("hardware.portalsDesc")}
          </p>
        </Panel>

        <Panel title={t("hardware.tagsPopulation")} subtitle={HARDWARE.tags.model}>
          <p className="flex items-center gap-2 text-3xl font-bold text-foreground">
            <Tags className="size-6 text-primary" /> {t("hardware.tagsIssuedCount", { count: HARDWARE.tags.issued })}
          </p>
          <div className="mt-2.5">
            <Bar value={HARDWARE.tags.issued} max={HARDWARE.tags.total} tone="cyan" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("hardware.tagsDesc")}
          </p>
        </Panel>
      </div>

      {/* Network Topology */}
      <Panel
        title={t("hardware.topologyTitle")}
        subtitle={t("hardware.topologySubtitle")}
      >
        <div className="grid-bg rounded-2xl border border-border p-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <div className="rounded-2xl border border-primary/30 bg-blue-50 dark:bg-blue-950/40 p-4 text-center shadow-sm">
              <Network className="mx-auto size-6 text-primary" />
              <p className="mt-2 font-bold text-foreground">{t("hardware.coreSwitch")}</p>
              <Mono className="text-muted-foreground text-[11px]">10.87.5.1 · 48-Port PoE+</Mono>
            </div>
            <div className="hidden md:block h-px w-12 bg-primary/40" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HARDWARE.gateways.map((g) => (
                <div key={g.id} className="rounded-xl border border-border bg-card p-3 shadow-sm">
                  <p className="font-bold text-foreground text-xs">{g.gate}</p>
                  <Mono className="text-[11px] text-muted-foreground">{g.uplink}</Mono>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3.5" /> {t("hardware.primaryOk")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
