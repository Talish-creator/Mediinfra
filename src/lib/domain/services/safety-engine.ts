/**
 * Site Guardian — Safety AI & Incident Engine
 * Handles edge AI vision detection, safety incident lifecycle transitions, and bilingual audio broadcasts.
 */

import type {
  Camera,
  AIDetection,
  AIDetectionType,
  SafetyIncident,
  IncidentStatus,
  BroadcastLog,
  Worker,
  Zone,
} from "../types";

export function createAIDetection(
  camera: Camera,
  zone: Zone,
  detectionType: AIDetectionType,
  worker?: Worker,
  confidence: number = 96,
): AIDetection {
  const timestamp = new Date().toISOString();
  return {
    id: `DET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    cameraId: camera.id,
    cameraName: camera.name,
    workerId: worker?.id,
    workerName: worker?.fullName,
    zoneId: zone.id,
    zoneName: zone.name,
    timestamp,
    detectionType,
    confidence,
    severity: detectionType === "NO_HARD_HAT" || detectionType === "RESTRICTED_ZONE" ? "High" : "Medium",
    boundingCoordinates: { x: 70, y: 34, w: 21, h: 44 },
    status: "INCIDENT_CREATED",
  };
}

export function createIncidentFromAIDetection(detection: AIDetection, worker?: Worker): SafetyIncident {
  const now = new Date().toISOString();
  const descriptionMap: Record<AIDetectionType, string> = {
    NO_HARD_HAT: "AI vision system detected worker operating in construction zone without safety hard hat.",
    NO_HI_VIS: "Worker detected without high-visibility Class 2 reflective safety vest.",
    PPE_VIOLATION: "Worker detected lacking mandatory personal protective equipment for clinical renovation.",
    UNAUTHORIZED_ENTRY: "Optical beam breach detected at non-permit perimeter boundary.",
    TURNSTILE_BYPASS: "Pedestrian ingress turnstile was jumped or physically bypassed without valid RFID swipe.",
    RESTRICTED_ZONE: "Unauthorized worker detected entering classified hospital plant machinery chamber.",
    UNSAFE_BEHAVIOR: "Unsafe ladder positioning or failure to maintain 3 points of contact at height.",
    UNSAFE_ROUTE: "Worker walked into active crane lift exclusion zone.",
  };

  return {
    id: `INC-${Date.now().toString().slice(-6)}`,
    source: "AI_DETECTION",
    sourceEventId: detection.id,
    workerId: worker?.id || detection.workerId,
    workerName: worker?.fullName || detection.workerName || "Unidentified Worker",
    contractorId: worker?.contractorId || "SC-01",
    contractorName: worker?.contractorName || "Al Sraiya MEP Engineering",
    zoneId: detection.zoneId,
    zoneName: detection.zoneName,
    type: detection.detectionType.replace(/_/g, " "),
    severity: detection.severity,
    description: descriptionMap[detection.detectionType] || "Safety violation flagged by AI inference model.",
    assignedTo: "Eng. Tariq Mansoor (HSE Field Marshal)",
    status: "OPEN",
    createdAt: now,
  };
}

export function advanceIncidentStatus(
  incident: SafetyIncident,
  nextStatus: IncidentStatus,
  details?: {
    assignedTo?: string;
    correctiveAction?: string;
  },
): SafetyIncident {
  const now = new Date().toISOString();
  const updated: SafetyIncident = {
    ...incident,
    status: nextStatus,
  };

  if (details?.assignedTo) updated.assignedTo = details.assignedTo;
  if (details?.correctiveAction) updated.correctiveAction = details.correctiveAction;

  if (nextStatus === "ACKNOWLEDGED") updated.acknowledgedAt = now;
  if (nextStatus === "ACTION_IN_PROGRESS" || nextStatus === "CORRECTIVE_ACTION") updated.actionTakenAt = now;
  if (nextStatus === "VERIFICATION") updated.verifiedAt = now;
  if (nextStatus === "CLOSED") updated.closedAt = now;

  return updated;
}

export function createBroadcastMessage(
  zone: Zone,
  text: string,
  severity: "info" | "warn" | "crit" = "warn",
  languages: string = "Arabic & English",
  triggeredBy: "AI_SAFETY_ENGINE" | "GEOFENCE_ENGINE" | "HSE_MANUAL" | "EMERGENCY_SYSTEM" = "AI_SAFETY_ENGINE",
): BroadcastLog {
  return {
    id: `BC-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    speakerId: `SPK-${zone.id}`,
    speakerName: `${zone.name} PA Horn`,
    zoneId: zone.id,
    messageText: text,
    languages,
    severity,
    triggeredBy,
  };
}
