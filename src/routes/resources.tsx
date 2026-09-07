import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CorporateHeader } from "@/components/corporate/CorporateHeader";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { CaseStudiesSection } from "@/components/corporate/CaseStudiesSection";
import { CorporateFaq } from "@/components/corporate/CorporateFaq";
import { DemoBookingModal } from "@/components/corporate/DemoBookingModal";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, ArrowRight, ShieldCheck, Download } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources, Whitepapers & Case Studies — MediInfra" },
      {
        name: "description",
        content:
          "Access executive whitepapers, regulatory compliance manuals, Ashghal Form LR-01 guides, and real-world case studies.",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pt-16">
      <CorporateHeader onOpenDemo={() => setDemoOpen(true)} />
      <main className="flex-1 space-y-12">
        {/* Resource Banner */}
        <section className="py-16 sm:py-24 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800">
              KNOWLEDGE & REGULATORY ASSETS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Executive Healthcare Infrastructure Resources
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Download technical blueprints, ICRA containment guidelines, and regulatory audit dossiers.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Button asChild className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-2">
                <Link to="/knowledge">
                  <BookOpen className="size-4" />
                  <span>Open Knowledge Center</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <CaseStudiesSection />
        <CorporateFaq />
      </main>
      <CorporateFooter />
      <DemoBookingModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
