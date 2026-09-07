import { useEffect, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface AnimatedNumberProps {
  value: number | string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function AnimatedNumber({ value, className = "", decimals }: AnimatedNumberProps) {
  // If the value is a string like "QAR 285.4M", "94.2%", "1.08x", "4 / 4"
  if (typeof value === "string") {
    // Check if it's a composite like "4 / 4" or "32 / 32"
    if (value.includes("/")) {
      const parts = value.split("/").map((p) => p.trim());
      const p0 = parts[0] ?? "";
      const p1 = parts[1] ?? "";
      const n1 = parseFloat(p0);
      const n2 = parseFloat(p1);
      if (!isNaN(n1) && !isNaN(n2)) {
        return (
          <span className={className}>
            <SingleNumber target={n1} decimals={0} /> / <SingleNumber target={n2} decimals={0} />
          </span>
        );
      }
      return <span className={className}>{value}</span>;
    }

    // Extract prefix, number, suffix
    const match = value.match(/^([^\d.-]*)([-+]?\d+(?:\.\d+)?)(.*)$/);
    if (match && match[2]) {
      const prefix = match[1] ?? "";
      const numStr = match[2];
      const suffix = match[3] ?? "";
      const num = parseFloat(numStr);
      const dec =
        decimals !== undefined
          ? decimals
          : numStr.includes(".")
            ? (numStr.split(".")[1]?.length ?? 0)
            : 0;

      return (
        <span className={className}>
          {prefix}
          <SingleNumber target={num} decimals={dec} />
          {suffix}
        </span>
      );
    }

    return <span className={className}>{value}</span>;
  }

  const dec = decimals !== undefined ? decimals : Number.isInteger(value) ? 0 : 1;
  return (
    <span className={className}>
      <SingleNumber target={value} decimals={dec} />
    </span>
  );
}

function SingleNumber({ target, decimals }: { target: number; decimals: number }) {
  const motionVal = useMotionValue(target);
  const springVal = useSpring(motionVal, {
    stiffness: 100,
    damping: 20,
  });
  const [display, setDisplay] = useState<string>(target.toFixed(decimals));

  useEffect(() => {
    motionVal.set(target);
  }, [target, motionVal]);

  useEffect(() => {
    const unsub = springVal.on("change", (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
    return () => unsub();
  }, [springVal, decimals]);

  return <>{display}</>;
}
