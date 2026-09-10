/**
 * Site Guardian — Core Domain Entity Definitions
 * Unified domain models for end-to-end construction site digital operations.
 * Configured to strictly satisfy exactOptionalPropertyTypes: true.
 */

export type ProjectId = string;
export type BuildingId = string;
export type FloorId = string;
export type ZoneId = string;
export type ContractorId = string;
export type WorkerId = string;
export type WorkPackageId = string;
export type WorkOrderId = string;
export type GateId = string;
export type CameraId = string;
export type IncidentId = string;
export type ClaimId = string;
export type PaymentId = string;
export type ChangeRequestId = string;
export type InspectionId = string;

export type SystemRole =
  | "SUPER_ADMIN"
  | "CLIENT_OWNER"
  | "PROJECT_MANAGER"
  | "MAIN_CONTRACTOR"
  | "CONSULTANT_ENGINEER"
  | "HSE_MANAGER"
  | "HSE_OFFICER"
  | "SECURITY_OPERATOR"
  | "CONTRACTOR_SUPERVISOR"
  | "FINANCE_OFFICER"
  | "WORKER";

// ==========================================
// 1. PROJECT, BUILDING, FLOOR, ZONE
// ==========================================

export interface Project {
  id: ProjectId;
  code: string;
  name: string;
  description: string;
  client: string;
  consultant: string;
  mainContractor: string;
  location: string;
  status: "Active" | "Mobilization" | "Substantially Complete" | "Closed";
  startDate: string;
  targetDate: string;
  budget: number; // in QAR
  actualCost: number; // in QAR
  progress: number; // 0 - 100
  riskScore: number; // 0 - 100
}

export interface Building {
  id: BuildingId;
  projectId: ProjectId;
  name: string;
  code: string;
  totalFloors: number;
  totalArea: string;
  activeZonesCount: number;
}

export interface Floor {
  id: FloorId;
  buildingId: BuildingId;
  name: string;
  level: string; // "B1", "GF", "L1", "L2", "L3", "L4", "L5"
  floorPlanUrl?: string | undefined;
  activePermitsCount: number;
}

export interface Zone {
  id: ZoneId;
  buildingId: BuildingId;
  floorId: FloorId;
  name: string;
  level: string;
  wing?: string | undefined;
  type: "Clinical Ward" | "Operating Theater" | "Corridor" | "Plant Room" | "Yard" | "Chokepoint";
  capacity: number;
  currentOccupancy: number;
  restricted: boolean;
  hazardLevel: "Low" | "Moderate" | "High" | "Critical";
  dustLevel?: string | undefined;
  supervisorId?: string | undefined;
  supervisorName?: string | undefined;
  supervisorPhone?: string | undefined;
  geofenceBoundary: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

// ==========================================
// 2. CONTRACTOR & WORKFORCE
// ==========================================

export interface Contractor {
  id: ContractorId;
  projectId: ProjectId;
  companyName: string;
  code: string;
  trade: string;
  contractValue: number;
  contactPerson: string;
  phone: string;
  email: string;
  status: "Active" | "Suspended" | "Completed" | "Pending Review";
  plannedManpower: number;
  actualManpower: number;
  safetyScore: number; // 0 - 100
  qualityScore: number; // 0 - 100
  progress: number; // 0 - 100
  totalManHours: number;
  totalBilledAmount: number;
  totalPaidAmount: number;
}

export type WorkerStatus = "Active" | "On Site" | "Off Site" | "Suspended" | "Deactivated";
export type InductionStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED" | "NOT_COMPLETED";

export interface Worker {
  id: WorkerId;
  employeeCode: string;
  fullName: string;
  name?: string | undefined; // alias for legacy code
  photoUrl: string;
  qid: string;
  rfid: string; // EPC tag
  epc?: string | undefined; // alias for legacy code
  contractorId: ContractorId;
  contractorName: string;
  employerId?: string | undefined; // alias for legacy code
  employer?: string | undefined; // alias for legacy code
  trade: string;
  phone: string;
  emergencyContact: string;
  projectId: ProjectId;
  status: WorkerStatus;
  inductionStatus: InductionStatus;
  inductionValid?: boolean | undefined; // alias for legacy code
  inductionExpiry: string;
  accessStatus: "Authorized" | "Restricted" | "Revoked" | "Pending Briefing";
  currentBuildingId?: BuildingId | undefined;
  currentFloorId?: FloorId | undefined;
  currentZoneId?: ZoneId | undefined;
  zone?: string | undefined; // alias for legacy code
  currentWorkOrderId?: WorkOrderId | undefined;
  currentCoordinates?: { x: number; y: number } | undefined;
  hoursToday: number;
  hoursThisWeek: number;
  joinedDate: string;
  nationality: string;
  safetyViolationsCount: number;
}

export interface WorkerDocument {
  id: string;
  workerId: WorkerId;
  documentType: "QID" | "Passport" | "Medical Fitness" | "Trade Certification" | "Safety Card";
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  verificationStatus: "Verified" | "Pending" | "Expired" | "Rejected";
  verifiedBy?: string | undefined;
  verifiedAt?: string | undefined;
  fileUrl?: string | undefined;
}

export interface SafetyInduction {
  id: string;
  workerId: WorkerId;
  trainingType: "Hospital Renovation Induction" | "Confined Space Entry" | "Hot Works Safety" | "Working at Heights";
  completedAt: string;
  expiresAt: string;
  score: number; // 0 - 100
  status: InductionStatus;
  certificateNumber: string;
  trainerName: string;
}

// ==========================================
// 3. WORK PACKAGE & WORK ORDERS
// ==========================================

export interface WorkPackage {
  id: WorkPackageId;
  projectId: ProjectId;
  contractorId: ContractorId;
  zoneId: ZoneId;
  name: string;
  description: string;
  plannedStart: string;
  plannedFinish: string;
  budget: number;
  progress: number;
  status: "Active" | "Completed" | "Delayed" | "Draft";
}

export type WorkOrderStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type WorkOrderStatus =
  | "Draft"
  | "Submitted"
  | "Main Contractor Review"
  | "Pending Consultant"
  | "Approved"
  | "Briefing Pending"
  | "Access Ready"
  | "Active"
  | "Under Inspection"
  | "Completed"
  | "Closed"
  | "Rejected";

export interface WorkOrder {
  id: WorkOrderId;
  workPackageId: WorkPackageId;
  projectId: ProjectId;
  zoneId: ZoneId;
  zoneName: string;
  buildingId: BuildingId;
  contractorId: ContractorId;
  contractorName: string;
  supervisorId: string;
  supervisorName: string;
  supervisorPhone: string;
  title: string;
  description: string;
  scope: string;
  methodStatement: string;
  riskAssessment: string;
  plannedStart: string;
  plannedEnd: string;
  workforceQuota: number;
  assignedWorkerIds: WorkerId[];
  acknowledgedWorkerIds: WorkerId[];
  hazards: string[];
  requiredPPE: string[];
  equipment: string[];
  documents: { name: string; size: string; status: string }[];
  status: WorkOrderStatus;
  stage: WorkOrderStage;
  progress: number; // 0 - 100
  actualStart?: string | undefined;
  actualEnd?: string | undefined;
  completionEvidence?: {
    photoUrl?: string | undefined;
    notes?: string | undefined;
    verifiedBy?: string | undefined;
    verifiedAt?: string | undefined;
  } | undefined;
  qrToken: string;
  createdAt: string;
}

export interface WorkOrderApproval {
  id: string;
  workOrderId: WorkOrderId;
  role: "Main Contractor" | "Consultant / Engineer" | "Client / Owner";
  approverName: string;
  decision: "APPROVED" | "REJECTED" | "RETURNED_FOR_CORRECTION" | "CLARIFICATION_REQUESTED";
  comment: string;
  signature: string;
  timestamp: string;
  stage: number;
}

export interface WorkerAcknowledgement {
  id: string;
  workerId: WorkerId;
  workOrderId: WorkOrderId;
  qrToken: string;
  briefingViewed: boolean;
  safetyBriefingCompleted: boolean;
  acknowledgementText: string;
  signatureDataUrl?: string | undefined;
  timestamp: string;
}

export interface AccessAuthorization {
  id: string;
  workerId: WorkerId;
  workOrderId: WorkOrderId;
  zoneId: ZoneId;
  validFrom: string;
  validTo: string;
  status: "ACTIVE" | "EXPIRED" | "REVOKED" | "SUSPENDED";
  createdAt: string;
}

// ==========================================
// 4. GATES, ACCESS ENGINE & ATTENDANCE
// ==========================================

export interface GateLane {
  id: string;
  name: string;
  direction: "IN" | "OUT" | "BIDIRECTIONAL";
  throughputPerHour: number;
  opticalTurnstileState: "Locked" | "Open" | "Alarm";
}

export interface Gate {
  id: GateId;
  projectId: ProjectId;
  name: string;
  location: string;
  readerModel: string;
  readerIp: string;
  lanes: GateLane[];
  status: "Online" | "Degraded" | "Offline" | "Maintenance";
  temperatureCelsius: number;
  rfPowerDbm: number;
  vswrRatio: number;
}

export type AccessDecision = "AUTHORIZED" | "DENIED" | "OVERRIDE_AUTHORIZED";

export type AccessDenialReason =
  | "UNREGISTERED_WORKER"
  | "INVALID_RFID"
  | "INVALID_QID"
  | "EXPIRED_INDUCTION"
  | "SUSPENDED_WORKER"
  | "NO_APPROVED_WORK_ORDER"
  | "WORKER_NOT_ASSIGNED"
  | "ACKNOWLEDGEMENT_NOT_COMPLETED"
  | "ACCESS_AUTHORIZATION_MISSING"
  | "OUTSIDE_WORKING_WINDOW"
  | "WRONG_ZONE"
  | "CAPACITY_EXCEEDED"
  | "ACCESS_REVOKED";

export interface AccessCheckRuleResult {
  ruleNumber: number;
  ruleName: string;
  passed: boolean;
  diagnostic: string;
}

export interface AccessEvaluationResult {
  decision: AccessDecision;
  denialReason?: AccessDenialReason | undefined;
  denialMessage?: string | undefined;
  checks: AccessCheckRuleResult[];
  worker?: Worker | undefined;
  workOrder?: WorkOrder | undefined;
  gateId: GateId;
  timestamp: string;
}

export type LegacyAccessStatus =
  | "Authorized"
  | "Denied: Unassigned Work Order"
  | "Denied: Expired Safety Induction"
  | "Denied: Zone Capacity Exceeded"
  | "Denied: Suspended RFID Tag";

export interface GateEvent {
  id: string;
  timestamp: string;
  time: string; // legacy alias
  gateId: GateId;
  gateName: string;
  laneId: string;
  lane: string; // legacy alias
  workerId: WorkerId;
  workerName: string;
  worker: Worker; // legacy alias
  contractorName: string;
  trade: string;
  rfid: string;
  qid: string;
  direction: "IN" | "OUT";
  decision: AccessDecision;
  status: LegacyAccessStatus | string; // legacy alias
  denialReason?: AccessDenialReason | undefined;
  denialMessage?: string | undefined;
  workOrderId?: WorkOrderId | undefined;
  zoneId?: ZoneId | undefined;
  transitSpeedSec: number;
  manual?: boolean | undefined; // legacy alias
  isManualOverride?: boolean | undefined;
  overrideOperator?: string | undefined;
  overrideReason?: string | undefined;
  reason?: string | undefined; // legacy alias
  checks?: AccessCheckRuleResult[] | undefined;
}

export interface AttendanceRecord {
  id: string;
  workerId: WorkerId;
  date: string; // YYYY-MM-DD
  direction: "IN" | "OUT";
  timestamp: string;
  gateId: GateId;
  workOrderId?: WorkOrderId | undefined;
  source: "RFID_TURNSTILE" | "MANUAL_OVERRIDE" | "MOBILE_PUNCH";
}

// ==========================================
// 5. LOCATION, DIGITAL TWIN & GEOFENCING
// ==========================================

export interface LocationEvent {
  id: string;
  workerId: WorkerId;
  timestamp: string;
  buildingId: BuildingId;
  floorId: FloorId;
  zoneId: ZoneId;
  coordinates: { x: number; y: number };
  source: "RFID_PORTAL" | "BLE_BEACON" | "AI_VISION" | "SIMULATION";
}

export interface GeofenceBreachEvent {
  id: string;
  workerId: WorkerId;
  workerName: string;
  contractorName: string;
  timestamp: string;
  authorizedZoneId: ZoneId;
  authorizedZoneName: string;
  breachedZoneId: ZoneId;
  breachedZoneName: string;
  severity: "High" | "Critical";
  responseStatus: "DETECTED" | "ESCALATED_HSE" | "FIELD_MARSHAL_DISPATCHED" | "RESOLVED";
}

// ==========================================
// 6. AI SAFETY, CAMERAS & INCIDENTS
// ==========================================

export interface Camera {
  id: CameraId;
  projectId: ProjectId;
  zoneId: ZoneId;
  name: string;
  locationLabel: string;
  streamUrl: string;
  status: "Online" | "Offline" | "Degraded";
  model: string;
  aiModelVersion: string;
  fps: number;
  inferenceLatencyMs: number;
}

export type AIDetectionType =
  | "NO_HARD_HAT"
  | "NO_HI_VIS"
  | "PPE_VIOLATION"
  | "UNAUTHORIZED_ENTRY"
  | "TURNSTILE_BYPASS"
  | "RESTRICTED_ZONE"
  | "UNSAFE_BEHAVIOR"
  | "UNSAFE_ROUTE";

export interface AIDetection {
  id: string;
  cameraId: CameraId;
  cameraName: string;
  workerId?: WorkerId | undefined;
  workerName?: string | undefined;
  zoneId: ZoneId;
  zoneName: string;
  timestamp: string;
  detectionType: AIDetectionType;
  confidence: number; // 0 - 100
  severity: "Low" | "Medium" | "High" | "Critical";
  boundingCoordinates: { x: number; y: number; w: number; h: number };
  evidenceThumbnailUrl?: string | undefined;
  status: "DETECTED" | "INCIDENT_CREATED" | "DISMISSED";
}

export type IncidentStatus =
  | "OPEN"
  | "ACKNOWLEDGED"
  | "ASSIGNED"
  | "ACTION_IN_PROGRESS"
  | "CORRECTIVE_ACTION"
  | "VERIFICATION"
  | "CLOSED";

export interface SafetyIncident {
  id: IncidentId;
  source: "AI_DETECTION" | "GEOFENCE_BREACH" | "GATE_DENIAL" | "MANUAL_REPORT" | "SUPERVISOR";
  sourceEventId?: string | undefined;
  workerId?: WorkerId | undefined;
  workerName?: string | undefined;
  contractorId?: ContractorId | undefined;
  contractorName?: string | undefined;
  zoneId: ZoneId;
  zoneName: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  evidenceUrl?: string | undefined;
  assignedTo?: string | undefined;
  status: IncidentStatus;
  correctiveAction?: string | undefined;
  createdAt: string;
  acknowledgedAt?: string | undefined;
  actionTakenAt?: string | undefined;
  verifiedAt?: string | undefined;
  closedAt?: string | undefined;
}

export interface BroadcastLog {
  id: string;
  timestamp: string;
  speakerId: string;
  speakerName: string;
  zoneId: ZoneId;
  messageText: string;
  languages: string;
  severity: "info" | "warn" | "crit";
  triggeredBy: "AI_SAFETY_ENGINE" | "GEOFENCE_ENGINE" | "HSE_MANUAL" | "EMERGENCY_SYSTEM";
}

// ==========================================
// 7. QUALITY & DAILY VERIFICATION
// ==========================================

export interface QualityChecklistItem {
  id: string;
  description: string;
  passed: boolean;
  comments?: string | undefined;
}

export interface QualityInspection {
  id: InspectionId;
  workOrderId: WorkOrderId;
  workOrderTitle: string;
  contractorName: string;
  zoneName: string;
  inspectorName: string;
  inspectorRole: string;
  inspectionDate: string;
  checklist: QualityChecklistItem[];
  result: "PASS" | "FAIL" | "CONDITIONAL_PASS";
  defectsCount: number;
  defectNotes?: string | undefined;
  evidenceUrl?: string | undefined;
  status: "SCHEDULED" | "IN_PROGRESS" | "RECTIFICATION_REQUIRED" | "VERIFIED_AND_CLOSED";
  signedAt?: string | undefined;
}

// ==========================================
// 8. CHANGE MANAGEMENT
// ==========================================

export type ChangeStatus =
  | "Draft"
  | "Submitted"
  | "Contractor Review"
  | "Main Contractor Review"
  | "Consultant Review"
  | "Client Approval"
  | "Approved"
  | "Implemented"
  | "Closed"
  | "Rejected";

export interface ChangeRequest {
  id: ChangeRequestId;
  code: string;
  projectId: ProjectId;
  workPackageId: WorkPackageId;
  workOrderId?: WorkOrderId | undefined;
  title: string;
  description: string;
  reason: string;
  requestedBy: string;
  requesterRole: string;
  contractorName: string;
  costImpact: number; // in QAR
  scheduleImpactDays: number;
  riskImpact: "Low" | "Medium" | "High";
  affectedZones: string[];
  affectedWorkersCount: number;
  approvalChain: {
    role: string;
    approver: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
    comment?: string | undefined;
    timestamp?: string | undefined;
  }[];
  status: ChangeStatus;
  submittedAt: string;
  closedAt?: string | undefined;
}

// ==========================================
// 9. TIMESHEETS, CLAIMS & TREASURY
// ==========================================

export interface Timesheet {
  id: string;
  workerId: WorkerId;
  workerName: string;
  contractorId: ContractorId;
  contractorName: string;
  workOrderId: WorkOrderId;
  date: string; // YYYY-MM-DD
  entryTime: string; // HH:mm:ss
  exitTime: string; // HH:mm:ss
  regularHours: number;
  overtimeHours: number;
  breakHours: number;
  totalBillableHours: number;
  hourlyRate: number; // in QAR
  totalCost: number; // in QAR
  approvalStatus: "PENDING_SUPERVISOR" | "SUPERVISOR_APPROVED" | "COMMERCIAL_VERIFIED" | "REJECTED";
  supervisorSignature?: string | undefined;
}

export type ClaimStatus =
  | "Draft"
  | "Submitted"
  | "Main Contractor Review"
  | "Consultant Review"
  | "Approved"
  | "Finance Review"
  | "Payment Pending"
  | "Paid"
  | "Rejected";

export interface ContractorClaim {
  id: ClaimId;
  code: string;
  contractorId: ContractorId;
  contractorName: string;
  workPackageId: WorkPackageId;
  workPackageName: string;
  billingPeriod: string;
  totalManpowerCount: number;
  totalManHours: number;
  calculatedAmount: number; // QAR
  verifiedProgressPercentage: number;
  supportingDocumentCount: number;
  status: ClaimStatus;
  submittedAt: string;
  approvedAmount?: number | undefined;
  approvals: {
    role: string;
    approver: string;
    status: "APPROVED" | "REJECTED";
    timestamp: string;
    comment: string;
  }[];
}

export interface PaymentRecord {
  id: PaymentId;
  invoiceNumber: string;
  contractorId: ContractorId;
  contractorName: string;
  claimId: ClaimId;
  claimCode: string;
  amount: number; // QAR
  currency: "QAR";
  paymentStatus: "PENDING_AUTHORIZATION" | "AUTHORIZED" | "PROCESSED" | "RECONCILED";
  paymentMethod: "Direct Bank Transfer (QNB Corporate)" | "Commercial Letter of Credit";
  disbursedDate?: string | undefined;
  authorizedBy: string;
  treasuryBatchRef: string;
}

// ==========================================
// 10. AUDIT TRAIL & SYSTEM NOTIFICATIONS
// ==========================================

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  beforeSnapshot?: string | undefined;
  afterSnapshot?: string | undefined;
  description: string;
  ipAddress?: string | undefined;
}

export interface SystemNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: "info" | "warn" | "crit" | "success";
  targetRoute?: string | undefined;
  targetEntityId?: string | undefined;
  read: boolean;
}

// ==========================================
// 11. EMERGENCY MUSTER
// ==========================================

export interface MusterPoint {
  id: string;
  name: string;
  location: string;
  capacity: number;
  accountedCount: number;
}
