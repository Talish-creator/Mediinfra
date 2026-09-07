import { useTranslation } from "react-i18next";
import { HelpCircle, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function CorporateFaq() {
  const { t } = useTranslation();

  const faqs = [
    {
      q: t("corporate.faq.q1"),
      a: t("corporate.faq.a1"),
    },
    {
      q: t("corporate.faq.q2"),
      a: t("corporate.faq.a2"),
    },
    {
      q: t("corporate.faq.q3"),
      a: t("corporate.faq.a3"),
    },
    {
      q: t("corporate.faq.q4"),
      a: t("corporate.faq.a4"),
    },
    {
      q: t("corporate.faq.q5"),
      a: t("corporate.faq.a5"),
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <HelpCircle className="size-3.5" />
            <span>{t("corporate.faq.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.faq.sectionSubtitle")}
          </p>
        </div>

        {/* Modern Accordion */}
        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-6 py-2 shadow-xs transition-colors"
            >
              <AccordionTrigger className="text-sm sm:text-base font-bold text-slate-900 dark:text-white text-start hover:no-underline py-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pb-4 pt-1">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
