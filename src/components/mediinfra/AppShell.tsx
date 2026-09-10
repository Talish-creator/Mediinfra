import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CloudSun,
  Cpu,
  CreditCard,
  FileBarChart2,
  Flame,
  FolderTree,
  Gauge,
  GitPullRequest,
  Globe,
  History,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Moon,
  Pause,
  Play,
  Radio,
  Receipt,
  RotateCcw,
  ScanLine,
  Search,
  ShieldAlert,
  Siren,
  Smartphone,
  Sparkles,
  StepForward,
  Sun,
  UserCog,
  Users,
  Zap,
} from "lucide-react";
import { useState, useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { GATES, PROJECT } from "@/lib/mediinfra-data";
import { ROLES, useMediInfra } from "@/lib/mediinfra-store";
import { useDomainStore } from "@/lib/domain/store";
import { motion } from "framer-motion";
import { MediInfraLogo } from "./MediInfraLogo";
import { CommandPalette } from "./CommandPalette";
import { Dot, LivePulse, Mono, Pill, SignalIndicator, StreamingDots } from "./ui-kit";

type NavItem = {
  to: string;
  label: string;
  icon: any;
  badge?: string;
  alert?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);

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

  const {
    notifications,
    markNotificationRead,
    runScenario,
    stepScenario,
    pauseScenario,
    resumeScenario,
    resetSimulation,
    isScenarioPaused,
    currentScenarioStepIndex,
    activeScenarioResult,
    activeScenarioNumber,
    clearScenarioResult,
  } = useDomainStore();

  const NAV_GROUPS: NavGroup[] = useMemo(
    () => [
      {
        title: t("nav.categories.operations", "OPERATIONS"),
        items: [
          { to: "/command", label: t("nav.commandCenter"), icon: LayoutDashboard, badge: t("nav.live") },
          { to: "/gates", label: t("nav.gates"), icon: ScanLine },
          { to: "/workforce", label: t("nav.workforce", "Workforce"), icon: Users },
          { to: "/worker-app", label: t("nav.workerApp", "Worker Terminal"), icon: Smartphone },
          { to: "/work-orders", label: t("nav.workOrders"), icon: BadgeCheck },
          { to: "/digital-twin", label: t("nav.digitalTwin"), icon: Boxes, badge: t("nav.threeD") },
          { to: "/muster", label: t("nav.muster"), icon: Siren },
        ],
      },
      {
        title: t("nav.categories.safetyQuality", "SAFETY & QUALITY"),
        items: [
          { to: "/safety-ai", label: t("nav.safetyAi"), icon: ShieldAlert, alert: true },
          { to: "/incidents", label: t("nav.incidents", "HSE Incidents"), icon: Flame },
          { to: "/quality", label: t("nav.quality", "Quality Verification"), icon: CheckCircle2 },
        ],
      },
      {
        title: t("nav.categories.commercial", "COMMERCIAL & FINANCIAL"),
        items: [
          { to: "/contractors", label: t("nav.contractors", "Subcontractors"), icon: Building2 },
          { to: "/timesheets", label: t("nav.timesheets", "Timesheets"), icon: Clock },
          { to: "/claims", label: t("nav.claims", "Claims"), icon: Receipt },
          { to: "/payments", label: t("nav.payments", "Treasury"), icon: CreditCard },
          { to: "/changes", label: t("nav.changes", "Variation Orders"), icon: GitPullRequest },
        ],
      },
      {
        title: t("nav.categories.intelligence", "INTELLIGENCE & ASSETS"),
        items: [
          { to: "/analytics", label: t("nav.analytics"), icon: BarChart3 },
          { to: "/hardware", label: t("nav.hardware"), icon: Cpu },
          { to: "/reports", label: t("nav.reports"), icon: FileBarChart2 },
          { to: "/knowledge", label: t("nav.knowledge"), icon: BookOpen, badge: "DOCS" },
        ],
      },
      {
        title: t("nav.categories.governance", "SYSTEM & GOVERNANCE"),
        items: [
          { to: "/projects", label: t("nav.projects", "Project Structure"), icon: FolderTree },
          { to: "/audit", label: t("nav.audit", "Audit Trail"), icon: History },
          { to: "/profile", label: t("nav.profile"), icon: UserCog, badge: "ME" },
        ],
      },
    ],
    [t],
  );

  const ALL_NAV_ITEMS = useMemo(() => NAV_GROUPS.flatMap((g) => g.items), [NAV_GROUPS]);
  const current = ALL_NAV_ITEMS.find((n) => n.to === pathname) ?? ALL_NAV_ITEMS[0];
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleRunScenario = (num: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => {
    runScenario(num);
    toast.success(`Executed Scenario ${num} successfully. View steps below.`);
  };

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
          collapsed ? "w-[78px]" : "w-[290px]",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#0F172A]/[0.06] dark:border-white/[0.08] px-4">
          <Link to="/command" className="flex items-center gap-3 overflow-hidden">
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

        {/* Navigation grouped links */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block pb-1">
                  {group.title}
                </span>
              )}
              {group.items.map((item) => {
                const active = item.to === pathname;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={item.label}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] font-medium transition-colors duration-200",
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
                    <span className="relative z-10 flex items-center gap-3 min-w-0 w-full">
                      <Icon
                        className={cn(
                          "size-[17px] shrink-0 transition-transform duration-200 group-hover:scale-110",
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
                                "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
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
            </div>
          ))}
        </nav>

        {/* Project & Metrics Status Card */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3.5 rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-[0_12px_40px_rgba(2,6,23,0.05)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                {t("common.project")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <SignalIndicator bars={4} activeBars={4} tone="ok" />
                <span>Phase 1A</span>
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">
                {t("header.hospitalName")}
              </p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-[#64748B] dark:text-slate-400 font-medium">
                <span>{lang === "ar" ? "الهيكل والكهروكيمياء" : "Substructure & MEP"}</span>
                <span className="font-semibold text-[#0F172A] dark:text-white">76%</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
                  style={{ width: "76%" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0F172A]/[0.05] dark:border-white/[0.06] text-[10px]">
              <div>
                <p className="text-[#64748B] dark:text-slate-400">{t("header.workersOnSite")}</p>
                <p className="font-bold text-[#0F172A] dark:text-white tabular-nums">
                  {headcount}
                </p>
              </div>
              <div>
                <p className="text-[#64748B] dark:text-slate-400">{t("header.flowRate")}</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {throughputPerMin}/min
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Floating Topbar */}
        <header className="sticky top-0 z-30 flex flex-col border-b border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2">
            {/* Left: Mobile trigger & context */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile Drawer */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden size-8 sm:size-9 rounded-xl border-border shrink-0"
                    aria-label={t("nav.openMobileMenu")}
                  >
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[82vw] max-w-xs p-0 flex flex-col">
                  <div className="p-4 border-b border-border">
                    <MediInfraLogo size="sm" />
                  </div>
                  <nav className="flex-1 overflow-y-auto p-3 space-y-3">
                    {NAV_GROUPS.map((group) => (
                      <div key={group.title} className="space-y-1">
                        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {group.title}
                        </span>
                        {group.items.map((item) => {
                          const active = item.to === pathname;
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium",
                                active
                                  ? "bg-blue-50 dark:bg-blue-950/60 text-primary font-semibold"
                                  : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900",
                              )}
                            >
                              <Icon className="size-4 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Breadcrumbs with Project Context */}
              <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] font-medium text-muted-foreground min-w-0">
                <span className="font-bold text-foreground">Hamad Hospital P875</span>
                <span className="text-muted-foreground/40 shrink-0">/</span>
                <span className="text-primary font-semibold truncate max-w-[160px]">
                  {current?.label}
                </span>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 ms-auto shrink-0">
              {/* Scenario Simulator Modal Trigger Button */}
              <Button
                size="sm"
                onClick={() => setScenarioModalOpen(true)}
                className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl shadow-sm hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              >
                <Zap className="size-3.5 sm:size-4 animate-pulse text-amber-300 shrink-0" />
                <span className="hidden sm:inline text-xs font-bold tracking-wide">
                  Test Scenarios (1–8)
                </span>
                <span className="sm:hidden text-xs font-bold">1–8</span>
              </Button>

              {/* Command Palette Trigger */}
              <button
                onClick={() => setCmdkOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 size-8 sm:size-9 lg:w-auto lg:px-3 lg:py-1.5 text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground transition-all shadow-sm shrink-0"
                title={t("header.quickCommand")}
              >
                <Search className="size-3.5 sm:size-4 text-muted-foreground shrink-0" />
                <span className="font-medium hidden lg:inline">{t("header.quickCommand")}</span>
                <kbd className="hidden lg:inline rounded bg-muted border border-border px-1.5 py-0.5 text-[10px] font-mono font-semibold">
                  ⌘K
                </kbd>
              </button>

              {/* Notifications Dropdown */}
              <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative size-8 sm:size-9 rounded-xl border-border hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                    aria-label="View notifications"
                  >
                    <Bell className="size-3.5 sm:size-4 text-foreground" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 shadow-xl max-h-96 overflow-y-auto">
                  <DropdownMenuLabel className="flex items-center justify-between py-1.5">
                    <span className="font-bold text-[13px]">Operational Notifications</span>
                    <span className="text-[10px] font-semibold text-primary">
                      {unreadNotifsCount} Unread
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-1 py-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground p-3 text-center">No notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={cn(
                            "rounded-xl p-2.5 transition-colors cursor-pointer",
                            !n.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-900",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "size-2 rounded-full",
                                n.severity === "crit"
                                  ? "bg-red-500"
                                  : n.severity === "warn"
                                  ? "bg-amber-500"
                                  : "bg-blue-500",
                              )}
                            />
                            <span className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                              {n.title}
                            </span>
                            <span className="ms-auto text-[10px] text-muted-foreground font-mono">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Switcher */}
              <button
                onClick={toggleLang}
                className="flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 h-8 sm:h-9 px-2 sm:px-2.5 text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm shrink-0"
                title={t("header.switchLang")}
              >
                <Globe className="size-3 sm:size-3.5 text-primary shrink-0" />
                <span className="font-bold">{lang === "en" ? "العربية" : "EN"}</span>
              </button>

              {/* Theme Switcher */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="hidden sm:inline-flex size-8 sm:size-9 rounded-xl border-border hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                aria-label={t("header.toggleTheme")}
              >
                {theme === "dark" ? (
                  <Sun className="size-3.5 sm:size-4 text-amber-500" />
                ) : (
                  <Moon className="size-3.5 sm:size-4 text-slate-700" />
                )}
              </Button>

              {/* Live Qatar AST Clock */}
              <div className="hidden xl:flex items-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-2.5 sm:px-3 py-1.5 text-xs font-mono shrink-0 whitespace-nowrap">
                <LivePulse tone="ok" size="sm" />
                <span className="text-muted-foreground">AST (UTC+3)</span>
                <span className="font-semibold text-foreground tabular-nums">{clock}</span>
              </div>

              {/* Emergency Evacuation Button */}
              <Button
                size="sm"
                className="gap-1 sm:gap-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold h-8 sm:h-9 px-2 sm:px-3 rounded-xl shadow-sm hover:shadow-[0_8px_20px_rgba(239,68,68,0.25)] transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0"
                onClick={() => {
                  startEmergency();
                  navigate({ to: "/muster" });
                }}
                title={t("header.emergencyMuster")}
              >
                <Siren className="size-3.5 sm:size-4 animate-bounce shrink-0" />
                <span className="hidden sm:inline text-xs font-bold tracking-wide">
                  {t("header.emergencyMuster")}
                </span>
              </Button>
            </div>
          </div>

          {/* Emergency Siren Ribbon */}
          {emergency && (
            <div className="mi-siren border-t border-red-500 bg-red-600/20 px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle className="size-4 animate-pulse" />
              <span>{t("header.emergencyBanner")}</span>
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

      {/* Floating 6-Scenario Simulator Modal */}
      <Dialog open={scenarioModalOpen} onOpenChange={setScenarioModalOpen}>
        <DialogContent className="w-full sm:max-w-3xl max-h-[88vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>Enterprise Simulation Suite (Scenarios 1 – 8)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Execute comprehensive real-world operational scenarios across turnstiles, spatial geofencing, AI vision, quality gates, emergency muster, timesheets, and treasury.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Scenario 1 */}
            <div className="p-4 border rounded-2xl bg-card space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Scenario 1
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  Full End-to-End Operational Lifecycle (W-0245)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Valid induction → Assigned WO-1027 → Briefing signed → Turnstile authorized → Location tracked → Timesheet approved → Commercial claim → QNB payment disbursed.
                </p>
              </div>
              <Button
                size="sm"
                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleRunScenario(1)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Execute Scenario 1
              </Button>
            </div>

            {/* Scenario 2 */}
            <div className="p-4 border rounded-2xl bg-card space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                  Scenario 2
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  Gate Denial: Expired Safety Induction (W-0317)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Worker Bilal taps at Gate 02. Turnstile engine evaluates 17-point rule check. Induction expired on 2026-08-30 → Gate remains locked, HSE alert dispatched.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={() => handleRunScenario(2)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Execute Scenario 2
              </Button>
            </div>

            {/* Scenario 3 */}
            <div className="p-4 border rounded-2xl bg-card space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Scenario 3
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  Gate Denial: Worker Not Assigned (W-0402)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Worker Farhan has valid induction but is not assigned to any active approved work order for today's shift → Turnstile locked with diagnostic notice.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-amber-200 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                onClick={() => handleRunScenario(3)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Execute Scenario 3
              </Button>
            </div>

            {/* Scenario 4 */}
            <div className="p-4 border rounded-2xl bg-card space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
                  Scenario 4
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  Geofence Spatial Breach & Containment (W-0245)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Worker W-0245 drifts into unauthorized Zone 04 (OR Critical Suite). Geofence boundary engine detects breach → High severity incident and field marshal dispatch.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-purple-200 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                onClick={() => handleRunScenario(4)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Execute Scenario 4
              </Button>
            </div>

            {/* Scenario 5 */}
            <div className="p-4 border rounded-2xl bg-card space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Scenario 5
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  Edge AI PPE Detection & PA Broadcast (W-0245)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  CCTV Camera CAM-03 captures missing safety helmet with 96% confidence. Safety AI synthesizes incident and triggers automated PA audio warning in Zone 02.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                onClick={() => handleRunScenario(5)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Execute Scenario 5
              </Button>
            </div>

            {/* Scenario 6 */}
            <div className="p-4 border rounded-2xl bg-card space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Scenario 6
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  Variation Order Approval Chain
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Contractor submits variation request (+QAR 45,000, +4 days). Main Contractor, Consultant QS, and Client review and approve digitally.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                onClick={() => handleRunScenario(6)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Execute Scenario 6
              </Button>
            </div>

            {/* Scenario 7 */}
            <div className="p-4 border rounded-2xl bg-card space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Scenario 7
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  Quality Handover: Defect Rectification (WO-1027)
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  QA Inspector fails duct insulation check. Work order completion blocked until HVAC subcontractor rectifies defects, uploads photos, and passes QA re-inspection.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-amber-200 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                onClick={() => handleRunScenario(7)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Execute Scenario 7
              </Button>
            </div>

            {/* Scenario 8 */}
            <div className="p-4 border rounded-2xl bg-card space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                  Scenario 8
                </span>
                <h4 className="font-bold text-sm text-foreground">
                  Site-Wide Emergency Evacuation & Muster
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Zone 03 fire alarm triggers Code RED. Turnstiles unlock into fail-safe evacuation mode. Digital twin tracks worker egress to Muster Point B with 100% accounted headcount.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={() => handleRunScenario(8)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" /> Execute Scenario 8
              </Button>
            </div>
          </div>

          {/* Stepper & Interactive Simulation Controls */}
          <div className="mt-4 p-3 rounded-2xl border bg-slate-50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Simulation Engine:</span>
              {activeScenarioNumber ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                  Scenario {activeScenarioNumber} (Step {currentScenarioStepIndex + 1}/{activeScenarioResult?.length || 0})
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Ready — click any scenario or step through</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5"
                onClick={stepScenario}
                disabled={!activeScenarioResult || currentScenarioStepIndex >= (activeScenarioResult?.length || 0) - 1}
              >
                <StepForward className="size-3.5" />
                Step Next
              </Button>

              {isScenarioPaused ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  onClick={resumeScenario}
                  disabled={!activeScenarioResult}
                >
                  <Play className="size-3.5" />
                  Resume
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  onClick={pauseScenario}
                  disabled={!activeScenarioResult}
                >
                  <Pause className="size-3.5" />
                  Pause
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  resetSimulation();
                  toast.info("Simulation state reset to baseline.");
                }}
              >
                <RotateCcw className="size-3.5" />
                Reset Baseline
              </Button>
            </div>
          </div>

          {/* Active Scenario Execution Trace */}
          {activeScenarioResult && (
            <div className="mt-4 p-4 rounded-2xl border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Execution Trace — Scenario {activeScenarioNumber}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={clearScenarioResult}
                >
                  Clear Trace
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                {activeScenarioResult.map((step) => (
                  <div
                    key={step.step}
                    className="p-2.5 rounded-xl border bg-background flex items-start gap-3"
                  >
                    <span
                      className={cn(
                        "size-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0",
                        step.status === "success"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : step.status === "warning"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                      )}
                    >
                      {step.step}
                    </span>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{step.title}</span>
                        <Mono className="text-[10px] text-muted-foreground">{step.time}</Mono>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                      {step.entityId && (
                        <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-primary">
                          <span>{step.entity}:</span>
                          <span>{step.entityId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
