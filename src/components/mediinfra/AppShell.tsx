import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Bell,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Cpu,
  FileBarChart2,
  Gauge,
  Globe,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Moon,
  Radio,
  ScanLine,
  Search,
  ShieldAlert,
  Siren,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import { useState, useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { GATES, PROJECT } from "@/lib/mediinfra-data";
import { ROLES, useMediInfra } from "@/lib/mediinfra-store";
import { motion } from "framer-motion";
import { MediInfraLogo } from "./MediInfraLogo";
import { CommandPalette } from "./CommandPalette";
import { Dot, LivePulse, Mono, Pill, SignalIndicator, StreamingDots } from "./ui-kit";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  alert?: boolean;
};

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const {
    lang,
    setLang,
    toggleLang,
    role,
    setRole,
    simulating,
    toggleSimulator,
    headcount,
    emergency,
    startEmergency,
    clock,
    shiftPhase,
    theme,
    toggleTheme,
    throughputPerMin,
  } = useMediInfra();

  const NAV: readonly NavItem[] = useMemo(
    () => [
      { to: "/", label: t("nav.commandCenter"), icon: LayoutDashboard, badge: t("nav.live") },
      { to: "/gates", label: t("nav.gates"), icon: ScanLine },
      { to: "/digital-twin", label: t("nav.digitalTwin"), icon: Boxes, badge: t("nav.threeD") },
      { to: "/work-orders", label: t("nav.workOrders"), icon: BadgeCheck },
      { to: "/analytics", label: t("nav.analytics"), icon: Users },
      { to: "/safety-ai", label: t("nav.safetyAi"), icon: ShieldAlert, alert: true },
      { to: "/muster", label: t("nav.muster"), icon: Siren },
      { to: "/hardware", label: t("nav.hardware"), icon: Cpu },
      { to: "/reports", label: t("nav.reports"), icon: FileBarChart2 },
    ],
    [t],
  );

  const current = NAV.find((n) => n.to === pathname) ?? NAV[0];

  return (
    <div
      className={cn(
        "flex min-h-screen bg-background text-foreground transition-colors duration-200",
        emergency && "mi-emergency",
      )}
    >
      <CommandPalette open={cmdkOpen} onOpenChange={setCmdkOpen} />

      {/* Floating Enterprise Sidebar */}
      <aside
        className={cn(
          "sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-e border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 transition-all duration-300 md:flex select-none",
          collapsed ? "w-[78px]" : "w-[280px]",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#0F172A]/[0.06] dark:border-white/[0.08] px-4">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <MediInfraLogo collapsed={collapsed} size={collapsed ? "md" : "md"} />
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:text-[#0F172A] dark:hover:text-white transition-colors"
              aria-label={t("nav.collapse")}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
          )}
        </div>

        {/* Collapsed expand button */}
        {collapsed && (
          <div className="flex justify-center py-2 border-b border-[#0F172A]/[0.06] dark:border-white/[0.08]">
            <button
              onClick={() => setCollapsed(false)}
              className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:text-[#0F172A] dark:hover:text-white transition-colors"
              aria-label={t("nav.expand")}
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = item.to === pathname;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                className={cn(
                  "group relative flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-200",
                  active
                    ? "text-[#2563EB] dark:text-blue-400 font-semibold"
                    : "text-[#64748B] hover:bg-[#F8FAFC]/80 dark:hover:bg-slate-800/60 hover:text-[#0F172A] dark:hover:text-white",
                  collapsed && "justify-center px-2",
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/40 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3.5 min-w-0 w-full">
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                      active
                        ? "text-[#2563EB] dark:text-blue-400"
                        : "text-[#64748B] group-hover:text-[#0F172A] dark:group-hover:text-white",
                    )}
                  />
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            active
                              ? "bg-[#2563EB] text-white shadow-[0_0_8px_rgba(37,99,235,0.35)]"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.alert && !active && (
                        <span className="size-2 rounded-full bg-amber-500 mi-pulse" />
                      )}
                    </div>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Project & Metrics Status Card */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-4 rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-[0_12px_40px_rgba(2,6,23,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                {t("common.project")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <SignalIndicator bars={4} activeBars={4} tone="ok" />
                <span>Phase 1A / 1B</span>
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">
                {t("header.hospitalName")}
              </p>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#64748B] dark:text-slate-400 font-medium">
                <span>{lang === "ar" ? "الهيكل الخرساني والأعمال الكهروميكانيكية" : "Substructure & MEP"}</span>
                <span className="font-semibold text-[#0F172A] dark:text-white">{lang === "ar" ? "76% مكتمل" : "76% complete"}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] transition-all duration-500"
                  style={{ width: "76%" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0F172A]/[0.05] dark:border-white/[0.06] text-[11px]">
              <div>
                <p className="text-[#64748B] dark:text-slate-400">{t("header.workersOnSite")}</p>
                <p className="font-bold text-[#0F172A] dark:text-white tabular-nums">
                  {t("header.onSiteCount", { count: headcount })}
                </p>
              </div>
              <div>
                <p className="text-[#64748B] dark:text-slate-400">{t("header.safetyScore")}</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {t("header.safetyScoreVal")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="border-t border-[#0F172A]/[0.06] dark:border-white/[0.08] p-3 space-y-2">
          {!collapsed ? (
            <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <LivePulse tone="ok" size="sm" />
                <span>{t("header.elvGateway")}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <StreamingDots tone="ok" />
                <span>42ms</span>
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <LivePulse tone="ok" size="md" className="cursor-pointer" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Top Enterprise Header */}
        <header className="sticky top-0 z-30 border-b border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-slate-900/95 transition-colors">
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
            {/* Left: Mobile Navigation Trigger & Breadcrumb */}
            <div className="flex items-center gap-2.5 min-w-0">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden size-9 rounded-xl border-border hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                    aria-label={t("nav.openMobileMenu")}
                  >
                    <Menu className="size-4 text-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={lang === "ar" ? "right" : "left"}
                  className="w-[300px] p-0 flex flex-col bg-white dark:bg-slate-900 border-e border-[#0F172A]/[0.06] dark:border-white/[0.08]"
                >
                  <div className="flex h-16 items-center justify-between border-b border-[#0F172A]/[0.06] dark:border-white/[0.08] px-5">
                    <MediInfraLogo size="md" />
                  </div>
                  <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
                    {NAV.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150",
                            active
                              ? "bg-primary text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                              : "text-[#64748B] dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:text-[#0F172A] dark:hover:text-white",
                          )}
                        >
                          <Icon
                            className={cn(
                              "size-4 shrink-0",
                              active ? "text-white" : "text-muted-foreground",
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "ms-auto text-[10px] px-1.5 py-0.5 rounded font-bold",
                                active
                                  ? "bg-white/20 text-white"
                                  : "bg-blue-50 dark:bg-blue-950/60 text-primary",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-[#0F172A]/[0.06] dark:border-white/[0.08] p-4 bg-slate-50/50 dark:bg-slate-950/40">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">{t("header.elvGateway")}</span>
                      <span className="text-emerald-600 font-mono flex items-center gap-1.5">
                        <LivePulse tone="ok" size="sm" /> 42ms
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {t("header.liveTurnstileSync")}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <nav className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer font-semibold text-foreground truncate max-w-[130px] sm:max-w-none">
                  {t("header.hospitalName")}
                </span>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-primary font-semibold truncate max-w-[140px] sm:max-w-[220px]">
                  {current?.label}
                </span>
              </nav>
            </div>

            {/* Center: Context Badges */}
            <div className="hidden xl:flex items-center gap-3">
              {/* Project & Client Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-semibold hover:border-primary/50 transition-colors">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <span>{t("header.phase1a")}</span>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64 rounded-xl">
                  <DropdownMenuLabel>{t("header.clientSelection")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-semibold text-primary">
                    {t("header.projectP875")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>{t("header.projectP876")}</DropdownMenuItem>
                  <DropdownMenuItem>{t("header.projectP880")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Client Badge */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="font-semibold text-foreground">{t("header.clientLabel")}</span> {t("header.clientValue")}
              </div>

              {/* Weather in Doha */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <CloudSun className="size-3.5 text-amber-500" />
                <span>{t("header.weatherDoha")}</span>
              </div>

              {/* Shift info */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Radio className="size-3.5 text-emerald-500" />
                <span className="text-foreground font-semibold">{t("header.shiftLabel")}</span>
                <span>{shiftPhase}</span>
              </div>
            </div>

            {/* Right: Controls Suite */}
            <div className="flex items-center gap-2.5 ms-auto">
              {/* Command Palette Trigger */}
              <button
                onClick={() => setCmdkOpen(true)}
                className="hidden lg:flex items-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground transition-all shadow-sm"
              >
                <Search className="size-3.5 text-muted-foreground" />
                <span className="font-medium">{t("header.quickCommand")}</span>
                <kbd className="rounded bg-muted border border-border px-1.5 py-0.5 text-[10px] font-mono font-semibold">
                  ⌘K
                </kbd>
              </button>

              {/* Live Telemetry Simulator Toggle */}
              <label
                className={cn(
                  "hidden sm:flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  simulating
                    ? "border-emerald-300 bg-emerald-50/70 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-border bg-slate-50 dark:bg-slate-900/60 text-muted-foreground",
                )}
              >
                <Gauge
                  className={cn(
                    "size-3.5",
                    simulating ? "text-emerald-600 animate-spin" : "text-muted-foreground",
                  )}
                />
                <span className="hidden md:inline">{t("header.liveStream")}</span>
                <Switch
                  checked={simulating}
                  onCheckedChange={toggleSimulator}
                  aria-label="Live telemetry toggle"
                />
              </label>

              {/* Notifications with Flyout */}
              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative size-9 rounded-xl border-border hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="View notifications"
                  >
                    <Bell className="size-4 text-foreground" />
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 shadow-xl">
                  <DropdownMenuLabel className="flex items-center justify-between py-1.5">
                    <span className="font-bold text-[13px]">{t("header.notifications")}</span>
                    <span className="text-[10px] font-semibold text-primary">{t("header.newAlerts")}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-1 py-1">
                    <div className="rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-semibold text-foreground">
                          {t("header.notif1Title")}
                        </span>
                        <span className="ms-auto text-[10px] text-muted-foreground">06:14</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {t("header.notif1Desc")}
                      </p>
                    </div>
                    <div className="rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-red-500" />
                        <span className="text-xs font-semibold text-foreground">
                          {t("header.notif2Title")}
                        </span>
                        <span className="ms-auto text-[10px] text-muted-foreground">06:08</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {t("header.notif2Desc")}
                      </p>
                    </div>
                    <div className="rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-semibold text-foreground">
                          {t("header.notif3Title")}
                        </span>
                        <span className="ms-auto text-[10px] text-muted-foreground">05:45</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {t("header.notif3Desc")}
                      </p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Switcher */}
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                title={t("header.switchLang")}
              >
                <Globe className="size-3.5 text-primary" />
                <span>{lang === "en" ? "العربية" : "EN"}</span>
              </button>

              {/* Theme Switcher */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="size-9 rounded-xl border-border hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={t("header.toggleTheme")}
              >
                {theme === "dark" ? (
                  <Sun className="size-4 text-amber-500" />
                ) : (
                  <Moon className="size-4 text-slate-700" />
                )}
              </Button>

              {/* Live Qatar AST Clock */}
              <div className="hidden lg:flex items-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-mono">
                <LivePulse tone="ok" size="sm" />
                <span className="text-muted-foreground">{t("header.astTime")}</span>
                <span className="font-semibold text-foreground tabular-nums">{clock}</span>
              </div>

              {/* Executive Profile Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-xl border border-border p-1 pe-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="size-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      JA
                    </div>
                    <div className="hidden sm:block text-start">
                      <p className="text-xs font-semibold leading-none text-foreground">
                        {t("header.directorName")}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        {t("header.directorTitle")}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2 shadow-xl">
                  <DropdownMenuLabel>
                    <p className="font-semibold text-sm">{t("header.directorName")}</p>
                    <p className="text-xs text-muted-foreground">{t("header.directorEmail")}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase">
                    {t("header.authorityPerspective")}
                  </DropdownMenuLabel>
                  {ROLES.map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => setRole(r)}
                      className={cn(
                        "text-xs py-2 rounded-xl cursor-pointer",
                        role === r && "bg-blue-50 dark:bg-blue-950/60 text-primary font-semibold",
                      )}
                    >
                      {r}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-muted-foreground cursor-pointer">
                    {t("header.systemSecurity")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Emergency Evacuation Button */}
              <Button
                size="sm"
                className="gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold h-11 px-4 rounded-xl shadow-sm hover:shadow-[0_8px_20px_rgba(239,68,68,0.25)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                onClick={() => {
                  startEmergency();
                  navigate({ to: "/muster" });
                }}
              >
                <Siren className="size-4 animate-bounce" />
                <span className="hidden sm:inline text-xs tracking-wide">{t("header.emergencyMuster")}</span>
              </Button>
            </div>
          </div>

          {/* Emergency Siren Ribbon */}
          {emergency && (
            <div className="mi-siren border-t border-red-500 bg-red-600/20 px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle className="size-4 animate-pulse" />
              <span>
                {t("header.emergencyBanner")}
              </span>
            </div>
          )}
        </header>

        {/* Page Body */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 flex-1 space-y-8 p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
