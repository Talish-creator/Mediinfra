/** Static, realistic mock data for the MediInfra P875 demo platform. */

export const PROJECT = {
  code: "P875",
  name: "Hamad General Hospital Safety Improvement & Retrofit",
  phase: "Phase 1A / 1B",
  client: "Ashghal (Public Works Authority) / Hamad Medical Corporation",
  consultant: "KEO International Consultants / Khatib & Alami",
  contractor: "IMAR Trading & Contracting — Al Sraiya JV",
  location: "Doha, Qatar",
} as const;

export type Trade =
  | "Electrician"
  | "Steel Fixer"
  | "Pipe Fitter"
  | "HSE Officer"
  | "HVAC Technician"
  | "Mason"
  | "Carpenter"
  | "Fire Alarm Technician"
  | "Painter"
  | "Rigger";

export type Subcontractor = {
  id: string;
  name: string;
  short: string;
  trade: string;
  planned: number;
  present: number;
  permits: number;
  manHours: number;
  inductionValidity: number;
  ghostFlags: number;
};

export const SUBCONTRACTORS: Subcontractor[] = [
  {
    id: "SC-01",
    name: "Al Sraiya MEP Engineering",
    short: "AS-MEP",
    trade: "MEP / Electrical",
    planned: 240,
    present: 228,
    permits: 6,
    manHours: 41320,
    inductionValidity: 99.1,
    ghostFlags: 0,
  },
  {
    id: "SC-02",
    name: "Qatar Structural Steel",
    short: "QSS",
    trade: "Structural Steel",
    planned: 180,
    present: 162,
    permits: 4,
    manHours: 29880,
    inductionValidity: 97.4,
    ghostFlags: 0,
  },
  {
    id: "SC-03",
    name: "Electro-Mechanical Enterprise",
    short: "EME",
    trade: "Medical Gas / Plumbing",
    planned: 150,
    present: 141,
    permits: 3,
    manHours: 24110,
    inductionValidity: 98.8,
    ghostFlags: 0,
  },
  {
    id: "SC-04",
    name: "Al Rayyan HVAC",
    short: "ARH",
    trade: "HVAC & Ductwork",
    planned: 130,
    present: 118,
    permits: 3,
    manHours: 19640,
    inductionValidity: 96.2,
    ghostFlags: 0,
  },
  {
    id: "SC-05",
    name: "Falcon Fire Protection",
    short: "FFP",
    trade: "Fire & Life Safety",
    planned: 95,
    present: 92,
    permits: 2,
    manHours: 15230,
    inductionValidity: 100,
    ghostFlags: 0,
  },
  {
    id: "SC-06",
    name: "Doha Interior Solutions",
    short: "DIS",
    trade: "Finishings & Joinery",
    planned: 130,
    present: 123,
    permits: 2,
    manHours: 17480,
    inductionValidity: 95.6,
    ghostFlags: 0,
  },
];

export type Worker = {
  id: string;
  name: string;
  qid: string;
  epc: string;
  trade: Trade;
  employerId: string;
  employer: string;
  phone: string;
  zone: string;
  inductionValid: boolean;
};

const FIRST = [
  "Mohammad",
  "Rizwan",
  "Abdul",
  "Sunil",
  "Ramesh",
  "Ahmed",
  "Bilal",
  "Prakash",
  "Yusuf",
  "Imran",
  "Santosh",
  "Kamal",
  "Vijay",
  "Hassan",
  "Naveed",
  "Rajesh",
  "Faisal",
  "Deepak",
  "Sajid",
  "Anwar",
];
const LAST = [
  "Rizwan",
  "Karim",
  "Hussain",
  "Kumar",
  "Thapa",
  "Rahman",
  "Sheikh",
  "Gurung",
  "Ali",
  "Chowdhury",
  "Perera",
  "Nair",
  "Iqbal",
  "Baig",
  "Das",
  "Shrestha",
  "Farooq",
  "Menon",
  "Malik",
  "Reddy",
];
const TRADES: Trade[] = [
  "Electrician",
  "Steel Fixer",
  "Pipe Fitter",
  "HSE Officer",
  "HVAC Technician",
  "Mason",
  "Carpenter",
  "Fire Alarm Technician",
  "Painter",
  "Rigger",
];

export const ZONE_IDS = [
  "IPT-L2-East",
  "IPT-L3-East",
  "IPT-L3-West",
  "IPT-L4-AHU",
  "IPT-L5-West",
  "IPT-L6-Core",
  "OPT-L1-Lobby",
  "OPT-L2-Clinics",
  "OPT-L3-Imaging",
  "ENG-Plant-01",
  "SV-Laundry",
  "SV-Yard",
];

/** Deterministic pseudo-random so SSR and client agree. */
function seeded(i: number, mod: number) {
  return (i * 2654435761) % mod;
}

export const WORKERS: Worker[] = Array.from({ length: 48 }, (_, i) => {
  const first = FIRST[seeded(i + 3, FIRST.length)]!;
  const last = LAST[seeded(i + 11, LAST.length)]!;
  const sub = SUBCONTRACTORS[seeded(i + 5, SUBCONTRACTORS.length)]!;
  const trade = TRADES[seeded(i + 7, TRADES.length)]!;
  const n = 100000 + seeded(i + 13, 899999);
  return {
    id: `W-${String(i + 1).padStart(4, "0")}`,
    name: `${first} ${last}`,
    qid: `2${String(8 + (i % 2))}${String(n).padStart(6, "0")}${String(10 + (i % 89))}`,
    epc: `E280-1160-${String(2000 + i * 7).slice(0, 4)}-${String(4096 + seeded(i + 17, 40000)).slice(0, 4)}`,
    trade,
    employerId: sub.id,
    employer: sub.name,
    phone: `+974 ${3 + (i % 4)}${String(1000000 + seeded(i + 19, 8999999)).slice(0, 3)} ${String(1000 + seeded(i + 23, 8999)).slice(0, 4)}`,
    zone: ZONE_IDS[seeded(i + 29, ZONE_IDS.length)]!,
    inductionValid: i % 17 !== 0,
  };
});

export type Gate = {
  id: string;
  name: string;
  reader: string;
  ip: string;
  lanes: { id: string; dir: "IN" | "OUT"; status: "Online" | "Degraded"; throughput: number }[];
  uptime: number;
  todayIn: number;
  todayOut: number;
};

export const GATES: Gate[] = [
  {
    id: "GATE-01",
    name: "North Main Ingress",
    reader: "Zebra FXR90 #1",
    ip: "10.87.5.11",
    lanes: [
      { id: "L1", dir: "IN", status: "Online", throughput: 18 },
      { id: "L2", dir: "OUT", status: "Online", throughput: 9 },
    ],
    uptime: 99.98,
    todayIn: 412,
    todayOut: 74,
  },
  {
    id: "GATE-02",
    name: "Service Yard",
    reader: "Zebra FXR90 #2",
    ip: "10.87.5.12",
    lanes: [
      { id: "L1", dir: "IN", status: "Online", throughput: 7 },
      { id: "L2", dir: "OUT", status: "Online", throughput: 6 },
    ],
    uptime: 99.91,
    todayIn: 168,
    todayOut: 51,
  },
  {
    id: "GATE-03",
    name: "IPT Hoarding Access",
    reader: "Zebra FXR90 #3",
    ip: "10.87.5.13",
    lanes: [
      { id: "L1", dir: "IN", status: "Online", throughput: 6 },
      { id: "L2", dir: "OUT", status: "Degraded", throughput: 3 },
    ],
    uptime: 99.42,
    todayIn: 221,
    todayOut: 88,
  },
  {
    id: "GATE-04",
    name: "South Logistics",
    reader: "Zebra FXR90 #4",
    ip: "10.87.5.14",
    lanes: [
      { id: "L1", dir: "IN", status: "Online", throughput: 4 },
      { id: "L2", dir: "OUT", status: "Online", throughput: 4 },
    ],
    uptime: 99.87,
    todayIn: 121,
    todayOut: 46,
  },
];

export type Zone = {
  id: string;
  building: "IPT" | "OPT" | "ENG" | "SV";
  level: string;
  label: string;
  wing: string;
  count: number;
  capacity: number;
  permit: string;
  foreman: string;
  foremanPhone: string;
  subs: string[];
  dust: string;
  restricted?: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const ZONES: Zone[] = [
  {
    id: "IPT-L3-East",
    building: "IPT",
    level: "L3",
    label: "East Ward Wing",
    wing: "East",
    count: 38,
    capacity: 50,
    permit: "PTW-P875-3391",
    foreman: "Anwar Baig",
    foremanPhone: "+974 5512 8890",
    subs: ["Al Sraiya MEP Engineering", "Electro-Mechanical Enterprise"],
    dust: "PM10 42 µg/m³ — Acceptable",
    x: 6,
    y: 8,
    w: 38,
    h: 34,
  },
  {
    id: "IPT-L3-West",
    building: "IPT",
    level: "L3",
    label: "West Ward Wing",
    wing: "West",
    count: 24,
    capacity: 45,
    permit: "PTW-P875-3402",
    foreman: "Rajesh Nair",
    foremanPhone: "+974 3390 4471",
    subs: ["Doha Interior Solutions"],
    dust: "PM10 31 µg/m³ — Good",
    x: 56,
    y: 8,
    w: 38,
    h: 34,
  },
  {
    id: "IPT-L3-Core",
    building: "IPT",
    level: "L3",
    label: "Central Elevator / Stair Core",
    wing: "Core",
    count: 9,
    capacity: 20,
    permit: "PTW-P875-3377",
    foreman: "Hassan Ali",
    foremanPhone: "+974 6620 1123",
    subs: ["Qatar Structural Steel"],
    dust: "PM10 55 µg/m³ — Monitor",
    x: 44,
    y: 8,
    w: 12,
    h: 34,
  },
  {
    id: "IPT-L3-Hoarding",
    building: "IPT",
    level: "L3",
    label: "Hoarding Chokepoint (Clinical Interface)",
    wing: "South",
    count: 5,
    capacity: 10,
    permit: "PTW-P875-3410",
    foreman: "Bilal Sheikh",
    foremanPhone: "+974 7781 3320",
    subs: ["Falcon Fire Protection"],
    dust: "Negative pressure verified",
    x: 6,
    y: 48,
    w: 88,
    h: 14,
  },
  {
    id: "IPT-L4-AHU",
    building: "IPT",
    level: "L4",
    label: "Air Handling Unit Room (NON-PERMIT)",
    wing: "Plant",
    count: 1,
    capacity: 6,
    permit: "— none active —",
    foreman: "Restricted",
    foremanPhone: "HSE Command",
    subs: [],
    dust: "Restricted access",
    restricted: true,
    x: 6,
    y: 68,
    w: 30,
    h: 24,
  },
  {
    id: "IPT-L5-West",
    building: "IPT",
    level: "L5",
    label: "West Wing Riser Works",
    wing: "West",
    count: 17,
    capacity: 30,
    permit: "PTW-P875-3455",
    foreman: "Imran Malik",
    foremanPhone: "+974 5540 9982",
    subs: ["Electro-Mechanical Enterprise"],
    dust: "PM10 38 µg/m³ — Acceptable",
    x: 46,
    y: 68,
    w: 48,
    h: 24,
  },
  {
    id: "OPT-L1-Lobby",
    building: "OPT",
    level: "L1",
    label: "Outpatient Lobby Retrofit",
    wing: "North",
    count: 31,
    capacity: 40,
    permit: "PTW-P875-2201",
    foreman: "Sunil Kumar",
    foremanPhone: "+974 3312 5540",
    subs: ["Doha Interior Solutions", "Al Sraiya MEP Engineering"],
    dust: "PM10 47 µg/m³ — Acceptable",
    x: 6,
    y: 8,
    w: 44,
    h: 40,
  },
  {
    id: "OPT-L2-Clinics",
    building: "OPT",
    level: "L2",
    label: "Clinic Block B Fit-Out",
    wing: "East",
    count: 26,
    capacity: 35,
    permit: "PTW-P875-2244",
    foreman: "Faisal Iqbal",
    foremanPhone: "+974 6690 7712",
    subs: ["Al Rayyan HVAC"],
    dust: "PM10 29 µg/m³ — Good",
    x: 54,
    y: 8,
    w: 40,
    h: 40,
  },
  {
    id: "OPT-L3-Imaging",
    building: "OPT",
    level: "L3",
    label: "Imaging Suite Shielding",
    wing: "West",
    count: 12,
    capacity: 18,
    permit: "PTW-P875-2290",
    foreman: "Kamal Rahman",
    foremanPhone: "+974 5578 3341",
    subs: ["Qatar Structural Steel"],
    dust: "Lead-lining works — PPE Level 2",
    x: 6,
    y: 54,
    w: 88,
    h: 38,
  },
  {
    id: "ENG-Plant-01",
    building: "ENG",
    level: "GF",
    label: "Central Engineering Plant",
    wing: "Plant",
    count: 22,
    capacity: 30,
    permit: "PTW-P875-9010",
    foreman: "Yusuf Farooq",
    foremanPhone: "+974 3345 8890",
    subs: ["Al Rayyan HVAC", "Falcon Fire Protection"],
    dust: "PM10 61 µg/m³ — Monitor",
    x: 6,
    y: 8,
    w: 44,
    h: 84,
  },
  {
    id: "SV-Yard",
    building: "SV",
    level: "GF",
    label: "Services Laydown Yard",
    wing: "South",
    count: 34,
    capacity: 60,
    permit: "PTW-P875-9044",
    foreman: "Naveed Baig",
    foremanPhone: "+974 7712 4408",
    subs: ["Qatar Structural Steel"],
    dust: "Open air",
    x: 54,
    y: 8,
    w: 40,
    h: 84,
  },
];

export type WorkOrder = {
  id: string;
  description: string;
  zone: string;
  contractor: string;
  scheduled: string;
  quota: number;
  signedOff: number;
  status: "Fully Approved" | "Pending Consultant" | "Main Contractor Review" | "Draft";
  stage: 1 | 2 | 3 | 4 | 5;
  hazards: string[];
};

export const WORK_ORDERS: WorkOrder[] = [
  {
    id: "WO-2026-P875-0142",
    description: "IPT Level 3 Medical Gas Piping Installation",
    zone: "IPT-L3-East",
    contractor: "Electro-Mechanical Enterprise",
    scheduled: "2026-09-07 06:00 → 17:00",
    quota: 25,
    signedOff: 25,
    status: "Fully Approved",
    stage: 5,
    hazards: ["Hot works", "Pressurised gas", "Working at height"],
  },
  {
    id: "WO-2026-P875-0143",
    description: "IPT Level 5 West Riser Cable Pulling",
    zone: "IPT-L5-West",
    contractor: "Al Sraiya MEP Engineering",
    scheduled: "2026-09-07 06:00 → 15:00",
    quota: 18,
    signedOff: 16,
    status: "Fully Approved",
    stage: 5,
    hazards: ["Live electrical adjacency", "Confined riser"],
  },
  {
    id: "WO-2026-P875-0148",
    description: "OPT Level 2 Clinic Block B Ductwork",
    zone: "OPT-L2-Clinics",
    contractor: "Al Rayyan HVAC",
    scheduled: "2026-09-07 07:00 → 18:00",
    quota: 22,
    signedOff: 12,
    status: "Pending Consultant",
    stage: 3,
    hazards: ["Overhead lifting", "Dust control adjacent to clinics"],
  },
  {
    id: "WO-2026-P875-0151",
    description: "OPT Level 3 Imaging Suite Lead Shielding",
    zone: "OPT-L3-Imaging",
    contractor: "Qatar Structural Steel",
    scheduled: "2026-09-08 06:30 → 16:30",
    quota: 14,
    signedOff: 0,
    status: "Main Contractor Review",
    stage: 2,
    hazards: ["Manual handling", "Lead exposure"],
  },
  {
    id: "WO-2026-P875-0155",
    description: "ENG Plant Fire Pump Room Sprinkler Tie-In",
    zone: "ENG-Plant-01",
    contractor: "Falcon Fire Protection",
    scheduled: "2026-09-08 22:00 → 04:00",
    quota: 9,
    signedOff: 0,
    status: "Pending Consultant",
    stage: 3,
    hazards: ["Night works", "System isolation", "Hot works"],
  },
  {
    id: "WO-2026-P875-0158",
    description: "IPT Level 3 West Ward Ceiling & Joinery",
    zone: "IPT-L3-West",
    contractor: "Doha Interior Solutions",
    scheduled: "2026-09-07 06:00 → 17:00",
    quota: 20,
    signedOff: 20,
    status: "Fully Approved",
    stage: 5,
    hazards: ["Working at height", "Noise adjacent to wards"],
  },
  {
    id: "WO-2026-P875-0161",
    description: "SV Yard Structural Steel Offloading & Staging",
    zone: "SV-Yard",
    contractor: "Qatar Structural Steel",
    scheduled: "2026-09-07 05:30 → 12:00",
    quota: 12,
    signedOff: 12,
    status: "Fully Approved",
    stage: 5,
    hazards: ["Crane lifts", "Vehicle-pedestrian interface"],
  },
  {
    id: "WO-2026-P875-0164",
    description: "IPT Hoarding Chokepoint Negative Pressure Survey",
    zone: "IPT-L3-Hoarding",
    contractor: "Al Sraiya MEP Engineering",
    scheduled: "2026-09-09 08:00 → 12:00",
    quota: 6,
    signedOff: 0,
    status: "Draft",
    stage: 1,
    hazards: ["Infection control (ICRA Class IV)"],
  },
];

export const MANPOWER_CURVE = [
  { hour: "00:00", scheduled: 40, actual: 36 },
  { hour: "01:00", scheduled: 40, actual: 38 },
  { hour: "02:00", scheduled: 40, actual: 37 },
  { hour: "03:00", scheduled: 45, actual: 41 },
  { hour: "04:00", scheduled: 90, actual: 72 },
  { hour: "05:00", scheduled: 320, actual: 288 },
  { hour: "06:00", scheduled: 780, actual: 742 },
  { hour: "07:00", scheduled: 940, actual: 861 },
  { hour: "08:00", scheduled: 980, actual: 902 },
  { hour: "09:00", scheduled: 980, actual: 914 },
  { hour: "10:00", scheduled: 975, actual: 908 },
  { hour: "11:00", scheduled: 960, actual: 889 },
  { hour: "12:00", scheduled: 620, actual: 574 },
  { hour: "13:00", scheduled: 610, actual: 561 },
  { hour: "14:00", scheduled: 940, actual: 866 },
  { hour: "15:00", scheduled: 930, actual: 864 },
  { hour: "16:00", scheduled: 880, actual: 812 },
  { hour: "17:00", scheduled: 520, actual: 486 },
  { hour: "18:00", scheduled: 280, actual: 254 },
  { hour: "19:00", scheduled: 180, actual: 166 },
  { hour: "20:00", scheduled: 120, actual: 112 },
  { hour: "21:00", scheduled: 90, actual: 84 },
  { hour: "22:00", scheduled: 70, actual: 61 },
  { hour: "23:00", scheduled: 50, actual: 44 },
];

export const DWELL_DISTRIBUTION = [
  { band: "Assigned zone", hours: 6.4 },
  { band: "Adjacent zone", hours: 0.9 },
  { band: "Transit / circulation", hours: 1.1 },
  { band: "Welfare & breaks", hours: 1.0 },
  { band: "Unclassified", hours: 0.3 },
];

export const HARDWARE = {
  readers: GATES.map((g, i) => ({
    id: g.reader,
    gate: g.name,
    ip: g.ip,
    rf: 30,
    temp: 41 + i,
    status: i === 2 ? ("Degraded" as const) : ("Online" as const),
    vswr: 1.12 + i * 0.04,
  })),
  antennas: { model: "Zebra AN440 Circular-Polarized", total: 32, online: 32, vswrMax: 1.28 },
  portals: { model: "Portable Macro-Zone Portal Kit", total: 12, online: 12 },
  tags: { model: "Passive EPC Gen2 ISO 18000-63 Hard-Hat Tag", total: 1100, issued: 964 },
  gateways: GATES.map((g, i) => ({
    id: `EDGE-GW-0${i + 1}`,
    gate: g.name,
    queue: i === 2 ? 14 : 0,
    disk: 12 + i * 3,
    uplink: i === 3 ? ("5G Failover" as const) : ("Fibre PoE" as const),
  })),
  ups: GATES.map((g, i) => ({
    id: `APC-IND-0${i + 1}`,
    gate: g.name,
    battery: 100 - i * 4,
    runtime: 180 - i * 12,
    load: 28 + i * 5,
  })),
};

export const AI_CAMERAS = [
  {
    id: "CAM-01",
    name: "Gate 01 Main Ingress",
    detections: [
      { id: "d1", label: "Helmet & Hi-Vis", type: "ok" as const, x: 12, y: 30, w: 22, h: 46 },
      { id: "d2", label: "Helmet & Hi-Vis", type: "ok" as const, x: 44, y: 26, w: 20, h: 50 },
      {
        id: "d3",
        label: "VIOLATION: No Safety Helmet",
        type: "crit" as const,
        x: 70,
        y: 34,
        w: 21,
        h: 44,
      },
    ],
  },
  {
    id: "CAM-02",
    name: "Gate 03 Hoarding Portal",
    detections: [
      { id: "d4", label: "Helmet & Hi-Vis", type: "ok" as const, x: 20, y: 28, w: 24, h: 50 },
      {
        id: "d5",
        label: "VIOLATION: Turnstile Bypassed",
        type: "warn" as const,
        x: 56,
        y: 32,
        w: 26,
        h: 46,
      },
    ],
  },
  {
    id: "CAM-03",
    name: "IPT Level 2 Hoarding Entrance",
    detections: [
      { id: "d6", label: "Helmet & Hi-Vis", type: "ok" as const, x: 14, y: 24, w: 22, h: 52 },
      { id: "d7", label: "Helmet & Hi-Vis", type: "ok" as const, x: 50, y: 30, w: 22, h: 48 },
      {
        id: "d8",
        label: "VIOLATION: No Hi-Vis Vest",
        type: "crit" as const,
        x: 76,
        y: 36,
        w: 18,
        h: 42,
      },
    ],
  },
];

export const BROADCAST_LOG = [
  {
    ts: "07:12:04",
    speaker: "Gate 01 Speaker",
    text: "Pedestrians, please use the turnstile lane. You have entered the construction zone, please wear a safety helmet.",
    lang: "Arabic & English",
    severity: "crit" as const,
  },
  {
    ts: "07:14:22",
    speaker: "IPT Hoarding Speaker",
    text: "Warning: High-visibility reflective vest required in active hospital renovation zone.",
    lang: "Arabic & English",
    severity: "warn" as const,
  },
  {
    ts: "07:31:47",
    speaker: "Gate 03 Speaker",
    text: "Turnstile bypass detected. Please return and present your hard-hat tag at Lane 1.",
    lang: "English & Hindi",
    severity: "warn" as const,
  },
  {
    ts: "08:02:10",
    speaker: "SV Yard Speaker",
    text: "Crane lift in progress. Clear the laydown yard exclusion radius immediately.",
    lang: "Arabic & English",
    severity: "crit" as const,
  },
];

export const MISSING_PERSONNEL = WORKERS.slice(0, 33).map((w, i) => ({
  ...w,
  lastSeen: `${w.zone} (last detected ${2 + (i % 9)} mins ago)`,
}));

export const MUSTER_POINTS = [
  { id: "A", name: "Muster Point A — North Car Park", accounted: 341 },
  { id: "B", name: "Muster Point B — Service Yard Perimeter", accounted: 288 },
  { id: "C", name: "Muster Point C — South Logistics Gate", accounted: 202 },
];

export const HEADCOUNT = { onSite: 864, scheduled: 1000 };

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export function avatarHue(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}
