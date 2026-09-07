import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Building,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactSection() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [inquiry, setInquiry] = useState("hospital");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please enter your name and official email address.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(t("corporate.contact.successToast"));
      setName("");
      setEmail("");
      setPhone("");
      setOrg("");
      setMsg("");
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <Mail className="size-3.5" />
            <span>{t("corporate.contact.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Schedule a Confidential Executive Briefing
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.contact.sectionSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 p-6 sm:p-10 shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t("corporate.contact.fullName")} *
                  </label>
                  <div className="relative">
                    <Input
                      required
                      placeholder="Eng. Mansoor Al-Sulaiti"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-xl ps-9 text-xs bg-white dark:bg-slate-900"
                    />
                    <User className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t("corporate.contact.email")} *
                  </label>
                  <div className="relative">
                    <Input
                      required
                      type="email"
                      placeholder="m.alsulaiti@hmc.org.qa"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl ps-9 text-xs bg-white dark:bg-slate-900"
                    />
                    <Mail className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t("corporate.contact.phone")}
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="+974 4400 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl ps-9 text-xs font-mono bg-white dark:bg-slate-900"
                    />
                    <Phone className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t("corporate.contact.organization")}
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Hamad Medical Corp / Ashghal"
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      className="rounded-xl ps-9 text-xs bg-white dark:bg-slate-900"
                    />
                    <Building className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t("corporate.contact.inquiryType")}
                </label>
                <Select value={inquiry} onValueChange={setInquiry}>
                  <SelectTrigger className="rounded-xl text-xs bg-white dark:bg-slate-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="hospital">{t("corporate.contact.inquiryOpt1")}</SelectItem>
                    <SelectItem value="retrofit">{t("corporate.contact.inquiryOpt2")}</SelectItem>
                    <SelectItem value="authority">{t("corporate.contact.inquiryOpt3")}</SelectItem>
                    <SelectItem value="contractor">{t("corporate.contact.inquiryOpt4")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t("corporate.contact.message")}
                </label>
                <Textarea
                  rows={4}
                  placeholder="Outline facility parameters, bed count, cleanroom containment requirements, or turnstile portal counts..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="rounded-xl text-xs resize-none bg-white dark:bg-slate-900"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>NDA protected. Direct response within 4 hours from senior Doha engineering team.</span>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 gap-2"
              >
                <Send className="size-3.5" />
                <span>{submitting ? "Transmitting..." : t("corporate.contact.submitBtn")}</span>
              </Button>
            </form>
          </div>

          {/* Right Column: Office Info & Visual Map Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Doha Map Frame */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-900 overflow-hidden shadow-md relative aspect-[16/10]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Pulsing Pin Indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="size-8 rounded-full bg-blue-500/40 animate-ping absolute" />
                  <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <Building className="size-4" />
                  </div>
                </div>
                <span className="mt-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/90 text-white border border-white/20 shadow-md">
                  West Bay HQ · Doha, Qatar
                </span>
              </div>
            </div>

            {/* Headquarters details */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t("corporate.contact.dohaOfficeTitle")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                  <MapPin className="size-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{t("corporate.contact.dohaOfficeAddr")}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="size-3.5 text-blue-600" />
                  <span className="font-mono">{t("corporate.contact.dohaPhone")}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="size-3.5 text-blue-600" />
                  <span>{t("corporate.contact.dohaEmail")}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("corporate.contact.regionalHubsTitle")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("corporate.contact.regionalHubsVal")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
