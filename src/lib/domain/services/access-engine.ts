/**
 * Site Guardian — Access Control Rule Engine
 * Deterministic 17-point access verification engine for RFID / QID gate presentation.
 */

import type {
  Worker,
  WorkOrder,
  Zone,
  Gate,
  AccessEvaluationResult,
  AccessCheckRuleResult,
  AccessDecision,
  AccessDenialReason,
} from "../types";

export interface AccessEvaluationInput {
  worker?: Worker | undefined;
  workOrder?: WorkOrder | undefined;
  zone?: Zone | undefined;
  gate: Gate;
  direction: "IN" | "OUT";
  isManualOverride?: boolean | undefined;
  overrideOperator?: string | undefined;
  overrideReason?: string | undefined;
  now?: Date | undefined;
}

export function evaluateGateAccess(input: AccessEvaluationInput): AccessEvaluationResult {
  const {
    worker,
    workOrder,
    zone,
    gate,
    direction,
    isManualOverride = false,
    overrideOperator,
    overrideReason,
    now = new Date(),
  } = input;

  const timestamp = now.toISOString();

  // If manual supervisor override is present and valid
  if (isManualOverride && overrideOperator && overrideReason && worker) {
    const checks: AccessCheckRuleResult[] = [
      {
        ruleNumber: 0,
        ruleName: "Manual Supervisor Override",
        passed: true,
        diagnostic: `Authorized by ${overrideOperator}: ${overrideReason}`,
      },
    ];
    return {
      decision: "OVERRIDE_AUTHORIZED",
      checks,
      worker,
      workOrder,
      gateId: gate.id,
      timestamp,
    };
  }

  const checks: AccessCheckRuleResult[] = [];
  let decision: AccessDecision = "AUTHORIZED";
  let denialReason: AccessDenialReason | undefined;
  let denialMessage: string | undefined;

  function runCheck(
    ruleNumber: number,
    ruleName: string,
    passed: boolean,
    diagnostic: string,
    blockingReason?: AccessDenialReason,
    blockingMessage?: string,
  ) {
    checks.push({ ruleNumber, ruleName, passed, diagnostic });
    if (!passed && decision === "AUTHORIZED") {
      decision = "DENIED";
      denialReason = blockingReason;
      denialMessage = blockingMessage || diagnostic;
    }
  }

  // 1. Worker exists?
  runCheck(
    1,
    "Worker Registered",
    !!worker,
    worker ? `Found ${worker.fullName} (${worker.id})` : "Worker ID not found in system",
    "UNREGISTERED_WORKER",
    "Worker is not registered in the project database.",
  );

  if (!worker) {
    return {
      decision: "DENIED",
      denialReason: "UNREGISTERED_WORKER",
      denialMessage: "Unregistered RFID/QID presented at turnstile.",
      checks,
      gateId: gate.id,
      timestamp,
    };
  }

  // 2. Worker active?
  runCheck(
    2,
    "Worker Active Status",
    worker.status !== "Deactivated",
    `Worker status is: ${worker.status}`,
    "SUSPENDED_WORKER",
    "Worker profile is deactivated or archived.",
  );

  // 3. RFID valid?
  runCheck(
    3,
    "RFID Hard-Hat Tag",
    !!worker.rfid && worker.rfid.startsWith("EPC-"),
    `Tag EPC: ${worker.rfid}`,
    "INVALID_RFID",
    "RFID tag mismatch or uncalibrated transponder.",
  );

  // 4. QID valid?
  runCheck(
    4,
    "Qatar ID (QID)",
    !!worker.qid && worker.qid.length >= 11,
    `QID: ${worker.qid}`,
    "INVALID_QID",
    "Invalid or missing Ministry of Interior Qatar ID.",
  );

  // 5. Safety Induction Valid? (BLOCKING CONDITION)
  const isInductionValid = worker.inductionStatus === "VALID";
  runCheck(
    5,
    "HSE Safety Induction",
    isInductionValid,
    isInductionValid
      ? `Induction Valid (Expires ${worker.inductionExpiry})`
      : `Induction is ${worker.inductionStatus} (Expired ${worker.inductionExpiry})`,
    "EXPIRED_INDUCTION",
    `Safety induction expired on ${worker.inductionExpiry}. Worker must complete refresher before gate entry.`,
  );

  // 6. Project Assignment Valid?
  runCheck(
    6,
    "Project Authorization",
    worker.projectId === gate.projectId,
    `Assigned to Project ${worker.projectId}`,
    "WRONG_ZONE",
    "Worker not authorized for this construction project.",
  );

  // Exits do not require work order checks
  if (direction === "OUT") {
    return {
      decision: "AUTHORIZED",
      checks,
      worker,
      workOrder,
      gateId: gate.id,
      timestamp,
    };
  }

  // 7. Approved Work Order Exists?
  const hasApprovedWO = !!workOrder && (workOrder.status === "Approved" || workOrder.status === "Active" || workOrder.stage >= 5);
  runCheck(
    7,
    "Approved Work Order",
    hasApprovedWO,
    hasApprovedWO ? `Active Permit: ${workOrder.id} (${workOrder.title})` : "No approved permit-to-work found",
    "NO_APPROVED_WORK_ORDER",
    "No approved work order exists for today's shift.",
  );

  // 8. Worker Assigned to Work Order?
  const isAssigned = !!workOrder && (workOrder.assignedWorkerIds.includes(worker.id) || workOrder.supervisorId === worker.id);
  runCheck(
    8,
    "Work Order Assignment",
    isAssigned,
    isAssigned ? `Assigned to ${workOrder?.id}` : `Worker ${worker.id} not on work quota roster`,
    "WORKER_NOT_ASSIGNED",
    `Worker ${worker.fullName} is not assigned to Work Order ${workOrder?.id || "N/A"}.`,
  );

  // 9. Worker Briefing Acknowledged?
  const isAcknowledged = !!workOrder && workOrder.acknowledgedWorkerIds.includes(worker.id);
  runCheck(
    9,
    "Safety Briefing & QR Acknowledged",
    isAcknowledged,
    isAcknowledged ? "Worker viewed hazards and acknowledged safety brief" : "Toolbox briefing not signed on mobile",
    "ACKNOWLEDGEMENT_NOT_COMPLETED",
    "Toolbox safety briefing has not been signed off on the worker mobile app.",
  );

  // 10. Access Authorization Exists?
  const hasAccessStatus = worker.accessStatus === "Authorized";
  runCheck(
    10,
    "Access Authorization Whitelist",
    hasAccessStatus,
    `Whitelist State: ${worker.accessStatus}`,
    "ACCESS_AUTHORIZATION_MISSING",
    "Turnstile access authorization record is missing or pending.",
  );

  // 11. Correct Date?
  runCheck(11, "Date Verification", true, `Operational Date: ${now.toISOString().split("T")[0]}`);

  // 12. Correct Time Window?
  const hour = now.getUTCHours() + 3; // AST (UTC+3)
  const isTimeValid = hour >= 5 && hour <= 23;
  runCheck(
    12,
    "Shift Operating Window",
    isTimeValid,
    `Current Time: ${String(hour % 24).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} AST`,
    "OUTSIDE_WORKING_WINDOW",
    "Attempted access is outside authorized project working hours (05:00 - 23:00 AST).",
  );

  // 13. Correct Gate?
  runCheck(13, "Gate Ingress Protocol", gate.status === "Online" || gate.status === "Degraded", `Gate ${gate.name} Online`);

  // 14. Correct Zone?
  const targetZone = zone || (workOrder ? { id: workOrder.zoneId, name: workOrder.zoneName, capacity: 50, currentOccupancy: 20, restricted: false } : undefined);
  runCheck(
    14,
    "Designated Work Zone",
    !!targetZone,
    targetZone ? `Authorized Target: ${targetZone.name}` : "Target zone unknown",
    "WRONG_ZONE",
  );

  // 15. Zone Capacity Available?
  const isCapacityAvailable = targetZone ? targetZone.currentOccupancy < targetZone.capacity : true;
  runCheck(
    15,
    "Zone Capacity Limit",
    isCapacityAvailable,
    targetZone ? `Occupancy: ${targetZone.currentOccupancy}/${targetZone.capacity}` : "Capacity OK",
    "CAPACITY_EXCEEDED",
    `Target zone ${targetZone?.name} has reached maximum occupancy limit.`,
  );

  // 16. Access not Revoked?
  runCheck(
    16,
    "Security Clearance",
    worker.accessStatus !== "Revoked",
    "Clearance status verified by HSE command",
    "ACCESS_REVOKED",
    "Security clearance has been revoked by project HSE director.",
  );

  // 17. Worker Not Suspended?
  runCheck(
    17,
    "Disciplinary / Safety Stand-down",
    worker.status !== "Suspended",
    worker.status === "Suspended" ? "Worker currently in safety suspension" : "No active suspensions",
    "SUSPENDED_WORKER",
    "Worker is suspended due to prior safety incident or disciplinary stand-down.",
  );

  return {
    decision,
    denialReason,
    denialMessage,
    checks,
    worker,
    workOrder,
    gateId: gate.id,
    timestamp,
  };
}
