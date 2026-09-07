import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileBarChart2,
  FileCheck2,
  FileDown,
  FileText,
  Fingerprint,
  Globe,
  HardHat,
  HelpCircle,
  Key,
  Laptop,
  Layers,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  Phone,
  QrCode,
  Radio,
  RefreshCw,
  Save,
  ScanLine,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sliders,
  Smartphone,
  Sparkles,
  Sun,
  Tablet,
  Terminal,
  Trash2,
  User,
  UserCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useMediInfra } from "@/lib/mediinfra-store";
import { AnimatedNumber, Dot, LivePulse, Mono, Pill, SignalIndicator, StatusBadge } from "@/components/mediinfra/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "User Profile & Security Settings — MediInfra Command" },
      {
        name: "description",
        content:
          "Enterprise account governance, 2FA credentials, notification dispatching, and workspace settings for MediInfra.",
      },
      { property: "og:title", content: "User Profile & Settings — MediInfra" },
      {
        property: "og:description",
        content:
          "Manage operator identity, biometric security, connected devices, and localized regional governance.",
      },
    ],
  }),
  component: ProfilePage,
});

// Demo recovery codes
const INITIAL_RECOVERY_CODES = [
  "8F4A-99B2-C10E",
  "3D71-FA52-09CE",
  "B421-6890-EE1A",
  "9901-AC34-DF12",
  "561B-0082-99AB",
  "CC14-9981-44E2",
  "7719-BB32-00FA",
  "1290-DD81-9964",
];

// Initial connected devices
interface DeviceItem {
  id: string;
  name: string;
  platform: string;
  type: "desktop" | "tablet" | "mobile";
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const INITIAL_DEVICES: DeviceItem[] = [
  {
    id: "dev-01",
    name: "Command Workstation 04 (Dell Precision 7960)",
    platform: "Windows 11 Pro · Edge 122 Enterprise",
    type: "desktop",
    ip: "178.152.24.11",
    location: "Doha, Qatar · West Bay Tower 3",
    lastActive: "Active Now",
    isCurrent: true,
  },
  {
    id: "dev-02",
    name: "Site Ops iPad Pro 12.9 M2",
    platform: "iPadOS 17.4 · Safari Mobile",
    type: "tablet",
    ip: "89.211.54.92",
    location: "Lusail, Qatar · Site Inspection Unit",
    lastActive: "18 minutes ago",
    isCurrent: false,
  },
  {
    id: "dev-03",
    name: "Executive Mobile iPhone 15 Pro",
    platform: "iOS 17.4.1 · MediInfra Field App v3.2",
    type: "mobile",
    ip: "89.211.54.92",
    location: "Doha, Qatar · Zone 4 Hospital Gate 2",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
];

// Initial audit trail
interface AuditItem {
  id: string;
  key: string;
  category: "auth" | "security" | "report" | "permit" | "safety";
  timestamp: string;
  ip: string;
  device: string;
  status: "success" | "warning" | "verified";
}

const AUDIT_TRAIL: AuditItem[] = [
  {
    id: "aud-01",
    key: "act1",
    category: "auth",
    timestamp: "Today, 13:42 AST",
    ip: "178.152.24.11",
    device: "Azure AD SSO · Doha",
    status: "verified",
  },
  {
    id: "aud-02",
    key: "act2",
    category: "security",
    timestamp: "Today, 11:20 AST",
    ip: "178.152.24.11",
    device: "OAuth2.0 Token Dispatch",
    status: "success",
  },
  {
    id: "aud-03",
    key: "act3",
    category: "report",
    timestamp: "Today, 09:15 AST",
    ip: "178.152.24.11",
    device: "Report Engine · Ashghal LR-01",
    status: "success",
  },
  {
    id: "aud-04",
    key: "act4",
    category: "permit",
    timestamp: "Yesterday, 16:40 AST",
    ip: "89.211.54.92",
    device: "iPad Pro · Lusail Field Office",
    status: "verified",
  },
  {
    id: "aud-05",
    key: "act5",
    category: "safety",
    timestamp: "Yesterday, 10:00 AST",
    ip: "89.211.54.92",
    device: "Civil Defence Drill Controller",
    status: "success",
  },
  {
    id: "aud-06",
    key: "act6",
    category: "security",
    timestamp: "4 days ago, 08:30 AST",
    ip: "178.152.24.11",
    device: "Workstation 04 · TOTP Verified",
    status: "verified",
  },
];

function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    role,
    setRole,
  } = useMediInfra();

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Account Information form state
  const [firstName, setFirstName] = useState("Talish");
  const [lastName, setLastName] = useState("Ahmed");
  const [email, setEmail] = useState("talish.ahmed@mediinfra.qa");
  const [phone, setPhone] = useState("+974 4492 8800");
  const [office, setOffice] = useState("Tower 3, Level 14 · West Bay, Doha");
  const [country, setCountry] = useState("State of Qatar");
  const [timeZone, setTimeZone] = useState("Asia/Qatar (AST UTC+3)");
  const [bio, setBio] = useState(
    "Overseeing mission-critical IoT sensor telemetry, RFID turnstile portals, and edge AI safety vision across Ashghal healthcare developments in Doha.",
  );
  const [linkedIn, setLinkedIn] = useState("linkedin.com/in/talish-ahmed-pe");
  const [emergencyContact, setEmergencyContact] = useState(
    "Eng. Fatima Al-Kuwari (Operations Deputy) · +974 5512 3456",
  );
  const [employeeNumber, setEmployeeNumber] = useState("QID-28463401928");
  const [accountDirty, setAccountDirty] = useState(false);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Security dialog states
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Recovery codes modal
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>(INITIAL_RECOVERY_CODES);

  // API Token modal
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Decommission modal
  const [decommissionModalOpen, setDecommissionModalOpen] = useState(false);

  // Connected devices
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);

  // Notification toggles state
  const [notifState, setNotifState] = useState({
    emailNotif: true,
    pushNotif: true,
    smsNotif: true,
    musterAlerts: true,
    workOrderAlerts: true,
    safetyAlerts: true,
    gateAlerts: false,
    aiAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    marketingEmails: false,
  });

  // Appearance & Accessibility state
  const [accentColor, setAccentColor] = useState<"blue" | "emerald" | "purple">("blue");
  const [fontScale, setFontScale] = useState<"standard" | "comfortable">("standard");
  const [compactDensity, setCompactDensity] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Privacy toggles
  const [privacyState, setPrivacyState] = useState({
    profileVisibility: true,
    locationSharing: true,
    activityStatus: true,
  });

  // Workspace configuration state
  const [workspaceConfig, setWorkspaceConfig] = useState({
    defaultDashboard: "/",
    defaultProject: "P875",
    defaultPeriod: "7d",
    tableSize: "25",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    units: "metric",
    autoRefresh: "15s",
  });

  // Password validation & strength
  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  // Handlers
  const handleSaveAccount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAccountDirty(false);
    toast.success(t("profile.saveSuccess"), {
      description: `${firstName} ${lastName} · ${email}`,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setPasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success(t("profile.security.passwordUpdated"));
  };

  const handleTerminateDevice = (dev: DeviceItem) => {
    setDevices((prev) => prev.filter((d) => d.id !== dev.id));
    toast.success(t("profile.devices.terminatedToast", { device: dev.name }));
  };

  const handleSignOutAll = () => {
    setDevices((prev) => prev.filter((d) => d.isCurrent));
    toast.success(t("profile.security.signOutAllSuccess"));
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    toast.success("All 8 emergency recovery codes copied to clipboard.");
  };

  const handleDownloadCodes = () => {
    const text = `MEDINFRA RECOVERY CODES\nGenerated: ${new Date().toISOString()}\nOperator: Eng. Talish Ahmed\nEmployee ID: EMP-88219\n\n` + recoveryCodes.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mediinfra-recovery-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded mediinfra-recovery-codes.txt");
  };

  const handleDownloadArchive = () => {
    toast.info(t("profile.privacy.downloadDataToast"));
    setTimeout(() => {
      const data = {
        operator: "Eng. Talish Ahmed",
        employeeId: "EMP-88219",
        qid: "QID-28463401928",
        project: "P875 — Hamad General Hospital",
        email: "talish.ahmed@mediinfra.qa",
        securityScore: 100,
        activityScore: 96.8,
        generatedAt: new Date().toISOString(),
        auditTrail: AUDIT_TRAIL,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mediinfra-data-archive-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("GDPR / Qatar PDP Data Archive downloaded.");
    }, 1200);
  };

  const handleUploadPhoto = () => {
    // Generate simulated avatar upload
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setAvatarUrl(reader.result as string);
          toast.success(t("profile.hero.photoUpdated"));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    toast.info(t("profile.hero.photoRemoved"));
  };

  const handleRunAudit = () => {
    toast.loading("Running endpoint security & compliance probe...");
    setTimeout(() => {
      toast.dismiss();
      toast.success(t("profile.quickActions.auditToast"));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-20 text-slate-900 dark:text-slate-100 transition-colors">
      {/* SECTION 1: PAGE HEADER & LIVE SESSION STATUS */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shadow-sm">
                  <UserCog className="size-5 sm:size-6" />
                </span>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {t("profile.headerTitle")}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {t("profile.headerSubtitle")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Metadata & Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Role badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>{role}</span>
              </div>

              {/* Online status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <LivePulse tone="ok" size="sm" />
                <span>{t("profile.onlineStatus")}</span>
              </div>

              {/* Last login timestamp */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="size-3.5" />
                <span>{t("profile.lastLogin")}</span>
              </div>

              {/* Save Changes button */}
              <Button
                onClick={() => handleSaveAccount()}
                size="sm"
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98]"
              >
                <Save className="size-3.5" />
                <span>{t("profile.saveChanges")}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* SECTION 2: PROFILE HERO CARD */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
        >
          {/* Subtle background ambient mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Avatar & Identity details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
              {/* Avatar Container with Upload overlay */}
              <div className="relative group">
                <div className="size-24 sm:size-28 rounded-2xl ring-4 ring-blue-500/20 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Talish Ahmed" className="size-full object-cover" />
                  ) : (
                    <span>TA</span>
                  )}
                </div>

                {/* Upload / Edit overlay button */}
                <button
                  onClick={handleUploadPhoto}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md border-2 border-white dark:border-slate-900 transition-transform active:scale-95 group-hover:scale-105"
                  title={t("profile.hero.uploadPhoto")}
                  aria-label={t("profile.hero.uploadPhoto")}
                >
                  <Camera className="size-3.5" />
                </button>
              </div>

              {/* Name, Title, Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {t("profile.hero.fullName")}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <BadgeCheck className="size-3.5" />
                    <span>{t("profile.hero.statusVal")}</span>
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                  <Briefcase className="size-4 text-blue-600 dark:text-blue-400" />
                  <span>{t("profile.hero.departmentVal")}</span>
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Building className="size-3.5 text-slate-400" />
                    <span>{t("profile.hero.officeVal")}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <HardHat className="size-3.5 text-slate-400" />
                    <span>{t("profile.hero.projectVal")}</span>
                  </span>
                </div>

                {/* Photo Action Links */}
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
                  <button
                    onClick={handleUploadPhoto}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    {t("profile.hero.uploadPhoto")}
                  </button>
                  {avatarUrl && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button
                        onClick={handleRemovePhoto}
                        className="text-red-500 hover:underline font-semibold"
                      >
                        {t("profile.hero.removePhoto")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Scores & High-level KPIs */}
            <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Employee ID Chip */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t("profile.hero.employeeId")}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white">
                    EMP-88219
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("EMP-88219");
                      toast.success("Employee ID copied");
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    title="Copy ID"
                  >
                    <Copy className="size-3" />
                  </button>
                </div>
              </div>

              {/* Activity Index */}
              <div className="p-3.5 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {t("profile.hero.activityScore")}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-300">
                    <AnimatedNumber value={96.8} decimals={1} />%
                  </span>
                </div>
              </div>

              {/* Security Score */}
              <div className="p-3.5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-center col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {t("profile.hero.securityScore")}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300">
                    100<span className="text-xs font-semibold text-emerald-600">/100</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* NAVIGATION TABS FOR EXTENSIVE MODULES */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1.5 bg-slate-200/70 dark:bg-slate-900/80 rounded-2xl border border-slate-300/60 dark:border-slate-800 gap-1">
            <TabsTrigger
              value="overview"
              className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
            >
              {t("profile.account.title")}
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm flex items-center gap-1.5"
            >
              <Lock className="size-3.5" />
              <span>{t("profile.security.title")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm flex items-center gap-1.5"
            >
              <Bell className="size-3.5" />
              <span>{t("profile.notifications.title")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm flex items-center gap-1.5"
            >
              <Sliders className="size-3.5" />
              <span>{t("profile.appearance.title")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="governance"
              className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm flex items-center gap-1.5"
            >
              <Shield className="size-3.5" />
              <span>{t("profile.privacy.title")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm flex items-center gap-1.5"
            >
              <Activity className="size-3.5" />
              <span>{t("profile.activity.title")}</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW & ACCOUNT INFORMATION */}
          <TabsContent value="overview" className="mt-6 space-y-8 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Col 1 & 2: Account Information Form */}
              <div className="lg:col-span-2 space-y-8">
                <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {t("profile.account.title")}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {t("profile.account.subtitle")}
                    </p>
                  </div>

                  <form onSubmit={handleSaveAccount} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          {t("profile.account.firstName")}
                        </label>
                        <Input
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            setAccountDirty(true);
                          }}
                          className="rounded-xl border-slate-200 dark:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          {t("profile.account.lastName")}
                        </label>
                        <Input
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            setAccountDirty(true);
                          }}
                          className="rounded-xl border-slate-200 dark:border-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          {t("profile.hero.email")}
                        </label>
                        <div className="relative">
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setAccountDirty(true);
                            }}
                            className="rounded-xl border-slate-200 dark:border-slate-800 ps-9"
                          />
                          <Mail className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          {t("profile.hero.phone")}
                        </label>
                        <div className="relative">
                          <Input
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setAccountDirty(true);
                            }}
                            className="rounded-xl border-slate-200 dark:border-slate-800 ps-9 font-mono text-xs"
                          />
                          <Phone className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          {t("profile.account.country")}
                        </label>
                        <Input
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            setAccountDirty(true);
                          }}
                          className="rounded-xl border-slate-200 dark:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          {t("profile.account.timeZone")}
                        </label>
                        <Input
                          value={timeZone}
                          onChange={(e) => {
                            setTimeZone(e.target.value);
                            setAccountDirty(true);
                          }}
                          className="rounded-xl border-slate-200 dark:border-slate-800 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        {t("profile.account.office")}
                      </label>
                      <Input
                        value={office}
                        onChange={(e) => {
                          setOffice(e.target.value);
                          setAccountDirty(true);
                        }}
                        className="rounded-xl border-slate-200 dark:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        {t("profile.account.bio")}
                      </label>
                      <Textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => {
                          setBio(e.target.value);
                          setAccountDirty(true);
                        }}
                        className="rounded-xl border-slate-200 dark:border-slate-800 resize-none text-xs sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          {t("profile.account.linkedIn")}
                        </label>
                        <Input
                          value={linkedIn}
                          onChange={(e) => {
                            setLinkedIn(e.target.value);
                            setAccountDirty(true);
                          }}
                          className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          {t("profile.account.employeeNumber")}
                        </label>
                        <Input
                          value={employeeNumber}
                          onChange={(e) => {
                            setEmployeeNumber(e.target.value);
                            setAccountDirty(true);
                          }}
                          className="rounded-xl border-slate-200 dark:border-slate-800 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        {t("profile.account.emergencyContact")}
                      </label>
                      <Input
                        value={emergencyContact}
                        onChange={(e) => {
                          setEmergencyContact(e.target.value);
                          setAccountDirty(true);
                        }}
                        className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500">
                        {accountDirty ? "Unsaved changes detected" : "All fields up to date"}
                      </span>
                      <Button
                        type="submit"
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                      >
                        <Save className="size-4" />
                        <span>{t("profile.account.saveAccountBtn")}</span>
                      </Button>
                    </div>
                  </form>
                </section>
              </div>

              {/* Col 3: Quick Actions & Credentials */}
              <div className="space-y-8">
                {/* SECTION 13: COMMAND QUICK ACTIONS */}
                <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="size-4 text-amber-500" />
                      <span>{t("profile.quickActions.title")}</span>
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => navigate({ to: "/reports-center" })}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-start group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                          <FileBarChart2 className="size-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {t("profile.quickActions.qaReport")}
                          </p>
                          <p className="text-[11px] text-slate-500">Ashghal LR-01 & Board Summary</p>
                        </div>
                      </div>
                      <ExternalLink className="size-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </button>

                    <button
                      onClick={handleDownloadArchive}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-start group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          <FileDown className="size-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {t("profile.quickActions.qaDownload")}
                          </p>
                          <p className="text-[11px] text-slate-500">Security Clearance Dossier (.PDF)</p>
                        </div>
                      </div>
                      <Download className="size-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </button>

                    <button
                      onClick={() => setApiModalOpen(true)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-start group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                          <Key className="size-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {t("profile.quickActions.qaApi")}
                          </p>
                          <p className="text-[11px] text-slate-500">Bearer & Webhook Tokens</p>
                        </div>
                      </div>
                      <Terminal className="size-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    </button>

                    <button
                      onClick={handleRunAudit}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-start group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                          <ShieldCheck className="size-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {t("profile.quickActions.qaAudit")}
                          </p>
                          <p className="text-[11px] text-slate-500">14 Endpoints & Zero Trust Check</p>
                        </div>
                      </div>
                      <Activity className="size-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                    </button>
                  </div>
                </section>

                {/* SECTION 12: ACHIEVEMENTS & CERTIFICATIONS */}
                <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="size-4 text-blue-600" />
                      <span>{t("profile.achievements.title")}</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {t("profile.achievements.ach1Title")}
                        </span>
                        <span className="font-mono">180d</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t("profile.achievements.ach1Desc")}
                      </p>
                      <Progress value={100} className="h-1.5 mt-2 bg-slate-200 dark:bg-slate-700" />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {t("profile.achievements.ach2Title")}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t("profile.achievements.ach2Desc")}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {t("profile.achievements.ach3Title")}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t("profile.achievements.ach3Desc")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>{t("profile.achievements.efficiencyRating")}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono">99.2%</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: SECURITY CENTER & 2FA */}
          <TabsContent value="security" className="mt-6 space-y-8 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Password & Authentication */}
              <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Lock className="size-5 text-blue-600" />
                    <span>{t("profile.security.passwordTitle")}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("profile.security.passwordDesc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Last Updated: 28 days ago
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      ✓ NIST 800-63B Compliant · Multi-Factor Enforced
                    </p>
                  </div>
                  <Button
                    onClick={() => setPasswordDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-300 dark:border-slate-700 font-semibold text-xs"
                  >
                    {t("profile.security.changePasswordBtn")}
                  </Button>
                </div>

                {/* 2FA Card */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Fingerprint className="size-4 text-emerald-600" />
                        <span>{t("profile.security.twoFactorTitle")}</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t("profile.security.twoFactorDesc")}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                      {t("profile.security.twoFactorActive")}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
                        <Smartphone className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Microsoft Authenticator (TOTP)
                        </p>
                        <p className="text-[11px] text-slate-500">iPhone 15 Pro · Added Jan 14, 2024</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setRecoveryModalOpen(true)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-semibold"
                    >
                      {t("profile.security.viewRecoveryBtn")}
                    </Button>
                  </div>
                </div>

                {/* Session Timeout */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {t("profile.security.sessionTimeoutTitle")}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.security.sessionTimeoutDesc")}
                      </p>
                    </div>
                    <Select defaultValue="30m">
                      <SelectTrigger className="w-32 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="15m">15 Minutes</SelectItem>
                        <SelectItem value="30m">30 Minutes</SelectItem>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="4h">4 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Sign Out All Sessions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Revoke Other Device Sessions
                    </p>
                    <p className="text-[11px] text-slate-500">
                      2 remote active sessions detected (iPad & iPhone)
                    </p>
                  </div>
                  <Button
                    onClick={handleSignOutAll}
                    variant="destructive"
                    size="sm"
                    className="rounded-xl text-xs font-semibold"
                  >
                    {t("profile.security.signOutAllBtn")}
                  </Button>
                </div>
              </section>

              {/* SECTION 10: CONNECTED DEVICES */}
              <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Laptop className="size-5 text-blue-600" />
                    <span>{t("profile.devices.title")}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("profile.devices.subtitle")}
                  </p>
                </div>

                <div className="space-y-4">
                  {devices.map((dev) => (
                    <div
                      key={dev.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                        dev.isCurrent
                          ? "border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={cn(
                            "p-2.5 rounded-xl shrink-0 mt-0.5",
                            dev.type === "desktop"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                              : dev.type === "tablet"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
                          )}
                        >
                          {dev.type === "desktop" ? (
                            <Laptop className="size-4" />
                          ) : dev.type === "tablet" ? (
                            <Tablet className="size-4" />
                          ) : (
                            <Smartphone className="size-4" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {dev.name}
                            </span>
                            {dev.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                                {t("profile.devices.currentDevice")}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {dev.platform}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>{dev.ip}</span>
                            <span>•</span>
                            <span>{dev.location}</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                              {dev.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!dev.isCurrent && (
                        <Button
                          onClick={() => handleTerminateDevice(dev)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold self-end sm:self-center"
                        >
                          {t("profile.devices.terminateBtn")}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>

          {/* TAB 3: NOTIFICATIONS & DISPATCH */}
          <TabsContent value="notifications" className="mt-6 space-y-8 focus-visible:outline-none">
            <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-8">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="size-5 text-blue-600" />
                  <span>{t("profile.notifications.title")}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t("profile.notifications.subtitle")}
                </p>
              </div>

              {/* Group 1: Telemetry & Life Safety Alerts */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Life Safety & Command Dispatch
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Siren className="size-4 text-red-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {t("profile.notifications.musterAlerts")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.musterAlertsDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.musterAlerts}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, musterAlerts: val }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="size-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {t("profile.notifications.safetyAlerts")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.safetyAlertsDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.safetyAlerts}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, safetyAlerts: val }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <ScanLine className="size-4 text-blue-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {t("profile.notifications.gateAlerts")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.gateAlertsDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.gateAlerts}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, gateAlerts: val }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-purple-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {t("profile.notifications.aiAlerts")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.aiAlertsDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.aiAlerts}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, aiAlerts: val }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Channel Delivery */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Dispatch Communication Channels
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {t("profile.notifications.emailNotif")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.emailNotifDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.emailNotif}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, emailNotif: val }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Radio className="size-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {t("profile.notifications.pushNotif")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.pushNotifDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.pushNotif}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, pushNotif: val }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="size-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {t("profile.notifications.smsNotif")}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.smsNotifDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.smsNotif}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, smsNotif: val }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Periodic Executive Dossiers */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Automated Dossier Delivery
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {t("profile.notifications.weeklyReports")}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.weeklyReportsDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.weeklyReports}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, weeklyReports: val }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {t("profile.notifications.monthlyReports")}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.monthlyReportsDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.monthlyReports}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, monthlyReports: val }))
                      }
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {t("profile.notifications.marketingEmails")}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.notifications.marketingEmailsDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={notifState.marketingEmails}
                      onCheckedChange={(val) =>
                        setNotifState((p) => ({ ...p, marketingEmails: val }))
                      }
                    />
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* TAB 4: APPEARANCE & LOCALIZATION */}
          <TabsContent value="preferences" className="mt-6 space-y-8 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SECTION 6: APPEARANCE & ACCESSIBILITY */}
              <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sun className="size-5 text-amber-500" />
                    <span>{t("profile.appearance.title")}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("profile.appearance.subtitle")}
                  </p>
                </div>

                {/* Theme Mode Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("profile.appearance.theme")}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (theme !== "light") toggleTheme();
                      }}
                      className={cn(
                        "p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all",
                        theme === "light"
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ring-2 ring-blue-500/20"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <Sun className="size-4 text-amber-500" />
                      <span>{t("profile.appearance.themeLight")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (theme !== "dark") toggleTheme();
                      }}
                      className={cn(
                        "p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all",
                        theme === "dark"
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ring-2 ring-blue-500/20"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <Moon className="size-4 text-indigo-400" />
                      <span>{t("profile.appearance.themeDark")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toast.info("System theme synchronized");
                      }}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-all col-span-2 sm:col-span-1"
                    >
                      <Laptop className="size-4 text-slate-400" />
                      <span>{t("profile.appearance.themeSystem")}</span>
                    </button>
                  </div>
                </div>

                {/* Accent Color Palette */}
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("profile.appearance.accentColor")}
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAccentColor("blue")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                        accentColor === "blue"
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <span className="size-3 rounded-full bg-[#2563EB]" />
                      <span>{t("profile.appearance.accentBlue")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccentColor("emerald")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                        accentColor === "emerald"
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <span className="size-3 rounded-full bg-[#10B981]" />
                      <span>{t("profile.appearance.accentEmerald")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccentColor("purple")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                        accentColor === "purple"
                          ? "border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <span className="size-3 rounded-full bg-[#7C3AED]" />
                      <span>{t("profile.appearance.accentPurple")}</span>
                    </button>
                  </div>
                </div>

                {/* Density & Motion Switches */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {t("profile.appearance.compactMode")}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.appearance.compactModeDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={compactDensity}
                      onCheckedChange={(val) => {
                        setCompactDensity(val);
                        toast.info(val ? "Compact density enabled" : "Standard density restored");
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {t("profile.appearance.reducedMotion")}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {t("profile.appearance.reducedMotionDesc")}
                      </p>
                    </div>
                    <Switch
                      checked={reducedMotion}
                      onCheckedChange={(val) => {
                        setReducedMotion(val);
                        toast.info(val ? "Reduced motion active" : "Full animations active");
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 7: LANGUAGE & REGIONAL GOVERNANCE */}
              <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="size-5 text-blue-600" />
                    <span>{t("profile.language.title")}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("profile.language.subtitle")}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("profile.language.selectLanguage")}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (lang !== "en") {
                          setLang("en");
                          toast.success(t("profile.language.langSwitched"));
                        }
                      }}
                      className={cn(
                        "p-4 rounded-2xl border text-start transition-all",
                        lang === "en"
                          ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          English (US / UK)
                        </span>
                        {lang === "en" && <Check className="size-4 text-blue-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Left-to-Right layout · Standard International
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (lang !== "ar") {
                          setLang("ar");
                          toast.success(t("profile.language.langSwitched"));
                        }
                      }}
                      className={cn(
                        "p-4 rounded-2xl border text-start transition-all",
                        lang === "ar"
                          ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          العربية (قطر وأشغال)
                        </span>
                        {lang === "ar" && <Check className="size-4 text-blue-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        تخطيط من اليمين إلى اليسار · معتمد رسمياً
                      </p>
                    </button>
                  </div>
                </div>

                {/* SECTION 9: OPERATIONAL WORKSPACE SETTINGS */}
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t("profile.workspace.title")}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        {t("profile.workspace.defaultDashboard")}
                      </label>
                      <Select
                        value={workspaceConfig.defaultDashboard}
                        onValueChange={(val) =>
                          setWorkspaceConfig((p) => ({ ...p, defaultDashboard: val }))
                        }
                      >
                        <SelectTrigger className="rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="/">Command Center (Live)</SelectItem>
                          <SelectItem value="/gates">Gate Telemetry</SelectItem>
                          <SelectItem value="/digital-twin">3D Digital Twin</SelectItem>
                          <SelectItem value="/reports-center">Reports & Analytics Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        {t("profile.workspace.autoRefresh")}
                      </label>
                      <Select
                        value={workspaceConfig.autoRefresh}
                        onValueChange={(val) =>
                          setWorkspaceConfig((p) => ({ ...p, autoRefresh: val }))
                        }
                      >
                        <SelectTrigger className="rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="5s">Every 5 seconds</SelectItem>
                          <SelectItem value="15s">Every 15 seconds (Standard)</SelectItem>
                          <SelectItem value="30s">Every 30 seconds</SelectItem>
                          <SelectItem value="60s">Every 1 minute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        {t("profile.workspace.dateFormat")}
                      </label>
                      <Select
                        value={workspaceConfig.dateFormat}
                        onValueChange={(val) =>
                          setWorkspaceConfig((p) => ({ ...p, dateFormat: val }))
                        }
                      >
                        <SelectTrigger className="rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (UK / Qatar)</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO-8601)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        {t("profile.workspace.units")}
                      </label>
                      <Select
                        value={workspaceConfig.units}
                        onValueChange={(val) =>
                          setWorkspaceConfig((p) => ({ ...p, units: val }))
                        }
                      >
                        <SelectTrigger className="rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="metric">Metric (SI · °C, m, Pa)</SelectItem>
                          <SelectItem value="imperial">Imperial (°F, ft, psi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>

          {/* TAB 5: PRIVACY & DATA GOVERNANCE */}
          <TabsContent value="governance" className="mt-6 space-y-8 focus-visible:outline-none">
            <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-8">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <span>{t("profile.privacy.title")}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t("profile.privacy.subtitle")}
                </p>
              </div>

              {/* Switches */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {t("profile.privacy.profileVisibility")}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {t("profile.privacy.profileVisibilityDesc")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-semibold text-emerald-600">Active</span>
                    <Switch
                      checked={privacyState.profileVisibility}
                      onCheckedChange={(val) =>
                        setPrivacyState((p) => ({ ...p, profileVisibility: val }))
                      }
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {t("profile.privacy.locationSharing")}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {t("profile.privacy.locationSharingDesc")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-semibold text-emerald-600">Active</span>
                    <Switch
                      checked={privacyState.locationSharing}
                      onCheckedChange={(val) =>
                        setPrivacyState((p) => ({ ...p, locationSharing: val }))
                      }
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {t("profile.privacy.activityStatus")}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {t("profile.privacy.activityStatusDesc")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-semibold text-emerald-600">Active</span>
                    <Switch
                      checked={privacyState.activityStatus}
                      onCheckedChange={(val) =>
                        setPrivacyState((p) => ({ ...p, activityStatus: val }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Data Archive Download Banner */}
              <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
                    <Download className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Export Comprehensive Personal & Security Dossier
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Compliant with State of Qatar Law No. 13 of 2016 (Personal Data Protection) & GDPR.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleDownloadArchive}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shrink-0"
                >
                  {t("profile.privacy.downloadDataBtn")}
                </Button>
              </div>

              {/* Danger Zone: Decommissioning */}
              <div className="p-6 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/10 space-y-3">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="size-5" />
                  <h4 className="text-sm font-bold">
                    {t("profile.privacy.deleteAccountBtn")}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t("profile.privacy.deleteAccountDesc")}
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => setDecommissionModalOpen(true)}
                    variant="destructive"
                    size="sm"
                    className="rounded-xl text-xs font-semibold"
                  >
                    {t("profile.privacy.deleteAccountBtn")}
                  </Button>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* TAB 6: AUDIT TRAIL & ACTIVITY LOG */}
          <TabsContent value="audit" className="mt-6 space-y-8 focus-visible:outline-none">
            {/* SECTION 11: RECENT OPERATOR AUDIT TRAIL */}
            <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="size-5 text-blue-600" />
                    <span>{t("profile.activity.title")}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t("profile.activity.subtitle")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Dot tone="ok" />
                    <span>Immutable Ledger</span>
                  </span>
                </div>
              </div>

              <div className="relative border-s border-slate-200 dark:border-slate-800 ms-4 ps-6 space-y-6">
                {AUDIT_TRAIL.map((audit) => (
                  <div key={audit.id} className="relative group">
                    {/* Dot on line */}
                    <span
                      className={cn(
                        "absolute -left-[31px] top-1 size-3 rounded-full ring-4 ring-white dark:ring-slate-900",
                        audit.status === "verified"
                          ? "bg-blue-600"
                          : audit.status === "warning"
                            ? "bg-amber-500"
                            : "bg-emerald-600",
                      )}
                    />

                    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {t(`profile.activity.${audit.key}`)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          <span>{audit.device}</span>
                          <span>•</span>
                          <span>{audit.ip}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono self-start sm:self-center">
                        <Clock className="size-3.5" />
                        <span>{audit.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* SECTION 14: SUPPORT & KNOWLEDGE BASE HUB */}
        <section className="rounded-3xl border border-blue-200/80 dark:border-blue-900/40 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {t("profile.support.title")}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100">
                {t("profile.support.subtitle")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="rounded-xl font-semibold text-xs shadow-sm bg-white text-blue-900 hover:bg-blue-50"
              >
                <a href="mailto:ops@mediinfra.qa">
                  <Mail className="size-3.5 mr-1.5" />
                  <span>{t("profile.support.btnSupport")}</span>
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl font-semibold text-xs border-white/30 text-white hover:bg-white/10"
              >
                <Link to="/knowledge">
                  <BookOpen className="size-3.5 mr-1.5" />
                  <span>{t("profile.support.btnKnowledge")}</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* DIALOG 1: CHANGE PASSWORD MODAL */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Lock className="size-5 text-blue-600" />
              <span>{t("profile.security.changePasswordBtn")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enforce NIST SP 800-63B standards: 8+ characters, symbols, numbers, and uppercase.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                {t("profile.security.currentPassword")}
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                {t("profile.security.newPassword")}
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="rounded-xl"
              />

              {/* Password strength meter */}
              {newPassword && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span>Password Strength</span>
                    <span
                      className={
                        passwordStrength === 4
                          ? "text-emerald-600"
                          : passwordStrength >= 2
                            ? "text-amber-500"
                            : "text-red-500"
                      }
                    >
                      {passwordStrength === 4
                        ? "Excellent (Score 4/4)"
                        : passwordStrength >= 2
                          ? "Moderate"
                          : "Weak"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <span
                        key={step}
                        className={cn(
                          "h-full flex-1 rounded-full transition-colors",
                          step <= passwordStrength
                            ? passwordStrength === 4
                              ? "bg-emerald-500"
                              : passwordStrength >= 2
                                ? "bg-amber-500"
                                : "bg-red-500"
                            : "bg-transparent",
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                {t("profile.security.confirmPassword")}
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                <span>{showPassword ? "Hide characters" : "Show characters"}</span>
              </button>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordDialogOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Save New Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: RECOVERY CODES MODAL */}
      <Dialog open={recoveryModalOpen} onOpenChange={setRecoveryModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-600" />
              <span>{t("profile.security.recoveryCodesTitle")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("profile.security.recoveryCodesDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-2.5 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-center">
            {recoveryCodes.map((c, i) => (
              <div key={i} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                {c}
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2 flex-col sm:flex-row gap-2">
            <Button
              onClick={handleCopyCodes}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              <Copy className="size-3.5" />
              <span>{t("profile.security.copyCodes")}</span>
            </Button>
            <Button
              onClick={handleDownloadCodes}
              size="sm"
              className="rounded-xl text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="size-3.5" />
              <span>{t("profile.security.downloadCodes")}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: API DEVELOPER TOKEN MODAL */}
      <Dialog open={apiModalOpen} onOpenChange={setApiModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Terminal className="size-5 text-purple-600" />
              <span>Developer API Tokens & Bearer Credentials</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Use these tokens to programmatically stream MQTT gate telemetry or ingest Ashghal work orders.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Active Production Bearer Token
              </label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value="mi_live_sec_99a81f3e82014cd7ba619082dae0"
                  className="rounded-xl font-mono text-xs bg-slate-50 dark:bg-slate-900"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText("mi_live_sec_99a81f3e82014cd7ba619082dae0");
                    setCopiedToken(true);
                    toast.success("API Token copied to clipboard");
                    setTimeout(() => setCopiedToken(false), 2000);
                  }}
                  size="sm"
                  variant="outline"
                  className="rounded-xl shrink-0"
                >
                  {copiedToken ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-bold">Security Notice:</p>
              <p>
                Tokens have full read/write permissions across Hamad Hospital Retrofit P875 turnstiles.
                Keep tokens in secure vaults (Azure Key Vault / HashiCorp Vault).
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              onClick={() => setApiModalOpen(false)}
              className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: DECOMMISSION OPERATOR CONFIRMATION */}
      <Dialog open={decommissionModalOpen} onOpenChange={setDecommissionModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" />
              <span>{t("profile.privacy.deleteModalTitle")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("profile.privacy.deleteModalDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-xs text-red-800 dark:text-red-300 space-y-2">
            <p className="font-bold">Permanent Impact:</p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Physical RFID turnstile access will be revoked immediately.</li>
              <li>Active sessions across all 3 terminals will be forcefully terminated.</li>
              <li>A security incident report will be transmitted to Ashghal Operations.</li>
            </ul>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              variant="outline"
              onClick={() => setDecommissionModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDecommissionModalOpen(false);
                toast.error("Decommissioning request submitted to Ashghal Security Operations.");
              }}
              className="rounded-xl font-semibold"
            >
              Confirm Decommissioning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
