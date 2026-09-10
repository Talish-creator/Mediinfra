/**
 * Site Guardian — Central Reactive Domain Store & State Manager
 * Unified single-source-of-truth state container for all 38 domains.
 */

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
import { useTranslation } from "react-i18next";
import i18n, { applyLanguageToDOM, getStoredLanguage, type SupportedLanguage } from "../i18n";

import type {
  Project,
  Building,
  Floor,
  Zone,
  Contractor,
  Worker,
  WorkerDocument,
  SafetyInduction,
  WorkPackage,
  WorkOrder,
  WorkOrderStage,
  Gate,
  GateEvent,
  AttendanceRecord,
  LocationEvent,
  Camera,
  SafetyIncident,
  IncidentStatus,
  BroadcastLog,
  QualityInspection,
  ChangeRequest,
  Timesheet,
  ContractorClaim,
  PaymentRecord,
  AuditLogEntry,
  SystemNotification,
  MusterPoint,
} from "./types";

import {
  INITIAL_PROJECT,
  INITIAL_BUILDINGS,
  INITIAL_FLOORS,
  INITIAL_ZONES,
  INITIAL_CONTRACTORS,
  INITIAL_WORKERS,
  INITIAL_DOCUMENTS,
  INITIAL_INDUCTIONS,
  INITIAL_WORK_PACKAGES,
  INITIAL_WORK_ORDERS,
  INITIAL_GATES,
  INITIAL_CAMERAS,
  INITIAL_INCIDENTS,
  INITIAL_INSPECTIONS,
  INITIAL_CHANGE_REQUESTS,
  INITIAL_TIMESHEETS,
  INITIAL_CLAIMS,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MUSTER_POINTS,
} from "./seed-data";

import { eventBus } from "./event-bus";
import { evaluateGateAccess } from "./services/access-engine";
import { updateWorkerLocation } from "./services/location-engine";
import {
  createAIDetection,
  createIncidentFromAIDetection,
  createBroadcastMessage,
  advanceIncidentStatus,
} from "./services/safety-engine";
import {
  transitionWorkOrderStage,
  recordWorkerAcknowledgement,
  generateAccessAuthorization,
} from "./services/workflow-engine";
import {
  generateTimesheetFromAttendance,
  createContractorClaim,
  createPaymentFromClaim,
} from "./services/commercial-engine";
import {
  executeScenario1,
  executeScenario2,
  executeScenario3,
  executeScenario4,
  executeScenario5,
  executeScenario6,
  executeScenario7,
  executeScenario8,
  type ScenarioStepResult,
  type SimulationContext,
} from "./simulation";

export type Role =
  | "Ministry of Public Health (MoPH) Auditor"
  | "Ashghal (PWA) Senior Resident Engineer"
  | "Hamad Medical Corporation (HMC) Safety Inspector"
  | "IMAR-Al Sraiya JV Main Contractor"
  | "HSE Field Marshal"
  | "Security Operations Lead"
  | "Commercial / Quantity Surveyor"
  | "Worker / Field Operative";

export const ROLES: readonly Role[] = [
  "Ministry of Public Health (MoPH) Auditor",
  "Ashghal (PWA) Senior Resident Engineer",
  "Hamad Medical Corporation (HMC) Safety Inspector",
  "IMAR-Al Sraiya JV Main Contractor",
  "HSE Field Marshal",
  "Security Operations Lead",
  "Commercial / Quantity Surveyor",
  "Worker / Field Operative",
] as const;

interface DomainStoreContextType {
  // Domain Entities
  project: Project;
  buildings: Building[];
  floors: Floor[];
  zones: Zone[];
  contractors: Contractor[];
  workers: Worker[];
  workerDocuments: WorkerDocument[];
  safetyInductions: SafetyInduction[];
  workPackages: WorkPackage[];
  workOrders: WorkOrder[];
  gates: Gate[];
  gateEvents: GateEvent[];
  attendance: AttendanceRecord[];
  locationEvents: LocationEvent[];
  cameras: Camera[];
  incidents: SafetyIncident[];
  broadcasts: BroadcastLog[];
  inspections: QualityInspection[];
  changeRequests: ChangeRequest[];
  timesheets: Timesheet[];
  claims: ContractorClaim[];
  payments: PaymentRecord[];
  auditLogs: AuditLogEntry[];
  notifications: SystemNotification[];
  musterPoints: MusterPoint[];

  // App & Telemetry state
  theme: "dark" | "light";
  toggleTheme: () => void;
  lang: SupportedLanguage;
  setLang: (l: SupportedLanguage) => void;
  toggleLang: () => void;
  role: Role;
  setRole: (r: Role) => void;
  clock: string;
  shiftPhase: string;
  headcount: number;
  emergency: boolean;
  accounted: number;
  startEmergency: () => void;
  standDown: () => void;
  simulating: boolean;
  toggleSimulator: () => void;
  gateQueues: Record<string, number>;
  throughputPerMin: number;

  // Derived Selectors
  presentWorkers: Worker[];
  activeHeadcount: number;
  zoneOccupancies: Record<string, number>;
  contractorManpower: Record<string, number>;
  activeWorkOrdersCount: number;
  safetyScore: number;
  canPerformAction: (action: "APPROVE_WORK_ORDER" | "APPROVE_CLAIM" | "DISBURSE_PAYMENT" | "OVERRIDE_GATE" | "TRIGGER_EMERGENCY" | "CLOSE_INCIDENT") => boolean;

  // Active Simulation Scenarios & Stepper Controls
  activeScenarioResult: ScenarioStepResult[] | null;
  activeScenarioNumber: number | null;
  currentScenarioStepIndex: number;
  isScenarioPaused: boolean;
  clearScenarioResult: () => void;
  runScenario: (num: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => ScenarioStepResult[];
  stepScenario: () => void;
  pauseScenario: () => void;
  resumeScenario: () => void;
  resetSimulation: () => void;

  // Operational Domain Mutations
  scanRfid: (gateId: string, workerId?: string, direction?: "IN" | "OUT") => GateEvent;
  submitManualGateOverride: (
    gateId: string,
    qid: string,
    operator: string,
    reason: string,
    photoUrl?: string,
  ) => GateEvent;
  moveWorker: (workerId: string, targetZoneId: string, coords?: { x: number; y: number }) => void;
  approveWorkOrder: (
    workOrderId: string,
    targetStage: WorkOrderStage,
    details?: { approverName: string; comment?: string; progress?: number },
  ) => void;
  acknowledgeWorkOrder: (workerId: string, workOrderId: string, signatureDataUrl?: string) => void;
  assignWorkerToWorkOrder: (workOrderId: string, workerId: string) => void;
  updateWorkOrderProgress: (workOrderId: string, progress: number, notes?: string) => void;
  completeWorkOrder: (workOrderId: string, evidenceNotes?: string) => void;
  submitIncident: (incidentData: Partial<SafetyIncident>) => SafetyIncident;
  updateIncidentStatus: (
    incidentId: string,
    status: IncidentStatus,
    details?: { assignedTo?: string; correctiveAction?: string },
  ) => void;
  emitBroadcast: (zoneId: string, text: string, severity?: "info" | "warn" | "crit") => void;
  submitQualityInspection: (inspection: Partial<QualityInspection>) => void;
  submitChangeRequest: (cr: Partial<ChangeRequest>) => void;
  approveChangeRequest: (changeRequestId: string, approverRole: string, approverName: string) => void;
  approveTimesheet: (timesheetId: string, signature: string) => void;
  submitContractorClaim: (claim: Partial<ContractorClaim>) => void;
  approveContractorClaim: (claimId: string, approverRole: string, approverName: string) => void;
  disbursePayment: (claimId: string) => void;
  markNotificationRead: (id: string) => void;
  addAuditLog: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;

  // Backwards compatibility aliases for existing UI
  events: GateEvent[];
  addEvent: (e: GateEvent) => void;
}

const DomainStoreContext = createContext<DomainStoreContextType | null>(null);

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
  const worker = INITIAL_WORKERS[(index * 7 + seq * 5) % INITIAL_WORKERS.length]!;
  const gate = INITIAL_GATES[(index + seq) % INITIAL_GATES.length]!;
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

  const roll = (seq * 17) % 100;
  let decision: "AUTHORIZED" | "DENIED" = "AUTHORIZED";
  let statusStr = "Authorized";

  if (worker.inductionStatus !== "VALID") {
    decision = "DENIED";
    statusStr = "Denied: Expired Safety Induction";
  } else if (roll < 3) {
    decision = "DENIED";
    statusStr = "Denied: Unassigned Work Order";
  } else if (roll === 4) {
    decision = "DENIED";
    statusStr = "Denied: Zone Capacity Exceeded";
  } else if (roll === 5) {
    decision = "DENIED";
    statusStr = "Denied: Suspended RFID Tag";
  }

  const transitSpeedSec = parseFloat((2.0 + ((seq * 3) % 22) / 10).toFixed(1));
  const timeStr = fmt(qatarNow());

  const fullWorker: Worker = {
    ...worker,
    name: worker.fullName,
    epc: worker.rfid,
    employerId: worker.contractorId,
    employer: worker.contractorName,
    inductionValid: worker.inductionStatus === "VALID",
    zone: worker.currentZoneId || "IPT-L3-East",
  };

  return {
    id: `EVT-${Date.now()}-${seq}`,
    timestamp: timeStr,
    time: timeStr,
    gateId: gate.id,
    gateName: gate.name,
    laneId: direction === "IN" ? "Lane 1" : "Lane 2",
    lane: direction === "IN" ? "Lane 1" : "Lane 2",
    workerId: worker.id,
    workerName: worker.fullName,
    worker: fullWorker,
    contractorName: worker.contractorName,
    trade: worker.trade,
    rfid: worker.rfid,
    qid: worker.qid,
    direction,
    decision,
    status: statusStr,
    transitSpeedSec,
  };
}

export function DomainStoreProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  // Settings
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [lang, setLangState] = useState<SupportedLanguage>(getStoredLanguage);
  const [role, setRole] = useState<Role>("IMAR-Al Sraiya JV Main Contractor");

  // Core Domain State
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [buildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [floors] = useState<Floor[]>(INITIAL_FLOORS);
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [contractors, setContractors] = useState<Contractor[]>(INITIAL_CONTRACTORS);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [workerDocuments, setWorkerDocuments] = useState<WorkerDocument[]>(INITIAL_DOCUMENTS);
  const [safetyInductions, setSafetyInductions] = useState<SafetyInduction[]>(INITIAL_INDUCTIONS);
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>(INITIAL_WORK_PACKAGES);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [gates, setGates] = useState<Gate[]>(INITIAL_GATES);
  const [gateEvents, setGateEvents] = useState<GateEvent[]>(() =>
    Array.from({ length: 16 }, (_, i) => makeEvent(i)),
  );
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [locationEvents, setLocationEvents] = useState<LocationEvent[]>([]);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState<SafetyIncident[]>(INITIAL_INCIDENTS);
  const [broadcasts, setBroadcasts] = useState<BroadcastLog[]>([]);
  const [inspections, setInspections] = useState<QualityInspection[]>(INITIAL_INSPECTIONS);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(INITIAL_CHANGE_REQUESTS);
  const [timesheets, setTimesheets] = useState<Timesheet[]>(INITIAL_TIMESHEETS);
  const [claims, setClaims] = useState<ContractorClaim[]>(INITIAL_CLAIMS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [musterPoints, setMusterPoints] = useState<MusterPoint[]>(INITIAL_MUSTER_POINTS);

  // Live Telemetry simulation state
  const [headcount, setHeadcount] = useState(864);
  const [emergency, setEmergency] = useState(false);
  const [accounted, setAccounted] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [clock, setClock] = useState("--:--:--");
  const [throughputPerMin, setThroughputPerMin] = useState(34);
  const [gateQueues, setGateQueues] = useState<Record<string, number>>({
    "GATE-01": 3,
    "GATE-02": 1,
    "GATE-03": 0,
    "GATE-04": 2,
  });

  // Scenario Runner State
  const [activeScenarioResult, setActiveScenarioResult] = useState<ScenarioStepResult[] | null>(null);
  const [activeScenarioNumber, setActiveScenarioNumber] = useState<number | null>(null);
  const [currentScenarioStepIndex, setCurrentScenarioStepIndex] = useState(0);
  const [isScenarioPaused, setIsScenarioPaused] = useState(false);

  // Derived Telemetry & Operational Metrics
  const presentWorkers = useMemo(
    () => workers.filter((w) => w.status === "On Site"),
    [workers],
  );

  const activeHeadcount = useMemo(() => {
    return presentWorkers.length;
  }, [presentWorkers]);

  const zoneOccupancies = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const z of zones) counts[z.id] = z.currentOccupancy;
    for (const w of presentWorkers) {
      if (w.currentZoneId) {
        counts[w.currentZoneId] = (counts[w.currentZoneId] || 0) + 1;
      }
    }
    return counts;
  }, [zones, presentWorkers]);

  const contractorManpower = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of contractors) counts[c.id] = c.actualManpower;
    for (const w of presentWorkers) {
      counts[w.contractorId] = (counts[w.contractorId] || 0) + 1;
    }
    return counts;
  }, [contractors, presentWorkers]);

  const activeWorkOrdersCount = useMemo(
    () => workOrders.filter((wo) => wo.status === "Active" || (wo.stage >= 7 && wo.stage <= 10)).length,
    [workOrders],
  );

  const safetyScore = useMemo(() => {
    const openIncidents = incidents.filter((i) => i.status !== "CLOSED").length;
    const criticalIncidents = incidents.filter((i) => i.status !== "CLOSED" && (i.severity === "Critical" || i.severity === "High")).length;
    const calculated = 99.4 - openIncidents * 0.8 - criticalIncidents * 1.5;
    return Math.max(75, Math.min(100, parseFloat(calculated.toFixed(1))));
  }, [incidents]);

  const canPerformAction = useCallback(
    (action: "APPROVE_WORK_ORDER" | "APPROVE_CLAIM" | "DISBURSE_PAYMENT" | "OVERRIDE_GATE" | "TRIGGER_EMERGENCY" | "CLOSE_INCIDENT") => {
      switch (action) {
        case "APPROVE_WORK_ORDER":
          return [
            "Ministry of Public Health (MoPH) Auditor",
            "Ashghal (PWA) Senior Resident Engineer",
            "Hamad Medical Corporation (HMC) Safety Inspector",
            "IMAR-Al Sraiya JV Main Contractor",
            "HSE Field Marshal",
          ].includes(role);
        case "APPROVE_CLAIM":
          return [
            "Ashghal (PWA) Senior Resident Engineer",
            "IMAR-Al Sraiya JV Main Contractor",
            "Commercial / Quantity Surveyor",
          ].includes(role);
        case "DISBURSE_PAYMENT":
          return ["Commercial / Quantity Surveyor", "Ashghal (PWA) Senior Resident Engineer"].includes(role);
        case "OVERRIDE_GATE":
          return ["Security Operations Lead", "HSE Field Marshal"].includes(role);
        case "TRIGGER_EMERGENCY":
          return ["HSE Field Marshal", "Security Operations Lead", "Hamad Medical Corporation (HMC) Safety Inspector"].includes(role);
        case "CLOSE_INCIDENT":
          return ["HSE Field Marshal", "Hamad Medical Corporation (HMC) Safety Inspector"].includes(role);
        default:
          return true;
      }
    },
    [role],
  );

  // Clock
  useEffect(() => {
    setClock(fmt(qatarNow()));
    const t = setInterval(() => setClock(fmt(qatarNow())), 1000);
    return () => clearInterval(t);
  }, []);

  // Theme
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setLang = useCallback((newLang: SupportedLanguage) => {
    setLangState(newLang);
    i18n.changeLanguage(newLang);
    applyLanguageToDOM(newLang);
    try {
      localStorage.setItem("mediinfra_lang", newLang);
    } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "ar" : "en");
  }, [lang, setLang]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const shiftPhase = useMemo(() => {
    const h = parseInt(clock.split(":")[0] ?? "0", 10) || qatarNow().getUTCHours();
    if (h >= 6 && h <= 8) return t("header.shiftMorning", "Morning Shift Ingress");
    if (h >= 12 && h <= 13) return t("header.shiftLunch", "Mid-day Handover & Meal Break");
    if (h >= 16 && h <= 18) return t("header.shiftEvening", "Evening Demobilization");
    return t("header.shiftStandard", "Standard Operating Shift");
  }, [clock, t]);

  // Add Audit Helper
  const addAuditLog = useCallback((entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  }, []);

  // ----------------------------------------------------
  // DOMAIN MUTATION: RFID Scan at Gate
  // ----------------------------------------------------
  const scanRfid = useCallback(
    (gateId: string, workerId?: string, direction: "IN" | "OUT" = "IN"): GateEvent => {
      const gate = gates.find((g) => g.id === gateId) || gates[0]!;
      const selectedWorker = workerId
        ? workers.find((w) => w.id === workerId)
        : workers[Math.floor(Math.random() * workers.length)];

      const currentWO = selectedWorker?.currentWorkOrderId
        ? workOrders.find((wo) => wo.id === selectedWorker.currentWorkOrderId)
        : workOrders.find((wo) => wo.assignedWorkerIds.includes(selectedWorker?.id || ""));

      const targetZone = currentWO ? zones.find((z) => z.id === currentWO.zoneId) : undefined;

      const evalResult = evaluateGateAccess({
        worker: selectedWorker,
        workOrder: currentWO,
        zone: targetZone,
        gate,
        direction,
      });

      const fallbackWorker = workers[0]!;
      const fullWorker: Worker = selectedWorker
        ? {
            ...selectedWorker,
            name: selectedWorker.fullName,
            epc: selectedWorker.rfid,
            employerId: selectedWorker.contractorId,
            employer: selectedWorker.contractorName,
            inductionValid: selectedWorker.inductionStatus === "VALID",
            zone: targetZone?.id || "IPT-L3-East",
          }
        : {
            ...fallbackWorker,
            id: "W-UNKNOWN",
            fullName: "Unregistered Worker",
            name: "Unregistered Worker",
            epc: "EPC-UNKNOWN",
            rfid: "EPC-UNKNOWN",
            qid: "00000000000",
            status: "Deactivated",
            inductionStatus: "NOT_COMPLETED",
            inductionValid: false,
          };

      const eventTime = fmt(qatarNow());
      const eventStatus = evalResult.decision === "AUTHORIZED" ? "Authorized" : `Denied: ${evalResult.denialReason || "Security"}`;

      const event: GateEvent = {
        id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: eventTime,
        time: eventTime,
        gateId: gate.id,
        gateName: gate.name,
        laneId: direction === "IN" ? "Lane 1" : "Lane 2",
        lane: direction === "IN" ? "Lane 1" : "Lane 2",
        workerId: selectedWorker?.id || "W-UNKNOWN",
        workerName: selectedWorker?.fullName || "Unregistered Worker",
        worker: fullWorker,
        contractorName: selectedWorker?.contractorName || "Unassigned",
        trade: selectedWorker?.trade || "General",
        rfid: selectedWorker?.rfid || "EPC-UNKNOWN",
        qid: selectedWorker?.qid || "00000000000",
        direction,
        decision: evalResult.decision,
        status: eventStatus,
        denialReason: evalResult.denialReason,
        denialMessage: evalResult.denialMessage,
        workOrderId: currentWO?.id,
        zoneId: targetZone?.id,
        transitSpeedSec: parseFloat((1.8 + Math.random() * 1.5).toFixed(1)),
        checks: evalResult.checks,
      };

      setGateEvents((prev) => [event, ...prev].slice(0, 150));

      if (evalResult.decision === "AUTHORIZED" && selectedWorker) {
        // Attendance Record
        const att: AttendanceRecord = {
          id: `ATT-${Date.now()}`,
          workerId: selectedWorker.id,
          date: new Date().toISOString().split("T")[0]!,
          direction,
          timestamp: event.timestamp,
          gateId: gate.id,
          workOrderId: currentWO?.id,
          source: "RFID_TURNSTILE",
        };
        setAttendance((prev) => [att, ...prev]);

        // Update Worker status
        setWorkers((prev) =>
          prev.map((w) => {
            if (w.id !== selectedWorker.id) return w;
            return {
              ...w,
              status: direction === "IN" ? "On Site" : "Off Site",
              currentBuildingId: direction === "IN" ? (targetZone?.buildingId || "IPT") : undefined,
              currentZoneId: direction === "IN" ? targetZone?.id : undefined,
            };
          }),
        );

        setHeadcount((h) => Math.min(1000, Math.max(700, h + (direction === "IN" ? 1 : -1))));

        toast.success(`Access Authorized · Gate Turnstile Opened`, {
          description: `${selectedWorker.fullName} (${selectedWorker.contractorName}) · ${gate.name}`,
        });

        addAuditLog({
          actor: selectedWorker.fullName,
          role: "Worker",
          action: direction === "IN" ? "GATE_ENTRY" : "GATE_EXIT",
          entity: "GateEvent",
          entityId: event.id,
          description: `Worker ${selectedWorker.fullName} verified at ${gate.name} (${event.laneId}).`,
        });
      } else {
        toast.error(`Access Denied: ${evalResult.denialReason}`, {
          description: evalResult.denialMessage,
        });

        addAuditLog({
          actor: "Access Engine",
          role: "Security Controller",
          action: "ACCESS_DENIED",
          entity: "GateEvent",
          entityId: event.id,
          description: `Access denied to ${selectedWorker?.fullName || "Unregistered"}: ${evalResult.denialReason}`,
        });
      }

      return event;
    },
    [gates, workers, workOrders, zones, addAuditLog],
  );

  // Manual Gate Override
  const submitManualGateOverride = useCallback(
    (
      gateId: string,
      qid: string,
      operator: string,
      reason: string,
      photoUrl?: string,
    ): GateEvent => {
      const gate = gates.find((g) => g.id === gateId) || gates[0]!;
      const worker = workers.find((w) => w.qid === qid) || workers[0]!;

      const eventTime = fmt(qatarNow());
      const fullWorker: Worker = {
        ...worker,
        name: worker.fullName,
        epc: worker.rfid,
        employerId: worker.contractorId,
        employer: worker.contractorName,
        inductionValid: worker.inductionStatus === "VALID",
        zone: worker.currentZoneId || "IPT-L3-East",
      };

      const event: GateEvent = {
        id: `EVT-${Date.now()}-OVERRIDE`,
        timestamp: eventTime,
        time: eventTime,
        gateId: gate.id,
        gateName: gate.name,
        laneId: "Lane 1",
        lane: "Lane 1",
        workerId: worker.id,
        workerName: worker.fullName,
        worker: fullWorker,
        contractorName: worker.contractorName,
        trade: worker.trade,
        rfid: worker.rfid,
        qid: worker.qid,
        direction: "IN",
        decision: "OVERRIDE_AUTHORIZED",
        status: "Authorized",
        transitSpeedSec: 3.5,
        manual: true,
        isManualOverride: true,
        overrideOperator: operator,
        overrideReason: reason,
        reason: reason,
      };

      setGateEvents((prev) => [event, ...prev]);

      addAuditLog({
        actor: operator,
        role: "Security Operator",
        action: "MANUAL_GATE_OVERRIDE",
        entity: "GateEvent",
        entityId: event.id,
        description: `Manual override by ${operator} for ${worker.fullName} (${qid}): ${reason}`,
      });

      toast.warning("Manual Gate Override Executed", {
        description: `Authorized by ${operator}. Logged to security audit.`,
      });

      return event;
    },
    [gates, workers, addAuditLog],
  );

  // ----------------------------------------------------
  // DOMAIN MUTATION: Move Worker & Evaluate Geofence
  // ----------------------------------------------------
  const moveWorker = useCallback(
    (workerId: string, targetZoneId: string, coords = { x: 30, y: 30 }) => {
      const worker = workers.find((w) => w.id === workerId);
      const targetZone = zones.find((z) => z.id === targetZoneId);
      if (!worker || !targetZone) return;

      const currentWO = workOrders.find((wo) => wo.id === worker.currentWorkOrderId);
      const authorizedZoneId = currentWO?.zoneId || "IPT-L3-East";
      const authorizedZoneName = currentWO?.zoneName || "East Ward Refit";

      const result = updateWorkerLocation(worker, targetZone, coords, authorizedZoneId, authorizedZoneName);

      setLocationEvents((prev) => [result.locationEvent, ...prev].slice(0, 100));

      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id !== workerId) return w;
          return {
            ...w,
            currentBuildingId: targetZone.buildingId,
            currentFloorId: targetZone.floorId,
            currentZoneId: targetZone.id,
            currentCoordinates: coords,
          };
        }),
      );

      if (!result.isAuthorized && result.breachEvent) {
        const breach = result.breachEvent;
        const incident: SafetyIncident = {
          id: `INC-${Date.now().toString().slice(-6)}`,
          source: "GEOFENCE_BREACH",
          sourceEventId: breach.id,
          workerId: worker.id,
          workerName: worker.fullName,
          contractorId: worker.contractorId,
          contractorName: worker.contractorName,
          zoneId: targetZone.id,
          zoneName: targetZone.name,
          type: "Geofence Intrusion",
          severity: breach.severity,
          description: `Worker moved into unauthorized zone ${targetZone.name}. Authorized for ${authorizedZoneName}.`,
          assignedTo: "Capt. Fahad Al-Naimi (HSE Field Marshal)",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        };

        setIncidents((prev) => [incident, ...prev]);

        toast.error("CRITICAL GEOFENCE BREACH DETECTED", {
          description: `${worker.fullName} entered unauthorized zone ${targetZone.name}.`,
          duration: 9000,
        });

        addAuditLog({
          actor: "Geofence Engine",
          role: "Spatial Tracking",
          action: "GEOFENCE_BREACH",
          entity: "Zone",
          entityId: targetZone.id,
          description: `Worker ${worker.fullName} breached ${targetZone.name}. Incident ${incident.id} opened.`,
        });
      }
    },
    [workers, zones, workOrders, addAuditLog],
  );

  // ----------------------------------------------------
  // WORK ORDER & APPROVAL WORKFLOWS
  // ----------------------------------------------------
  const approveWorkOrder = useCallback(
    (
      workOrderId: string,
      targetStage: WorkOrderStage,
      details?: { approverName: string; comment?: string; progress?: number },
    ) => {
      const wo = workOrders.find((w) => w.id === workOrderId);
      if (!wo) return;

      const { updatedOrder } = transitionWorkOrderStage(wo, targetStage, details);

      setWorkOrders((prev) => prev.map((w) => (w.id === workOrderId ? updatedOrder : w)));

      addAuditLog({
        actor: details?.approverName || "Reviewer",
        role: targetStage >= 4 ? "Consultant / Engineer" : "Main Contractor",
        action: "WORK_ORDER_APPROVED",
        entity: "WorkOrder",
        entityId: workOrderId,
        description: `Work order ${workOrderId} promoted to Stage ${targetStage} (${updatedOrder.status}).`,
      });

      toast.success(`Work Order ${workOrderId} Updated`, {
        description: `Advanced to ${updatedOrder.status} (Stage ${targetStage}).`,
      });
    },
    [workOrders, addAuditLog],
  );

  const acknowledgeWorkOrder = useCallback(
    (workerId: string, workOrderId: string, signatureDataUrl?: string) => {
      const worker = workers.find((w) => w.id === workerId);
      const wo = workOrders.find((w) => w.id === workOrderId);
      if (!worker || !wo) return;

      const ack = recordWorkerAcknowledgement(workerId, workOrderId, wo.qrToken, signatureDataUrl);
      const auth = generateAccessAuthorization(worker, wo);

      setWorkOrders((prev) =>
        prev.map((w) => {
          if (w.id !== workOrderId) return w;
          const nextAckList = Array.from(new Set([...w.acknowledgedWorkerIds, workerId]));
          return {
            ...w,
            acknowledgedWorkerIds: nextAckList,
            stage: nextAckList.length >= w.assignedWorkerIds.length ? 5 : w.stage,
            status: nextAckList.length >= w.assignedWorkerIds.length ? "Approved" : w.status,
          };
        }),
      );

      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id !== workerId) return w;
          return {
            ...w,
            accessStatus: "Authorized",
            currentWorkOrderId: workOrderId,
          };
        }),
      );

      addAuditLog({
        actor: worker.fullName,
        role: "Worker",
        action: "WORKER_SIGNED",
        entity: "WorkerAcknowledgement",
        entityId: workerId,
        description: `Worker ${worker.fullName} signed toolbox briefing for ${workOrderId}. RFID whitelisted.`,
      });

      toast.success("Toolbox Briefing Signed", {
        description: `Access authorization generated. RFID ${worker.rfid} whitelisted for Gate entry.`,
      });
    },
    [workers, workOrders, addAuditLog],
  );

  const assignWorkerToWorkOrder = useCallback(
    (workOrderId: string, workerId: string) => {
      setWorkOrders((prev) =>
        prev.map((wo) => {
          if (wo.id !== workOrderId) return wo;
          return {
            ...wo,
            assignedWorkerIds: Array.from(new Set([...wo.assignedWorkerIds, workerId])),
          };
        }),
      );
      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id !== workerId) return w;
          return {
            ...w,
            currentWorkOrderId: workOrderId,
            accessStatus: "Pending Briefing",
          };
        }),
      );
      toast.info(`Worker ${workerId} assigned to ${workOrderId}`);
    },
    [],
  );

  const updateWorkOrderProgress = useCallback(
    (workOrderId: string, progress: number, notes?: string) => {
      setWorkOrders((prev) =>
        prev.map((wo) => {
          if (wo.id !== workOrderId) return wo;
          return {
            ...wo,
            progress,
            stage: progress >= 100 ? 10 : 7,
            status: progress >= 100 ? "Under Inspection" : "Active",
          };
        }),
      );
      toast.success(`Work Order ${workOrderId} progress updated to ${progress}%`);
    },
    [],
  );

  const completeWorkOrder = useCallback(
    (workOrderId: string, evidenceNotes?: string) => {
      const wo = workOrders.find((w) => w.id === workOrderId);
      if (!wo) return;

      setWorkOrders((prev) =>
        prev.map((w) => {
          if (w.id !== workOrderId) return w;
          return {
            ...w,
            status: "Completed",
            stage: 10,
            progress: 100,
            actualEnd: new Date().toISOString(),
            completionEvidence: {
              notes: evidenceNotes || "Work completed and verified by supervisor.",
              verifiedBy: "Eng. Tariq Al-Masri",
              verifiedAt: new Date().toISOString(),
            },
          };
        }),
      );

      addAuditLog({
        actor: "Eng. Tariq Al-Masri",
        role: "Contractor Supervisor",
        action: "WORK_COMPLETED",
        entity: "WorkOrder",
        entityId: workOrderId,
        description: `Work order ${workOrderId} marked completed and verified.`,
      });

      toast.success(`Work Order ${workOrderId} Verified & Completed`);
    },
    [workOrders, addAuditLog],
  );

  // ----------------------------------------------------
  // SAFETY INCIDENTS & BROADCASTS
  // ----------------------------------------------------
  const submitIncident = useCallback(
    (incidentData: Partial<SafetyIncident>): SafetyIncident => {
      const newInc: SafetyIncident = {
        id: `INC-${Date.now().toString().slice(-6)}`,
        source: incidentData.source || "MANUAL_REPORT",
        ...(incidentData.workerId ? { workerId: incidentData.workerId } : {}),
        workerName: incidentData.workerName || "Unspecified",
        contractorId: incidentData.contractorId || "SC-01",
        contractorName: incidentData.contractorName || "Al Sraiya MEP Engineering",
        zoneId: incidentData.zoneId || "IPT-L3-East",
        zoneName: incidentData.zoneName || "East Ward Refit",
        type: incidentData.type || "General Safety Hazard",
        severity: incidentData.severity || "Medium",
        description: incidentData.description || "Field incident recorded.",
        assignedTo: incidentData.assignedTo || "Eng. Tariq Mansoor (HSE Lead)",
        status: "OPEN",
        createdAt: new Date().toISOString(),
      };

      setIncidents((prev) => [newInc, ...prev]);

      addAuditLog({
        actor: "HSE Field Team",
        role: "Safety Management",
        action: "SAFETY_INCIDENT_CREATED",
        entity: "SafetyIncident",
        entityId: newInc.id,
        description: `Safety Incident ${newInc.id} opened: ${newInc.type}`,
      });

      toast.error(`Safety Incident Created: ${newInc.id}`, {
        description: newInc.description,
      });

      return newInc;
    },
    [addAuditLog],
  );

  const updateIncidentStatus = useCallback(
    (
      incidentId: string,
      status: IncidentStatus,
      details?: { assignedTo?: string; correctiveAction?: string },
    ) => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id !== incidentId) return inc;
          return advanceIncidentStatus(inc, status, details);
        }),
      );

      addAuditLog({
        actor: "HSE Command",
        role: "HSE Lead",
        action: `INCIDENT_${status}`,
        entity: "SafetyIncident",
        entityId: incidentId,
        description: `Incident ${incidentId} transitioned to ${status}. ${details?.correctiveAction || ""}`,
      });

      toast.success(`Incident ${incidentId} Updated`, {
        description: `Status: ${status}`,
      });
    },
    [addAuditLog],
  );

  const emitBroadcast = useCallback(
    (zoneId: string, text: string, severity: "info" | "warn" | "crit" = "warn") => {
      const zone = zones.find((z) => z.id === zoneId) || zones[0]!;
      const bc = createBroadcastMessage(zone, text, severity, "Arabic & English", "HSE_MANUAL");

      setBroadcasts((prev) => [bc, ...prev]);

      toast.info(`Public Address Broadcast Dispatched`, {
        description: `Zone: ${zone.name} — "${text}"`,
      });

      addAuditLog({
        actor: "HSE Command",
        role: "Safety Dispatch",
        action: "BROADCAST_EMITTED",
        entity: "BroadcastLog",
        entityId: bc.id,
        description: `PA broadcast to ${zone.name}: ${text}`,
      });
    },
    [zones, addAuditLog],
  );

  // ----------------------------------------------------
  // QUALITY, CHANGES, TIMESHEETS, CLAIMS, PAYMENTS
  // ----------------------------------------------------
  const submitQualityInspection = useCallback((inspection: Partial<QualityInspection>) => {
    const newQi: QualityInspection = {
      id: `QI-${Date.now().toString().slice(-6)}`,
      workOrderId: inspection.workOrderId || "WO-1027",
      workOrderTitle: inspection.workOrderTitle || "Medical Infrastructure Works",
      contractorName: inspection.contractorName || "Al Sraiya MEP Engineering",
      zoneName: inspection.zoneName || "IPT-L3-East",
      inspectorName: inspection.inspectorName || "Eng. Ahmed Al-Bishri",
      inspectorRole: "KEO Quality Assurance Engineer",
      inspectionDate: new Date().toISOString().split("T")[0]!,
      checklist: inspection.checklist || [
        { id: "c1", description: "Brazing joint penetration & dye test", passed: true },
        { id: "c2", description: "HEPA air barrier containment seal", passed: true },
      ],
      result: inspection.result || "PASS",
      defectsCount: inspection.defectsCount || 0,
      defectNotes: inspection.defectNotes,
      status: inspection.result === "FAIL" ? "RECTIFICATION_REQUIRED" : "VERIFIED_AND_CLOSED",
      signedAt: new Date().toISOString(),
    };

    setInspections((prev) => [newQi, ...prev]);
    toast.success(`Quality Inspection ${newQi.id} Logged: ${newQi.result}`);
  }, []);

  const submitChangeRequest = useCallback((cr: Partial<ChangeRequest>) => {
    const newCr: ChangeRequest = {
      id: `CHANGE-${Date.now().toString().slice(-4)}`,
      code: `CR-P875-${Date.now().toString().slice(-3)}`,
      projectId: "P875",
      workPackageId: cr.workPackageId || "WP-01",
      ...(cr.workOrderId ? { workOrderId: cr.workOrderId } : {}),
      title: cr.title || "Field Variation Request",
      description: cr.description || "Variation scope.",
      reason: cr.reason || "Field condition modification.",
      requestedBy: cr.requestedBy || "Subcontractor Director",
      requesterRole: "Subcontractor PM",
      contractorName: cr.contractorName || "Al Sraiya MEP Engineering",
      costImpact: cr.costImpact || 50000,
      scheduleImpactDays: cr.scheduleImpactDays || 2,
      riskImpact: cr.riskImpact || "Low",
      affectedZones: cr.affectedZones || ["IPT-L3-East"],
      affectedWorkersCount: cr.affectedWorkersCount || 4,
      approvalChain: [
        { role: "Subcontractor PM", approver: "Eng. Mounir Hadad", status: "APPROVED", timestamp: new Date().toISOString() },
        { role: "Main Contractor Lead", approver: "IMAR-Al Sraiya JV Lead", status: "PENDING" },
      ],
      status: "Submitted",
      submittedAt: new Date().toISOString(),
    };

    setChangeRequests((prev) => [newCr, ...prev]);
    toast.success(`Change Request ${newCr.code} Submitted`);
  }, []);

  const approveChangeRequest = useCallback((changeRequestId: string, approverRole: string, approverName: string) => {
    setChangeRequests((prev) =>
      prev.map((cr) => {
        if (cr.id !== changeRequestId) return cr;
        return {
          ...cr,
          status: "Approved",
          approvalChain: cr.approvalChain.map((c) => ({
            ...c,
            status: "APPROVED" as const,
            timestamp: new Date().toISOString(),
          })),
        };
      }),
    );
    toast.success(`Change Request Approved by ${approverRole}`);
  }, []);

  const approveTimesheet = useCallback((timesheetId: string, signature: string) => {
    setTimesheets((prev) =>
      prev.map((t) => {
        if (t.id !== timesheetId) return t;
        return {
          ...t,
          approvalStatus: "SUPERVISOR_APPROVED",
          supervisorSignature: signature,
        };
      }),
    );
    toast.success(`Timesheet ${timesheetId} Approved`);
  }, []);

  const submitContractorClaim = useCallback((claimData: Partial<ContractorClaim>) => {
    const newClaim: ContractorClaim = {
      id: `CLAIM-${Date.now()}`,
      code: `IPC-SUB-${Date.now().toString().slice(-4)}`,
      contractorId: claimData.contractorId || "SC-01",
      contractorName: claimData.contractorName || "Al Sraiya MEP Engineering",
      workPackageId: claimData.workPackageId || "WP-01",
      workPackageName: claimData.workPackageName || "MEP Revamp",
      billingPeriod: "Current Bi-Weekly Shift",
      totalManpowerCount: claimData.totalManpowerCount || 228,
      totalManHours: claimData.totalManHours || 41320,
      calculatedAmount: claimData.calculatedAmount || 2685800,
      ...(claimData.approvedAmount !== undefined ? { approvedAmount: claimData.approvedAmount } : {}),
      verifiedProgressPercentage: claimData.verifiedProgressPercentage || 78.5,
      supportingDocumentCount: 12,
      status: "Submitted",
      submittedAt: new Date().toISOString(),
      approvals: [],
    };
    setClaims((prev) => [newClaim, ...prev]);
    toast.success(`Contractor Claim ${newClaim.code} Submitted`);
  }, []);

  const approveContractorClaim = useCallback((claimId: string, approverRole: string, approverName: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id !== claimId) return c;
        return {
          ...c,
          status: "Approved",
          approvedAmount: c.calculatedAmount,
          approvals: [
            ...c.approvals,
            {
              role: approverRole,
              approver: approverName,
              status: "APPROVED",
              timestamp: new Date().toISOString(),
              comment: "Biometric turnstile cross-verification passed.",
            },
          ],
        };
      }),
    );
    toast.success(`Claim ${claimId} Approved for Payment`);
  }, []);

  const disbursePayment = useCallback((claimId: string) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    const payment = createPaymentFromClaim(claim);
    setPayments((prev) => [payment, ...prev]);
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: "Paid" } : c)),
    );

    toast.success(`Payment Disbursed: QAR ${payment.amount.toLocaleString()}`, {
      description: `Treasury Batch: ${payment.treasuryBatchRef}`,
    });
  }, [claims]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  // ----------------------------------------------------
  // ----------------------------------------------------
  // RUN END-TO-END SCENARIOS (1 to 8) & STEPPER CONTROLS
  // ----------------------------------------------------
  const runScenario = useCallback(
    (num: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8): ScenarioStepResult[] => {
      const currentCtx: SimulationContext = {
        workers,
        workOrders,
        zones,
        gates,
        cameras,
        contractors,
        incidents,
        broadcasts,
        timesheets,
        claims,
        payments,
        changeRequests,
        auditLogs,
        notifications,
        headcount,
        inspections,
        musterPoints,
      };

      let result: { steps: ScenarioStepResult[]; updatedCtx: Partial<SimulationContext> };

      switch (num) {
        case 1:
          result = executeScenario1(currentCtx);
          break;
        case 2:
          result = executeScenario2(currentCtx);
          break;
        case 3:
          result = executeScenario3(currentCtx);
          break;
        case 4:
          result = executeScenario4(currentCtx);
          break;
        case 5:
          result = executeScenario5(currentCtx);
          break;
        case 6:
          result = executeScenario6(currentCtx);
          break;
        case 7:
          result = executeScenario7(currentCtx);
          break;
        case 8:
          result = executeScenario8(currentCtx);
          break;
        default:
          result = { steps: [], updatedCtx: {} };
      }

      // Apply state updates
      if (result.updatedCtx.workers) setWorkers(result.updatedCtx.workers);
      if (result.updatedCtx.workOrders) setWorkOrders(result.updatedCtx.workOrders);
      if (result.updatedCtx.timesheets) setTimesheets(result.updatedCtx.timesheets);
      if (result.updatedCtx.claims) setClaims(result.updatedCtx.claims);
      if (result.updatedCtx.payments) setPayments(result.updatedCtx.payments);
      if (result.updatedCtx.incidents) setIncidents(result.updatedCtx.incidents);
      if (result.updatedCtx.broadcasts) setBroadcasts(result.updatedCtx.broadcasts);
      if (result.updatedCtx.changeRequests) setChangeRequests(result.updatedCtx.changeRequests);
      if (result.updatedCtx.auditLogs) setAuditLogs(result.updatedCtx.auditLogs);
      if (result.updatedCtx.notifications) setNotifications(result.updatedCtx.notifications);
      if (result.updatedCtx.inspections) setInspections(result.updatedCtx.inspections);
      if (result.updatedCtx.gates) setGates(result.updatedCtx.gates);
      if (result.updatedCtx.musterPoints) setMusterPoints(result.updatedCtx.musterPoints);

      setActiveScenarioResult(result.steps);
      setActiveScenarioNumber(num);
      setCurrentScenarioStepIndex(result.steps.length);
      setIsScenarioPaused(false);

      toast.success(`Executed Scenario ${num}`, {
        description: `Completed ${result.steps.length} operational steps across domain services.`,
      });

      return result.steps;
    },
    [
      workers,
      workOrders,
      zones,
      gates,
      cameras,
      contractors,
      incidents,
      broadcasts,
      timesheets,
      claims,
      payments,
      changeRequests,
      auditLogs,
      notifications,
      headcount,
      inspections,
      musterPoints,
    ],
  );

  const clearScenarioResult = useCallback(() => {
    setActiveScenarioResult(null);
    setActiveScenarioNumber(null);
    setCurrentScenarioStepIndex(0);
    setIsScenarioPaused(false);
  }, []);

  const stepScenario = useCallback(() => {
    if (!activeScenarioResult || activeScenarioResult.length === 0) {
      runScenario(1);
      return;
    }
    if (currentScenarioStepIndex < activeScenarioResult.length) {
      const nextIdx = currentScenarioStepIndex + 1;
      setCurrentScenarioStepIndex(nextIdx);
      const step = activeScenarioResult[nextIdx - 1];
      if (step) {
        toast.info(`Step ${step.step}: ${step.title}`, {
          description: step.description,
        });
      }
    } else {
      toast.success("All steps completed for this scenario.");
    }
  }, [activeScenarioResult, currentScenarioStepIndex, runScenario]);

  const pauseScenario = useCallback(() => {
    setIsScenarioPaused(true);
    toast.info("Scenario simulation paused");
  }, []);

  const resumeScenario = useCallback(() => {
    setIsScenarioPaused(false);
    toast.info("Scenario simulation resumed");
  }, []);

  const resetSimulation = useCallback(() => {
    setProject(INITIAL_PROJECT);
    setZones(INITIAL_ZONES);
    setContractors(INITIAL_CONTRACTORS);
    setWorkers(INITIAL_WORKERS);
    setWorkerDocuments(INITIAL_DOCUMENTS);
    setSafetyInductions(INITIAL_INDUCTIONS);
    setWorkPackages(INITIAL_WORK_PACKAGES);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setGates(INITIAL_GATES);
    setGateEvents(Array.from({ length: 16 }, (_, i) => makeEvent(i)));
    setAttendance([]);
    setLocationEvents([]);
    setCameras(INITIAL_CAMERAS);
    setIncidents(INITIAL_INCIDENTS);
    setBroadcasts([]);
    setInspections(INITIAL_INSPECTIONS);
    setChangeRequests(INITIAL_CHANGE_REQUESTS);
    setTimesheets(INITIAL_TIMESHEETS);
    setClaims(INITIAL_CLAIMS);
    setPayments(INITIAL_PAYMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setMusterPoints(INITIAL_MUSTER_POINTS);
    setEmergency(false);
    setSimulating(false);
    setActiveScenarioResult(null);
    setActiveScenarioNumber(null);
    setCurrentScenarioStepIndex(0);
    setIsScenarioPaused(false);
    toast.success("Site simulation reset to deterministic baseline", {
      description: "All worker rosters, permits, gates, and financial ledgers restored.",
    });
  }, []);

  // Emergency Muster
  const startEmergency = useCallback(() => {
    setEmergency(true);
    toast.error("SITE-WIDE EMERGENCY EVACUATION ACTIVE", {
      description: "All optical turnstiles released open. Muster points counting.",
      duration: 9000,
    });
    addAuditLog({
      actor: "Command Control",
      role: "HSE Field Marshal",
      action: "EMERGENCY_ACTIVATED",
      entity: "Project",
      entityId: "P875",
      description: "Emergency alarm tripped. All perimeter gates in fail-safe open mode.",
    });
  }, [addAuditLog]);

  const standDown = useCallback(() => {
    setEmergency(false);
    toast.success("Site Stand-Down Verified — Normal Operations Restored");
    addAuditLog({
      actor: "Command Control",
      role: "HSE Field Marshal",
      action: "EMERGENCY_STOOD_DOWN",
      entity: "Project",
      entityId: "P875",
      description: "All muster points accounted. Normal turnstile telemetry resumed.",
    });
  }, [addAuditLog]);

  // Continuous Telemetry Loop
  useEffect(() => {
    if (!simulating) return;

    const interval = setInterval(() => {
      const g = gates[Math.floor(Math.random() * gates.length)]!;
      scanRfid(g.id, undefined, Math.random() > 0.4 ? "IN" : "OUT");
      setThroughputPerMin(30 + Math.floor(Math.random() * 12));
    }, 4000);

    return () => clearInterval(interval);
  }, [simulating, gates, scanRfid]);

  // Emergency muster counter loop
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

  const value = useMemo<DomainStoreContextType>(
    () => ({
      project,
      buildings,
      floors,
      zones,
      contractors,
      workers,
      workerDocuments,
      safetyInductions,
      workPackages,
      workOrders,
      gates,
      gateEvents,
      attendance,
      locationEvents,
      cameras,
      incidents,
      broadcasts,
      inspections,
      changeRequests,
      timesheets,
      claims,
      payments,
      auditLogs,
      notifications,
      musterPoints,

      theme,
      toggleTheme,
      lang,
      setLang,
      toggleLang,
      role,
      setRole,
      clock,
      shiftPhase,
      headcount,
      emergency,
      accounted,
      startEmergency,
      standDown,
      simulating,
      toggleSimulator: () =>
        setSimulating((s) => {
          const next = !s;
          if (next) {
            toast.success("Live telemetry simulator active", {
              description: "Streaming 60 Hz RFID turnstile and edge AI telemetry events.",
            });
          } else {
            toast.info("Live telemetry simulator paused");
          }
          return next;
        }),
      gateQueues,
      throughputPerMin,

      // Derived Selectors
      presentWorkers,
      activeHeadcount,
      zoneOccupancies,
      contractorManpower,
      activeWorkOrdersCount,
      safetyScore,
      canPerformAction,

      activeScenarioResult,
      activeScenarioNumber,
      currentScenarioStepIndex,
      isScenarioPaused,
      clearScenarioResult,
      runScenario,
      stepScenario,
      pauseScenario,
      resumeScenario,
      resetSimulation,

      scanRfid,
      submitManualGateOverride,
      moveWorker,
      approveWorkOrder,
      acknowledgeWorkOrder,
      assignWorkerToWorkOrder,
      updateWorkOrderProgress,
      completeWorkOrder,
      submitIncident,
      updateIncidentStatus,
      emitBroadcast,
      submitQualityInspection,
      submitChangeRequest,
      approveChangeRequest,
      approveTimesheet,
      submitContractorClaim,
      approveContractorClaim,
      disbursePayment,
      markNotificationRead,
      addAuditLog,

      // Backwards-compatible events
      events: gateEvents,
      addEvent: (e) => setGateEvents((prev) => [e, ...prev]),
    }),
    [
      project,
      buildings,
      floors,
      zones,
      contractors,
      workers,
      workerDocuments,
      safetyInductions,
      workPackages,
      workOrders,
      gates,
      gateEvents,
      attendance,
      locationEvents,
      cameras,
      incidents,
      broadcasts,
      inspections,
      changeRequests,
      timesheets,
      claims,
      payments,
      auditLogs,
      notifications,
      musterPoints,
      theme,
      toggleTheme,
      lang,
      setLang,
      toggleLang,
      role,
      clock,
      shiftPhase,
      headcount,
      emergency,
      accounted,
      startEmergency,
      standDown,
      simulating,
      gateQueues,
      throughputPerMin,
      presentWorkers,
      activeHeadcount,
      zoneOccupancies,
      contractorManpower,
      activeWorkOrdersCount,
      safetyScore,
      canPerformAction,
      activeScenarioResult,
      activeScenarioNumber,
      currentScenarioStepIndex,
      isScenarioPaused,
      clearScenarioResult,
      runScenario,
      stepScenario,
      pauseScenario,
      resumeScenario,
      resetSimulation,
      scanRfid,
      submitManualGateOverride,
      moveWorker,
      approveWorkOrder,
      acknowledgeWorkOrder,
      assignWorkerToWorkOrder,
      updateWorkOrderProgress,
      completeWorkOrder,
      submitIncident,
      updateIncidentStatus,
      emitBroadcast,
      submitQualityInspection,
      submitChangeRequest,
      approveChangeRequest,
      approveTimesheet,
      submitContractorClaim,
      approveContractorClaim,
      disbursePayment,
      markNotificationRead,
      addAuditLog,
    ],
  );

  return <DomainStoreContext.Provider value={value}>{children}</DomainStoreContext.Provider>;
}

export function useDomainStore() {
  const ctx = useContext(DomainStoreContext);
  if (!ctx) throw new Error("useDomainStore must be used inside DomainStoreProvider");
  return ctx;
}

// Backwards-compatible hook export so existing components work immediately!
export const useMediInfra = useDomainStore;
export const MediInfraProvider = DomainStoreProvider;
