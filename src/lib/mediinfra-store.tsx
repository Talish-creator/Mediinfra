import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { GATES, HEADCOUNT, WORKERS, type Worker } from "./mediinfra-data";

export type Role =
  | "Ashghal / HMC Client View"
  | "IMAR-Al Sraiya JV Main Contractor"
  | "HSE & Security Command"
  | "Subcontractor Portal";

export const ROLES: Role[] = [
  "Ashghal / HMC Client View",
  "IMAR-Al Sraiya JV Main Contractor",
  "HSE & Security Command",
  "Subcontractor Portal",
];

export type AccessStatus =
  | "Authorized"
  | "Denied: Unassigned Work Order"
  | "Denied: Expired Safety Induction"
  | "Denied: Zone Capacity Exceeded"
  | "Denied: Suspended RFID Tag";

export type GateEvent = {
  id: string;
  time: string;
  worker: Worker;
  gateId: string;
  gateName: string;
  lane: string;
  direction: "IN" | "OUT";
  status: AccessStatus;
  transitSpeedSec: number;
  manual?: boolean;
  reason?: string;
};

type Ctx = {
  theme: "dark" | "light";
  toggleTheme: () => void;
  role: Role;
  setRole: (r: Role) => void;
  simulating: boolean;
  toggleSimulator: () => void;
  events: GateEvent[];
  addEvent: (e: GateEvent) => void;
  headcount: number;
  emergency: boolean;
  accounted: number;
  startEmergency: () => void;
  standDown: () => void;
  clock: string;
  shiftPhase: string;
  gateQueues: Record<string, number>;
  throughputPerMin: number;
};

const MediInfraCtx = createContext<Ctx | null>(null);

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fmt(d: Date) {
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

/** Qatar AST = UTC+3 */
function qatarNow() {
  return new Date(Date.now() + 3 * 3600 * 1000);
}

let seq = 0;
export function makeEvent(index: number, forceHour?: number): GateEvent {
  seq += 1;
  const worker = WORKERS[(index * 7 + seq * 5) % WORKERS.length]!;
  const gate = GATES[(index + seq) % GATES.length]!;

  // Dynamic shift modeling
  const now = qatarNow();
  const currentHour = forceHour ?? now.getUTCHours();
  const isMorningRush = currentHour >= 6 && currentHour <= 7;
  const isLunchRush = currentHour >= 12 && currentHour <= 13;
  const isEveningRush = currentHour >= 16 && currentHour <= 18;

  let direction: "IN" | "OUT";
  if (isMorningRush) {
    direction = seq % 10 === 0 ? "OUT" : "IN";
  } else if (isEveningRush) {
    direction = seq % 10 === 0 ? "IN" : "OUT";
  } else if (isLunchRush) {
    direction = seq % 2 === 0 ? "OUT" : "IN";
  } else {
    direction = seq % 4 === 0 ? "OUT" : "IN";
  }

  // Realistic random failure modes
  const roll = (seq * 17) % 100;
  let status: AccessStatus = "Authorized";

  if (!worker.inductionValid) {
    status = "Denied: Expired Safety Induction";
  } else if (roll < 3) {
    status = "Denied: Unassigned Work Order";
  } else if (roll === 4) {
    status = "Denied: Zone Capacity Exceeded";
  } else if (roll === 5) {
    status = "Denied: Suspended RFID Tag";
  }

  // Realistic transit time between 1.8s and 4.2s
  const transitSpeedSec = parseFloat((2.0 + ((seq * 3) % 22) / 10).toFixed(1));

  return {
    id: `EVT-${Date.now()}-${seq}`,
    time: fmt(qatarNow()),
    worker,
    gateId: gate.id,
    gateName: gate.name,
    lane: direction === "IN" ? "Lane 1" : "Lane 2",
    direction,
    status,
    transitSpeedSec,
  };
}

const SEED_EVENTS: GateEvent[] = Array.from({ length: 16 }, (_, i) => makeEvent(i));

export function MediInfraProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("light"); // Enterprise light default
  const [role, setRole] = useState<Role>("IMAR-Al Sraiya JV Main Contractor");
  const [simulating, setSimulating] = useState(false);
  const [events, setEvents] = useState<GateEvent[]>(SEED_EVENTS);
  const [headcount, setHeadcount] = useState(HEADCOUNT.onSite);
  const [emergency, setEmergency] = useState(false);
  const [accounted, setAccounted] = useState(0);
  const [clock, setClock] = useState("--:--:--");
  const [throughputPerMin, setThroughputPerMin] = useState(34);
  const [gateQueues, setGateQueues] = useState<Record<string, number>>({
    "GATE-01": 3,
    "GATE-02": 1,
    "GATE-03": 0,
    "GATE-04": 2,
  });

  const tick = useRef(0);

  useEffect(() => {
    setClock(fmt(qatarNow()));
    const t = setInterval(() => setClock(fmt(qatarNow())), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const addEvent = useCallback((e: GateEvent) => {
    setEvents((prev) => [e, ...prev].slice(0, 150));
  }, []);

  // Realistic Shift Phase
  const shiftPhase = useMemo(() => {
    const h = parseInt(clock.split(":")[0] ?? "0", 10) || qatarNow().getUTCHours();
    if (h >= 6 && h <= 8) return "Morning Ingress Peak (06:00 → 08:00)";
    if (h >= 12 && h <= 13) return "Midday Meal Transit (12:00 → 13:00)";
    if (h >= 16 && h <= 18) return "Evening Egress Peak (16:00 → 18:00)";
    return "Standard Site Shift Operations";
  }, [clock]);

  // Live Telemetry realistic worker simulation
  useEffect(() => {
    if (!simulating) return;

    const t = setInterval(() => {
      tick.current += 1;
      const e = makeEvent(tick.current);
      setEvents((prev) => [e, ...prev].slice(0, 150));

      // Fluctuate headcount realistically
      setHeadcount((h) =>
        e.status === "Authorized"
          ? Math.min(1000, Math.max(780, h + (e.direction === "IN" ? 1 : -1)))
          : h,
      );

      // Fluctuate throughput
      setThroughputPerMin(30 + (tick.current % 14));

      // Fluctuate gate queues
      setGateQueues({
        "GATE-01": Math.max(0, (tick.current * 3) % 6),
        "GATE-02": Math.max(0, (tick.current * 2) % 4),
        "GATE-03": Math.max(0, tick.current % 3),
        "GATE-04": Math.max(0, (tick.current * 5) % 5),
      });

      // Realistic alerts
      if (e.status !== "Authorized") {
        toast.error(`${e.status}`, {
          description: `${e.worker.name} (${e.worker.employer}) · ${e.gateName} · EPC ${e.worker.epc}`,
        });
      } else if (tick.current % 6 === 0) {
        toast.warning("Edge AI Vision Safety Alert", {
          description: `Missing safety helmet detected at ${e.gateName} — HSE marshal notified.`,
        });
      } else if (tick.current % 11 === 0) {
        toast.info("RFID Edge Reader Health Check", {
          description: `Zebra FXR90 ${e.gateId} antenna beam calibrated. VSWR 1.08:1 optimal.`,
        });
      }
    }, 3200);

    return () => clearInterval(t);
  }, [simulating]);

  // Emergency evacuation counter
  useEffect(() => {
    if (!emergency) return;
    setAccounted(0);
    const target = 831;
    const t = setInterval(() => {
      setAccounted((a) => {
        if (a >= target) {
          clearInterval(t);
          return target;
        }
        return Math.min(target, a + Math.ceil((target - a) / 10) + 4);
      });
    }, 100);
    return () => clearInterval(t);
  }, [emergency]);

  const value = useMemo<Ctx>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      role,
      setRole,
      simulating,
      toggleSimulator: () =>
        setSimulating((s) => {
          const next = !s;
          if (next) {
            toast.success("Live telemetry simulator armed", {
              description: "Streaming real-time EPC Gen2 turnstile taps with dynamic queues.",
            });
          } else {
            toast.info("Live telemetry simulator paused");
          }
          return next;
        }),
      events,
      addEvent,
      headcount,
      emergency,
      accounted,
      startEmergency: () => {
        setEmergency(true);
        toast.error("SITE-WIDE EMERGENCY EVACUATION ACTIVE", {
          description: "All optical turnstiles released open. Muster points A/B/C now counting.",
          duration: 9000,
        });
      },
      standDown: () => {
        setEmergency(false);
        toast.success("Site stand-down verified — Normal ELV gate operations restored");
      },
      clock,
      shiftPhase,
      gateQueues,
      throughputPerMin,
    }),
    [
      theme,
      role,
      simulating,
      events,
      addEvent,
      headcount,
      emergency,
      accounted,
      clock,
      shiftPhase,
      gateQueues,
      throughputPerMin,
    ],
  );

  return <MediInfraCtx.Provider value={value}>{children}</MediInfraCtx.Provider>;
}

export function useMediInfra() {
  const ctx = useContext(MediInfraCtx);
  if (!ctx) throw new Error("useMediInfra must be used inside MediInfraProvider");
  return ctx;
}
