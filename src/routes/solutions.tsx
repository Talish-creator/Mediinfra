import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CorporateHeader } from "@/components/corporate/CorporateHeader";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { SolutionsGrid } from "@/components/corporate/SolutionsGrid";
import { PlatformShowcase } from "@/components/corporate/PlatformShowcase";
import { DemoBookingModal } from "@/components/corporate/DemoBookingModal";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Enterprise Solutions Suite — MediInfra" },
      {
        name: "description",
        content:
          "Explore MediInfra's 6 core healthcare infrastructure modules: Command Center, 3D Digital Twin, Gate Telemetry, Emergency Muster, Edge AI, and Reports.",
      },
    ],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pt-16">
      <CorporateHeader onOpenDemo={() => setDemoOpen(true)} />
      <main className="flex-1">
        <SolutionsGrid />
        <PlatformShowcase />
      </main>
      <CorporateFooter />
      <DemoBookingModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
