/**
 * Site Guardian — Location & Geofence Engine
 * Evaluates spatial positioning, macro-zone boundaries, and unauthorized area intrusions.
 */

import type {
  Worker,
  Zone,
  LocationEvent,
  GeofenceBreachEvent,
} from "../types";

export interface ZoneEvaluationResult {
  isAuthorized: boolean;
  breachEvent?: GeofenceBreachEvent;
  locationEvent: LocationEvent;
}

export function updateWorkerLocation(
  worker: Worker,
  targetZone: Zone,
  coordinates: { x: number; y: number },
  authorizedZoneId?: string,
  authorizedZoneName?: string,
): ZoneEvaluationResult {
  const timestamp = new Date().toISOString();

  const locationEvent: LocationEvent = {
    id: `LOC-${Date.now()}-${worker.id}`,
    workerId: worker.id,
    timestamp,
    buildingId: targetZone.buildingId,
    floorId: targetZone.floorId,
    zoneId: targetZone.id,
    coordinates,
    source: "RFID_PORTAL",
  };

  // Check geofence rules:
  // 1. Is the target zone strictly restricted (e.g. Plant room, AHU)?
  // 2. Does the target zone mismatch the worker's approved work order zone?
  const isRestrictedZone = targetZone.restricted;
  const isMismatch = authorizedZoneId && targetZone.id !== authorizedZoneId && targetZone.id !== "IPT-L3-Core"; // corridors are transit

  if (isRestrictedZone || isMismatch) {
    const breachEvent: GeofenceBreachEvent = {
      id: `GEO-${Date.now()}-${worker.id}`,
      workerId: worker.id,
      workerName: worker.fullName,
      contractorName: worker.contractorName,
      timestamp,
      authorizedZoneId: authorizedZoneId || "IPT-L3-East",
      authorizedZoneName: authorizedZoneName || "East Ward Refit",
      breachedZoneId: targetZone.id,
      breachedZoneName: targetZone.name,
      severity: isRestrictedZone ? "Critical" : "High",
      responseStatus: "DETECTED",
    };

    return {
      isAuthorized: false,
      breachEvent,
      locationEvent,
    };
  }

  return {
    isAuthorized: true,
    locationEvent,
  };
}
