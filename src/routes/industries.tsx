import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CorporateHeader } from "@/components/corporate/CorporateHeader";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { IndustriesSection } from "@/components/corporate/IndustriesSection";
import { CaseStudiesSection } from "@/components/corporate/CaseStudiesSection";
import { DemoBookingModal } from "@/components/corporate/DemoBookingModal";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries & Healthcare Sectors — MediInfra" },
      {
        name: "description",
        content:
          "Specialized infrastructure solutions for tertiary hospitals, state health agencies, international airports, mega EPC projects, and smart medical districts.",
      },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pt-16">
      <CorporateHeader onOpenDemo={() => setDemoOpen(true)} />
      <main className="flex-1">
        <IndustriesSection />
        <CaseStudiesSection />
      </main>
      <CorporateFooter />
      <DemoBookingModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
