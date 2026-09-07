import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  BadgeCheck,
  Building,
  CheckCircle2,
  Globe,
  HardHat,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediInfraLogo } from "@/components/mediinfra/MediInfraLogo";

export function CorporateFooter() {
  const { t } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid work email address.");
      return;
    }
    toast.success(t("corporate.footer.subscribedToast"));
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Tier: Brand, Newsletter & High-Level Positioning */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="lg:col-span-6 space-y-4">
            <MediInfraLogo size="lg" />
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t("corporate.footer.tagline")}
            </p>

            {/* Certifications badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/60">
                <ShieldCheck className="size-3.5 text-blue-400" />
                <span>{t("corporate.footer.certAshghal")}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                <BadgeCheck className="size-3.5 text-emerald-400" />
                <span>{t("corporate.footer.certIso")}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/60">
                <Building className="size-3.5 text-purple-400" />
                <span>{t("corporate.footer.certMoph")}</span>
              </span>
            </div>
          </div>

          {/* Newsletter subscription */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t("corporate.footer.newsletterTitle")}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t("corporate.footer.newsletterDesc")}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md pt-1">
              <Input
                type="email"
                placeholder="executive@hospital.gov.qa"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="rounded-xl bg-slate-900 border-slate-700 text-xs text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0 gap-1.5"
              >
                <Send className="size-3.5" />
                <span>{t("corporate.footer.subscribeBtn")}</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Middle Tier: 5 Column Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Col 1: Solutions */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              {t("corporate.footer.colSolutions")}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/command" className="hover:text-blue-400 transition-colors">
                  {t("corporate.solutions.sol1Title")}
                </Link>
              </li>
              <li>
                <Link to="/digital-twin" className="hover:text-blue-400 transition-colors">
                  {t("corporate.solutions.sol2Title")}
                </Link>
              </li>
              <li>
                <Link to="/gates" className="hover:text-blue-400 transition-colors">
                  {t("corporate.solutions.sol3Title")}
                </Link>
              </li>
              <li>
                <Link to="/muster" className="hover:text-blue-400 transition-colors">
                  {t("corporate.solutions.sol4Title")}
                </Link>
              </li>
              <li>
                <Link to="/safety-ai" className="hover:text-blue-400 transition-colors">
                  {t("corporate.solutions.sol5Title")}
                </Link>
              </li>
              <li>
                <Link to="/reports-center" className="hover:text-blue-400 transition-colors">
                  {t("corporate.solutions.sol6Title")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Industries */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              {t("corporate.footer.colIndustries")}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="/#industries" className="hover:text-blue-400 transition-colors">
                  {t("corporate.industries.tab1")}
                </a>
              </li>
              <li>
                <a href="/#industries" className="hover:text-blue-400 transition-colors">
                  {t("corporate.industries.tab2")}
                </a>
              </li>
              <li>
                <a href="/#industries" className="hover:text-blue-400 transition-colors">
                  {t("corporate.industries.tab3")}
                </a>
              </li>
              <li>
                <a href="/#industries" className="hover:text-blue-400 transition-colors">
                  {t("corporate.industries.tab4")}
                </a>
              </li>
              <li>
                <a href="/#industries" className="hover:text-blue-400 transition-colors">
                  {t("corporate.industries.tab5")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Architecture */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              {t("corporate.footer.colPlatform")}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/hardware" className="hover:text-blue-400 transition-colors">
                  Zebra FXR90 RFID ELV
                </Link>
              </li>
              <li>
                <Link to="/digital-twin" className="hover:text-blue-400 transition-colors">
                  WebGL 3D BIM Graphics
                </Link>
              </li>
              <li>
                <Link to="/safety-ai" className="hover:text-blue-400 transition-colors">
                  NVIDIA Jetson AGX Orin
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="hover:text-blue-400 transition-colors">
                  Technical Architecture Docs
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-blue-400 transition-colors">
                  SHA-256 Custody Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Locations */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              {t("corporate.footer.colCompany")}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="/#about" className="hover:text-blue-400 transition-colors">
                  About MediInfra Technologies
                </a>
              </li>
              <li>
                <a href="/#case-studies" className="hover:text-blue-400 transition-colors">
                  Enterprise Case Studies
                </a>
              </li>
              <li>
                <a href="/#testimonials" className="hover:text-blue-400 transition-colors">
                  Leadership Testimonials
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-blue-400 transition-colors">
                  Doha Operational HQ
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors text-blue-400 font-semibold">
                  Executive Sign In →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Compliance & Security */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              {t("corporate.footer.colLegal")}
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Qatar Law No. 13 of 2016 (PDP)</li>
              <li>ISO/IEC 27001:2022 Certified</li>
              <li>Qatar Civil Defence Compliant</li>
              <li>Joint Commission International (JCI)</li>
              <li>NIST SP 800-63B Identity Standards</li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Legal */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t("corporate.footer.rights")}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/#contact" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="/#contact" className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="/#contact" className="hover:underline">Security Whitepaper</a>
            <span>•</span>
            <Link to="/knowledge" className="hover:underline text-blue-400">
              Knowledge Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
