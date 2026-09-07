import { cn } from "@/lib/utils";

interface MediInfraLogoProps {
  collapsed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MediInfraLogo({ collapsed = false, className, size = "md" }: MediInfraLogoProps) {
  if (collapsed) {
    return (
      <div className={cn("relative flex items-center justify-center shrink-0", className)}>
        <img
          src="/mediinfra-icon.png"
          alt="MediInfra"
          className={cn(
            "object-contain select-none transition-transform duration-200 hover:scale-105",
            size === "sm" && "h-7 w-7",
            size === "md" && "h-9 w-9",
            size === "lg" && "h-11 w-11",
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <img
        src="/mediinfra-logo.png"
        alt="MediInfra — Site Safety Command"
        className={cn(
          "object-contain transition-transform duration-200 hover:scale-[1.02]",
          size === "sm" && "h-8 w-auto max-w-[140px]",
          size === "md" && "h-9 w-auto max-w-[170px]",
          size === "lg" && "h-12 w-auto max-w-[210px]",
        )}
      />
    </div>
  );
}
