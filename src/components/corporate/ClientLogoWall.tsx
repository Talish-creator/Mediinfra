import { useTranslation } from "react-i18next";
import { Building2, Landmark, Shield, Sparkles } from "lucide-react";

export function ClientLogoWall() {
  const { t } = useTranslation();

  const clients = [
    { name: "ASHGHAL", sub: "Public Works Authority", country: "Qatar" },
    { name: "HAMAD MEDICAL CORP", sub: "Premier Healthcare Provider", country: "Qatar" },
    { name: "MINISTRY OF PUBLIC HEALTH", sub: "State Regulatory Authority", country: "Qatar" },
    { name: "SIEMENS HEALTHINEERS", sub: "Global Medical Infrastructure", country: "International" },
    { name: "HONEYWELL FORGE", sub: "Building Technologies", country: "Global" },
    { name: "MIDMAC CONTRACTING", sub: "Tier-1 Healthcare EPC", country: "Qatar" },
    { name: "CONSOLIDATED CONTRACTORS", sub: "CCC Mega-Projects", country: "Middle East" },
    { name: "QATARI DIAR", sub: "Real Estate Investment", country: "Lusail" },
  ];

  return (
    <section className="py-14 sm:py-16 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-1.5">
          <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
            {t("corporate.customers.title")}
          </p>
        </div>

        {/* Logo Wall Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 items-center">
          {clients.map((c, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-700 transition-all group flex flex-col items-center justify-center min-h-[72px]"
            >
              <span className="text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {c.name}
              </span>
              <span className="text-[9px] text-slate-400 truncate max-w-full">
                {c.country}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
