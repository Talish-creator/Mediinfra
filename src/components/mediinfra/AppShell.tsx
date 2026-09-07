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
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
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
import { Dot, Mono, Pill } from "./ui-kit";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  alert?: boolean;
};

const NAV: readonly NavItem[] = [
  { to: "/", label: "Executive Command Center", icon: LayoutDashboard, badge: "Live" },
  { to: "/gates", label: "Gate & Turnstile Telemetry", icon: ScanLine },
  { to: "/digital-twin", label: "Digital Twin & Zones", icon: Boxes, badge: "3D" },
  { to: "/work-orders", label: "Work Orders & Permits", icon: BadgeCheck },
  { to: "/analytics", label: "Manpower & Financials", icon: Users },
  { to: "/safety-ai", label: "Edge AI Safety Vision", icon: ShieldAlert, alert: true },
  { to: "/muster", label: "Emergency Muster", icon: Siren },
  { to: "/hardware", label: "ELV Hardware Health", icon: Cpu },
  { to: "/reports", label: "Audit & Compliance", icon: FileBarChart2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "AR">("EN");
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const {
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
          "sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 transition-all duration-300 md:flex select-none",
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
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand button */}
        {collapsed && (
          <div className="flex justify-center py-2 border-b border-[#0F172A]/[0.06] dark:border-white/[0.08]">
            <button
              onClick={() => setCollapsed(false)}
              className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:text-[#0F172A] dark:hover:text-white transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="size-4" />
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
                  "group flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                  active
                    ? "bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400 font-semibold shadow-sm border border-blue-200/60 dark:border-blue-800/40"
                    : "text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-slate-800/80 hover:text-[#0F172A] dark:hover:text-white",
                  collapsed && "justify-center px-2",
                )}
              >
                <Icon
                  className={cn(
                    "size-[18px] shrink-0 transition-transform duration-150 group-hover:scale-110",
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
              </Link>
            );
          })}
        </nav>

        {/* Project & Metrics Status Card */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-4 rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-[0_12px_40px_rgba(2,6,23,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                Active Project
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Phase 1A / 1B
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">
                P875 — Hamad General Hospital
              </p>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#64748B] dark:text-slate-400 font-medium">
                <span>Substructure & MEP</span>
                <span className="font-semibold text-[#0F172A] dark:text-white">76% complete</span>
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
                <p className="text-[#64748B] dark:text-slate-400">Workers</p>
                <p className="font-bold text-[#0F172A] dark:text-white tabular-nums">
                  {headcount} on-site
                </p>
              </div>
              <div>
                <p className="text-[#64748B] dark:text-slate-400">Safety Score</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  98.4%
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
                <span className="size-2 rounded-full bg-emerald-500 mi-pulse" />
                <span>ELV Gateway</span>
              </span>
              <Mono className="text-emerald-600 dark:text-emerald-400 font-semibold">
                42ms Latency
              </Mono>
            </div>
          ) : (
            <div className="flex justify-center">
              <span
                className="size-2.5 rounded-full bg-emerald-500 mi-pulse"
                title="Gateway Online (42ms)"
              />
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Top Enterprise Header */}
        <header className="sticky top-0 z-30 border-b border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-slate-900/95 transition-colors">
          <div className="flex items-center justify-between gap-4 px-6 py-3">
            {/* Left: Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <nav className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer font-semibold text-foreground">
                  P875 Hamad General Hospital
                </span>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-primary font-semibold truncate max-w-[220px]">
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
                    <span>P875 · Phase 1A</span>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64 rounded-xl">
                  <DropdownMenuLabel>Client / Project Selection</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-semibold text-primary">
                    P875 — Hamad General Hospital Phase 1A
                  </DropdownMenuItem>
                  <DropdownMenuItem>P876 — Ambulatory Care Building</DropdownMenuItem>
                  <DropdownMenuItem>P880 — Communicable Diseases Wing</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Client Badge */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="font-semibold text-foreground">Client:</span> Ashghal / HMC
              </div>

              {/* Weather in Doha */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <CloudSun className="size-3.5 text-amber-500" />
                <span>Doha 34°C · Clear AST</span>
              </div>

              {/* Shift info */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Radio className="size-3.5 text-emerald-500" />
                <span className="text-foreground font-semibold">Shift:</span>
                <span>{shiftPhase}</span>
              </div>
            </div>

            {/* Right: Controls Suite */}
            <div className="flex items-center gap-2.5 ml-auto">
              {/* Command Palette Trigger */}
              <button
                onClick={() => setCmdkOpen(true)}
                className="hidden lg:flex items-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground transition-all shadow-sm"
              >
                <Search className="size-3.5 text-muted-foreground" />
                <span className="font-medium">Quick command…</span>
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
                <span className="hidden md:inline">Live Stream</span>
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
                    <span className="font-bold text-[13px]">HSE Operational Alerts</span>
                    <span className="text-[10px] font-semibold text-primary">3 New</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="space-y-1 py-1">
                    <div className="rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-semibold text-foreground">
                          Missing PPE Detected
                        </span>
                        <span className="ml-auto text-[10px] text-muted-foreground">06:14</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Gate 01 Ingress · Hard hat violation flagged by Edge AI.
                      </p>
                    </div>
                    <div className="rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-red-500" />
                        <span className="text-xs font-semibold text-foreground">
                          Turnstile Access Denied
                        </span>
                        <span className="ml-auto text-[10px] text-muted-foreground">06:08</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Gate 03 · Expired safety induction for subcontractor worker.
                      </p>
                    </div>
                    <div className="rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-semibold text-foreground">
                          Work Order Approved
                        </span>
                        <span className="ml-auto text-[10px] text-muted-foreground">05:45</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        WO-0142 approved by Ashghal Consultant.
                      </p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === "EN" ? "AR" : "EN")}
                className="hidden sm:flex items-center gap-1 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                title="Switch Language"
              >
                <Globe className="size-3.5" />
                <span>{lang}</span>
              </button>

              {/* Theme Switcher */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="size-9 rounded-xl border-border hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle light/dark theme"
              >
                {theme === "dark" ? (
                  <Sun className="size-4 text-amber-500" />
                ) : (
                  <Moon className="size-4 text-slate-700" />
                )}
              </Button>

              {/* Live Qatar AST Clock */}
              <div className="hidden lg:flex items-center gap-2 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-mono">
                <span className="size-2 rounded-full bg-emerald-500 mi-pulse" />
                <span className="text-muted-foreground">AST:</span>
                <span className="font-semibold text-foreground tabular-nums">{clock}</span>
              </div>

              {/* Executive Profile Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-xl border border-border p-1 pr-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="size-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      JA
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-semibold leading-none text-foreground">
                        Dr. J. Al-Kuwari
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        HSE Director
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2 shadow-xl">
                  <DropdownMenuLabel>
                    <p className="font-semibold text-sm">Dr. Jassim Al-Kuwari</p>
                    <p className="text-xs text-muted-foreground">j.alkuwari@ashghal.gov.qa</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Active Authority Perspective
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
                    System Security & Permissions
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
                <span className="hidden sm:inline text-xs tracking-wide">EMERGENCY MUSTER</span>
              </Button>
            </div>
          </div>

          {/* Emergency Siren Ribbon */}
          {emergency && (
            <div className="mi-siren border-t border-red-500 bg-red-600/20 px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle className="size-4 animate-pulse" />
              <span>
                Emergency Evacuation In Progress — Optical Turnstiles Released Open — Muster
                Counting Live
              </span>
            </div>
          )}
        </header>

        {/* Page Body */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="min-w-0 flex-1 space-y-8 p-8 max-w-[1720px] mx-auto w-full"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
