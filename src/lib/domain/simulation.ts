/**
 * Site Guardian — Simulation Suite & The 6 Demo Scenarios
 * Implements deterministic execution of the 6 end-to-end operational scenarios.
 */

import { eventBus } from "./event-bus";
import { evaluateGateAccess } from "./services/access-engine";
import { updateWorkerLocation } from "./services/location-engine";
import { createAIDetection, createIncidentFromAIDetection, createBroadcastMessage, advanceIncidentStatus } from "./services/safety-engine";
import { transitionWorkOrderStage, recordWorkerAcknowledgement, generateAccessAuthorization } from "./services/workflow-engine";
import { generateTimesheetFromAttendance, createContractorClaim, createPaymentFromClaim } from "./services/commercial-engine";
import type {
  Worker,
  WorkOrder,
  Zone,
  Gate,
  Camera,
  Contractor,
  ChangeRequest,
  GateEvent,
  AttendanceRecord,
  SafetyIncident,
  BroadcastLog,
  Timesheet,
  ContractorClaim,
  PaymentRecord,
  AuditLogEntry,
  SystemNotification,
} from "./types";

export interface SimulationContext {
  workers: Worker[];
  workOrders: WorkOrder[];
  zones: Zone[];
  gates: Gate[];
  cameras: Camera[];
  contractors: Contractor[];
  incidents: SafetyIncident[];
  broadcasts: BroadcastLog[];
  timesheets: Timesheet[];
  claims: ContractorClaim[];
  payments: PaymentRecord[];
  changeRequests: ChangeRequest[];
  auditLogs: AuditLogEntry[];
  notifications: SystemNotification[];
  headcount: number;
}

export interface ScenarioStepResult {
  step: number;
  time: string;
  title: string;
  description: string;
  entity: string;
  entityId: string;
  status: "success" | "warning" | "error" | "info";
}

// ----------------------------------------------------
// SCENARIO 1: SUCCESSFUL WORKER LIFECYCLE (W-0245)
// ----------------------------------------------------
export function executeScenario1(ctx: SimulationContext): {
  steps: ScenarioStepResult[];
  updatedCtx: Partial<SimulationContext>;
} {
  const steps: ScenarioStepResult[] = [];
  const worker = ctx.workers.find((w) => w.id === "W-0245") || ctx.workers[0]!;
  const workOrder = ctx.workOrders.find((wo) => wo.id === "WO-1027") || ctx.workOrders[0]!;
  const gate = ctx.gates.find((g) => g.id === "GATE-02") || ctx.gates[0]!;
  const zone = ctx.zones.find((z) => z.id === "IPT-L3-East") || ctx.zones[0]!;
  const contractor = ctx.contractors.find((c) => c.id === worker.contractorId) || ctx.contractors[0]!;

  // 1. 07:05 Worker scheduled & Work Order Approved
  const { updatedOrder } = transitionWorkOrderStage(workOrder, 5, {
    approverRole: "Consultant / Engineer",
    approverName: "Eng. Tariq Al-Mansoor (KEO)",
    comment: "All method statements, gas hazard assessments and worker quotas verified.",
  });
  steps.push({
    step: 1,
    time: "07:05:00",
    title: "Work Order Approved & QR Issued",
    description: `Consultant signed Work Order ${workOrder.id}. Secure QR token generated: ${workOrder.qrToken}`,
    entity: "WorkOrder",
    entityId: workOrder.id,
    status: "success",
  });

  // 2. 07:13 Worker scans QR, reads briefing & digitally signs
  const ack = recordWorkerAcknowledgement(worker.id, workOrder.id, workOrder.qrToken, "data:image/svg+xml;base64,mockSignature");
  const auth = generateAccessAuthorization(worker, updatedOrder);
  const updatedWorker: Worker = {
    ...worker,
    accessStatus: "Authorized",
  };
  steps.push({
    step: 2,
    time: "07:13:42",
    title: "Worker Signs Briefing & Access Authorized",
    description: `Worker ${worker.fullName} (${worker.id}) acknowledged hazards and electronically signed. RFID ${worker.rfid} whitelisted for Gate 02.`,
    entity: "WorkerAcknowledgement",
    entityId: worker.id,
    status: "success",
  });

  // 3. 07:20 Worker presents RFID hard-hat tag at Gate 02
  const accessResult = evaluateGateAccess({
    worker: updatedWorker,
    workOrder: {
      ...updatedOrder,
      assignedWorkerIds: Array.from(new Set([...updatedOrder.assignedWorkerIds, worker.id])),
      acknowledgedWorkerIds: Array.from(new Set([...updatedOrder.acknowledgedWorkerIds, worker.id])),
    },
    zone,
    gate,
    direction: "IN",
  });

  const gateEvent: GateEvent = {
    id: `EVT-${Date.now()}-01`,
    timestamp: "07:20:08",
    time: "07:20:08",
    gateId: gate.id,
    gateName: gate.name,
    laneId: "Lane 1",
    lane: "Lane 1",
    workerId: worker.id,
    workerName: worker.fullName,
    worker: {
      ...worker,
      name: worker.fullName,
      epc: worker.rfid,
      employerId: worker.contractorId,
      employer: worker.contractorName,
      inductionValid: worker.inductionStatus === "VALID",
      zone: zone.id,
    },
    contractorName: worker.contractorName,
    trade: worker.trade,
    rfid: worker.rfid,
    qid: worker.qid,
    direction: "IN",
    decision: accessResult.decision,
    status: "Authorized",
    workOrderId: workOrder.id,
    zoneId: zone.id,
    transitSpeedSec: 2.1,
  };

  const attendanceIn: AttendanceRecord = {
    id: `ATT-${Date.now()}-IN`,
    workerId: worker.id,
    date: "2026-09-10",
    direction: "IN",
    timestamp: "07:20:08",
    gateId: gate.id,
    workOrderId: workOrder.id,
    source: "RFID_TURNSTILE",
  };

  steps.push({
    step: 3,
    time: "07:20:08",
    title: "Gate 02 RFID Tap — Access Authorized",
    description: `17-point rule engine evaluated PASS. Gate 02 turnstile released open. Attendance IN logged for ${worker.fullName}.`,
    entity: "GateEvent",
    entityId: gateEvent.id,
    status: "success",
  });

  // 4. 07:31 Worker reaches IPT L3 East work zone & Geofence validates
  const locResult = updateWorkerLocation(updatedWorker, zone, { x: 22, y: 18 }, zone.id, zone.name);
  const workerOnSite: Worker = {
    ...updatedWorker,
    status: "On Site",
    currentBuildingId: "IPT",
    currentFloorId: "IPT-L3",
    currentZoneId: zone.id,
    currentWorkOrderId: workOrder.id,
    currentCoordinates: { x: 22, y: 18 },
  };

  steps.push({
    step: 4,
    time: "07:31:00",
    title: "Digital Twin Presence & Geofence Verified",
    description: `Worker entered designated zone ${zone.name}. Spatial boundary match verified with zero breach warnings.`,
    entity: "Zone",
    entityId: zone.id,
    status: "success",
  });

  // 5. 08:00 AI Camera confirms full PPE compliance
  steps.push({
    step: 5,
    time: "08:00:00",
    title: "Edge AI Camera Verified PPE Compliance",
    description: `CAM-03 confirmed Safety Helmet, Hi-Vis Vest and eye protection with 99.1% neural confidence.`,
    entity: "Camera",
    entityId: "CAM-03",
    status: "success",
  });

  // 6. 17:00 Work finished, Worker exits at Gate 02
  const gateExitEvent: GateEvent = {
    id: `EVT-${Date.now()}-02`,
    timestamp: "17:00:12",
    time: "17:00:12",
    gateId: gate.id,
    gateName: gate.name,
    laneId: "Lane 2",
    lane: "Lane 2",
    workerId: worker.id,
    workerName: worker.fullName,
    worker: {
      ...worker,
      name: worker.fullName,
      epc: worker.rfid,
      employerId: worker.contractorId,
      employer: worker.contractorName,
      inductionValid: worker.inductionStatus === "VALID",
      zone: zone.id,
    },
    contractorName: worker.contractorName,
    trade: worker.trade,
    rfid: worker.rfid,
    qid: worker.qid,
    direction: "OUT",
    decision: "AUTHORIZED",
    status: "Authorized",
    workOrderId: workOrder.id,
    transitSpeedSec: 1.9,
  };

  const attendanceOut: AttendanceRecord = {
    id: `ATT-${Date.now()}-OUT`,
    workerId: worker.id,
    date: "2026-09-10",
    direction: "OUT",
    timestamp: "17:00:12",
    gateId: gate.id,
    workOrderId: workOrder.id,
    source: "RFID_TURNSTILE",
  };

  const timesheet = generateTimesheetFromAttendance(workerOnSite, updatedOrder, "07:20:08", "17:00:12");
  steps.push({
    step: 6,
    time: "17:00:12",
    title: "Gate 02 Exit & Timesheet Calculated",
    description: `Worker tapped out. Active shift: 8h 47m. Timesheet TS-${timesheet.id} created with 8.0h regular + 0.78h overtime verified.`,
    entity: "Timesheet",
    entityId: timesheet.id,
    status: "success",
  });

  // 7. 17:15 Work order completed & Contractor Claim generated
  const completedWO: WorkOrder = {
    ...updatedOrder,
    status: "Completed",
    stage: 10,
    progress: 100,
    actualEnd: "17:15:00",
  };

  const claim = createContractorClaim(contractor, workOrder.workPackageId, "IPT Level 3 Clinical Area MEP Revamp", [timesheet], 100);
  const payment = createPaymentFromClaim(claim);

  steps.push({
    step: 7,
    time: "17:15:00",
    title: "Claim Generated & Treasury Payment Disbursed",
    description: `Contractor Claim ${claim.code} approved against verified man-hours. Payment ${payment.invoiceNumber} disbursed via QNB Treasury batch.`,
    entity: "PaymentRecord",
    entityId: payment.id,
    status: "success",
  });

  // Generate audit trail entries
  const newAudit: AuditLogEntry[] = [
    {
      id: `AUD-${Date.now()}-1`,
      timestamp: "07:20:08",
      actor: worker.fullName,
      role: "Worker",
      action: "GATE_ENTRY",
      entity: "GateEvent",
      entityId: gateEvent.id,
      description: `Worker W-0245 entered Gate 02 after 17 rule checks passed.`,
    },
    {
      id: `AUD-${Date.now()}-2`,
      timestamp: "17:00:12",
      actor: worker.fullName,
      role: "Worker",
      action: "GATE_EXIT",
      entity: "GateEvent",
      entityId: gateExitEvent.id,
      description: `Worker W-0245 exited Gate 02. Timesheet generated.`,
    },
    {
      id: `AUD-${Date.now()}-3`,
      timestamp: "17:15:00",
      actor: "Commercial Lead",
      role: "Commercial QS",
      action: "CLAIM_APPROVED",
      entity: "ContractorClaim",
      entityId: claim.id,
      description: `Claim ${claim.code} approved and sent to treasury for payment.`,
    },
  ];

  eventBus.emit("GATE_ENTRY", gateEvent, worker.fullName, "Worker", gateEvent.id, "GateEvent");
  eventBus.emit("ATTENDANCE_IN", attendanceIn, "Attendance Service", "Automated Operations", attendanceIn.id, "AttendanceRecord");
  eventBus.emit("TIMESHEET_CREATED", timesheet, "Commercial Engine", "Automated Operations", timesheet.id, "Timesheet");
  eventBus.emit("CLAIM_APPROVED", claim, "Commercial QS", "KEO Lead QS", claim.id, "ContractorClaim");
  eventBus.emit("PAYMENT_RELEASED", payment, "HMC Treasury", "Treasury Lead", payment.id, "PaymentRecord");

  return {
    steps,
    updatedCtx: {
      workers: ctx.workers.map((w) => (w.id === worker.id ? workerOnSite : w)),
      workOrders: ctx.workOrders.map((wo) => (wo.id === workOrder.id ? completedWO : wo)),
      timesheets: [timesheet, ...ctx.timesheets],
      claims: [claim, ...ctx.claims],
      payments: [payment, ...ctx.payments],
      auditLogs: [...newAudit, ...ctx.auditLogs],
    },
  };
}

// ----------------------------------------------------
// SCENARIO 2: ACCESS DENIED (EXPIRED INDUCTION - W-0317)
// ----------------------------------------------------
export function executeScenario2(ctx: SimulationContext): {
  steps: ScenarioStepResult[];
  updatedCtx: Partial<SimulationContext>;
} {
  const steps: ScenarioStepResult[] = [];
  const worker = ctx.workers.find((w) => w.id === "W-0317") || ctx.workers[1]!;
  const gate = ctx.gates.find((g) => g.id === "GATE-02") || ctx.gates[1]!;
  const workOrder = ctx.workOrders.find((wo) => wo.id === "WO-2026-P875-0148");

  const accessResult = evaluateGateAccess({
    worker,
    workOrder,
    gate,
    direction: "IN",
  });

  const gateEvent: GateEvent = {
    id: `EVT-${Date.now()}-DENIED`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    gateId: gate.id,
    gateName: gate.name,
    laneId: "Lane 1",
    lane: "Lane 1",
    workerId: worker.id,
    workerName: worker.fullName,
    worker: {
      ...worker,
      name: worker.fullName,
      epc: worker.rfid,
      employerId: worker.contractorId,
      employer: worker.contractorName,
      inductionValid: worker.inductionStatus === "VALID",
      zone: "ZONE-01",
    },
    contractorName: worker.contractorName,
    trade: worker.trade,
    rfid: worker.rfid,
    qid: worker.qid,
    direction: "IN",
    decision: "DENIED",
    status: "Denied",
    denialReason: accessResult.denialReason,
    denialMessage: accessResult.denialMessage,
    transitSpeedSec: 0.8,
  };

  const notification: SystemNotification = {
    id: `NOTIF-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    title: "Access Denied: Expired Safety Induction",
    message: `${worker.fullName} (${worker.contractorName}) denied entry at ${gate.name}. Induction expired on ${worker.inductionExpiry}.`,
    severity: "crit",
    targetRoute: "/workforce",
    targetEntityId: worker.id,
    read: false,
  };

  const auditEntry: AuditLogEntry = {
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: "Access Engine",
    role: "Gate Security Controller",
    action: "ACCESS_DENIED",
    entity: "GateEvent",
    entityId: gateEvent.id,
    description: `Worker ${worker.fullName} denied at Gate 02: EXPIRED_INDUCTION (${worker.inductionExpiry}). Turnstile remained locked.`,
  };

  steps.push({
    step: 1,
    time: gateEvent.timestamp,
    title: "RFID Hard-Hat Tag Presented at Gate 02",
    description: `Worker ${worker.fullName} (${worker.id}) tapped EPC tag at turnstile Lane 1.`,
    entity: "Worker",
    entityId: worker.id,
    status: "info",
  });

  steps.push({
    step: 2,
    time: gateEvent.timestamp,
    title: "Access Rule Engine Evaluation: DENIED",
    description: `Rule 5 (HSE Safety Induction) failed: ${accessResult.denialMessage}. Turnstile locked. No attendance record created.`,
    entity: "GateEvent",
    entityId: gateEvent.id,
    status: "error",
  });

  steps.push({
    step: 3,
    time: gateEvent.timestamp,
    title: "Security & HSE Alerts Dispatched",
    description: `Security console alerted. Incident audit logged. Worker redirected to Safety Training Trailer.`,
    entity: "SystemNotification",
    entityId: notification.id,
    status: "warning",
  });

  eventBus.emit("ACCESS_DENIED", gateEvent, "Gate Controller", "ELV System", gateEvent.id, "GateEvent");

  return {
    steps,
    updatedCtx: {
      notifications: [notification, ...ctx.notifications],
      auditLogs: [auditEntry, ...ctx.auditLogs],
    },
  };
}

// ----------------------------------------------------
// SCENARIO 3: WORKER NOT ASSIGNED (W-0402)
// ----------------------------------------------------
export function executeScenario3(ctx: SimulationContext): {
  steps: ScenarioStepResult[];
  updatedCtx: Partial<SimulationContext>;
} {
  const steps: ScenarioStepResult[] = [];
  const worker = ctx.workers.find((w) => w.id === "W-0402") || ctx.workers[2]!;
  const gate = ctx.gates[0]!;

  const accessResult = evaluateGateAccess({
    worker,
    gate,
    direction: "IN",
  });

  const gateEvent: GateEvent = {
    id: `EVT-${Date.now()}-UNASSIGNED`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    gateId: gate.id,
    gateName: gate.name,
    laneId: "Lane 1",
    lane: "Lane 1",
    workerId: worker.id,
    workerName: worker.fullName,
    worker: {
      ...worker,
      name: worker.fullName,
      epc: worker.rfid,
      employerId: worker.contractorId,
      employer: worker.contractorName,
      inductionValid: worker.inductionStatus === "VALID",
      zone: "ZONE-01",
    },
    contractorName: worker.contractorName,
    trade: worker.trade,
    rfid: worker.rfid,
    qid: worker.qid,
    direction: "IN",
    decision: "DENIED",
    status: "Denied",
    denialReason: "WORKER_NOT_ASSIGNED",
    denialMessage: "Worker has valid induction but is not assigned to any approved work order for today's shift.",
    transitSpeedSec: 0.9,
  };

  steps.push({
    step: 1,
    time: gateEvent.timestamp,
    title: "RFID Hard-Hat Tag Scanned",
    description: `Worker ${worker.fullName} presented tag at ${gate.name}. Induction is valid.`,
    entity: "Worker",
    entityId: worker.id,
    status: "info",
  });

  steps.push({
    step: 2,
    time: gateEvent.timestamp,
    title: "Work Order Quota Verification: DENIED",
    description: `Access Engine checked today's active work orders. Worker ${worker.id} is unassigned. Access DENIED. Turnstile remained locked.`,
    entity: "GateEvent",
    entityId: gateEvent.id,
    status: "error",
  });

  eventBus.emit("ACCESS_DENIED", gateEvent, "Gate Controller", "ELV System", gateEvent.id, "GateEvent");

  return {
    steps,
    updatedCtx: {
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "Access Engine",
          role: "Security Controller",
          action: "ACCESS_DENIED",
          entity: "GateEvent",
          entityId: gateEvent.id,
          description: `Worker ${worker.fullName} denied: WORKER_NOT_ASSIGNED.`,
        },
        ...ctx.auditLogs,
      ],
    },
  };
}

// ----------------------------------------------------
// SCENARIO 4: GEOFENCE BREACH (IPT L3 East -> IPT L4 AHU)
// ----------------------------------------------------
export function executeScenario4(ctx: SimulationContext): {
  steps: ScenarioStepResult[];
  updatedCtx: Partial<SimulationContext>;
} {
  const steps: ScenarioStepResult[] = [];
  const worker = ctx.workers.find((w) => w.id === "W-0245") || ctx.workers[0]!;
  const restrictedZone = ctx.zones.find((z) => z.id === "IPT-L4-AHU") || ctx.zones[4]!;

  const locResult = updateWorkerLocation(worker, restrictedZone, { x: 16, y: 72 }, "IPT-L3-East", "East Ward Refit");

  const breach = locResult.breachEvent!;

  const incident: SafetyIncident = {
    id: `INC-${Date.now().toString().slice(-6)}`,
    source: "GEOFENCE_BREACH",
    sourceEventId: breach.id,
    workerId: worker.id,
    workerName: worker.fullName,
    contractorId: worker.contractorId,
    contractorName: worker.contractorName,
    zoneId: restrictedZone.id,
    zoneName: restrictedZone.name,
    type: "Restricted Non-Permit Zone Intrusion",
    severity: "Critical",
    description: `Worker ${worker.fullName} breached geofence boundary into classified air handling chamber ${restrictedZone.name}.`,
    assignedTo: "Capt. Fahad Al-Naimi (HSE Field Marshal)",
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  steps.push({
    step: 1,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    title: "Spatial BLE / RFID Portal Tracks Movement",
    description: `Worker ${worker.fullName} moved outside authorized IPT Level 3 East corridor.`,
    entity: "Worker",
    entityId: worker.id,
    status: "info",
  });

  steps.push({
    step: 2,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    title: "CRITICAL GEOFENCE BREACH DETECTED",
    description: `Worker entered ${restrictedZone.name} (Restricted Hospital Plant Area). Digital Twin flashing RED siren.`,
    entity: "Zone",
    entityId: restrictedZone.id,
    status: "error",
  });

  steps.push({
    step: 3,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    title: "HSE Escalation & Field Marshal Dispatched",
    description: `High-priority Safety Incident ${incident.id} opened. Immediate audio evacuation horn triggered in zone.`,
    entity: "SafetyIncident",
    entityId: incident.id,
    status: "warning",
  });

  eventBus.emit("GEOFENCE_BREACH", breach, "Geofence Engine", "Spatial Safety", breach.id, "GeofenceBreachEvent");
  eventBus.emit("SAFETY_INCIDENT_CREATED", incident, "Safety Engine", "Automated HSE", incident.id, "SafetyIncident");

  return {
    steps,
    updatedCtx: {
      incidents: [incident, ...ctx.incidents],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "Geofence Engine",
          role: "Spatial Safety",
          action: "GEOFENCE_BREACH",
          entity: "Zone",
          entityId: restrictedZone.id,
          description: `Worker ${worker.fullName} breached restricted zone ${restrictedZone.name}. Incident ${incident.id} logged.`,
        },
        ...ctx.auditLogs,
      ],
    },
  };
}

// ----------------------------------------------------
// SCENARIO 5: AI PPE VIOLATION & LOUDSPEAKER BROADCAST
// ----------------------------------------------------
export function executeScenario5(ctx: SimulationContext): {
  steps: ScenarioStepResult[];
  updatedCtx: Partial<SimulationContext>;
} {
  const steps: ScenarioStepResult[] = [];
  const camera = ctx.cameras.find((c) => c.id === "CAM-01") || ctx.cameras[0]!;
  const zone = ctx.zones.find((z) => z.id === "IPT-L3-East") || ctx.zones[0]!;
  const worker = ctx.workers.find((w) => w.id === "W-0245") || ctx.workers[0]!;

  // 1. AI Vision Detection
  const detection = createAIDetection(camera, zone, "NO_HARD_HAT", worker, 96.4);
  const incident = createIncidentFromAIDetection(detection, worker);

  // 2. Bilingual Broadcast
  const broadcast = createBroadcastMessage(
    zone,
    "Warning: Safety helmet required. You have entered active construction zone IPT Level 3. Please put on hard hat immediately.",
    "crit",
    "Arabic & English",
    "AI_SAFETY_ENGINE",
  );

  // 3. HSE Corrective Action
  const resolvedIncident = advanceIncidentStatus(incident, "CLOSED", {
    assignedTo: "Eng. Tariq Mansoor (HSE Lead)",
    correctiveAction: "HSE marshal provided new certified hard hat. Worker re-instructed and verified.",
  });

  steps.push({
    step: 1,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    title: "AI Camera Detection: Missing Hard Hat (96.4%)",
    description: `Edge AI Vision on ${camera.name} flagged worker ${worker.fullName} operating without hard hat.`,
    entity: "Camera",
    entityId: camera.id,
    status: "error",
  });

  steps.push({
    step: 2,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    title: "Automated PA Horn Safety Broadcast Emitted",
    description: `Bilingual announcement broadcasted to ${zone.name} PA speakers: "${broadcast.messageText}"`,
    entity: "BroadcastLog",
    entityId: broadcast.id,
    status: "warning",
  });

  steps.push({
    step: 3,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    title: "Safety Incident Closed with Corrective Action",
    description: `HSE Lead attended zone, verified helmet compliance, and recorded closure evidence in audit trail.`,
    entity: "SafetyIncident",
    entityId: resolvedIncident.id,
    status: "success",
  });

  eventBus.emit("AI_DETECTION", detection, "Edge AI Inference", "Vision Model", detection.id, "AIDetection");
  eventBus.emit("BROADCAST_EMITTED", broadcast, "Broadcast Engine", "Loudspeaker System", broadcast.id, "BroadcastLog");
  eventBus.emit("SAFETY_INCIDENT_CLOSED", resolvedIncident, "HSE Lead", "Safety Department", resolvedIncident.id, "SafetyIncident");

  return {
    steps,
    updatedCtx: {
      incidents: [resolvedIncident, ...ctx.incidents],
      broadcasts: [broadcast, ...ctx.broadcasts],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "AI Vision Camera",
          role: "SafetyNet Model",
          action: "AI_DETECTION",
          entity: "SafetyIncident",
          entityId: resolvedIncident.id,
          description: `PPE violation flagged on CAM-01, broadcast issued, corrective action verified and closed.`,
        },
        ...ctx.auditLogs,
      ],
    },
  };
}

// ----------------------------------------------------
// SCENARIO 6: CHANGE REQUEST APPROVAL CHAIN (CHANGE-004)
// ----------------------------------------------------
export function executeScenario6(ctx: SimulationContext): {
  steps: ScenarioStepResult[];
  updatedCtx: Partial<SimulationContext>;
} {
  const steps: ScenarioStepResult[] = [];
  const existingCR = ctx.changeRequests.find((cr) => cr.id === "CHANGE-004") || ctx.changeRequests[0]!;
  const workOrder = ctx.workOrders.find((wo) => wo.id === existingCR.workOrderId) || ctx.workOrders[0]!;

  // Multi-party approval progression
  const updatedCR: ChangeRequest = {
    ...existingCR,
    status: "Approved",
    approvalChain: [
      { role: "Subcontractor PM", approver: "Eng. Mounir Hadad", status: "APPROVED", timestamp: "2026-09-08 09:00" },
      { role: "Main Contractor Lead", approver: "IMAR-Al Sraiya JV Lead", status: "APPROVED", timestamp: "2026-09-08 14:00" },
      { role: "Consultant Resident Eng", approver: "KEO Senior Resident Engineer", status: "APPROVED", timestamp: "2026-09-09 11:30" },
      { role: "Client Director (Ashghal)", approver: "Ashghal Healthcare Project Director", status: "APPROVED", timestamp: new Date().toISOString(), comment: "Approved under MoPH Healthcare Code Upgrade. Budget adjusted." },
    ],
    closedAt: new Date().toISOString(),
  };

  const updatedWO: WorkOrder = {
    ...workOrder,
    description: `${workOrder.description} [Includes Approved Change Order ${updatedCR.code}: +60m Medical Exhaust Ducting]`,
    workforceQuota: workOrder.workforceQuota + 4,
  };

  steps.push({
    step: 1,
    time: "09:00:00",
    title: "Change Request CHANGE-004 Submitted",
    description: `Subcontractor requested +120,000 QAR and +4 days schedule impact for additional medical exhaust ducting.`,
    entity: "ChangeRequest",
    entityId: updatedCR.id,
    status: "info",
  });

  steps.push({
    step: 2,
    time: "11:30:00",
    title: "Technical Review Approved by KEO Consultant",
    description: `Consultant verified engineering drawings and infection control isolation specifications.`,
    entity: "ChangeRequest",
    entityId: updatedCR.id,
    status: "success",
  });

  steps.push({
    step: 3,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    title: "Ashghal Client Approval & Budget Variation Released",
    description: `Client signed approval. Project budget increased by 120,000 QAR. Work Order ${workOrder.id} workforce quota updated.`,
    entity: "ChangeRequest",
    entityId: updatedCR.id,
    status: "success",
  });

  eventBus.emit("CHANGE_APPROVED", updatedCR, "Ashghal Client Director", "Client / Owner", updatedCR.id, "ChangeRequest");

  return {
    steps,
    updatedCtx: {
      changeRequests: ctx.changeRequests.map((cr) => (cr.id === updatedCR.id ? updatedCR : cr)),
      workOrders: ctx.workOrders.map((wo) => (wo.id === workOrder.id ? updatedWO : wo)),
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: "Ashghal Client Director",
          role: "Client / Owner",
          action: "CHANGE_APPROVED",
          entity: "ChangeRequest",
          entityId: updatedCR.id,
          description: `Change Request ${updatedCR.code} fully approved. Budget impact (+120,000 QAR) reflected.`,
        },
        ...ctx.auditLogs,
      ],
    },
  };
}
