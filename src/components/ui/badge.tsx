import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-blue-200/60 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40",
        secondary:
          "border-slate-200/80 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        destructive:
          "border-red-200/60 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40",
        outline: "border-[#0F172A]/[0.08] text-[#0F172A] dark:text-slate-200 dark:border-white/10",
        success:
          "border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
        warning:
          "border-amber-200/60 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
        live: "border-emerald-200/60 bg-emerald-50 text-emerald-700 shadow-[0_0_10px_rgba(34,197,94,0.32)] dark:bg-emerald-950/40 dark:text-emerald-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
