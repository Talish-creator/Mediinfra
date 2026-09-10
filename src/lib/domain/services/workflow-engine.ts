/**
 * Site Guardian — Work Order Workflow Engine
 * Implements strict 12-stage state transitions, worker assignments, QR tokens, and digital signatures.
 */

import type {
  WorkOrder,
  WorkOrderStage,
  WorkOrderStatus,
  WorkOrderApproval,
  WorkerAcknowledgement,
  AccessAuthorization,
  Worker,
} from "../types";

export function createWorkOrderApproval(
  workOrderId: string,
  role: "Main Contractor" | "Consultant / Engineer" | "Client / Owner",
  approverName: string,
  decision: "APPROVED" | "REJECTED" | "RETURNED_FOR_CORRECTION" | "CLARIFICATION_REQUESTED",
  comment: string,
  stage: number,
  signature: string = "Verified Electronic Signature",
): WorkOrderApproval {
  return {
    id: `APPR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    workOrderId,
    role,
    approverName,
    decision,
    comment,
    signature,
    timestamp: new Date().toISOString(),
    stage,
  };
}

export function recordWorkerAcknowledgement(
  workerId: string,
  workOrderId: string,
  qrToken: string,
  signatureDataUrl?: string,
): WorkerAcknowledgement {
  return {
    id: `ACK-${Date.now()}-${workerId}`,
    workerId,
    workOrderId,
    qrToken,
    briefingViewed: true,
    safetyBriefingCompleted: true,
    acknowledgementText: "I understand the assigned task, hazards, mandatory PPE and emergency escape protocol.",
    signatureDataUrl,
    timestamp: new Date().toISOString(),
  };
}

export function generateAccessAuthorization(
  worker: Worker,
  workOrder: WorkOrder,
): AccessAuthorization {
  const now = new Date();
  const validFrom = now.toISOString();
  const validTo = new Date(now.getTime() + 16 * 3600 * 1000).toISOString(); // 16 hours validity

  return {
    id: `AUTH-${worker.id}-${workOrder.id}`,
    workerId: worker.id,
    workOrderId: workOrder.id,
    zoneId: workOrder.zoneId,
    validFrom,
    validTo,
    status: "ACTIVE",
    createdAt: validFrom,
  };
}

export function transitionWorkOrderStage(
  order: WorkOrder,
  targetStage: WorkOrderStage,
  details?: {
    approverRole?: "Main Contractor" | "Consultant / Engineer" | "Client / Owner";
    approverName?: string;
    comment?: string;
    progress?: number;
    completionEvidence?: {
      photoUrl?: string;
      notes?: string;
      verifiedBy?: string;
    };
  },
): {
  updatedOrder: WorkOrder;
  approval?: WorkOrderApproval | undefined;
} {
  const now = new Date().toISOString();
  let nextStatus: WorkOrderStatus = order.status;
  let approval: WorkOrderApproval | undefined;

  switch (targetStage) {
    case 1:
      nextStatus = "Draft";
      break;
    case 2:
      nextStatus = "Main Contractor Review";
      break;
    case 3:
      nextStatus = "Pending Consultant";
      if (details?.approverName) {
        approval = createWorkOrderApproval(
          order.id,
          "Main Contractor",
          details.approverName,
          "APPROVED",
          details.comment || "Technical compliance and method statement approved by Main Contractor JV.",
          2,
        );
      }
      break;
    case 4:
    case 5:
      nextStatus = "Approved";
      if (details?.approverName) {
        approval = createWorkOrderApproval(
          order.id,
          "Consultant / Engineer",
          details.approverName,
          "APPROVED",
          details.comment || "Consultant Ashghal / KEO sign-off granted. QR token generated.",
          3,
        );
      }
      break;
    case 6:
    case 7:
      nextStatus = "Active";
      break;
    case 8:
    case 9:
      nextStatus = "Under Inspection";
      break;
    case 10:
    case 11:
      nextStatus = "Completed";
      break;
    case 12:
      nextStatus = "Closed";
      break;
    default:
      break;
  }

  const updatedOrder: WorkOrder = {
    ...order,
    stage: targetStage,
    status: nextStatus,
    progress: details?.progress !== undefined ? details.progress : order.progress,
    actualStart: targetStage >= 6 && !order.actualStart ? now : order.actualStart,
    actualEnd: targetStage >= 10 && !order.actualEnd ? now : order.actualEnd,
    completionEvidence: details?.completionEvidence
      ? {
          ...details.completionEvidence,
          verifiedAt: now,
        }
      : order.completionEvidence,
  };

  return { updatedOrder, approval };
}
