import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { useTranslation } from "react-i18next";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Boxes,
  Cpu,
  FileBarChart2,
  Gauge,
  Globe,
  LayoutDashboard,
  Moon,
  ScanLine,
  Search,
  ShieldAlert,
  Siren,
  Sun,
  UserCog,
  Users,
  X,
} from "lucide-react";

import { useMediInfra, type Role } from "@/lib/mediinfra-store";
import { toast } from "sonner";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    toggleTheme,
    theme,
    simulating,
    toggleSimulator,
    startEmergency,
    setRole,
    lang,
    toggleLang,
  } = useMediInfra();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  const runAndClose = (fn: () => void) => {
    fn();
    onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-150"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col w-full">
          <div className="flex items-center border-b border-border px-4 py-3 gap-3 bg-slate-50/50 dark:bg-slate-900/30">
            <Search className="size-5 text-muted-foreground shrink-0" />
            <Command.Input
              placeholder={t("commandPalette.searchPlaceholder")}
              className="w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-muted-foreground text-foreground"
              autoFocus
            />
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-3 space-y-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              {t("commandPalette.noResults")}
            </Command.Empty>

            <Command.Group
              heading={t("commandPalette.navigation")}
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1"
            >
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Globe className="size-4 text-primary" />
                <span>{t("corporate.nav.home")} (Corporate)</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/command" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <LayoutDashboard className="size-4 text-primary" />
                <span>{t("nav.commandCenter")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/command</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/gates" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <ScanLine className="size-4 text-primary" />
                <span>{t("nav.gates")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/gates</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/digital-twin" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Boxes className="size-4 text-primary" />
                <span>{t("nav.digitalTwin")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/digital-twin</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/work-orders" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <BadgeCheck className="size-4 text-primary" />
                <span>{t("nav.workOrders")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/work-orders</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/analytics" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Users className="size-4 text-primary" />
                <span>{t("nav.analytics")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/analytics</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/safety-ai" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <ShieldAlert className="size-4 text-primary" />
                <span>{t("nav.safetyAi")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/safety-ai</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/muster" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Siren className="size-4 text-primary" />
                <span>{t("nav.muster")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/muster</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/hardware" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Cpu className="size-4 text-primary" />
                <span>{t("nav.hardware")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/hardware</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/reports" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <FileBarChart2 className="size-4 text-primary" />
                <span>{t("nav.reports")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/reports</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/reports-center" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <BarChart3 className="size-4 text-primary" />
                <span>{t("nav.reportsCenter")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/reports-center</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/knowledge" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <BookOpen className="size-4 text-primary" />
                <span>{t("nav.knowledge")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/knowledge</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/profile" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <UserCog className="size-4 text-primary" />
                <span>{t("nav.profile")}</span>
                <span className="ms-auto text-xs text-muted-foreground font-mono">/profile</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading={t("commandPalette.actions")}
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1 pt-2"
            >
              <Command.Item
                onSelect={() => runAndClose(toggleLang)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Globe className="size-4 text-primary" />
                <span>{lang === "en" ? t("commandPalette.switchArabic") : t("commandPalette.switchEnglish")}</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runAndClose(() => {
                    toggleSimulator();
                  })
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Gauge className="size-4 text-emerald-500" />
                <span>{t("commandPalette.toggleTelemetry")}</span>
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  runAndClose(() => {
                    startEmergency();
                    navigate({ to: "/muster" });
                  })
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
              >
                <Siren className="size-4 text-red-600" />
                <span>{t("commandPalette.triggerEmergency")}</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(toggleTheme)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="size-4 text-amber-500" />
                ) : (
                  <Moon className="size-4 text-indigo-500" />
                )}
                <span>{t("commandPalette.toggleTheme")}</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading={t("header.authorityPerspective")}
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1 pt-2"
            >
              {(
                [
                  "Ministry of Public Health (MoPH) Auditor",
                  "Ashghal (PWA) Senior Resident Engineer",
                  "Hamad Medical Corporation (HMC) Safety Inspector",
                  "IMAR-Al Sraiya JV Main Contractor",
                  "HSE Field Marshal",
                ] as Role[]
              ).map((r) => (
                <Command.Item
                  key={r}
                  onSelect={() =>
                    runAndClose(() => {
                      setRole(r);
                      toast.success(`Active perspective changed to ${r}`);
                    })
                  }
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
                >
                  <Activity className="size-4 text-blue-500" />
                  <span>{r}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono ms-1">
                  ↓
                </kbd>{" "}
                {t("common.next")} / {t("common.previous")}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">
                  ↵
                </kbd>{" "}
                {t("common.actions")}
              </span>
            </div>
            <span>MediInfra Enterprise v4.2</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
