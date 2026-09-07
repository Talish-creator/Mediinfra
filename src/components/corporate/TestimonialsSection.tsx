import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Building2,
  HeartHandshake,
  MessageSquare,
  Quote,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: "t1",
      quote: t("corporate.testimonials.t1Quote"),
      author: t("corporate.testimonials.t1Author"),
      role: t("corporate.testimonials.t1Role"),
      org: t("corporate.testimonials.t1Org"),
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      sector: "HEALTHCARE AUTHORITY",
    },
    {
      id: "t2",
      quote: t("corporate.testimonials.t2Quote"),
      author: t("corporate.testimonials.t2Author"),
      role: t("corporate.testimonials.t2Role"),
      org: t("corporate.testimonials.t2Org"),
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      sector: "GOVERNMENT INFRASTRUCTURE",
    },
    {
      id: "t3",
      quote: t("corporate.testimonials.t3Quote"),
      author: t("corporate.testimonials.t3Author"),
      role: t("corporate.testimonials.t3Role"),
      org: t("corporate.testimonials.t3Org"),
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      sector: "TIER-1 EPC CONSORTIUM",
    },
  ];

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            <MessageSquare className="size-3.5" />
            <span>{t("corporate.testimonials.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Endorsed by Clinical & Infrastructure Leaders
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.testimonials.sectionSubtitle")}
          </p>
        </div>

        {/* 3 Executive Quote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-xl transition-all group"
            >
              <div className="space-y-4">
                <Quote className="size-8 text-blue-600/30 group-hover:text-blue-600 transition-colors" />
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                <img
                  src={item.photo}
                  alt={item.author}
                  className="size-12 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.author}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {item.role}
                  </p>
                  <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    {item.org}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
