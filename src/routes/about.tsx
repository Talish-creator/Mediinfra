import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CorporateHeader } from "@/components/corporate/CorporateHeader";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { InteractiveTimeline } from "@/components/corporate/InteractiveTimeline";
import { TestimonialsSection } from "@/components/corporate/TestimonialsSection";
import { StatsCounters } from "@/components/corporate/StatsCounters";
import { DemoBookingModal } from "@/components/corporate/DemoBookingModal";
import { Building, ShieldCheck, Award, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MediInfra Technologies — Doha Headquarters" },
      {
        name: "description",
        content:
          "The world standard for mission-critical healthcare infrastructure intelligence and workforce life safety, headquartered in West Bay, Doha, State of Qatar.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pt-16">
      <CorporateHeader onOpenDemo={() => setDemoOpen(true)} />
      <main className="flex-1 space-y-12">
        {/* About Hero */}
        <section className="py-20 sm:py-28 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800">
              MISSION & INSTITUTIONAL LEADERSHIP
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Zero-Tolerance Safety for Healthcare Developments
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Headquartered in the West Bay Financial District in Doha, MediInfra Technologies partners with state authorities, major hospitals, and Tier-1 EPC consortiums to safeguard lives, eliminate phantom labor, and ensure flawless regulatory compliance.
            </p>
          </div>
        </section>

        <StatsCounters />
        <InteractiveTimeline />
        <TestimonialsSection />
      </main>
      <CorporateFooter />
      <DemoBookingModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
