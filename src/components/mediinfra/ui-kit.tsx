import { useState, useMemo, type ReactNode } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { avatarHue, initials } from "@/lib/mediinfra-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedNumber } from "./AnimatedNumber";
export { AnimatedNumber };
export { KpiSkeleton, TableSkeleton, ChartSkeleton, SkeletonPulse } from "./Skeletons";

export type Tone = "cyan" | "ok" | "warn" | "crit" | "exec" | "muted";

const toneText: Record<Tone, string> = {
  cyan: "text-[var(--primary)]",
  ok: "text-[var(--ok)]",
  warn: "text-[var(--warn)]",
  crit: "text-[var(--crit)]",
  exec: "text-[var(--exec)]",
  muted: "text-muted-foreground",
};

const toneBg: Record<Tone, string> = {
  cyan: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40",
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
  warn: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
  crit: "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40",
  exec: "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40",
  muted:
    "bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function Pill({
  tone = "muted",
  children,
  className,
  glow = false,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string | undefined;
  glow?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold tracking-tight transition-colors",
        toneBg[tone],
        glow && "shadow-[0_0_10px_rgba(34,197,94,0.32)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export type BadgeStatus =
  | "online"
  | "success"
  | "warning"
  | "error"
  | "live"
  | "draft"
  | "approved"
  | "queued"
  | "streaming"
  | "active";

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: BadgeStatus;
  label?: string;
  className?: string;
}) {
  const config: Record<BadgeStatus, { tone: Tone; text: string; glow?: boolean; pulse?: boolean }> =
    {
      online: { tone: "ok", text: "Online", pulse: true },
      success: { tone: "ok", text: "Success" },
      warning: { tone: "warn", text: "Warning" },
      error: { tone: "crit", text: "Error" },
      live: { tone: "ok", text: "LIVE", glow: true, pulse: true },
      draft: { tone: "muted", text: "Draft" },
      approved: { tone: "ok", text: "Approved" },
      queued: { tone: "warn", text: "Queued" },
      streaming: { tone: "cyan", text: "Streaming", glow: true, pulse: true },
      active: { tone: "ok", text: "Active", pulse: true },
    };

  const item = config[status] ?? config.online;
  const displayText = label ?? item.text;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold tracking-tight transition-colors",
        toneBg[item.tone],
        item.glow && "shadow-[0_0_10px_rgba(34,197,94,0.32)]",
        className,
      )}
    >
      <Dot tone={item.tone} pulse={item.pulse ?? false} />
      <span>{displayText}</span>
    </span>
  );
}

export function Dot({
  tone = "ok",
  pulse = true,
}: {
  tone?: Tone | undefined;
  pulse?: boolean | undefined;
}) {
  const map: Record<Tone, string> = {
    cyan: "var(--primary)",
    ok: "var(--ok)",
    warn: "var(--warn)",
    crit: "var(--crit)",
    exec: "var(--exec)",
    muted: "var(--muted-foreground)",
  };
  return (
    <span
      className={cn("inline-block size-2 shrink-0 rounded-full", pulse && "mi-pulse")}
      style={{ backgroundColor: map[tone] }}
    />
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string | undefined;
  bodyClassName?: string | undefined;
}) {
  return (
    <section
      className={cn(
        "h-full flex flex-col rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-[0_12px_40px_rgba(2,6,23,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(2,6,23,0.08)] transition-all duration-[180ms] ease-out overflow-hidden",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-[#0F172A]/[0.05] dark:border-white/[0.06] px-6 py-4.5 bg-[#F8FAFC]/60 dark:bg-slate-900/40 shrink-0">
          <div>
            {title && (
              <h2 className="text-[24px] font-bold text-[#0F172A] dark:text-white tracking-tight leading-snug">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm font-normal text-[#64748B] dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-6 flex-1 flex flex-col", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Mono({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <span className={cn("font-mono text-xs tracking-tight tabular-nums", className)}>
      {children}
    </span>
  );
}

export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const hue = avatarHue(name);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ring-2 ring-white/20 shadow-sm"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 65% 45%), hsl(${(hue + 45) % 360} 70% 30%))`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export function Spark({ data, tone = "cyan" }: { data: number[]; tone?: Tone }) {
  const map: Record<Tone, string> = {
    cyan: "#2563EB",
    ok: "#22C55E",
    warn: "#F59E0B",
    crit: "#EF4444",
    exec: "#7C3AED",
    muted: "#64748B",
  };
  const color = map[tone];
  const series = data.map((v, i) => ({ i, v }));
  const id = `spark-${tone}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="h-11 w-full">
      <ResponsiveContainer width="100%" height={44} minHeight={44}>
        <AreaChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${id})`}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  tone = "cyan",
  spark,
  trend,
  trendLabel = "vs yesterday",
  status,
  footer,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: Tone;
  spark?: number[] | undefined;
  trend?: number | string | undefined;
  trendLabel?: string | undefined;
  status?: string | undefined;
  footer?: ReactNode;
}) {
  const isPositive = typeof trend === "number" ? trend >= 0 : String(trend).startsWith("+");

  return (
    <div className="group relative h-full rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(2,6,23,0.08)] hover:-translate-y-0.5 transition-all duration-[180ms] ease-out overflow-hidden flex flex-col justify-between">
      {/* Top indicator bar */}
      <div
        className="absolute inset-x-0 top-0 h-1 transition-opacity opacity-80 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, var(--${tone === "ok" ? "ok" : tone}), transparent)`,
        }}
      />

      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[15px] sm:text-[16px] font-semibold text-[#64748B] dark:text-slate-400 tracking-tight leading-snug">
            {label}
          </p>
          {status && (
            <Pill tone={tone} className="text-[11px] py-0.5 px-2.5">
              {status}
            </Pill>
          )}
        </div>

        {/* 42px KPI Value */}
        <div className="mt-3.5 flex items-baseline gap-2">
          <p className="text-[42px] font-bold tracking-tight leading-none tabular-nums text-[#0F172A] dark:text-white">
            {typeof value === "string" || typeof value === "number" ? (
              <AnimatedNumber value={value} />
            ) : (
              value
            )}
          </p>
        </div>

        {/* Trend badge and comparison */}
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 font-semibold text-[11px] border",
                isPositive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60"
                  : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200/60",
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="size-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="size-3 stroke-[2.5]" />
              )}
              {typeof trend === "number" ? `${trend > 0 ? "+" : ""}${trend}%` : trend}
            </span>
            <span className="text-[#64748B] dark:text-slate-400 text-xs">{trendLabel}</span>
          </div>
        )}

        {sub && !trend && (
          <p className="mt-2.5 text-sm font-normal text-[#64748B] dark:text-slate-400">{sub}</p>
        )}
      </div>

      {spark && (
        <div className="mt-5 pt-2 border-t border-[#0F172A]/[0.05] dark:border-white/[0.06]">
          <Spark data={spark} tone={tone} />
        </div>
      )}

      {footer && (
        <div className="mt-4 pt-3 border-t border-[#0F172A]/[0.05] dark:border-white/[0.06] text-xs text-[#64748B] dark:text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
}

export function Bar({ value, max, tone = "cyan" }: { value: number; max: number; tone?: Tone }) {
  const map: Record<Tone, string> = {
    cyan: "var(--primary)",
    ok: "var(--ok)",
    warn: "var(--warn)",
    crit: "var(--crit)",
    exec: "var(--exec)",
    muted: "var(--muted-foreground)",
  };
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: map[tone] }}
      />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
}: {
  title: string;
  description: string;
  badge?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between pb-8 border-b border-border/60">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold tracking-tight leading-tight text-foreground">
            {title}
          </h1>
          {badge}
        </div>
        <p className="mt-2.5 max-w-3xl text-sm font-normal text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}

/*
 * Enterprise Data Grid with Search, Sorting, Filtering, and Pagination
 */
export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export function EnterpriseDataGrid<T extends { id?: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search records…",
  searchKeys = [],
  filterOptions,
  filterKey,
  onExportCsv,
  title,
  actions,
}: {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filterOptions?: { label: string; value: string }[];
  filterKey?: keyof T;
  onExportCsv?: () => void;
  title?: string;
  actions?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [filterVal, setFilterVal] = useState("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return data.filter((row) => {
      // Search
      if (query.trim() && searchKeys.length > 0) {
        const text = searchKeys
          .map((k) => String(row[k] ?? ""))
          .join(" ")
          .toLowerCase();
        if (!text.includes(query.toLowerCase())) return false;
      }
      // Filter
      if (filterKey && filterVal !== "all") {
        if (String(row[filterKey]) !== filterVal) return false;
      }
      return true;
    });
  }, [data, query, searchKeys, filterKey, filterVal]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const va = (a as Record<string, unknown>)[sortKey];
      const vb = (b as Record<string, unknown>)[sortKey];
      if (typeof va === "number" && typeof vb === "number") {
        return sortAsc ? va - vb : vb - va;
      }
      return sortAsc
        ? String(va ?? "").localeCompare(String(vb ?? ""))
        : String(vb ?? "").localeCompare(String(va ?? ""));
    });
  }, [filtered, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const toggleSelectAll = () => {
    if (Object.keys(selectedIds).length === paginated.length) {
      setSelectedIds({});
    } else {
      const next: Record<string, boolean> = {};
      paginated.forEach((row, i) => {
        const id = String(row.id ?? i);
        next[id] = true;
      });
      setSelectedIds(next);
    }
  };

  return (
    <div className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-[0_12px_40px_rgba(2,6,23,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] overflow-hidden">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-[#0F172A]/[0.06] dark:border-white/[0.06] bg-[#F8FAFC]/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-3 min-w-[280px] flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748B] dark:text-slate-400" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-9 h-11 rounded-xl bg-background border-[#0F172A]/[0.08] dark:border-white/10 text-sm"
            />
          </div>
          {filterOptions && (
            <select
              value={filterVal}
              onChange={(e) => {
                setFilterVal(e.target.value);
                setPage(1);
              }}
              className="h-11 px-3.5 rounded-xl border border-[#0F172A]/[0.08] dark:border-white/10 bg-background text-sm font-medium text-[#0F172A] dark:text-white outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All categories</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {actions}
          {onExportCsv && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="gap-2 h-11 rounded-xl text-sm"
            >
              <Download className="size-4" /> Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="grid">
          <thead className="sticky top-0 z-10 border-b border-[#0F172A]/[0.06] dark:border-white/[0.06] bg-[#F8FAFC] dark:bg-slate-900 text-left uppercase text-[12px] font-semibold tracking-wider text-[#64748B] dark:text-slate-400">
            <tr role="row">
              <th className="w-12 px-6 py-4 text-center" scope="col">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={
                    paginated.length > 0 && Object.keys(selectedIds).length === paginated.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  role="columnheader"
                  tabIndex={col.sortable !== false ? 0 : undefined}
                  aria-sort={sortKey === col.key ? (sortAsc ? "ascending" : "descending") : "none"}
                  onKeyDown={(e) => {
                    if (col.sortable !== false && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      if (sortKey === col.key) setSortAsc(!sortAsc);
                      else {
                        setSortKey(col.key);
                        setSortAsc(true);
                      }
                    }
                  }}
                  onClick={() => {
                    if (col.sortable !== false) {
                      if (sortKey === col.key) setSortAsc(!sortAsc);
                      else {
                        setSortKey(col.key);
                        setSortAsc(true);
                      }
                    }
                  }}
                  className={cn(
                    "px-6 py-4 whitespace-nowrap",
                    col.sortable !== false &&
                      "cursor-pointer select-none hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                  )}
                  style={{ width: col.width }}
                >
                  <div
                    className={cn(
                      "flex items-center gap-1.5",
                      col.align === "right" && "justify-end",
                    )}
                  >
                    <span>{col.header}</span>
                    {sortKey === col.key && (
                      <span className="text-primary font-bold">{sortAsc ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0F172A]/[0.05] dark:divide-white/[0.06]">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-16 text-center text-[#64748B] dark:text-slate-400 text-sm"
                >
                  No matching records found. Try adjusting search filters.
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => {
                const id = String(row.id ?? idx);
                const isSelected = !!selectedIds[id];
                return (
                  <tr
                    key={id}
                    className={cn(
                      "transition-colors hover:bg-[#F8FAFC]/90 dark:hover:bg-slate-800/50",
                      isSelected && "bg-blue-50/50 dark:bg-blue-950/20",
                    )}
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          setSelectedIds((prev) => ({
                            ...prev,
                            [id]: !prev[id],
                          }))
                        }
                        className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-6 py-4 text-[#0F172A] dark:text-slate-200",
                          col.align === "right" && "text-right tabular-nums",
                          col.align === "center" && "text-center",
                        )}
                      >
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-[#0F172A]/[0.06] dark:border-white/[0.06] px-6 py-4 bg-[#F8FAFC]/50 dark:bg-slate-900/30 text-xs text-[#64748B] dark:text-slate-400">
        <div>
          Showing{" "}
          <span className="font-semibold text-[#0F172A] dark:text-white">
            {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-[#0F172A] dark:text-white">
            {Math.min(sorted.length, page * pageSize)}
          </span>{" "}
          of <span className="font-semibold text-[#0F172A] dark:text-white">{sorted.length}</span>{" "}
          records
          {Object.keys(selectedIds).length > 0 && (
            <span className="ml-3 font-medium text-primary">
              ({Object.keys(selectedIds).length} selected)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-9 w-9 p-0 rounded-lg"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="px-2 font-medium text-[#0F172A] dark:text-white">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 w-9 p-0 rounded-lg"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/*
 * Illustrated Empty State
 */
export function EmptyState({
  icon: Icon = SlidersHorizontal,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}: {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-slate-50/50 dark:bg-slate-900/20">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-primary shadow-sm mb-4">
        <Icon className="size-7" />
      </div>
      <h3 className="text-[17px] font-semibold text-foreground tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13px] text-muted-foreground">{description}</p>
      {(actionText || secondaryActionText) && (
        <div className="mt-5 flex items-center gap-3">
          {actionText && (
            <Button onClick={onAction} className="rounded-xl h-9 px-4 text-xs font-semibold">
              {actionText}
            </Button>
          )}
          {secondaryActionText && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              className="rounded-xl h-9 px-4 text-xs font-semibold"
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
