import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CorporateHeader } from "@/components/corporate/CorporateHeader";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { PlatformShowcase } from "@/components/corporate/PlatformShowcase";
import { MasonryGallery } from "@/components/corporate/MasonryGallery";
import { DemoBookingModal } from "@/components/corporate/DemoBookingModal";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform Architecture & Specifications — MediInfra" },
      {
        name: "description",
        content:
          "Enterprise hardware specifications, Zebra FXR90 RFID portals, NVIDIA Jetson edge inference, WebGL 3D BIM, and SHA-256 custody ledger.",
      },
    ],
  }),
  component: PlatformPage,
});

function PlatformPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pt-16">
      <CorporateHeader onOpenDemo={() => setDemoOpen(true)} />
      <main className="flex-1">
        <PlatformShowcase />
        <MasonryGallery />
      </main>
      <CorporateFooter />
      <DemoBookingModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
