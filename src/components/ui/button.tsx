import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-sm hover:shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-[#EF4444] text-white shadow-sm hover:bg-[#DC2626] hover:shadow-[0_8px_20px_rgba(239,68,68,0.25)] hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-[#0F172A]/[0.08] dark:border-white/10 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-slate-100 shadow-sm hover:bg-[#F8FAFC] dark:hover:bg-slate-800 hover:shadow-[0_4px_12px_rgba(2,6,23,0.06)] hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-slate-100 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-[#F1F5F9] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-100",
        link: "text-[#2563EB] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 rounded-xl",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
