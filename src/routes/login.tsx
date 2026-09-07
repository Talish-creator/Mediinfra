import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  CheckCircle2,
  Cpu,
  Fingerprint,
  Globe,
  HardHat,
  Key,
  LayoutDashboard,
  Lock,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediInfraLogo } from "@/components/mediinfra/MediInfraLogo";
import { useMediInfra } from "@/lib/mediinfra-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Enterprise Access Portal — MediInfra Command" },
      {
        name: "description",
        content:
          "Single Sign-On and Qatar Smart QID authentication gateway for MediInfra Healthcare Infrastructure Command.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang, toggleLang, theme, toggleTheme } = useMediInfra();
  const [username, setUsername] = useState("talish.ahmed@mediinfra.qa");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Authenticating operational credentials with Azure AD...");
    setTimeout(() => {
      setLoading(false);
      toast.dismiss();
      toast.success("Identity verified · Session granted (Qatar AST).");
      navigate({ to: "/command" });
    }, 1000);
  };

  const handleSso = (provider: string) => {
    toast.loading(`Authenticating via ${provider}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Authenticated via ${provider}. Welcome back, Director.`);
      navigate({ to: "/command" });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient image & mesh */}
      <div className="absolute inset-0 z-0 opacity-25">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      {/* Top Header Controls */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="size-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span>{t("corporate.nav.backToPublic")}</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 hover:bg-white/10"
          >
            <Globe className="size-3.5 text-blue-400" />
            <span>{lang === "en" ? "العربية" : "EN"}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
          >
            {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>
        </div>
      </header>

      {/* Centered Login Box */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block">
            <MediInfraLogo size="lg" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {t("corporate.login.title")}
            </h1>
            <p className="text-xs text-slate-400">
              {t("corporate.login.subtitle")}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quick SSO Buttons */}
          <div className="space-y-2.5">
            <Button
              onClick={() => handleSso("Qatar Government Azure AD")}
              variant="outline"
              className="w-full rounded-xl font-semibold text-xs border-white/20 bg-white/5 hover:bg-white/10 text-white gap-2.5 py-2.5"
            >
              <ShieldCheck className="size-4 text-blue-400" />
              <span>{t("corporate.login.azureSso")}</span>
            </Button>

            <Button
              onClick={() => handleSso("Qatar Smart Card QID")}
              variant="outline"
              className="w-full rounded-xl font-semibold text-xs border-white/20 bg-white/5 hover:bg-white/10 text-white gap-2.5 py-2.5"
            >
              <Fingerprint className="size-4 text-emerald-400" />
              <span>{t("corporate.login.qidCard")}</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-wider shrink-0 font-mono">
              {t("corporate.login.orDivider")}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t("corporate.login.username")}
              </label>
              <div className="relative">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl bg-slate-950/80 border-slate-700 text-xs text-white ps-9"
                />
                <User className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t("corporate.login.password")}
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl bg-slate-950/80 border-slate-700 text-xs text-white ps-9"
                />
                <Key className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 gap-2 shadow-lg shadow-blue-600/30"
            >
              <Lock className="size-3.5" />
              <span>{loading ? "Authenticating..." : t("corporate.login.signInBtn")}</span>
            </Button>
          </form>

          {/* Direct Interactive Demo Link */}
          <div className="pt-2 border-t border-white/10">
            <Button
              onClick={() => {
                toast.success("Entering MediInfra Executive Command Center (Demo Mode)");
                navigate({ to: "/command" });
              }}
              variant="ghost"
              className="w-full rounded-xl text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 gap-1.5"
            >
              <LayoutDashboard className="size-3.5" />
              <span>{t("corporate.login.demoBtn")}</span>
              <ArrowRight className="size-3 rtl:rotate-180" />
            </Button>
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-500 max-w-xs mx-auto leading-relaxed">
          {t("corporate.login.securityNotice")}
        </p>
      </main>

      {/* Bottom Footer bar */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} MediInfra Technologies W.L.L. State of Qatar. All rights reserved.
      </footer>
    </div>
  );
}
