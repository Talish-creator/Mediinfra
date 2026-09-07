# MediInfra — Hospital Infrastructure IoT & Safety Command Center

MediInfra is a mission-critical Extra Low Voltage (ELV) digital twin and workforce intelligence platform engineered for healthcare campus construction, life-safety compliance, and operational facility monitoring.

---

## Key Capabilities

- **Digital Twin Command Map**: Real-time multi-zone telemetry (ICU, Oncology, Trauma, SurgiCenter, HVAC Penthouse) with interactive sensor nodes and heatmaps.
- **Biometric & RFID Gate Telemetry**: Access control logs, turnstile throughput analytics, credential verification, and automated lockout triggers.
- **AI Safety & PPE Computer Vision**: Automated real-time PPE detection (Hard hats, Hi-Vis, Safety boots, Eye protection) with infraction scoring and anomaly alerts.
- **Enterprise Work Orders & Dispatch**: SLA-driven preventative maintenance workflows, asset tracking, priority dispatch, and technician task status.
- **Emergency Evacuation & Muster Accounting**: Instant roll-call tallying, panic alarms, critical muster point tracking, and missing personnel geofencing.
- **Comprehensive Analytics & Compliance**: Safety index trending, sensor threshold analysis, acoustic monitoring, air quality metrics, and OSHA/Joint Commission export reporting.

---

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack React with SSR & Nitro)
- **Frontend**: React 19, TypeScript 5.8
- **Styling**: Tailwind CSS v4, Framer Motion, Radix UI Primitives, Lucide Icons
- **Data Visualization**: Recharts, TanStack Virtual
- **State Management**: TanStack Query v5, Context API with Persistent Local Storage
- **Build Engine**: Vite 8 & Nitro Engine

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Talish-creator/Mediinfra.git
cd Mediinfra

# Install dependencies
npm install

# Launch local development server
npm run dev
```

The application will be available at `http://localhost:8080/`.

---

## Production Build

```bash
# Compile and build production bundle
npm run build

# Preview production build
npm run preview
```

---

## License

Proprietary — All Rights Reserved.
