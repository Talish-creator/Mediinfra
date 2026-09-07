import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  HardHat,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface DemoBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoBookingModal({ open, onOpenChange }: DemoBookingModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [scope, setScope] = useState("");
  const [inquiryType, setInquiryType] = useState("hospital");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please provide your name and email address.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onOpenChange(false);
      toast.success(t("corporate.contact.successToast"));
      setName("");
      setEmail("");
      setPhone("");
      setOrg("");
      setScope("");
      setNotes("");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 w-fit">
            <Sparkles className="size-3.5" />
            <span>CONFIDENTIAL ARCHITECTURAL BRIEFING</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("corporate.nav.bookDemo")}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t("corporate.contact.sectionSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
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
                  className="rounded-xl ps-9 text-xs"
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
                  className="rounded-xl ps-9 text-xs"
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
                  className="rounded-xl ps-9 text-xs font-mono"
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
                  className="rounded-xl ps-9 text-xs"
                />
                <Building className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {t("corporate.contact.inquiryType")}
              </label>
              <Select value={inquiryType} onValueChange={setInquiryType}>
                <SelectTrigger className="rounded-xl text-xs">
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
                {t("corporate.contact.projectScope")}
              </label>
              <Input
                placeholder="e.g. 650 Beds · 4 Levels"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {t("corporate.contact.message")}
            </label>
            <Textarea
              rows={3}
              placeholder="Outline specific cleanroom segregation, RFID turnstile counts, or Civil Defence muster integration..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl text-xs resize-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
            <span>Encrypted under Qatar PDP Law No. 13. Direct response within 4 hours.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-2"
            >
              <Send className="size-3.5" />
              <span>{submitting ? "Transmitting..." : t("corporate.contact.submitBtn")}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
