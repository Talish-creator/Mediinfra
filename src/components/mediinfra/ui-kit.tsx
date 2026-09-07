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
  cyan: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60",
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60",
  warn: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60",
  crit: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900/60",
  exec: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900/60",
  muted:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function Pill({
  tone = "muted",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors",
        toneBg[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "ok", pulse = true }: { tone?: Tone; pulse?: boolean }) {
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
        "rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border/80 px-5 py-4 bg-slate-50/50 dark:bg-slate-900/30">
          <div>
            {title && (
              <h2 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
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
    cyan: "#1F6FEB",
    ok: "#16A34A",
    warn: "#F59E0B",
    crit: "#DC2626",
    exec: "#4F46E5",
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
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
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
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Top indicator bar */}
      <div
        className="absolute inset-x-0 top-0 h-1 transition-opacity opacity-80 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, var(--${tone === "ok" ? "ok" : tone}), transparent)`,
        }}
      />

      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold text-muted-foreground tracking-tight">{label}</p>
          {status && (
            <Pill tone={tone} className="text-[10px] py-0 px-2">
              {status}
            </Pill>
          )}
        </div>

        {/* 42px KPI Value */}
        <div className="mt-3 flex items-baseline gap-2">
          <p
            className={cn(
              "text-[42px] font-bold tracking-tight leading-none tabular-nums text-foreground",
            )}
          >
            {typeof value === "string" || typeof value === "number" ? (
              <AnimatedNumber value={value} />
            ) : (
              value
            )}
          </p>
        </div>

        {/* Trend badge and comparison */}
        {trend !== undefined && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold text-[11px]",
                isPositive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300",
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="size-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="size-3 stroke-[2.5]" />
              )}
              {typeof trend === "number" ? `${trend > 0 ? "+" : ""}${trend}%` : trend}
            </span>
            <span className="text-muted-foreground text-[12px]">{trendLabel}</span>
          </div>
        )}

        {sub && !trend && <p className="mt-2 text-xs font-medium text-muted-foreground">{sub}</p>}
      </div>

      {spark && (
        <div className="mt-4 pt-1 border-t border-border/40">
          <Spark data={spark} tone={tone} />
        </div>
      )}

      {footer && <div className="mt-3 text-xs text-muted-foreground">{footer}</div>}
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
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-1 border-b border-border/60">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] font-bold tracking-tight text-foreground">{title}</h1>
          {badge}
        </div>
        <p className="mt-1.5 max-w-3xl text-[13px] font-medium text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
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
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-3 min-w-[280px] flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-9 h-9 rounded-xl bg-background text-[13px]"
            />
          </div>
          {filterOptions && (
            <select
              value={filterVal}
              onChange={(e) => {
                setFilterVal(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-xl border border-input bg-background text-[13px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
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

        <div className="flex items-center gap-2">
          {actions}
          {onExportCsv && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="gap-2 h-9 rounded-xl text-[13px]"
            >
              <Download className="size-3.5" /> Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]" role="grid">
          <thead className="sticky top-0 z-10 border-b border-border/80 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm text-left uppercase text-[11px] font-semibold tracking-wider text-muted-foreground">
            <tr role="row">
              <th className="w-10 px-4 py-3 text-center" scope="col">
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
                    "px-4 py-3 whitespace-nowrap",
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
          <tbody className="divide-y divide-border/60">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-muted-foreground"
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
                      "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                      isSelected && "bg-blue-50/50 dark:bg-blue-950/20",
                    )}
                  >
                    <td className="px-4 py-3 text-center">
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
                          "px-4 py-3 text-foreground",
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
      <div className="flex items-center justify-between border-t border-border/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/30 text-xs text-muted-foreground">
        <div>
          Showing{" "}
          <span className="font-semibold text-foreground">
            {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">
            {Math.min(sorted.length, page * pageSize)}
          </span>{" "}
          of <span className="font-semibold text-foreground">{sorted.length}</span> records
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
            className="h-8 w-8 p-0 rounded-lg"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="px-2 font-medium text-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-8 w-8 p-0 rounded-lg"
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
