/**
 * Site Guardian — Central Seed Data
 * Deterministic, internally consistent construction site data for Hamad General Hospital P875.
 * Guarantee: One Worker ID, One Work Order ID, One Project ID, One Zone ID everywhere.
 */

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
  Gate,
  Camera,
  SafetyIncident,
  QualityInspection,
  ChangeRequest,
  Timesheet,
  ContractorClaim,
  PaymentRecord,
  AuditLogEntry,
  SystemNotification,
  MusterPoint,
} from "./types";

// ==========================================
// 1. PROJECT
// ==========================================

export const INITIAL_PROJECT: Project = {
  id: "P875",
  code: "P875",
  name: "Hamad General Hospital Safety Improvement & Retrofit",
  description:
    "Critical healthcare facility infrastructure modernization, clinical MEP upgrade, negative pressure isolation wards and structural retrofit in live operating hospital environments.",
  client: "Ashghal (Public Works Authority) / Hamad Medical Corporation (HMC)",
  consultant: "KEO International Consultants / Khatib & Alami",
  mainContractor: "IMAR Trading & Contracting — Al Sraiya JV",
  location: "Al Rayyan Road, Doha, State of Qatar",
  status: "Active",
  startDate: "2025-11-01",
  targetDate: "2027-04-30",
  budget: 285000000, // 285M QAR
  actualCost: 198420000, // 198.42M QAR
  progress: 76.4,
  riskScore: 18,
};

// ==========================================
// 2. BUILDINGS & FLOORS
// ==========================================

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: "IPT",
    projectId: "P875",
    name: "Inpatient Tower (IPT)",
    code: "IPT",
    totalFloors: 7,
    totalArea: "42,000 m²",
    activeZonesCount: 6,
  },
  {
    id: "OPT",
    projectId: "P875",
    name: "Outpatient Center (OPT)",
    code: "OPT",
    totalFloors: 4,
    totalArea: "28,500 m²",
    activeZonesCount: 3,
  },
  {
    id: "ENG",
    projectId: "P875",
    name: "Central Engineering Plant",
    code: "ENG",
    totalFloors: 2,
    totalArea: "14,200 m²",
    activeZonesCount: 1,
  },
  {
    id: "SV",
    projectId: "P875",
    name: "Services Laydown Yard & Staging",
    code: "SV",
    totalFloors: 1,
    totalArea: "19,000 m²",
    activeZonesCount: 1,
  },
];

export const INITIAL_FLOORS: Floor[] = [
  { id: "IPT-L2", buildingId: "IPT", name: "Level 2 — Surgical Suites", level: "L2", activePermitsCount: 2 },
  { id: "IPT-L3", buildingId: "IPT", name: "Level 3 — Medical Wards", level: "L3", activePermitsCount: 4 },
  { id: "IPT-L4", buildingId: "IPT", name: "Level 4 — Dedicated Plant & AHU", level: "L4", activePermitsCount: 0 },
  { id: "IPT-L5", buildingId: "IPT", name: "Level 5 — Specialty Care & Risers", level: "L5", activePermitsCount: 2 },
  { id: "OPT-L1", buildingId: "OPT", name: "Level 1 — Main Ambulatory Lobby", level: "L1", activePermitsCount: 2 },
  { id: "OPT-L2", buildingId: "OPT", name: "Level 2 — Outpatient Specialty Clinics", level: "L2", activePermitsCount: 2 },
  { id: "OPT-L3", buildingId: "OPT", name: "Level 3 — Diagnostic Imaging Suites", level: "L3", activePermitsCount: 1 },
  { id: "ENG-GF", buildingId: "ENG", name: "Ground Floor — Central Chillers & Generators", level: "GF", activePermitsCount: 2 },
  { id: "SV-GF", buildingId: "SV", name: "Ground Floor — Logistics Yard", level: "GF", activePermitsCount: 2 },
];

// ==========================================
// 3. ZONES
// ==========================================

export const INITIAL_ZONES: Zone[] = [
  {
    id: "IPT-L3-East",
    buildingId: "IPT",
    floorId: "IPT-L3",
    name: "East Ward Mechanical & Medical Gas Refit",
    level: "L3",
    wing: "East",
    type: "Clinical Ward",
    capacity: 50,
    currentOccupancy: 28,
    restricted: false,
    hazardLevel: "Moderate",
    dustLevel: "PM10 22 µg/m³ — Good",
    supervisorId: "W-0005",
    supervisorName: "Tariq Al-Masri",
    supervisorPhone: "+974 5512 8841",
    geofenceBoundary: { x: 6, y: 8, w: 38, h: 34 },
  },
  {
    id: "IPT-L3-West",
    buildingId: "IPT",
    floorId: "IPT-L3",
    name: "West Ward Wing Finishing",
    level: "L3",
    wing: "West",
    type: "Clinical Ward",
    capacity: 45,
    currentOccupancy: 24,
    restricted: false,
    hazardLevel: "Low",
    dustLevel: "PM10 31 µg/m³ — Good",
    supervisorId: "W-0008",
    supervisorName: "Rajesh Nair",
    supervisorPhone: "+974 3390 4471",
    geofenceBoundary: { x: 56, y: 8, w: 38, h: 34 },
  },
  {
    id: "IPT-L3-Core",
    buildingId: "IPT",
    floorId: "IPT-L3",
    name: "Central Elevator & Riser Stair Core",
    level: "L3",
    wing: "Core",
    type: "Corridor",
    capacity: 20,
    currentOccupancy: 9,
    restricted: false,
    hazardLevel: "Moderate",
    dustLevel: "PM10 55 µg/m³ — Monitor",
    supervisorId: "W-0012",
    supervisorName: "Hassan Ali",
    supervisorPhone: "+974 6620 1123",
    geofenceBoundary: { x: 44, y: 8, w: 12, h: 34 },
  },
  {
    id: "IPT-L3-Hoarding",
    buildingId: "IPT",
    floorId: "IPT-L3",
    name: "Hoarding Chokepoint (Clinical Interface)",
    level: "L3",
    wing: "South",
    type: "Chokepoint",
    capacity: 10,
    currentOccupancy: 5,
    restricted: false,
    hazardLevel: "High",
    dustLevel: "Negative pressure verified (-12.5 Pa)",
    supervisorId: "W-0015",
    supervisorName: "Bilal Sheikh",
    supervisorPhone: "+974 7781 3320",
    geofenceBoundary: { x: 6, y: 48, w: 88, h: 14 },
  },
  {
    id: "IPT-L4-AHU",
    buildingId: "IPT",
    floorId: "IPT-L4",
    name: "Air Handling Unit Room (NON-PERMIT RESTRICTED)",
    level: "L4",
    wing: "Plant",
    type: "Plant Room",
    capacity: 6,
    currentOccupancy: 0,
    restricted: true,
    hazardLevel: "Critical",
    dustLevel: "Restricted Access · Authorized Keycards Only",
    supervisorId: "W-0001",
    supervisorName: "HSE Command Control",
    supervisorPhone: "+974 4439 9999",
    geofenceBoundary: { x: 6, y: 68, w: 30, h: 24 },
  },
  {
    id: "IPT-L5-West",
    buildingId: "IPT",
    floorId: "IPT-L5",
    name: "West Wing Riser Works",
    level: "L5",
    wing: "West",
    type: "Corridor",
    capacity: 30,
    currentOccupancy: 17,
    restricted: false,
    hazardLevel: "Moderate",
    dustLevel: "PM10 38 µg/m³ — Acceptable",
    supervisorId: "W-0022",
    supervisorName: "Imran Malik",
    supervisorPhone: "+974 5540 9982",
    geofenceBoundary: { x: 46, y: 68, w: 48, h: 24 },
  },
  {
    id: "OPT-L1-Lobby",
    buildingId: "OPT",
    floorId: "OPT-L1",
    name: "Outpatient Lobby Retrofit",
    level: "L1",
    wing: "North",
    type: "Clinical Ward",
    capacity: 40,
    currentOccupancy: 31,
    restricted: false,
    hazardLevel: "Moderate",
    dustLevel: "PM10 47 µg/m³ — Acceptable",
    supervisorId: "W-0030",
    supervisorName: "Sunil Kumar",
    supervisorPhone: "+974 3312 5540",
    geofenceBoundary: { x: 6, y: 8, w: 44, h: 40 },
  },
  {
    id: "OPT-L2-Clinics",
    buildingId: "OPT",
    floorId: "OPT-L2",
    name: "Clinic Block B Fit-Out",
    level: "L2",
    wing: "East",
    type: "Clinical Ward",
    capacity: 35,
    currentOccupancy: 26,
    restricted: false,
    hazardLevel: "Low",
    dustLevel: "PM10 29 µg/m³ — Good",
    supervisorId: "W-0035",
    supervisorName: "Faisal Iqbal",
    supervisorPhone: "+974 6690 7712",
    geofenceBoundary: { x: 54, y: 8, w: 40, h: 40 },
  },
  {
    id: "OPT-L3-Imaging",
    buildingId: "OPT",
    floorId: "OPT-L3",
    name: "Imaging Suite Shielding",
    level: "L3",
    wing: "West",
    type: "Operating Theater",
    capacity: 18,
    currentOccupancy: 12,
    restricted: false,
    hazardLevel: "High",
    dustLevel: "Lead-lining works — PPE Level 2",
    supervisorId: "W-0040",
    supervisorName: "Kamal Rahman",
    supervisorPhone: "+974 5578 3341",
    geofenceBoundary: { x: 6, y: 54, w: 88, h: 38 },
  },
  {
    id: "ENG-Plant-01",
    buildingId: "ENG",
    floorId: "ENG-GF",
    name: "Central Engineering Plant",
    level: "GF",
    wing: "Plant",
    type: "Plant Room",
    capacity: 30,
    currentOccupancy: 22,
    restricted: false,
    hazardLevel: "High",
    dustLevel: "PM10 61 µg/m³ — Monitor",
    supervisorId: "W-0045",
    supervisorName: "Yusuf Farooq",
    supervisorPhone: "+974 3345 8890",
    geofenceBoundary: { x: 6, y: 8, w: 44, h: 84 },
  },
  {
    id: "SV-Yard",
    buildingId: "SV",
    floorId: "SV-GF",
    name: "Services Laydown Yard",
    level: "GF",
    wing: "South",
    type: "Yard",
    capacity: 60,
    currentOccupancy: 34,
    restricted: false,
    hazardLevel: "Moderate",
    dustLevel: "Open air · Crane exclusion active",
    supervisorId: "W-0050",
    supervisorName: "Naveed Baig",
    supervisorPhone: "+974 7712 4408",
    geofenceBoundary: { x: 54, y: 8, w: 40, h: 84 },
  },
];

// ==========================================
// 4. CONTRACTORS
// ==========================================

export const INITIAL_CONTRACTORS: Contractor[] = [
  {
    id: "SC-01",
    projectId: "P875",
    companyName: "Al Sraiya MEP Engineering",
    code: "AS-MEP",
    trade: "MEP / Electrical",
    contractValue: 54200000,
    contactPerson: "Eng. Mounir Hadad",
    phone: "+974 4488 2211",
    email: "m.hadad@alsraiyagroup.com",
    status: "Active",
    plannedManpower: 240,
    actualManpower: 228,
    safetyScore: 98.4,
    qualityScore: 96.0,
    progress: 78.5,
    totalManHours: 41320,
    totalBilledAmount: 38940000,
    totalPaidAmount: 35120000,
  },
  {
    id: "SC-02",
    projectId: "P875",
    companyName: "Qatar Structural Steel",
    code: "QSS",
    trade: "Structural Steel & Framing",
    contractValue: 42100000,
    contactPerson: "Eng. Khalid Al-Sulaiti",
    phone: "+974 4455 1100",
    email: "khalid@qss-steel.qa",
    status: "Active",
    plannedManpower: 180,
    actualManpower: 162,
    safetyScore: 97.1,
    qualityScore: 94.5,
    progress: 81.2,
    totalManHours: 29880,
    totalBilledAmount: 32400000,
    totalPaidAmount: 29800000,
  },
  {
    id: "SC-03",
    projectId: "P875",
    companyName: "Electro-Mechanical Enterprise",
    code: "EME",
    trade: "Medical Gas / Plumbing",
    contractValue: 38500000,
    contactPerson: "Eng. George Antoun",
    phone: "+974 4433 9922",
    email: "g.antoun@eme-qatar.com",
    status: "Active",
    plannedManpower: 150,
    actualManpower: 141,
    safetyScore: 99.2,
    qualityScore: 98.0,
    progress: 74.0,
    totalManHours: 24110,
    totalBilledAmount: 26800000,
    totalPaidAmount: 24200000,
  },
  {
    id: "SC-04",
    projectId: "P875",
    companyName: "Al Rayyan HVAC",
    code: "ARH",
    trade: "HVAC & Specialist Ductwork",
    contractValue: 31800000,
    contactPerson: "Eng. Sameh Zaki",
    phone: "+974 4477 3344",
    email: "sameh@alrayyanhvac.com",
    status: "Active",
    plannedManpower: 130,
    actualManpower: 118,
    safetyScore: 94.8,
    qualityScore: 92.4,
    progress: 69.8,
    totalManHours: 19640,
    totalBilledAmount: 21500000,
    totalPaidAmount: 18900000,
  },
  {
    id: "SC-05",
    projectId: "P875",
    companyName: "Falcon Fire Protection",
    code: "FFP",
    trade: "Fire & Life Safety",
    contractValue: 24600000,
    contactPerson: "Eng. Bernard O'Connor",
    phone: "+974 4499 5566",
    email: "b.oconnor@falconfire.qa",
    status: "Active",
    plannedManpower: 95,
    actualManpower: 92,
    safetyScore: 100.0,
    qualityScore: 99.0,
    progress: 84.5,
    totalManHours: 15230,
    totalBilledAmount: 19800000,
    totalPaidAmount: 18400000,
  },
  {
    id: "SC-06",
    projectId: "P875",
    companyName: "Doha Interior Solutions",
    code: "DIS",
    trade: "Finishings & Clinical Joinery",
    contractValue: 28900000,
    contactPerson: "Eng. Ziad Tannir",
    phone: "+974 4411 7788",
    email: "ztannir@dohainteriors.qa",
    status: "Active",
    plannedManpower: 130,
    actualManpower: 123,
    safetyScore: 95.6,
    qualityScore: 95.0,
    progress: 72.1,
    totalManHours: 17480,
    totalBilledAmount: 19200000,
    totalPaidAmount: 17100000,
  },
];

// ==========================================
// 5. WORKERS (100+ REALISTIC RECORDS)
// ==========================================

const FIRST_NAMES = [
  "Mohammad", "Rizwan", "Abdul", "Sunil", "Ramesh", "Ahmed", "Bilal", "Prakash",
  "Yusuf", "Imran", "Santosh", "Kamal", "Vijay", "Hassan", "Naveed", "Rajesh",
  "Faisal", "Deepak", "Sajid", "Anwar", "Ali", "Mustafa", "Zubair", "Khaled",
  "Rashid", "Dinesh", "Suresh", "Manpreet", "Gurdeep", "Farhan"
];

const LAST_NAMES = [
  "Rizwan", "Karim", "Kumar", "Patel", "Khan", "Sheikh", "Nair", "Rahman",
  "Malik", "Ali", "Baig", "Iqbal", "Farooq", "Ansari", "Hussain", "Mahmoud",
  "Saleh", "Yadav", "Sharma", "Singh", "Qureshi", "Akram", "Chowdhury", "Das"
];

const TRADES = [
  "Electrician", "Steel Fixer", "Pipe Fitter", "HSE Officer", "HVAC Technician",
  "Mason", "Carpenter", "Fire Alarm Technician", "Painter", "Rigger"
];

const NATIONALITIES = [
  "India", "Nepal", "Bangladesh", "Pakistan", "Philippines", "Egypt", "Jordan", "Sri Lanka"
];

function generateSeedWorkers(): Worker[] {
  const workers: Worker[] = [];

  // 1. Anchor Worker for Demo Scenario 1 (Successful Path)
  workers.push({
    id: "W-0245",
    employeeCode: "EMP-AS-0245",
    fullName: "Mohammad Rizwan",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    qid: "28863419024",
    rfid: "EPC-00245",
    contractorId: "SC-01",
    contractorName: "Al Sraiya MEP Engineering",
    trade: "Electrician",
    phone: "+974 5581 4092",
    emergencyContact: "+974 3312 9011 (Brother)",
    projectId: "P875",
    status: "Active",
    inductionStatus: "VALID",
    inductionExpiry: "2027-03-15",
    accessStatus: "Authorized",
    currentBuildingId: "IPT",
    currentFloorId: "IPT-L3",
    currentZoneId: "IPT-L3-East",
    currentWorkOrderId: "WO-1027",
    currentCoordinates: { x: 22, y: 18 },
    hoursToday: 8.7,
    hoursThisWeek: 44.2,
    joinedDate: "2024-03-10",
    nationality: "Pakistan",
    safetyViolationsCount: 0,
  });

  // 2. Anchor Worker for Demo Scenario 2 (Expired Induction Denial)
  workers.push({
    id: "W-0317",
    employeeCode: "EMP-ARH-0317",
    fullName: "Faisal Iqbal",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    qid: "29163400317",
    rfid: "EPC-00317",
    contractorId: "SC-04",
    contractorName: "Al Rayyan HVAC",
    trade: "HVAC Technician",
    phone: "+974 6690 7712",
    emergencyContact: "+974 7712 3456 (Cousin)",
    projectId: "P875",
    status: "Active",
    inductionStatus: "EXPIRED",
    inductionExpiry: "2026-08-15",
    accessStatus: "Restricted",
    currentBuildingId: undefined,
    currentFloorId: undefined,
    currentZoneId: undefined,
    currentWorkOrderId: undefined,
    currentCoordinates: undefined,
    hoursToday: 0,
    hoursThisWeek: 18.0,
    joinedDate: "2024-06-01",
    nationality: "Pakistan",
    safetyViolationsCount: 1,
  });

  // 3. Anchor Worker for Demo Scenario 3 (Unassigned Worker)
  workers.push({
    id: "W-0402",
    employeeCode: "EMP-QSS-0402",
    fullName: "Ramesh Patel",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    qid: "28463499402",
    rfid: "EPC-00402",
    contractorId: "SC-02",
    contractorName: "Qatar Structural Steel",
    trade: "Steel Fixer",
    phone: "+974 3344 8811",
    emergencyContact: "+974 5511 2233",
    projectId: "P875",
    status: "Active",
    inductionStatus: "VALID",
    inductionExpiry: "2027-01-20",
    accessStatus: "Pending Briefing",
    currentBuildingId: undefined,
    currentFloorId: undefined,
    currentZoneId: undefined,
    currentWorkOrderId: undefined,
    currentCoordinates: undefined,
    hoursToday: 0,
    hoursThisWeek: 32.5,
    joinedDate: "2024-08-15",
    nationality: "India",
    safetyViolationsCount: 0,
  });

  // 4. Generate 97 additional realistic workers (total 100)
  for (let i = 1; i <= 97; i++) {
    const numStr = String(i).padStart(4, "0");
    const id = `W-${numStr}`;
    const fn = FIRST_NAMES[(i * 7) % FIRST_NAMES.length]!;
    const ln = LAST_NAMES[(i * 11) % LAST_NAMES.length]!;
    const fullName = `${fn} ${ln}`;
    const sub = INITIAL_CONTRACTORS[i % INITIAL_CONTRACTORS.length]!;
    const trade = TRADES[(i + 3) % TRADES.length]!;
    const nationality = NATIONALITIES[(i * 5) % NATIONALITIES.length]!;
    const qid = `29${(i % 10)}${String(3400000 + i * 137).slice(0, 8)}`;
    const rfid = `EPC-${numStr}`;
    const isInductionValid = i % 18 !== 0; // realistic occasional expired induction
    const zone = INITIAL_ZONES[i % INITIAL_ZONES.length]!;

    workers.push({
      id,
      employeeCode: `EMP-${sub.code}-${numStr}`,
      fullName,
      photoUrl: `https://images.unsplash.com/photo-${1500000000000 + (i % 20) * 10000}?w=150&auto=format&fit=crop&q=80`,
      qid,
      rfid,
      contractorId: sub.id,
      contractorName: sub.companyName,
      trade,
      phone: `+974 ${3300 + (i % 500)} ${String(1000 + (i * 37) % 9000).padStart(4, "0")}`,
      emergencyContact: `+974 55${String(100000 + i).slice(0, 6)}`,
      projectId: "P875",
      status: i % 4 === 0 ? "On Site" : "Off Site",
      inductionStatus: isInductionValid ? "VALID" : "EXPIRED",
      inductionExpiry: isInductionValid ? "2027-02-28" : "2026-07-31",
      accessStatus: isInductionValid ? "Authorized" : "Restricted",
      currentBuildingId: i % 4 === 0 ? zone.buildingId : undefined,
      currentFloorId: i % 4 === 0 ? zone.floorId : undefined,
      currentZoneId: i % 4 === 0 ? zone.id : undefined,
      currentWorkOrderId: i % 4 === 0 ? "WO-1027" : undefined,
      currentCoordinates: i % 4 === 0 ? { x: 20 + (i % 60), y: 15 + (i % 50) } : undefined,
      hoursToday: i % 4 === 0 ? 6.5 : 0,
      hoursThisWeek: 36.0 + (i % 12),
      joinedDate: "2024-01-15",
      nationality,
      safetyViolationsCount: i % 25 === 0 ? 1 : 0,
    });
  }

  return workers;
}

export const INITIAL_WORKERS: Worker[] = generateSeedWorkers();

// ==========================================
// 6. WORKER DOCUMENTS & SAFETY INDUCTIONS
// ==========================================

export const INITIAL_DOCUMENTS: WorkerDocument[] = INITIAL_WORKERS.slice(0, 20).map((w, i) => ({
  id: `DOC-W-${w.id}-${i}`,
  workerId: w.id,
  documentType: i % 2 === 0 ? "QID" : "Trade Certification",
  documentNumber: `QAT-${w.qid}`,
  issueDate: "2023-01-01",
  expiryDate: "2027-01-01",
  verificationStatus: "Verified",
  verifiedBy: "MoPH Compliance Officer",
  verifiedAt: "2024-02-15 10:30",
  fileUrl: "https://mediinfra.internal/docs/qid-verified.pdf",
}));

export const INITIAL_INDUCTIONS: SafetyInduction[] = INITIAL_WORKERS.slice(0, 30).map((w, i) => ({
  id: `IND-${w.id}`,
  workerId: w.id,
  trainingType: "Hospital Renovation Induction",
  completedAt: "2026-01-10 09:00",
  expiresAt: w.inductionExpiry,
  score: 95,
  status: w.inductionStatus,
  certificateNumber: `HMC-HSE-${w.id}-2026`,
  trainerName: "Eng. Salem Al-Kuwari (Ashghal HSE)",
}));

// ==========================================
// 7. WORK PACKAGES
// ==========================================

export const INITIAL_WORK_PACKAGES: WorkPackage[] = [
  {
    id: "WP-01",
    projectId: "P875",
    contractorId: "SC-01",
    zoneId: "IPT-L3-East",
    name: "IPT Level 3 Clinical Area MEP Revamp",
    description: "Full replacement of clinical electrical feeds, isolated power supplies (IPS), UPS integration and medical gas terminal units in live wards.",
    plannedStart: "2026-08-01",
    plannedFinish: "2026-11-30",
    budget: 18500000,
    progress: 82.0,
    status: "Active",
  },
  {
    id: "WP-02",
    projectId: "P875",
    contractorId: "SC-02",
    zoneId: "OPT-L3-Imaging",
    name: "OPT Diagnostic Imaging Radiation Shielding",
    description: "Structural lead lining installation, heavy ceiling steel framing for MRI gantry and radiological isolation barriers.",
    plannedStart: "2026-08-15",
    plannedFinish: "2026-12-15",
    budget: 14200000,
    progress: 68.5,
    status: "Active",
  },
  {
    id: "WP-03",
    projectId: "P875",
    contractorId: "SC-03",
    zoneId: "ENG-Plant-01",
    name: "Central Plant Chilled Water Header Replacement",
    description: "Tie-in of new 500-ton high-efficiency magnetic-bearing chillers to hospital main hydraulic ring.",
    plannedStart: "2026-07-01",
    plannedFinish: "2026-10-31",
    budget: 12800000,
    progress: 75.0,
    status: "Active",
  },
  {
    id: "WP-04",
    projectId: "P875",
    contractorId: "SC-05",
    zoneId: "SV-Yard",
    name: "Site Perimeter Life Safety & Deluge Monitoring",
    description: "Installation of seismic gas shutoff valves, exterior fire loop loopback and hydrant flow telemetry.",
    plannedStart: "2026-08-01",
    plannedFinish: "2026-10-15",
    budget: 8400000,
    progress: 90.0,
    status: "Active",
  },
];

// ==========================================
// 8. WORK ORDERS (INCLUDING WO-1027)
// ==========================================

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "WO-1027",
    workPackageId: "WP-01",
    projectId: "P875",
    zoneId: "IPT-L3-East",
    zoneName: "East Ward Mechanical & Medical Gas Refit",
    buildingId: "IPT",
    contractorId: "SC-01",
    contractorName: "Al Sraiya MEP Engineering",
    supervisorId: "W-0005",
    supervisorName: "Tariq Al-Masri",
    supervisorPhone: "+974 5512 8841",
    title: "IPT Level 3 East Medical Infrastructure & Electrical Installation",
    description: "Conduit routing, medical gas pipeline hookups and secondary busway installation in IPT Level 3 East Ward under ICRA Class IV isolation.",
    scope: "Installation of 240m copper medical gas piping (O2, N2O, MedAir, Vacuum), isolated power panelboards, and low-voltage emergency circuit terminations.",
    methodStatement: "MS-P875-MEP-014 Rev.2 (Ashghal Certified)",
    riskAssessment: "RAMS-IPT-L3-09 approved by KEO HSE Lead",
    plannedStart: "2026-09-10 07:00",
    plannedEnd: "2026-09-10 17:00",
    workforceQuota: 20,
    assignedWorkerIds: ["W-0245", "W-0001", "W-0002", "W-0003", "W-0004", "W-0005"],
    acknowledgedWorkerIds: ["W-0245"],
    hazards: ["Hot works", "Pressurised medical gas", "Working at height", "ICRA infection barrier breach risk"],
    requiredPPE: ["Safety Helmet", "Hi-Vis Reflective Vest", "Steel-toe Boots", "Safety Goggles", "FFP2 Dust Mask"],
    equipment: ["Rotary Hammer Drill with HEPA Vacuum", "Oxy-Acetylene Brazing Rig", "Certified Aluminum Mobile Scaffolding", "Portable Gas Leak Detector"],
    documents: [
      { name: "Approved_Method_Statement_Rev02.pdf", size: "4.8 MB", status: "Signed & Stamped" },
      { name: "Risk_Assessment_Matrix_RAMS.pdf", size: "2.1 MB", status: "Approved by KEO" },
      { name: "ICRA_Dust_Control_Permit.pdf", size: "1.2 MB", status: "HMC Infection Lead Verified" }
    ],
    status: "Approved",
    stage: 5, // Access Ready / Worker Acknowledged
    progress: 65,
    actualStart: "2026-09-10 07:15",
    qrToken: "SG-WO1027-TOKEN-8839-AUTH",
    createdAt: "2026-09-09 14:00",
  },
  {
    id: "WO-2026-P875-0142",
    workPackageId: "WP-01",
    projectId: "P875",
    zoneId: "IPT-L3-East",
    zoneName: "East Ward Mechanical & Medical Gas Refit",
    buildingId: "IPT",
    contractorId: "SC-03",
    contractorName: "Electro-Mechanical Enterprise",
    supervisorId: "W-0010",
    supervisorName: "Sunil Kumar",
    supervisorPhone: "+974 3312 5540",
    title: "IPT Level 3 Medical Gas Piping Installation",
    description: "Brazing and pressure decay leak-testing of O2 and medical air risers.",
    scope: "Pressure test zone valves and connect terminal wall outlets in rooms 301-320.",
    methodStatement: "MS-EME-MEDGAS-04",
    riskAssessment: "RAMS-EME-04",
    plannedStart: "2026-09-10 06:00",
    plannedEnd: "2026-09-10 17:00",
    workforceQuota: 25,
    assignedWorkerIds: ["W-0010", "W-0011", "W-0012", "W-0013"],
    acknowledgedWorkerIds: ["W-0010", "W-0011"],
    hazards: ["Hot works", "Pressurised gas", "Confined space"],
    requiredPPE: ["Safety Helmet", "Hi-Vis Vest", "Safety Boots", "Gas Monitor"],
    equipment: ["Nitrogen purge bottles", "Brazing torch", "Manometer test kit"],
    documents: [{ name: "Pressure_Test_Certificate.pdf", size: "2.4 MB", status: "Valid" }],
    status: "Active",
    stage: 6,
    progress: 78,
    actualStart: "2026-09-10 06:30",
    qrToken: "SG-WO0142-TOKEN-1122-AUTH",
    createdAt: "2026-09-08 10:00",
  },
  {
    id: "WO-2026-P875-0143",
    workPackageId: "WP-01",
    projectId: "P875",
    zoneId: "IPT-L5-West",
    zoneName: "West Wing Riser Works",
    buildingId: "IPT",
    contractorId: "SC-01",
    contractorName: "Al Sraiya MEP Engineering",
    supervisorId: "W-0022",
    supervisorName: "Imran Malik",
    supervisorPhone: "+974 5540 9982",
    title: "IPT Level 5 West Riser Cable Pulling",
    description: "Pulling 4x240mm² XLPE power submain cables through vertical fire-rated riser duct.",
    scope: "Cable pull, cleating and fire barrier sealing at L5 penetration.",
    methodStatement: "MS-AS-LV-02",
    riskAssessment: "RAMS-AS-LV-02",
    plannedStart: "2026-09-10 06:00",
    plannedEnd: "2026-09-10 15:00",
    workforceQuota: 18,
    assignedWorkerIds: ["W-0020", "W-0021", "W-0022"],
    acknowledgedWorkerIds: ["W-0020", "W-0021", "W-0022"],
    hazards: ["Confined riser", "Heavy cable pull", "Working at height"],
    requiredPPE: ["Safety Helmet", "Hi-Vis Vest", "Leather Gloves", "Fall Arrest Harness"],
    equipment: ["Electric cable pulling winch", "Roller guides"],
    documents: [{ name: "Cable_Test_Report.pdf", size: "1.9 MB", status: "Approved" }],
    status: "Active",
    stage: 6,
    progress: 88,
    actualStart: "2026-09-10 06:15",
    qrToken: "SG-WO0143-TOKEN-3344-AUTH",
    createdAt: "2026-09-08 11:30",
  },
  {
    id: "WO-2026-P875-0148",
    workPackageId: "WP-01",
    projectId: "P875",
    zoneId: "OPT-L2-Clinics",
    zoneName: "Clinic Block B Fit-Out",
    buildingId: "OPT",
    contractorId: "SC-04",
    contractorName: "Al Rayyan HVAC",
    supervisorId: "W-0035",
    supervisorName: "Faisal Iqbal",
    supervisorPhone: "+974 6690 7712",
    title: "OPT Level 2 Clinic Block B Ductwork",
    description: "Installation of acoustic duct silencers and VAV boxes adjacent to live exam rooms.",
    scope: "Mount 14 VAV boxes and connect low-leakage spiral ductwork.",
    methodStatement: "MS-ARH-DUCT-01",
    riskAssessment: "RAMS-ARH-01",
    plannedStart: "2026-09-11 07:00",
    plannedEnd: "2026-09-11 18:00",
    workforceQuota: 22,
    assignedWorkerIds: ["W-0317", "W-0035"],
    acknowledgedWorkerIds: [],
    hazards: ["Overhead lifting", "Noise transmission to active clinics"],
    requiredPPE: ["Safety Helmet", "Hi-Vis Vest", "Ear Defenders"],
    equipment: ["Duct jack lifter", "Acoustic insulation knives"],
    documents: [{ name: "VAV_Commissioning_Datasheet.pdf", size: "3.1 MB", status: "Pending" }],
    status: "Pending Consultant",
    stage: 3,
    progress: 40,
    qrToken: "SG-WO0148-TOKEN-5566-PEND",
    createdAt: "2026-09-09 09:00",
  },
  {
    id: "WO-2026-P875-0151",
    workPackageId: "WP-02",
    projectId: "P875",
    zoneId: "OPT-L3-Imaging",
    zoneName: "Imaging Suite Shielding",
    buildingId: "OPT",
    contractorId: "SC-02",
    contractorName: "Qatar Structural Steel",
    supervisorId: "W-0040",
    supervisorName: "Kamal Rahman",
    supervisorPhone: "+974 5578 3341",
    title: "OPT Level 3 Imaging Suite Lead Shielding",
    description: "Lead sheet laminations and structural framing for CT Scanner room.",
    scope: "Fix 3mm Pb lead lining on partitions and leaded glass inspection window.",
    methodStatement: "MS-QSS-LEAD-03",
    riskAssessment: "RAMS-QSS-RAD-03",
    plannedStart: "2026-09-12 06:30",
    plannedEnd: "2026-09-12 16:30",
    workforceQuota: 14,
    assignedWorkerIds: ["W-0040", "W-0402"],
    acknowledgedWorkerIds: [],
    hazards: ["Heavy manual handling", "Lead dust exposure"],
    requiredPPE: ["Lead Handling Gloves", "Respirator Mask", "Safety Helmet", "Hi-Vis Vest"],
    equipment: ["Vacuum glass lifter", "Lead sheet hoist"],
    documents: [{ name: "Radiation_Protection_Survey.pdf", size: "5.5 MB", status: "Draft" }],
    status: "Main Contractor Review",
    stage: 2,
    progress: 15,
    qrToken: "SG-WO0151-TOKEN-7788-DRAFT",
    createdAt: "2026-09-09 16:00",
  },
  {
    id: "WO-2026-P875-0158",
    workPackageId: "WP-01",
    projectId: "P875",
    zoneId: "IPT-L3-West",
    zoneName: "West Ward Wing Finishing",
    buildingId: "IPT",
    contractorId: "SC-06",
    contractorName: "Doha Interior Solutions",
    supervisorId: "W-0008",
    supervisorName: "Rajesh Nair",
    supervisorPhone: "+974 3390 4471",
    title: "IPT Level 3 West Ward Ceiling & Joinery",
    description: "Acoustic ceiling grid tiles and antimicrobial medical nurse station cabinetry installation.",
    scope: "Complete 450m² ceiling and 8 patient recovery rooms.",
    methodStatement: "MS-DIS-INT-09",
    riskAssessment: "RAMS-DIS-09",
    plannedStart: "2026-09-07 06:00",
    plannedEnd: "2026-09-07 17:00",
    workforceQuota: 20,
    assignedWorkerIds: ["W-0008", "W-0009"],
    acknowledgedWorkerIds: ["W-0008", "W-0009"],
    hazards: ["Working at height", "Fine dust particles"],
    requiredPPE: ["Safety Helmet", "Hi-Vis Vest", "Dust Mask"],
    equipment: ["Laser level", "Pneumatic finish nailer"],
    documents: [{ name: "Handover_Checklist_Signed.pdf", size: "2.8 MB", status: "Passed" }],
    status: "Completed",
    stage: 10,
    progress: 100,
    actualStart: "2026-09-07 06:00",
    actualEnd: "2026-09-07 16:45",
    qrToken: "SG-WO0158-TOKEN-9900-DONE",
    createdAt: "2026-09-05 08:00",
  },
  {
    id: "WO-2026-P875-0164",
    workPackageId: "WP-01",
    projectId: "P875",
    zoneId: "IPT-L3-Hoarding",
    zoneName: "Hoarding Chokepoint (Clinical Interface)",
    buildingId: "IPT",
    contractorId: "SC-01",
    contractorName: "Al Sraiya MEP Engineering",
    supervisorId: "W-0005",
    supervisorName: "Tariq Al-Masri",
    supervisorPhone: "+974 5512 8841",
    title: "IPT Hoarding Chokepoint Negative Pressure Survey",
    description: "Continuous differential pressure sensor calibration and HEPA filtration velocity audits.",
    scope: "Audit 3 airlock anterooms between construction zone and clinical corridors.",
    methodStatement: "MS-AS-ICRA-01",
    riskAssessment: "RAMS-ICRA-01",
    plannedStart: "2026-09-14 08:00",
    plannedEnd: "2026-09-14 12:00",
    workforceQuota: 6,
    assignedWorkerIds: [],
    acknowledgedWorkerIds: [],
    hazards: ["Infection control (ICRA Class IV) boundary exposure"],
    requiredPPE: ["Cleanroom Tyvek Suit", "N95 Mask", "Shoe Covers"],
    equipment: ["Digital micromanometer", "Hot-wire anemometer"],
    documents: [],
    status: "Draft",
    stage: 1,
    progress: 0,
    qrToken: "SG-WO0164-TOKEN-0011-DRAFT",
    createdAt: "2026-09-10 11:00",
  },
];

// ==========================================
// 9. GATES
// ==========================================

export const INITIAL_GATES: Gate[] = [
  {
    id: "GATE-01",
    projectId: "P875",
    name: "Gate 01 — Main Logistics & Pedestrian Portal",
    location: "North Perimeter (Al Rayyan Access Road)",
    readerModel: "Zebra FXR90 Ultra-Rugged Fixed RFID Reader",
    readerIp: "10.87.5.101",
    status: "Online",
    temperatureCelsius: 41.2,
    rfPowerDbm: 30.0,
    vswrRatio: 1.12,
    lanes: [
      { id: "G01-L1", name: "Lane 1 (Turnstile Pedestrian In)", direction: "IN", throughputPerHour: 480, opticalTurnstileState: "Locked" },
      { id: "G01-L2", name: "Lane 2 (Turnstile Pedestrian Out)", direction: "OUT", throughputPerHour: 460, opticalTurnstileState: "Locked" }
    ],
  },
  {
    id: "GATE-02",
    projectId: "P875",
    name: "Gate 02 — Inpatient Tower North Portal",
    location: "IPT North Pedestrian Concourse",
    readerModel: "Zebra FXR90 Ultra-Rugged Fixed RFID Reader",
    readerIp: "10.87.5.102",
    status: "Online",
    temperatureCelsius: 42.0,
    rfPowerDbm: 30.0,
    vswrRatio: 1.15,
    lanes: [
      { id: "G02-L1", name: "Lane 1 (Turnstile In)", direction: "IN", throughputPerHour: 510, opticalTurnstileState: "Locked" },
      { id: "G02-L2", name: "Lane 2 (Turnstile Out)", direction: "OUT", throughputPerHour: 490, opticalTurnstileState: "Locked" }
    ],
  },
  {
    id: "GATE-03",
    projectId: "P875",
    name: "Gate 03 — Clean Hoarding Interface Turnstile",
    location: "Clinical Interface (IPT Level 2 Airlock)",
    readerModel: "Zebra FX7500 Compact Enterprise RFID Reader",
    readerIp: "10.87.5.103",
    status: "Online",
    temperatureCelsius: 38.5,
    rfPowerDbm: 28.5,
    vswrRatio: 1.18,
    lanes: [
      { id: "G03-L1", name: "Lane 1 (Cleanroom Biometric In)", direction: "IN", throughputPerHour: 220, opticalTurnstileState: "Locked" },
      { id: "G03-L2", name: "Lane 2 (Cleanroom Biometric Out)", direction: "OUT", throughputPerHour: 210, opticalTurnstileState: "Locked" }
    ],
  },
  {
    id: "GATE-04",
    projectId: "P875",
    name: "Gate 04 — Services Laydown & Heavy Plant Gate",
    location: "South Logistics Compound",
    readerModel: "Zebra FXR90 Ultra-Rugged Fixed RFID Reader",
    readerIp: "10.87.5.104",
    status: "Online",
    temperatureCelsius: 44.1,
    rfPowerDbm: 31.5,
    vswrRatio: 1.22,
    lanes: [
      { id: "G04-L1", name: "Lane 1 (Heavy Vehicle / Tag Portal)", direction: "IN", throughputPerHour: 180, opticalTurnstileState: "Locked" },
      { id: "G04-L2", name: "Lane 2 (Heavy Vehicle / Tag Portal)", direction: "OUT", throughputPerHour: 175, opticalTurnstileState: "Locked" }
    ],
  },
];

// ==========================================
// 10. AI CAMERAS & RECOGNITION
// ==========================================

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: "CAM-01",
    projectId: "P875",
    zoneId: "IPT-L3-East",
    name: "CAM-01 — Gate 01 Main Ingress & PPE Portal",
    locationLabel: "Main Site Entry Gantry",
    streamUrl: "rtsp://edge-ai.p875.internal/stream/cam01",
    status: "Online",
    model: "Axis Q3538-LVE Edge AI",
    aiModelVersion: "SafetyNet-v4.2-YOLO11x",
    fps: 30,
    inferenceLatencyMs: 11.2,
  },
  {
    id: "CAM-02",
    projectId: "P875",
    zoneId: "IPT-L3-Hoarding",
    name: "CAM-02 — Gate 03 Hoarding Clean Portal",
    locationLabel: "Clinical Hoarding Entry Airlock",
    streamUrl: "rtsp://edge-ai.p875.internal/stream/cam02",
    status: "Online",
    model: "Hikvision DeepinView 4K",
    aiModelVersion: "SafetyNet-v4.2-YOLO11x",
    fps: 30,
    inferenceLatencyMs: 12.0,
  },
  {
    id: "CAM-03",
    projectId: "P875",
    zoneId: "IPT-L3-East",
    name: "CAM-03 — IPT Level 3 East Corridor",
    locationLabel: "IPT Level 3 Active Work Zone",
    streamUrl: "rtsp://edge-ai.p875.internal/stream/cam03",
    status: "Online",
    model: "Hanwha Vision AI PNV-A9081R",
    aiModelVersion: "SafetyNet-v4.2-YOLO11x",
    fps: 30,
    inferenceLatencyMs: 10.8,
  },
];

// ==========================================
// 11. SAFETY INCIDENTS
// ==========================================

export const INITIAL_INCIDENTS: SafetyIncident[] = [
  {
    id: "INC-2026-0881",
    source: "AI_DETECTION",
    sourceEventId: "DET-0912",
    workerId: "W-0012",
    workerName: "Hassan Ali",
    contractorId: "SC-02",
    contractorName: "Qatar Structural Steel",
    zoneId: "IPT-L3-Core",
    zoneName: "Central Elevator & Riser Stair Core",
    type: "Missing Safety Helmet (PPE Violation)",
    severity: "High",
    description: "AI Camera CAM-03 detected worker operating in IPT Level 3 Core without hard hat.",
    evidenceUrl: "https://mediinfra.internal/evidence/inc-0881.jpg",
    assignedTo: "Eng. Tariq Mansoor (HSE Officer)",
    status: "CORRECTIVE_ACTION",
    correctiveAction: "HSE marshal dispatched, helmet refitted on site, safety toolbox briefing re-signed.",
    createdAt: "2026-09-10 08:14:20",
    acknowledgedAt: "2026-09-10 08:15:02",
    actionTakenAt: "2026-09-10 08:22:15",
  },
  {
    id: "INC-2026-0879",
    source: "GEOFENCE_BREACH",
    sourceEventId: "GEO-0441",
    workerId: "W-0025",
    workerName: "Mustafa Sheikh",
    contractorId: "SC-01",
    contractorName: "Al Sraiya MEP Engineering",
    zoneId: "IPT-L4-AHU",
    zoneName: "Air Handling Unit Room (NON-PERMIT RESTRICTED)",
    type: "Unauthorized Non-Permit Zone Entry",
    severity: "Critical",
    description: "Worker entered restricted hospital air filtration chamber without active permit.",
    evidenceUrl: "https://mediinfra.internal/evidence/inc-0879.jpg",
    assignedTo: "Capt. Fahad Al-Naimi (Senior HSE Field Marshal)",
    status: "CLOSED",
    correctiveAction: "Worker immediately escorted back to authorized IPT L3 corridor. Gate privileges reviewed.",
    createdAt: "2026-09-09 14:10:00",
    acknowledgedAt: "2026-09-09 14:10:45",
    actionTakenAt: "2026-09-09 14:15:00",
    verifiedAt: "2026-09-09 15:30:00",
    closedAt: "2026-09-09 15:45:00",
  },
];

// ==========================================
// 12. QUALITY INSPECTIONS
// ==========================================

export const INITIAL_INSPECTIONS: QualityInspection[] = [
  {
    id: "QI-2026-0199",
    workOrderId: "WO-2026-P875-0158",
    workOrderTitle: "IPT Level 3 West Ward Ceiling & Joinery",
    contractorName: "Doha Interior Solutions",
    zoneName: "IPT-L3-West",
    inspectorName: "Eng. Ahmed Al-Bishri",
    inspectorRole: "KEO Senior Quality Assurance Engineer",
    inspectionDate: "2026-09-08 14:00",
    checklist: [
      { id: "ck-1", description: "Ceiling grid alignment and seismic wire bracing", passed: true },
      { id: "ck-2", description: "Antimicrobial surface coating compliance test", passed: true },
      { id: "ck-3", description: "Negative pressure boundary airtight seals", passed: true },
    ],
    result: "PASS",
    defectsCount: 0,
    defectNotes: "All ceiling tiles level and securely clipped.",
    status: "VERIFIED_AND_CLOSED",
    signedAt: "2026-09-08 15:30",
  },
];

// ==========================================
// 13. CHANGE MANAGEMENT
// ==========================================

export const INITIAL_CHANGE_REQUESTS: ChangeRequest[] = [
  {
    id: "CHANGE-004",
    code: "CR-P875-004",
    projectId: "P875",
    workPackageId: "WP-01",
    workOrderId: "WO-1027",
    title: "Additional Dedicated Medical Exhaust Ducting (IPT L3 East)",
    description: "Ashghal & HMC Infection Control request 60m of additional stainless-steel exhaust ducting with HEPA filter box to isolate new immunocompromised patient suites.",
    reason: "MoPH Revised Healthcare Code 2026 compliance requirement.",
    requestedBy: "Eng. Mounir Hadad",
    requesterRole: "Al Sraiya MEP Project Director",
    contractorName: "Al Sraiya MEP Engineering",
    costImpact: 120000, // +120,000 QAR
    scheduleImpactDays: 4,
    riskImpact: "Low",
    affectedZones: ["IPT-L3-East", "IPT-L4-AHU"],
    affectedWorkersCount: 8,
    approvalChain: [
      { role: "Subcontractor PM", approver: "Eng. Mounir Hadad", status: "APPROVED", timestamp: "2026-09-08 09:00" },
      { role: "Main Contractor Lead", approver: "IMAR-Al Sraiya JV Lead", status: "APPROVED", timestamp: "2026-09-08 14:00" },
      { role: "Consultant Resident Eng", approver: "KEO Senior Resident Engineer", status: "APPROVED", timestamp: "2026-09-09 11:30" },
      { role: "Client Director (Ashghal)", approver: "Ashghal Healthcare Project Director", status: "PENDING" },
    ],
    status: "Consultant Review",
    submittedAt: "2026-09-08 09:00",
  },
];

// ==========================================
// 14. TIMESHEETS
// ==========================================

export const INITIAL_TIMESHEETS: Timesheet[] = [
  {
    id: "TS-2026-0910-0245",
    workerId: "W-0245",
    workerName: "Mohammad Rizwan",
    contractorId: "SC-01",
    contractorName: "Al Sraiya MEP Engineering",
    workOrderId: "WO-1027",
    date: "2026-09-10",
    entryTime: "07:20:08",
    exitTime: "17:00:12",
    regularHours: 8.0,
    overtimeHours: 0.78,
    breakHours: 0.88,
    totalBillableHours: 8.78,
    hourlyRate: 65, // QAR / hr
    totalCost: 570.7,
    approvalStatus: "SUPERVISOR_APPROVED",
    supervisorSignature: "Tariq Al-Masri (Signed 17:10 AST)",
  },
];

// ==========================================
// 15. CONTRACTOR CLAIMS & PAYMENTS
// ==========================================

export const INITIAL_CLAIMS: ContractorClaim[] = [
  {
    id: "CLAIM-2026-09-01",
    code: "IPC-AS-MEP-011",
    contractorId: "SC-01",
    contractorName: "Al Sraiya MEP Engineering",
    workPackageId: "WP-01",
    workPackageName: "IPT Level 3 Clinical Area MEP Revamp",
    billingPeriod: "2026-08-01 to 2026-08-31",
    totalManpowerCount: 228,
    totalManHours: 41320,
    calculatedAmount: 2685800,
    approvedAmount: 2685800,
    verifiedProgressPercentage: 78.5,
    supportingDocumentCount: 24,
    status: "Approved",
    submittedAt: "2026-09-02 11:00",
    approvals: [
      { role: "Commercial QS", approver: "KEO Senior Quantity Surveyor", status: "APPROVED", timestamp: "2026-09-04 14:00", comment: "Verified against biometric turnstile man-hours." },
      { role: "Resident Engineer", approver: "Ashghal Senior Resident Engineer", status: "APPROVED", timestamp: "2026-09-05 10:00", comment: "Milestone completion verified on site." }
    ],
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "PAY-2026-09-001",
    invoiceNumber: "INV-ASMEP-2026-088",
    contractorId: "SC-01",
    contractorName: "Al Sraiya MEP Engineering",
    claimId: "CLAIM-2026-09-01",
    claimCode: "IPC-AS-MEP-011",
    amount: 2685800,
    currency: "QAR",
    paymentStatus: "PROCESSED",
    paymentMethod: "Direct Bank Transfer (QNB Corporate)",
    disbursedDate: "2026-09-08",
    authorizedBy: "Hamad Medical Corporation Treasury Lead",
    treasuryBatchRef: "QNB-EFT-P875-99210",
  },
];

// ==========================================
// 16. AUDIT TRAIL
// ==========================================

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-001",
    timestamp: "2026-09-10 07:05:00",
    actor: "Eng. Tariq Al-Masri",
    role: "Contractor Supervisor",
    action: "WORK_ORDER_DISPATCH",
    entity: "WorkOrder",
    entityId: "WO-1027",
    description: "Approved Work Order WO-1027 issued to mobile workforce terminal.",
  },
  {
    id: "AUD-002",
    timestamp: "2026-09-10 07:13:42",
    actor: "Mohammad Rizwan (W-0245)",
    role: "Worker",
    action: "WORKER_SIGNED",
    entity: "WorkerAcknowledgement",
    entityId: "W-0245",
    description: "Toolbox briefing electronically signed and acknowledged on mobile terminal.",
  },
  {
    id: "AUD-003",
    timestamp: "2026-09-10 07:14:00",
    actor: "System Engine",
    role: "Automated Operations",
    action: "ACCESS_AUTHORIZED",
    entity: "AccessAuthorization",
    entityId: "AUTH-W0245-WO1027",
    description: "Access authorization granted for IPT Level 3 East. RFID EPC-00245 whitelisted.",
  },
  {
    id: "AUD-004",
    timestamp: "2026-09-10 07:20:08",
    actor: "Zebra RFID Reader (Gate 02)",
    role: "ELV Gate Controller",
    action: "GATE_ENTRY",
    entity: "GateEvent",
    entityId: "EVT-GATE02-00245",
    description: "Worker W-0245 authenticated at Gate 02 Lane 1. Optical turnstile opened.",
  },
  {
    id: "AUD-005",
    timestamp: "2026-09-10 07:20:09",
    actor: "Attendance Service",
    role: "Automated Operations",
    action: "ATTENDANCE_IN",
    entity: "AttendanceRecord",
    entityId: "ATT-W0245-IN",
    description: "Worker status updated to ON SITE. Headcount incremented.",
  },
];

// ==========================================
// 17. NOTIFICATIONS
// ==========================================

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "NOTIF-01",
    timestamp: "07:14",
    title: "Access Authorization Whitelist Synced",
    message: "Worker W-0245 signed briefing. RFID whitelist pushed to Gates 01–04.",
    severity: "success",
    targetRoute: "/gates",
    targetEntityId: "W-0245",
    read: false,
  },
  {
    id: "NOTIF-02",
    timestamp: "06:45",
    title: "Consultant Signature Needed",
    message: "Work Order WO-2026-P875-0148 awaiting KEO consultant sign-off.",
    severity: "info",
    targetRoute: "/work-orders",
    targetEntityId: "WO-2026-P875-0148",
    read: false,
  },
  {
    id: "NOTIF-03",
    timestamp: "06:12",
    title: "Safety Induction Expired Warning",
    message: "Worker W-0317 (Faisal Iqbal) induction expired. Entry access blocked.",
    severity: "warn",
    targetRoute: "/workforce",
    targetEntityId: "W-0317",
    read: false,
  },
];

// ==========================================
// 18. MUSTER POINTS
// ==========================================

export const INITIAL_MUSTER_POINTS: MusterPoint[] = [
  { id: "MUSTER-A", name: "Muster Point A — North Logistics Car Park", location: "Outside Gate 01", capacity: 500, accountedCount: 341 },
  { id: "MUSTER-B", name: "Muster Point B — South Engineering Perimeter", location: "Outside Gate 04", capacity: 400, accountedCount: 288 },
  { id: "MUSTER-C", name: "Muster Point C — Clinical Ring Buffer Area", location: "East Perimeter Yard", capacity: 300, accountedCount: 202 },
];
