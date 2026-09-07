import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Boxes,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  ExternalLink,
  FileBarChart2,
  FileText,
  HelpCircle,
  Languages,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Radio,
  ScanLine,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediInfraLogo } from "@/components/mediinfra/MediInfraLogo";
import { Dot, StreamingDots } from "@/components/mediinfra/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Center & Architecture Manual — MediInfra" },
      {
        name: "description",
        content:
          "Enterprise knowledge hub, operational manuals, video walkthroughs, and technical specifications for MediInfra.",
      },
      { property: "og:title", content: "Knowledge Center — MediInfra" },
      {
        property: "og:description",
        content:
          "Comprehensive documentation, FAQs, and engineering specifications for Qatar healthcare infrastructure.",
      },
    ],
  }),
  component: KnowledgeCenter,
});

export function KnowledgeCenter() {
  const { t } = useTranslation();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Video Modal State
  const [activeVideo, setActiveVideo] = useState<{
    id: string;
    title: string;
    desc: string;
    duration: string;
  } | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Live Dispatch Chat Dialog State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatForm, setChatForm] = useState({
    name: "",
    email: "",
    priority: "P2",
    message: "",
  });

  // Global keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        const searchInput = document.getElementById("knowledge-search-input");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Category items definitions
  const CATEGORIES = useMemo(
    () => [
      {
        id: "dashboard",
        title: t("knowledge.categories.dashboardTitle"),
        desc: t("knowledge.categories.dashboardDesc"),
        icon: LayoutDashboard,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "hover:border-blue-500/40",
        to: "/",
      },
      {
        id: "digitalTwin",
        title: t("knowledge.categories.digitalTwinTitle"),
        desc: t("knowledge.categories.digitalTwinDesc"),
        icon: Boxes,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        border: "hover:border-indigo-500/40",
        to: "/digital-twin",
      },
      {
        id: "gates",
        title: t("knowledge.categories.gatesTitle"),
        desc: t("knowledge.categories.gatesDesc"),
        icon: ScanLine,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "hover:border-emerald-500/40",
        to: "/gates",
      },
      {
        id: "workOrders",
        title: t("knowledge.categories.workOrdersTitle"),
        desc: t("knowledge.categories.workOrdersDesc"),
        icon: BadgeCheck,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "hover:border-amber-500/40",
        to: "/work-orders",
      },
      {
        id: "muster",
        title: t("knowledge.categories.musterTitle"),
        desc: t("knowledge.categories.musterDesc"),
        icon: Siren,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "hover:border-rose-500/40",
        to: "/muster",
      },
      {
        id: "safetyAi",
        title: t("knowledge.categories.safetyAiTitle"),
        desc: t("knowledge.categories.safetyAiDesc"),
        icon: ShieldAlert,
        color: "text-teal-500",
        bg: "bg-teal-500/10",
        border: "hover:border-teal-500/40",
        to: "/safety-ai",
      },
      {
        id: "analytics",
        title: t("knowledge.categories.analyticsTitle"),
        desc: t("knowledge.categories.analyticsDesc"),
        icon: Users,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        border: "hover:border-cyan-500/40",
        to: "/analytics",
      },
      {
        id: "audit",
        title: t("knowledge.categories.auditTitle"),
        desc: t("knowledge.categories.auditDesc"),
        icon: FileBarChart2,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "hover:border-purple-500/40",
        to: "/reports",
      },
      {
        id: "hardware",
        title: t("knowledge.categories.hardwareTitle"),
        desc: t("knowledge.categories.hardwareDesc"),
        icon: Cpu,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
        border: "hover:border-violet-500/40",
        to: "/hardware",
      },
      {
        id: "localization",
        title: t("knowledge.categories.localizationTitle"),
        desc: t("knowledge.categories.localizationDesc"),
        icon: Languages,
        color: "text-emerald-600",
        bg: "bg-emerald-600/10",
        border: "hover:border-emerald-600/40",
        to: "/knowledge#faq-section",
      },
    ],
    [t],
  );

  // FAQ Items
  const FAQ_ITEMS = useMemo(
    () => [
      {
        id: "q1",
        category: "digitalTwin",
        q: t("knowledge.faq.q1"),
        a: t("knowledge.faq.a1"),
      },
      {
        id: "q2",
        category: "gates",
        q: t("knowledge.faq.q2"),
        a: t("knowledge.faq.a2"),
      },
      {
        id: "q3",
        category: "hardware",
        q: t("knowledge.faq.q3"),
        a: t("knowledge.faq.a3"),
      },
      {
        id: "q4",
        category: "muster",
        q: t("knowledge.faq.q4"),
        a: t("knowledge.faq.a4"),
      },
      {
        id: "q5",
        category: "safetyAi",
        q: t("knowledge.faq.q5"),
        a: t("knowledge.faq.a5"),
      },
      {
        id: "q6",
        category: "audit",
        q: t("knowledge.faq.q6"),
        a: t("knowledge.faq.a6"),
      },
      {
        id: "q7",
        category: "localization",
        q: t("knowledge.faq.q7"),
        a: t("knowledge.faq.a7"),
      },
      {
        id: "q8",
        category: "dashboard",
        q: t("knowledge.faq.q8"),
        a: t("knowledge.faq.a8"),
      },
    ],
    [t],
  );

  // Documentation Cards
  const DOCS_ITEMS = useMemo(
    () => [
      {
        id: "g1",
        category: "dashboard",
        title: t("knowledge.docs.g1Title"),
        desc: t("knowledge.docs.g1Desc"),
        mins: 4,
        icon: LayoutDashboard,
      },
      {
        id: "g2",
        category: "hardware",
        title: t("knowledge.docs.g2Title"),
        desc: t("knowledge.docs.g2Desc"),
        mins: 9,
        icon: Cpu,
      },
      {
        id: "g3",
        category: "audit",
        title: t("knowledge.docs.g3Title"),
        desc: t("knowledge.docs.g3Desc"),
        mins: 7,
        icon: Lock,
      },
      {
        id: "g4",
        category: "localization",
        title: t("knowledge.docs.g4Title"),
        desc: t("knowledge.docs.g4Desc"),
        mins: 5,
        icon: Languages,
      },
      {
        id: "g5",
        category: "hardware",
        title: t("knowledge.docs.g5Title"),
        desc: t("knowledge.docs.g5Desc"),
        mins: 11,
        icon: ShieldCheck,
      },
      {
        id: "g6",
        category: "dashboard",
        title: t("knowledge.docs.g6Title"),
        desc: t("knowledge.docs.g6Desc"),
        mins: 8,
        icon: Radio,
      },
      {
        id: "g7",
        category: "digitalTwin",
        title: t("knowledge.docs.g7Title"),
        desc: t("knowledge.docs.g7Desc"),
        mins: 6,
        icon: Boxes,
      },
      {
        id: "g8",
        category: "muster",
        title: t("knowledge.docs.g8Title"),
        desc: t("knowledge.docs.g8Desc"),
        mins: 5,
        icon: Siren,
      },
      {
        id: "g9",
        category: "workOrders",
        title: t("knowledge.docs.g9Title"),
        desc: t("knowledge.docs.g9Desc"),
        mins: 7,
        icon: BadgeCheck,
      },
    ],
    [t],
  );

  // Video Tutorials
  const VIDEO_ITEMS = useMemo(
    () => [
      {
        id: "v1",
        title: t("knowledge.videos.v1Title"),
        desc: t("knowledge.videos.v1Desc"),
        duration: t("knowledge.videos.v1Duration"),
        tag: "Executive Console",
      },
      {
        id: "v2",
        title: t("knowledge.videos.v2Title"),
        desc: t("knowledge.videos.v2Desc"),
        duration: t("knowledge.videos.v2Duration"),
        tag: "Spatial BIM",
      },
      {
        id: "v3",
        title: t("knowledge.videos.v3Title"),
        desc: t("knowledge.videos.v3Desc"),
        duration: t("knowledge.videos.v3Duration"),
        tag: "QCD Protocol",
      },
      {
        id: "v4",
        title: t("knowledge.videos.v4Title"),
        desc: t("knowledge.videos.v4Desc"),
        duration: t("knowledge.videos.v4Duration"),
        tag: "RF Antenna Calibration",
      },
      {
        id: "v5",
        title: t("knowledge.videos.v5Title"),
        desc: t("knowledge.videos.v5Desc"),
        duration: t("knowledge.videos.v5Duration"),
        tag: "RTL Engine",
      },
      {
        id: "v6",
        title: t("knowledge.videos.v6Title"),
        desc: t("knowledge.videos.v6Desc"),
        duration: t("knowledge.videos.v6Duration"),
        tag: "Permit Workflow",
      },
    ],
    [t],
  );

  // Filtered FAQ Items
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCat;
      const matchText =
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query);
      return matchCat && matchText;
    });
  }, [FAQ_ITEMS, selectedCategory, searchQuery]);

  // Filtered Documentation Items
  const filteredDocs = useMemo(() => {
    return DOCS_ITEMS.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCat;
      const matchText =
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query);
      return matchCat && matchText;
    });
  }, [DOCS_ITEMS, selectedCategory, searchQuery]);

  // Download Action Simulation
  const handleDownload = (title: string, size: string) => {
    toast.success(t("knowledge.downloads.toastSuccess", { title, size }), {
      icon: <Download className="size-4 text-emerald-500" />,
      duration: 3500,
    });
  };

  // Guide preview toast
  const handleOpenDoc = (title: string) => {
    toast.info(`Opening "${title}" in secure technical viewer...`, {
      icon: <FileText className="size-4 text-blue-500" />,
    });
  };

  // Dispatch Chat Submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChatOpen(false);
    toast.success(t("knowledge.contact.sentSuccess"), {
      icon: <CheckCircle2 className="size-4 text-emerald-500" />,
      duration: 5000,
    });
    setChatForm({ name: "", email: "", priority: "P2", message: "" });
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-foreground overflow-x-hidden selection:bg-blue-500/20">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-500/8 via-indigo-500/4 to-transparent pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-20 sm:space-y-24">
        {/* =========================================================================
            SECTION 1: HERO SECTION & HIGH-TECH DIGITAL HOSPITAL SCHEMATIC
           ========================================================================= */}
        <section className="relative pt-4 sm:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-start">
              {/* Badge Tag */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/80 dark:bg-blue-950/50 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm shadow-sm">
                <Dot tone="ok" />
                <span className="font-mono tracking-wide uppercase">
                  {t("knowledge.heroTag")}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-[#0F172A] dark:text-white">
                {t("knowledge.heroTitle")}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#64748B] dark:text-slate-400 leading-relaxed max-w-xl">
                {t("knowledge.heroSubtitle")}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a href="#docs-section">
                  <Button
                    size="lg"
                    className="h-11 px-6 rounded-xl font-medium bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="size-4" />
                    <span>{t("knowledge.browseDocs")}</span>
                  </Button>
                </a>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    setActiveVideo({
                      id: "v1",
                      title: t("knowledge.videos.v1Title"),
                      desc: t("knowledge.videos.v1Desc"),
                      duration: t("knowledge.videos.v1Duration"),
                    })
                  }
                  className="h-11 px-6 rounded-xl font-medium border-border/80 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="size-4 text-blue-500 fill-blue-500" />
                  <span>{t("knowledge.watchDemo")}</span>
                </Button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#64748B] dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Ashghal Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>HMC Infection Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>QCD Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Digital Hospital Diagram & Floating Glass Cards */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Outer Decorative Container */}
              <div className="relative w-full aspect-[4/3] max-w-lg rounded-3xl border border-blue-200/60 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 shadow-xl backdrop-blur-md p-6 overflow-hidden flex items-center justify-center">
                {/* Tech Radar Scanning Pulse */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)] pointer-events-none" />

                {/* Animated SVG Schematic */}
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full text-blue-500/60 dark:text-blue-400/50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="gridGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="400" y2="300">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Orthogonal Grid Lines */}
                  <line x1="40" y1="60" x2="360" y2="60" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="40" y1="120" x2="360" y2="120" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="40" y1="180" x2="360" y2="180" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="40" y1="240" x2="360" y2="240" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="100" y1="40" x2="100" y2="260" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="200" y1="40" x2="200" y2="260" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="300" y1="40" x2="300" y2="260" stroke="currentColor" strokeDasharray="3 3" opacity="0.4" />

                  {/* Hospital Building Isometric Wings */}
                  {/* Wing A: Inpatient Tower */}
                  <rect x="70" y="70" width="100" height="70" rx="8" stroke="#2563EB" strokeWidth="1.5" fill="url(#gridGrad)" />
                  <text x="78" y="90" fill="#2563EB" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                    WING-A · Inpatient
                  </text>
                  <circle cx="120" cy="115" r="4" fill="#22C55E" />
                  <circle cx="120" cy="115" r="8" stroke="#22C55E" strokeWidth="1" opacity="0.5" />

                  {/* Wing B: Outpatient & ICU */}
                  <rect x="230" y="70" width="100" height="70" rx="8" stroke="#14B8A6" strokeWidth="1.5" fill="url(#gridGrad)" />
                  <text x="238" y="90" fill="#14B8A6" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                    WING-B · ICU & Clinical
                  </text>
                  <circle cx="280" cy="115" r="4" fill="#3B82F6" />
                  <circle cx="280" cy="115" r="8" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />

                  {/* Central Spine Hoarding Barrier */}
                  <rect x="150" y="160" width="100" height="80" rx="8" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 2" fill="url(#gridGrad)" />
                  <text x="158" y="180" fill="#F59E0B" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                    ICRA Zone · Negative Press.
                  </text>
                  <circle cx="200" cy="210" r="4" fill="#F59E0B" />

                  {/* Cat6A Telemetry Spine Conduits */}
                  <path
                    d="M 120 115 L 200 115 L 200 210 L 280 115"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Gate 01 & Gate 02 Perimeter Turnstiles */}
                  <rect x="50" y="220" width="50" height="24" rx="4" stroke="#7C3AED" strokeWidth="1" />
                  <text x="56" y="235" fill="#7C3AED" fontSize="8" fontWeight="600">
                    GATE-01
                  </text>

                  <rect x="300" y="220" width="50" height="24" rx="4" stroke="#7C3AED" strokeWidth="1" />
                  <text x="306" y="235" fill="#7C3AED" fontSize="8" fontWeight="600">
                    GATE-02
                  </text>
                </svg>

                {/* Radar Ring Visual Animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-blue-500/20 animate-ping pointer-events-none" />
              </div>

              {/* 4 Floating Glass Telemetry Cards */}
              {/* Card 1: AI Vision Analytics (Top Left) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 sm:left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-[#0F172A]/[0.08] dark:border-white/[0.08] p-3 shadow-lg flex items-center gap-3 z-10"
              >
                <div className="size-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400">
                    {t("knowledge.floatingCards.aiAnalytics")}
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] dark:text-white font-mono flex items-center gap-1.5">
                    <Dot tone="ok" />
                    {t("knowledge.floatingCards.aiAnalyticsVal")}
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Safety Compliance (Top Right) */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute -top-4 -right-4 sm:right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-[#0F172A]/[0.08] dark:border-white/[0.08] p-3 shadow-lg flex items-center gap-3 z-10"
              >
                <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400">
                    {t("knowledge.floatingCards.safetyScore")}
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] dark:text-white font-mono">
                    {t("knowledge.floatingCards.safetyScoreVal")}
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Live RFID Ingress (Bottom Left) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute -bottom-4 -left-4 sm:left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-[#0F172A]/[0.08] dark:border-white/[0.08] p-3 shadow-lg flex items-center gap-3 z-10"
              >
                <div className="size-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Radio className="size-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400">
                    {t("knowledge.floatingCards.liveMonitoring")}
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] dark:text-white font-mono flex items-center gap-1.5">
                    <StreamingDots />
                    {t("knowledge.floatingCards.liveMonitoringVal")}
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Workers On Site (Bottom Right) */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute -bottom-4 -right-4 sm:right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-[#0F172A]/[0.08] dark:border-white/[0.08] p-3 shadow-lg flex items-center gap-3 z-10"
              >
                <div className="size-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Users className="size-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#64748B] dark:text-slate-400">
                    {t("knowledge.floatingCards.workersOnSite")}
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] dark:text-white font-mono">
                    {t("knowledge.floatingCards.workersOnSiteVal")}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: SEARCH & FILTER HUB (WITH SHORTCUT AND CATEGORY PILLS)
           ========================================================================= */}
        <section id="search-section" className="space-y-5">
          {/* Prominent Search Bar */}
          <div className="relative mx-auto max-w-3xl">
            <div className="relative flex items-center rounded-2xl border border-border/80 bg-white dark:bg-slate-900 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="size-5 text-muted-foreground ms-4 shrink-0" />
              <input
                id="knowledge-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("knowledge.searchPlaceholder")}
                className="h-14 w-full bg-transparent px-4 text-sm font-medium outline-none text-[#0F172A] dark:text-white placeholder:text-muted-foreground"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-2 me-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : (
                <div className="me-4 hidden sm:flex items-center gap-1 rounded-md border border-border/60 bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[11px] font-mono text-muted-foreground">
                  <span>/</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto pt-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer border",
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-white dark:bg-slate-900 text-muted-foreground border-border/80 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              {t("knowledge.allCategories")}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5",
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-white dark:bg-slate-900 text-muted-foreground border-border/80 hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                <span>{cat.title}</span>
              </button>
            ))}
          </div>

          {/* Search Result Status Banner when filtered */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="text-center text-xs text-muted-foreground pt-1">
              Found {filteredFaqs.length} FAQs and {filteredDocs.length} technical guides matching criteria.
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 3: 10 TELEMETRY DOMAIN CATEGORY CARDS
           ========================================================================= */}
        <section className="space-y-8">
          <div className="text-start space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.categories.title")}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t("knowledge.categories.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isFiltered =
                selectedCategory === "all" || selectedCategory === cat.id;

              return (
                <Link
                  key={cat.id}
                  to={cat.to}
                  className={cn(
                    "group relative rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-200 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5",
                    cat.border,
                    !isFiltered && "opacity-40 grayscale hover:opacity-80 hover:grayscale-0",
                  )}
                >
                  <div className="space-y-3">
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                        cat.bg,
                        cat.color,
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center text-xs font-semibold text-primary group-hover:underline">
                    <span>Explore Subsystem</span>
                    <ArrowRight className="size-3.5 ms-1 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: 4 DEEP-DIVE SUBSYSTEM OVERVIEWS (ALTERNATING LAYOUT)
           ========================================================================= */}
        <section className="space-y-16">
          <div className="text-start space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              <span>{t("knowledge.productOverview.tag")}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.productOverview.title")}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t("knowledge.productOverview.subtitle")}
            </p>
          </div>

          {/* Subsystem 1: Executive Command Center */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border border-border/80 bg-white dark:bg-slate-900/60 p-6 sm:p-10 shadow-sm">
            <div className="lg:col-span-6 space-y-5 text-start">
              <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <LayoutDashboard className="size-3.5" />
                <span>Primary Console</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
                {t("knowledge.productOverview.sec1Title")}
              </h3>
              <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                {t("knowledge.productOverview.sec1Desc")}
              </p>
              <ul className="space-y-2.5 text-xs text-[#0F172A] dark:text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec1Bullet1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec1Bullet2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec1Bullet3")}</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/">
                  <Button className="rounded-xl font-medium cursor-pointer flex items-center gap-2">
                    <span>{t("knowledge.productOverview.sec1Cta")}</span>
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-slate-50 dark:bg-slate-950/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Dot tone="ok" />
                  <span className="text-xs font-bold font-mono text-foreground">
                    COMMAND-STREAM-ACTIVE
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  PORT 8080 · 11.4ms
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-border/80">
                  <div className="text-[11px] text-muted-foreground">Wing A Density</div>
                  <div className="text-lg font-bold font-mono text-primary">312 / 350</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">Normal (89%)</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-border/80">
                  <div className="text-[11px] text-muted-foreground">Wing B Inpatient</div>
                  <div className="text-lg font-bold font-mono text-emerald-600">248 / 300</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">Normal (82%)</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-border/80">
                  <div className="text-[11px] text-muted-foreground">ICRA Hoarding Area</div>
                  <div className="text-lg font-bold font-mono text-amber-500">42 / 45</div>
                  <div className="text-[10px] text-amber-500 font-semibold mt-1">Near Quota (93%)</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-border/80">
                  <div className="text-[11px] text-muted-foreground">Turnstile Throughput</div>
                  <div className="text-lg font-bold font-mono text-purple-600">38 reads/min</div>
                  <div className="text-[10px] text-muted-foreground font-semibold mt-1">All 4 Gates Sync</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subsystem 2: Living Spatial Digital Twin (Image on Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border border-border/80 bg-white dark:bg-slate-900/60 p-6 sm:p-10 shadow-sm">
            <div className="lg:col-span-6 order-2 lg:order-1 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/40 bg-slate-50 dark:bg-slate-950/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Boxes className="size-4 text-indigo-500" />
                  <span className="text-xs font-bold font-mono text-foreground">
                    BIM-COORDINATE-CAD · REV 4
                  </span>
                </div>
                <span className="text-[11px] font-mono text-indigo-500 font-semibold">
                  3D GEOMETRY LIVE
                </span>
              </div>
              <div className="relative aspect-video rounded-xl bg-white dark:bg-slate-900 border border-border/80 p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                  <span>LEVEL 02 · AMBULATORY CARE</span>
                  <span>FPS: 60 · WAYPOINTS: 148</span>
                </div>
                <div className="grid grid-cols-3 gap-2 my-auto">
                  <div className="h-16 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-center text-center p-1">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                      Zone 1: Triage
                    </span>
                  </div>
                  <div className="h-16 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center text-center p-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                      Zone 2: CSSD
                    </span>
                  </div>
                  <div className="h-16 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-center p-1">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-300">
                      Zone 3: Negative Press.
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>ANTENNA: Zebra FXR90 (Port 1-4)</span>
                  <span className="text-emerald-500 font-semibold">0 Geofence Violations</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-start">
              <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Boxes className="size-3.5" />
                <span>Spatial BIM Synchronization</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
                {t("knowledge.productOverview.sec2Title")}
              </h3>
              <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                {t("knowledge.productOverview.sec2Desc")}
              </p>
              <ul className="space-y-2.5 text-xs text-[#0F172A] dark:text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec2Bullet1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec2Bullet2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec2Bullet3")}</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/digital-twin">
                  <Button className="rounded-xl font-medium cursor-pointer flex items-center gap-2">
                    <span>{t("knowledge.productOverview.sec2Cta")}</span>
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Subsystem 3: Edge AI Safety Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border border-border/80 bg-white dark:bg-slate-900/60 p-6 sm:p-10 shadow-sm">
            <div className="lg:col-span-6 space-y-5 text-start">
              <div className="inline-flex items-center gap-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <ShieldAlert className="size-3.5" />
                <span>On-Premise Computer Vision</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
                {t("knowledge.productOverview.sec3Title")}
              </h3>
              <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                {t("knowledge.productOverview.sec3Desc")}
              </p>
              <ul className="space-y-2.5 text-xs text-[#0F172A] dark:text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec3Bullet1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec3Bullet2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec3Bullet3")}</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/safety-ai">
                  <Button className="rounded-xl font-medium cursor-pointer flex items-center gap-2">
                    <span>{t("knowledge.productOverview.sec3Cta")}</span>
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-teal-200/60 dark:border-teal-900/40 bg-slate-50 dark:bg-slate-950/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4 text-teal-500" />
                  <span className="text-xs font-bold font-mono text-foreground">
                    NVIDIA JETSON ORIN AGX
                  </span>
                </div>
                <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
                  LATENCY: 42ms
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-border/80">
                  <span className="font-semibold text-[#0F172A] dark:text-white">
                    Hard-Hat PPE Detection
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">99.8% Conf.</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-border/80">
                  <span className="font-semibold text-[#0F172A] dark:text-white">
                    High-Vis Vest Classification
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">99.4% Conf.</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-border/80">
                  <span className="font-semibold text-[#0F172A] dark:text-white">
                    Turnstile Tailgating Prevention
                  </span>
                  <span className="font-mono text-blue-600 font-bold">0 Violations</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-border/80">
                  <span className="font-semibold text-[#0F172A] dark:text-white">
                    Zone Loudspeaker Broadcast
                  </span>
                  <span className="font-mono text-teal-600 font-bold">Ready · Bilingual</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsystem 4: Life Safety & Emergency Muster (Image on Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border border-border/80 bg-white dark:bg-slate-900/60 p-6 sm:p-10 shadow-sm">
            <div className="lg:col-span-6 order-2 lg:order-1 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-slate-50 dark:bg-slate-950/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Siren className="size-4 text-rose-500" />
                  <span className="text-xs font-bold font-mono text-foreground">
                    QCD-EVACUATION-TRIAGE
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">
                  HEADCOUNT PASS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-border/80">
                  <div className="text-[11px] text-muted-foreground">Muster Point 01</div>
                  <div className="text-lg font-bold font-mono text-emerald-600">284 Assembled</div>
                  <div className="text-[10px] text-muted-foreground mt-1">North Carpark Zone</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-border/80">
                  <div className="text-[11px] text-muted-foreground">Muster Point 02</div>
                  <div className="text-lg font-bold font-mono text-emerald-600">310 Assembled</div>
                  <div className="text-[10px] text-muted-foreground mt-1">East Helipad Zone</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-border/80">
                  <div className="text-[11px] text-muted-foreground">Muster Point 03</div>
                  <div className="text-lg font-bold font-mono text-emerald-600">196 Assembled</div>
                  <div className="text-[10px] text-muted-foreground mt-1">South Perimeter</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-border/80">
                  <div className="text-[11px] text-muted-foreground">Muster Point 04</div>
                  <div className="text-lg font-bold font-mono text-emerald-600">74 Assembled</div>
                  <div className="text-[10px] text-muted-foreground mt-1">West Logistics Gate</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-start">
              <div className="inline-flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <Siren className="size-3.5" />
                <span>Life Safety & QCD Standard</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
                {t("knowledge.productOverview.sec4Title")}
              </h3>
              <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                {t("knowledge.productOverview.sec4Desc")}
              </p>
              <ul className="space-y-2.5 text-xs text-[#0F172A] dark:text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec4Bullet1")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec4Bullet2")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t("knowledge.productOverview.sec4Bullet3")}</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/muster">
                  <Button className="rounded-xl font-medium cursor-pointer flex items-center gap-2">
                    <span>{t("knowledge.productOverview.sec4Cta")}</span>
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: INTERACTIVE FAQ ACCORDION
           ========================================================================= */}
        <section id="faq-section" className="space-y-8">
          <div className="text-start space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <HelpCircle className="size-3.5" />
              <span>{t("knowledge.faq.tag")}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.faq.title")}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t("knowledge.faq.subtitle")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 shadow-sm p-4 sm:p-6">
            {filteredFaqs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No questions found matching your search term. Try another keyword or reset the category filter.
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {filteredFaqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-border/60 rounded-xl px-4 py-1 data-[state=open]:bg-slate-50/70 dark:data-[state=open]:bg-slate-800/40 transition-colors"
                  >
                    <AccordionTrigger className="text-start hover:no-underline text-[#0F172A] dark:text-white font-semibold text-sm sm:text-base py-3.5">
                      <div className="flex items-center gap-3 pe-2">
                        <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                        <span>{faq.q}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 leading-relaxed ps-5 pt-1 pb-4 text-start">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: ENGINEERING & OPERATIONS DOCUMENTATION (9 CARDS)
           ========================================================================= */}
        <section id="docs-section" className="space-y-8">
          <div className="text-start space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <FileText className="size-3.5" />
              <span>{t("knowledge.docs.tag")}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.docs.title")}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t("knowledge.docs.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        <Clock className="size-3" />
                        <span>{t("knowledge.docs.minsRead", { mins: doc.mins })}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-start">
                      <h3 className="text-base font-semibold text-[#0F172A] dark:text-white group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDoc(doc.title)}
                      className="w-full rounded-xl text-xs font-medium cursor-pointer flex items-center justify-center gap-2 border-border/80 group-hover:border-primary group-hover:text-primary"
                    >
                      <span>{t("knowledge.docs.readGuide")}</span>
                      <ArrowRight className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: VIDEO DEMOS & WALKTHROUGHS (6 CARDS + INTERACTIVE MODAL)
           ========================================================================= */}
        <section className="space-y-8">
          <div className="text-start space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Play className="size-3.5 fill-primary" />
              <span>{t("knowledge.videos.tag")}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.videos.title")}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t("knowledge.videos.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIDEO_ITEMS.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group rounded-2xl border border-border/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Video Card Thumbnail Simulation */}
                <div className="relative aspect-video bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:12px_12px]" />
                  <div className="size-12 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:border-primary">
                    <Play className="size-5 fill-white ms-0.5" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-white px-2 py-0.5 rounded-md">
                    {video.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{video.duration}</span>
                  </div>
                </div>

                {/* Video Meta Content */}
                <div className="p-5 text-start space-y-2">
                  <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                    {video.desc}
                  </p>
                </div>

                <div className="px-5 pb-5 pt-1 text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline">
                  <span>{t("knowledge.videos.watchNow")}</span>
                  <ArrowRight className="size-3 rtl:rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: MISSION-CRITICAL PLATFORM STATISTICS
           ========================================================================= */}
        <section className="rounded-3xl border border-border/80 bg-white dark:bg-slate-900/80 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-border/60 rtl:divide-x-reverse">
            <div className="space-y-2 pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-primary tracking-tight">
                {t("knowledge.stats.articlesCount")}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-slate-400">
                {t("knowledge.stats.articles")}
              </div>
            </div>

            <div className="space-y-2 pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tracking-tight">
                {t("knowledge.stats.videosCount")}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-slate-400">
                {t("knowledge.stats.videos")}
              </div>
            </div>

            <div className="space-y-2 pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                {t("knowledge.stats.supportCount")}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-slate-400">
                {t("knowledge.stats.support")}
              </div>
            </div>

            <div className="space-y-2 pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-teal-600 dark:text-teal-400 tracking-tight">
                {t("knowledge.stats.uptimeCount")}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#64748B] dark:text-slate-400">
                {t("knowledge.stats.uptime")}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: CUSTOMER & REGULATORY TESTIMONIALS
           ========================================================================= */}
        <section className="space-y-8">
          <div className="text-start space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>{t("knowledge.testimonials.tag")}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.testimonials.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Testimonial 1: Ashghal */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-5 text-start flex flex-col justify-between">
              <blockquote className="text-sm text-[#0F172A] dark:text-slate-200 leading-relaxed italic">
                "{t("knowledge.testimonials.t1Quote")}"
              </blockquote>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <div className="size-11 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm shrink-0">
                  MN
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                    <span>{t("knowledge.testimonials.t1Name")}</span>
                    <BadgeCheck className="size-4 text-blue-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("knowledge.testimonials.t1Role")} · {t("knowledge.testimonials.t1Org")}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2: Hamad Medical Corporation */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-5 text-start flex flex-col justify-between">
              <blockquote className="text-sm text-[#0F172A] dark:text-slate-200 leading-relaxed italic">
                "{t("knowledge.testimonials.t2Quote")}"
              </blockquote>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <div className="size-11 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0">
                  AS
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                    <span>{t("knowledge.testimonials.t2Name")}</span>
                    <BadgeCheck className="size-4 text-emerald-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("knowledge.testimonials.t2Role")} · {t("knowledge.testimonials.t2Org")}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3: Qatar Civil Defence */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-5 text-start flex flex-col justify-between">
              <blockquote className="text-sm text-[#0F172A] dark:text-slate-200 leading-relaxed italic">
                "{t("knowledge.testimonials.t3Quote")}"
              </blockquote>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <div className="size-11 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center text-sm shrink-0">
                  FM
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                    <span>{t("knowledge.testimonials.t3Name")}</span>
                    <BadgeCheck className="size-4 text-rose-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("knowledge.testimonials.t3Role")} · {t("knowledge.testimonials.t3Org")}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 4: KEO International */}
            <div className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-5 text-start flex flex-col justify-between">
              <blockquote className="text-sm text-[#0F172A] dark:text-slate-200 leading-relaxed italic">
                "{t("knowledge.testimonials.t4Quote")}"
              </blockquote>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <div className="size-11 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-sm shrink-0">
                  GH
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                    <span>{t("knowledge.testimonials.t4Name")}</span>
                    <BadgeCheck className="size-4 text-purple-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("knowledge.testimonials.t4Role")} · {t("knowledge.testimonials.t4Org")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: OFFICIAL DOWNLOADS & TECHNICAL ARCHIVE
           ========================================================================= */}
        <section className="space-y-8">
          <div className="text-start space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Download className="size-3.5" />
              <span>{t("knowledge.downloads.tag")}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.downloads.title")}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t("knowledge.downloads.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { id: "d1", title: t("knowledge.downloads.d1Title"), size: t("knowledge.downloads.d1Size"), sha: "3fa9...10b" },
              { id: "d2", title: t("knowledge.downloads.d2Title"), size: t("knowledge.downloads.d2Size"), sha: "88cd...44e" },
              { id: "d3", title: t("knowledge.downloads.d3Title"), size: t("knowledge.downloads.d3Size"), sha: "b102...98f" },
              { id: "d4", title: t("knowledge.downloads.d4Title"), size: t("knowledge.downloads.d4Size"), sha: "4c7a...f01" },
              { id: "d5", title: t("knowledge.downloads.d5Title"), size: t("knowledge.downloads.d5Size"), sha: "991e...c23" },
              { id: "d6", title: t("knowledge.downloads.d6Title"), size: t("knowledge.downloads.d6Size"), sha: "ee41...77d" },
            ].map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="size-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 text-start">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-muted-foreground">
                      <span>{item.size}</span>
                      <span>·</span>
                      <span>SHA: {item.sha}</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload(item.title, item.size)}
                  className="rounded-xl size-9 p-0 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-primary"
                  aria-label={`Download ${item.title}`}
                >
                  <Download className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: SECURITY & REGULATORY CERTIFICATIONS
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-start space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Shield className="size-3.5" />
              <span>{t("knowledge.certifications.tag")}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.certifications.title")}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t("knowledge.certifications.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "ISO / IEC 27001", badge: "Certified", color: "text-blue-500" },
              { name: "HIPAA Security", badge: "Ready", color: "text-emerald-500" },
              { name: "GDPR / Qatar PDP", badge: "Compliant", color: "text-purple-500" },
              { name: "SOC 2 Type II", badge: "Audited", color: "text-teal-500" },
              { name: "IEC 62443 Industrial", badge: "Level 3", color: "text-amber-500" },
              { name: "Azure Qatar Cloud", badge: "Sovereign", color: "text-indigo-500" },
            ].map((cert) => (
              <div
                key={cert.name}
                className="rounded-2xl border border-border/80 bg-white dark:bg-slate-900 p-4 text-center shadow-sm space-y-2"
              >
                <ShieldCheck className={cn("size-6 mx-auto", cert.color)} />
                <div className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">
                  {cert.name}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">
                  {cert.badge}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 12: PRIORITY CONTACT & LIVE DISPATCH HUB
           ========================================================================= */}
        <section className="relative rounded-3xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-8 sm:p-12 shadow-md overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6 text-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 dark:border-blue-700 bg-white/80 dark:bg-slate-800/80 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Dot tone="ok" />
              <span>Doha Operations Center (TOC) · 24/7 Hotline</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t("knowledge.contact.title")}
            </h2>

            <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 leading-relaxed">
              {t("knowledge.contact.subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => setChatOpen(true)}
                className="h-11 px-6 rounded-xl font-medium bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-2"
              >
                <MessageSquare className="size-4" />
                <span>{t("knowledge.contact.liveChat")}</span>
              </Button>

              <a href="mailto:support@mediinfra.qa">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 rounded-xl font-medium border-border/80 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Mail className="size-4 text-blue-500" />
                  <span>{t("knowledge.contact.emailSupport")}</span>
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 13: ENTERPRISE FOOTER
           ========================================================================= */}
        <footer className="border-t border-border/80 pt-12 pb-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-start">
            {/* Brand & Purpose */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <MediInfraLogo size="md" />
              </div>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed max-w-sm">
                {t("knowledge.footer.description")}
              </p>
              <div className="text-[11px] font-mono text-muted-foreground">
                Qatar Public Works Authority (Ashghal)
              </div>
            </div>

            {/* Links Column 1: Subsystems */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                {t("knowledge.footer.quickLinks")}
              </h4>
              <ul className="space-y-2 text-xs text-[#64748B] dark:text-slate-400">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    {t("nav.commandCenter")}
                  </Link>
                </li>
                <li>
                  <Link to="/digital-twin" className="hover:text-primary transition-colors">
                    {t("nav.digitalTwin")}
                  </Link>
                </li>
                <li>
                  <Link to="/gates" className="hover:text-primary transition-colors">
                    {t("nav.gates")}
                  </Link>
                </li>
                <li>
                  <Link to="/safety-ai" className="hover:text-primary transition-colors">
                    {t("nav.safetyAi")}
                  </Link>
                </li>
                <li>
                  <Link to="/muster" className="hover:text-primary transition-colors">
                    {t("nav.muster")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links Column 2: Resources */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                {t("knowledge.footer.resources")}
              </h4>
              <ul className="space-y-2 text-xs text-[#64748B] dark:text-slate-400">
                <li>
                  <a href="#docs-section" className="hover:text-primary transition-colors">
                    Operations Manuals
                  </a>
                </li>
                <li>
                  <a href="#faq-section" className="hover:text-primary transition-colors">
                    Technical Inquiries (FAQ)
                  </a>
                </li>
                <li>
                  <Link to="/hardware" className="hover:text-primary transition-colors">
                    Zebra RFID Diagnostics
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="hover:text-primary transition-colors">
                    Ashghal LR-01 Audit Forms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links Column 3: Legal & Gov */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                {t("knowledge.footer.legal")}
              </h4>
              <ul className="space-y-2 text-xs text-[#64748B] dark:text-slate-400">
                <li>
                  <span className="cursor-pointer hover:text-primary transition-colors">
                    {t("knowledge.footer.privacy")}
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-primary transition-colors">
                    {t("knowledge.footer.terms")}
                  </span>
                </li>
                <li>
                  <a
                    href="https://github.com/Talish-creator/Mediinfra"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span>{t("knowledge.footer.github")}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground text-center sm:text-start">
            <div>{t("knowledge.footer.copyright")}</div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-mono">
                <Dot tone="ok" />
                Pipeline Uptime: 99.94%
              </span>
              <span>·</span>
              <span>Doha Datacenter Node</span>
            </div>
          </div>
        </footer>
      </div>

      {/* =========================================================================
          INTERACTIVE VIDEO PLAYER DIALOG MODAL
         ========================================================================= */}
      <Dialog
        open={Boolean(activeVideo)}
        onOpenChange={(open) => !open && setActiveVideo(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-slate-950 text-white border-slate-800">
          <DialogHeader className="p-4 bg-slate-900/80 border-b border-slate-800 text-start">
            <DialogTitle className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Play className="size-4 text-primary fill-primary" />
              <span>{activeVideo?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              {activeVideo?.desc}
            </DialogDescription>
          </DialogHeader>

          {/* Video Mock Display */}
          <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Animated Audio/Video Wave */}
            <div className="flex items-end gap-1.5 h-24 mb-4">
              {[40, 65, 30, 85, 95, 55, 75, 45, 90, 60, 80, 50, 70, 88, 42].map(
                (h, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      height: isVideoPlaying ? [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`] : `${h * 0.3}%`,
                    }}
                    transition={{
                      duration: 0.8 + (idx % 5) * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 bg-blue-500 rounded-full"
                  />
                ),
              )}
            </div>

            <div className="text-xs font-mono text-slate-400 mb-2">
              {t("knowledge.videos.nowPlaying")} {activeVideo?.title}
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex items-center justify-between gap-4">
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="size-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
                aria-label={isVideoPlaying ? "Pause" : "Play"}
              >
                {isVideoPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-white" />}
              </button>

              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden relative cursor-pointer">
                <div className="h-full bg-blue-500 w-1/3 rounded-full" />
              </div>

              <span className="text-[11px] font-mono text-slate-300">
                01:42 / {activeVideo?.duration}
              </span>

              <div className="flex items-center gap-2 text-slate-300">
                <Volume2 className="size-4" />
                <span className="text-[11px] font-mono">100%</span>
              </div>
            </div>
          </div>

          <DialogFooter className="p-3 bg-slate-900/80 border-t border-slate-800 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveVideo(null)}
              className="text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
            >
              {t("knowledge.videos.closeModal")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          INTERACTIVE LIVE DISPATCH CHAT DIALOG
         ========================================================================= */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-border">
          <DialogHeader className="text-start">
            <DialogTitle className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <span>{t("knowledge.contact.chatModalTitle")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {t("knowledge.contact.chatModalDesc")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChatSubmit} className="space-y-4 pt-2 text-start">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("knowledge.contact.nameLabel")}
              </label>
              <Input
                required
                placeholder="Eng. Sarah Al-Kuwari"
                value={chatForm.name}
                onChange={(e) => setChatForm({ ...chatForm, name: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("knowledge.contact.emailLabel")}
              </label>
              <Input
                required
                type="email"
                placeholder="s.alkuwari@ashghal.gov.qa"
                value={chatForm.email}
                onChange={(e) => setChatForm({ ...chatForm, email: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("knowledge.contact.topicLabel")}
              </label>
              <select
                value={chatForm.priority}
                onChange={(e) => setChatForm({ ...chatForm, priority: e.target.value })}
                className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="P1">P1 — Critical Site Disruption / Evacuation Fault</option>
                <option value="P2">P2 — Sensor Telemetry Degradation / Camera Offline</option>
                <option value="P3">P3 — Operational Inquiry / Timesheet Export</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t("knowledge.contact.messageLabel")}
              </label>
              <textarea
                required
                rows={3}
                placeholder="Enter inquiry or fault description here..."
                value={chatForm.message}
                onChange={(e) => setChatForm({ ...chatForm, message: e.target.value })}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-xl font-medium text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="size-3.5" />
                <span>{t("knowledge.contact.sendBtn")}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
