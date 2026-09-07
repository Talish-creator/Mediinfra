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
      className={cn("rounded-xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse", className)}
    />
  );
}

export function KpiSkeleton() {
  return (
    <div className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.05)] space-y-4 mi-shimmer flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-5 w-20 rounded-full" />
      </div>
      <SkeletonPulse className="h-10 w-44 rounded-lg" />
      <div className="flex items-center gap-2 pt-2 border-t border-[#0F172A]/[0.04] dark:border-white/[0.04]">
        <SkeletonPulse className="h-4 w-16 rounded-full" />
        <SkeletonPulse className="h-3 w-36" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-[0_12px_40px_rgba(2,6,23,0.05)] mi-shimmer">
      <div className="border-b border-[#0F172A]/[0.06] dark:border-white/[0.06] bg-[#F8FAFC] dark:bg-slate-900/60 px-6 py-4 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonPulse key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="px-6 py-2 divide-y divide-[#0F172A]/[0.05] dark:divide-white/[0.05]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-6 py-4 items-center">
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
      className="rounded-[18px] border border-[#0F172A]/[0.06] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.05)] space-y-4 mi-shimmer"
      style={{ height }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <SkeletonPulse className="h-4 w-44" />
          <SkeletonPulse className="h-3 w-64" />
        </div>
        <SkeletonPulse className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex items-end gap-3 h-44 pt-4">
        {Array.from({ length: 14 }).map((_, i) => (
          <SkeletonPulse
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${25 + ((i * 19) % 65)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function FloorplanSkeleton({ height = 480 }: { height?: number }) {
  return (
    <div
      className="rounded-[18px] border border-slate-800 bg-slate-950 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.05)] mi-shimmer relative overflow-hidden flex flex-col justify-between"
      style={{ height }}
    >
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-48 bg-slate-800" />
        <SkeletonPulse className="h-7 w-28 rounded-xl bg-slate-800" />
      </div>
      <div className="grid grid-cols-3 gap-4 h-64 my-auto">
        <SkeletonPulse className="h-full rounded-2xl bg-slate-900 border border-slate-800/80" />
        <SkeletonPulse className="h-full rounded-2xl bg-slate-900 border border-slate-800/80" />
        <SkeletonPulse className="h-full rounded-2xl bg-slate-900 border border-slate-800/80" />
      </div>
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-3 w-36 bg-slate-800" />
        <SkeletonPulse className="h-3 w-48 bg-slate-800" />
      </div>
    </div>
  );
}
