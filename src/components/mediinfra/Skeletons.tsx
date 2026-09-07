import type React from "react";
import { cn } from "@/lib/utils";

export function SkeletonPulse({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn("animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80", className)}
    />
  );
}

export function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-28" />
        <SkeletonPulse className="h-5 w-16 rounded-full" />
      </div>
      <SkeletonPulse className="h-10 w-36" />
      <div className="flex items-center gap-2 pt-1">
        <SkeletonPulse className="h-4 w-12" />
        <SkeletonPulse className="h-3 w-32" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="border-b border-border bg-slate-50 dark:bg-slate-900 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonPulse key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 py-2 border-b border-border/40 last:border-0">
            {Array.from({ length: cols }).map((_, c) => (
              <SkeletonPulse key={c} className={cn("h-4 flex-1", c === 0 ? "w-2/3" : "w-full")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
      style={{ height }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <SkeletonPulse className="h-4 w-40" />
          <SkeletonPulse className="h-3 w-64" />
        </div>
        <SkeletonPulse className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex items-end gap-3 h-48 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonPulse
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${30 + ((i * 17) % 65)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
