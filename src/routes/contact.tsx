import { createFileRoute } from "@tanstack/react-router";
import { CorporateHeader } from "@/components/corporate/CorporateHeader";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { ContactSection } from "@/components/corporate/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Operational Leadership — MediInfra Doha HQ" },
      {
        name: "description",
        content:
          "Schedule an executive architectural briefing or visit our operational headquarters in Tower 3, West Bay Financial District, Doha, State of Qatar.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pt-16">
      <CorporateHeader />
      <main className="flex-1">
        <ContactSection />
      </main>
      <CorporateFooter />
    </div>
  );
}
