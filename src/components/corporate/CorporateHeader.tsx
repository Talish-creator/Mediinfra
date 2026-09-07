import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Boxes,
  Building,
  ChevronDown,
  Globe,
  HardHat,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Moon,
  Radio,
  ScanLine,
  Shield,
  ShieldCheck,
  Siren,
  Sparkles,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MediInfraLogo } from "@/components/mediinfra/MediInfraLogo";
import { useMediInfra } from "@/lib/mediinfra-store";
import { cn } from "@/lib/utils";

interface CorporateHeaderProps {
  onOpenDemo?: () => void;
}

export function CorporateHeader({ onOpenDemo }: CorporateHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang, toggleLang, theme, toggleTheme } = useMediInfra();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("corporate.nav.solutions"), href: "/#solutions" },
    { label: t("corporate.nav.industries"), href: "/#industries" },
    { label: t("corporate.nav.platform"), href: "/#platform" },
    { label: t("corporate.nav.resources"), href: "/#case-studies" },
    { label: t("corporate.nav.about"), href: "/#timeline" },
    { label: t("corporate.nav.contact"), href: "/#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <MediInfraLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-xl text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              title="Toggle Language (English / العربية)"
              aria-label="Toggle Language"
            >
              <Globe className="size-3.5 text-blue-600 dark:text-blue-400" />
              <span>{lang === "en" ? "العربية" : "EN"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex size-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="size-3.5 text-amber-500" />
              ) : (
                <Moon className="size-3.5 text-slate-700" />
              )}
            </button>

            {/* Book Demo Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenDemo}
              className="hidden md:inline-flex rounded-xl font-semibold text-xs border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("corporate.nav.bookDemo")}
            </Button>

            {/* Primary Action: Launch Platform / Login */}
            <Button
              asChild
              size="sm"
              className="rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-md transition-all gap-1.5"
            >
              <Link to="/command">
                <LayoutDashboard className="size-3.5" />
                <span>{t("corporate.nav.launchPlatform")}</span>
              </Link>
            </Button>

            {/* Mobile Navigation Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden size-9 rounded-xl text-slate-700 dark:text-slate-200"
                  aria-label="Open mobile menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <MediInfraLogo size="sm" />
                  </div>

                  <nav className="space-y-1">
                    {navLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenDemo?.();
                      }}
                      variant="outline"
                      className="w-full rounded-xl text-xs font-semibold"
                    >
                      {t("corporate.nav.bookDemo")}
                    </Button>

                    <Button
                      asChild
                      className="w-full rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
                      <Link to="/command" onClick={() => setMobileMenuOpen(false)}>
                        <LayoutDashboard className="size-4" />
                        <span>{t("corporate.nav.launchPlatform")}</span>
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      className="w-full rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 gap-2"
                    >
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Lock className="size-4" />
                        <span>{t("corporate.nav.login")}</span>
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>ISO 27001 Certified</span>
                  <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-1.5 rounded-lg border">
                      {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                    </button>
                    <button onClick={toggleLang} className="p-1.5 rounded-lg border font-bold">
                      {lang === "en" ? "AR" : "EN"}
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
