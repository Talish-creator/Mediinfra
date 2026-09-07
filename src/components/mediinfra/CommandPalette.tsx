import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import {
  Activity,
  BadgeCheck,
  Boxes,
  Cpu,
  FileBarChart2,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
  Moon,
  Plus,
  ScanLine,
  Search,
  ShieldAlert,
  Siren,
  Sun,
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
  const navigate = useNavigate();
  const { toggleTheme, theme, simulating, toggleSimulator, startEmergency, setRole } =
    useMediInfra();

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
              placeholder="Type a command, jump to a screen, or search actions… (ESC to exit)"
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
              No matching commands found.
            </Command.Empty>

            <Command.Group
              heading="Navigation Screens"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1"
            >
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <LayoutDashboard className="size-4 text-primary" />
                <span>Executive Command Center</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">/</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/gates" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <ScanLine className="size-4 text-primary" />
                <span>Gate & Turnstile Telemetry</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">/gates</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/digital-twin" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Boxes className="size-4 text-primary" />
                <span>Digital Twin & Zones</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  /digital-twin
                </span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/work-orders" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <BadgeCheck className="size-4 text-primary" />
                <span>Work Orders & Permits (Kanban)</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  /work-orders
                </span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/analytics" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Users className="size-4 text-primary" />
                <span>Manpower & Financial Analytics</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">/analytics</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/safety-ai" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <ShieldAlert className="size-4 text-primary" />
                <span>Edge AI Safety Vision & Broadcast</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">/safety-ai</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/muster" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Siren className="size-4 text-red-500" />
                <span>Emergency Muster & Evacuation</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">/muster</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/hardware" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Cpu className="size-4 text-primary" />
                <span>ELV Hardware Health & Zebra Readers</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">/hardware</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAndClose(() => navigate({ to: "/reports" }))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <FileBarChart2 className="size-4 text-primary" />
                <span>Audit & Compliance Records</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">/reports</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Quick Operational Actions"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1 pt-2"
            >
              <Command.Item
                onSelect={() =>
                  runAndClose(() => {
                    toggleSimulator();
                  })
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-primary cursor-pointer transition-colors"
              >
                <Gauge className="size-4 text-emerald-500" />
                <span>
                  {simulating ? "Pause Live Telemetry Simulator" : "Arm Live Telemetry Simulator"}
                </span>
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
                <span>Trigger Site Emergency Muster Alarm</span>
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
                <span>
                  Toggle Appearance Theme ({theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                  )
                </span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Switch Executive Role Perspective"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1 pt-2"
            >
              {(
                [
                  "Ashghal / HMC Client View",
                  "IMAR-Al Sraiya JV Main Contractor",
                  "HSE & Security Command",
                  "Subcontractor Portal",
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
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono ml-1">
                  ↓
                </kbd>{" "}
                Navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">
                  ↵
                </kbd>{" "}
                Select
              </span>
            </div>
            <span>MediInfra Enterprise v4.2</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
