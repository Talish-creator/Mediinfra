import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CorporateHeader } from "@/components/corporate/CorporateHeader";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { HeroSection } from "@/components/corporate/HeroSection";
import { ImageStorytelling } from "@/components/corporate/ImageStorytelling";
import { SolutionsGrid } from "@/components/corporate/SolutionsGrid";
import { IndustriesSection } from "@/components/corporate/IndustriesSection";
import { PlatformShowcase } from "@/components/corporate/PlatformShowcase";
import { MasonryGallery } from "@/components/corporate/MasonryGallery";
import { StatsCounters } from "@/components/corporate/StatsCounters";
import { ClientLogoWall } from "@/components/corporate/ClientLogoWall";
import { CaseStudiesSection } from "@/components/corporate/CaseStudiesSection";
import { InteractiveTimeline } from "@/components/corporate/InteractiveTimeline";
import { TestimonialsSection } from "@/components/corporate/TestimonialsSection";
import { CorporateFaq } from "@/components/corporate/CorporateFaq";
import { ContactSection } from "@/components/corporate/ContactSection";
import { DemoBookingModal } from "@/components/corporate/DemoBookingModal";
import { VideoModal } from "@/components/corporate/VideoModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "MediInfra — AI-Powered Healthcare Infrastructure Intelligence",
      },
      {
        name: "description",
        content:
          "The unified operational command center, 3D BIM digital twin, and IoT workforce safety platform for hospital construction and mission-critical healthcare facilities.",
      },
      {
        property: "og:title",
        content: "MediInfra — Healthcare Site Safety & Telemetry Command",
      },
      {
        property: "og:description",
        content:
          "Zero-tolerance healthcare infrastructure intelligence: UHF RFID turnstiles, Edge AI safety vision, and spatial digital twins.",
      },
      {
        property: "og:image",
        content: "/corporate/enterprise_command_center.png",
      },
    ],
  }),
  component: CorporateHomePage,
});

function CorporateHomePage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Fortune 500 Sticky Header */}
      <CorporateHeader onOpenDemo={() => setDemoOpen(true)} />

      {/* Main Storytelling Experience */}
      <main className="flex-1">
        {/* Full-Screen Hero */}
        <HeroSection
          onOpenDemo={() => setDemoOpen(true)}
          onOpenVideo={() => setVideoOpen(true)}
        />

        {/* Enterprise Client Logo Wall */}
        <ClientLogoWall />

        {/* High-Impact Numerical Stats Counter */}
        <StatsCounters />

        {/* Alternating Edge-to-Edge Image Storytelling Sections */}
        <ImageStorytelling />

        {/* Integrated Solutions Suite Grid */}
        <SolutionsGrid />

        {/* Industry Focus & Specialized Applications */}
        <IndustriesSection />

        {/* Operating System Platform & Interactive Mockups */}
        <PlatformShowcase />

        {/* High-Resolution Media Masonry Gallery */}
        <MasonryGallery />

        {/* Interactive 6-Step Operational Pipeline Timeline */}
        <InteractiveTimeline />

        {/* Real-World Case Studies & Measurable Outcomes */}
        <CaseStudiesSection />

        {/* Clinical & Infrastructure Leadership Testimonials */}
        <TestimonialsSection />

        {/* Frequently Asked Questions Accordion */}
        <CorporateFaq />

        {/* Interactive Executive Contact & Briefing Booking */}
        <ContactSection />
      </main>

      {/* Global Corporate Mega-Footer */}
      <CorporateFooter />

      {/* Interactive Modals */}
      <DemoBookingModal open={demoOpen} onOpenChange={setDemoOpen} />
      <VideoModal open={videoOpen} onOpenChange={setVideoOpen} />
    </div>
  );
}
