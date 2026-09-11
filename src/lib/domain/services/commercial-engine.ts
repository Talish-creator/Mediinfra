/**
 * Site Guardian — Commercial & Financial Engine
 * Calculates timesheets from attendance, generates contractor claims, and tracks treasury disbursements.
 */

import type {
  Timesheet,
  ContractorClaim,
  PaymentRecord,
  Worker,
  WorkOrder,
  Contractor,
} from "../types";

export function generateTimesheetFromAttendance(
  worker: Worker,
  workOrder: WorkOrder,
  entryTimeStr: string,
  exitTimeStr: string,
  dateStr: string = new Date().toISOString().split("T")[0]!,
): Timesheet {
  // Parse hours
  const inParts = entryTimeStr.split(":");
  const outParts = exitTimeStr.split(":");
  const inH = Number(inParts[0] || 0);
  const inM = Number(inParts[1] || 0);
  const outH = Number(outParts[0] || 0);
  const outM = Number(outParts[1] || 0);

  const totalMin = Math.max(0, outH * 60 + outM - (inH * 60 + inM));
  const breakMin = 45; // 45 min mandatory lunch/rest break
  const netWorkingMin = Math.max(0, totalMin - breakMin);

  const totalHours = parseFloat((netWorkingMin / 60).toFixed(2));
  const regularHours = Math.min(8.0, totalHours);
  const overtimeHours = parseFloat(Math.max(0, totalHours - 8.0).toFixed(2));
  const breakHours = parseFloat((breakMin / 60).toFixed(2));

  // Hourly rates in QAR by trade
  const rateMap: Record<string, number> = {
    Electrician: 65,
    "HVAC Technician": 68,
    "Steel Fixer": 62,
    "Pipe Fitter": 64,
    "Fire Alarm Technician": 75,
    "HSE Officer": 95,
  };
  const hourlyRate = rateMap[worker.trade] || 60;
  const totalCost = parseFloat(((regularHours + overtimeHours * 1.5) * hourlyRate).toFixed(2));

  return {
    id: `TS-${dateStr.replace(/-/g, "")}-${worker.id}`,
    workerId: worker.id,
    workerName: worker.fullName,
    contractorId: worker.contractorId,
    contractorName: worker.contractorName,
    workOrderId: workOrder.id,
    date: dateStr,
    entryTime: entryTimeStr,
    exitTime: exitTimeStr,
    regularHours,
    overtimeHours,
    breakHours,
    totalBillableHours: totalHours,
    hourlyRate,
    totalCost,
    approvalStatus: "PENDING_SUPERVISOR",
    supervisorSignature: undefined,
  };
}

export function createContractorClaim(
  contractor: Contractor,
  workPackageId: string,
  workPackageName: string,
  timesheets: Timesheet[],
  progressPct: number,
): ContractorClaim {
  const code = `IPC-${contractor.code}-${Date.now().toString().slice(-4)}`;
  const totalHours = timesheets.reduce((acc, t) => acc + t.totalBillableHours, 0);
  const calculatedAmount = timesheets.reduce((acc, t) => acc + t.totalCost, 0);
  if (timesheets.length === 0 || calculatedAmount <= 0) {
    throw new Error("CALCULATION PENDING: no approved operational timesheets are available for this claim.");
  }

  return {
    id: `CLAIM-${Date.now()}`,
    code,
    contractorId: contractor.id,
    contractorName: contractor.companyName,
    workPackageId,
    workPackageName,
    billingPeriod: "Current Operational Shift",
    totalManpowerCount: contractor.actualManpower,
    totalManHours: Math.round(totalHours),
    calculatedAmount,
    verifiedProgressPercentage: progressPct,
    supportingDocumentCount: 8,
    status: "Submitted",
    submittedAt: new Date().toISOString(),
    approvals: [],
  };
}

export function reviewContractorClaim(
  claim: ContractorClaim,
  reviewerRole: string = "Main Contractor Lead",
  reviewerName: string = "IMAR-Al Sraiya Lead QS",
  comment: string = "Verified biometric attendance logs match claimed hours.",
): ContractorClaim {
  if (claim.status !== "Submitted" && claim.status !== "Draft" && claim.status !== "Main Contractor Review") {
    throw new Error(`Cannot review claim in '${claim.status}' state.`);
  }
  return {
    ...claim,
    status: "Under Review",
    approvals: [
      ...claim.approvals,
      {
        role: reviewerRole,
        approver: reviewerName,
        status: "APPROVED",
        timestamp: new Date().toISOString(),
        comment,
      },
    ],
  };
}

export function approveContractorClaim(
  claim: ContractorClaim,
  approverRole: string = "Consultant Quantity Surveyor",
  approverName: string = "Eng. Khalid Al-Sulaiti (KEO)",
  approvedAmount?: number,
  comment: string = "Approved against turnstile cross-verification.",
): ContractorClaim {
  if (
    claim.status !== "Under Review" &&
    claim.status !== "Submitted" &&
    claim.status !== "Main Contractor Review" &&
    claim.status !== "Consultant Review"
  ) {
    throw new Error(`Cannot approve claim in '${claim.status}' state.`);
  }
  const finalAmount = approvedAmount !== undefined ? approvedAmount : claim.calculatedAmount;
  return {
    ...claim,
    status: "Approved",
    approvedAmount: finalAmount,
    approvals: [
      ...claim.approvals,
      {
        role: approverRole,
        approver: approverName,
        status: "APPROVED",
        timestamp: new Date().toISOString(),
        comment,
      },
    ],
  };
}

export function financeApproveContractorClaim(
  claim: ContractorClaim,
  financeOfficer: string = "HMC Financial Controller",
  comment: string = "Budget line item verified. Ready for payment scheduling.",
): ContractorClaim {
  if (claim.status !== "Approved") {
    throw new Error(`Finance approval requires 'Approved' status (current: '${claim.status}').`);
  }
  return {
    ...claim,
    status: "Payment Pending",
    approvals: [
      ...claim.approvals,
      {
        role: "Finance Controller",
        approver: financeOfficer,
        status: "APPROVED",
        timestamp: new Date().toISOString(),
        comment,
      },
    ],
  };
}

export function createPaymentFromClaim(claim: ContractorClaim, authorizedBy?: string): PaymentRecord {
  if (claim.status !== "Approved" && claim.status !== "Payment Pending") {
    throw new Error(`Payment can only be created for an approved claim (current: '${claim.status}').`);
  }
  if (claim.approvedAmount === undefined || claim.approvedAmount <= 0) {
    throw new Error("Payment requires a verified approved amount.");
  }
  const invNumber = `INV-${claim.code.replace("IPC-", "")}-${new Date().getFullYear()}`;
  return {
    id: `PAY-${Date.now()}`,
    invoiceNumber: invNumber,
    contractorId: claim.contractorId,
    contractorName: claim.contractorName,
    claimId: claim.id,
    claimCode: claim.code,
    amount: claim.approvedAmount,
    currency: "QAR",
    paymentStatus: "PROCESSED",
    paymentMethod: "Direct Bank Transfer (QNB Corporate)",
    disbursedDate: new Date().toISOString().split("T")[0],
    authorizedBy: authorizedBy || "Hamad Medical Corporation Treasury Director",
    treasuryBatchRef: `QNB-HMC-EFT-${Math.floor(100000 + Math.random() * 900000)}`,
  };
}

export function markClaimPaid(claim: ContractorClaim): ContractorClaim {
  return {
    ...claim,
    status: "Paid",
  };
}

export function closeClaim(claim: ContractorClaim): ContractorClaim {
  return {
    ...claim,
    status: "Closed",
  };
}
