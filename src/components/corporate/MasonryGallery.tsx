import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  Expand,
  ExternalLink,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function MasonryGallery() {
  const { t } = useTranslation();
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; desc: string } | null>(null);

  const galleryItems = [
    {
      id: "gal-1",
      src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85",
      titleKey: "corporate.gallery.img1Title",
      descKey: "corporate.gallery.img1Desc",
      aspect: "aspect-[4/5]",
    },
    {
      id: "gal-2",
      src: "/corporate/enterprise_digital_twin_upgraded.png",
      titleKey: "corporate.gallery.img2Title",
      descKey: "corporate.gallery.img2Desc",
      aspect: "aspect-[16/10]",
    },
    {
      id: "gal-3",
      src: "/corporate/enterprise_gates_upgraded.png",
      titleKey: "corporate.gallery.img3Title",
      descKey: "corporate.gallery.img3Desc",
      aspect: "aspect-[16/10]",
    },
    {
      id: "gal-4",
      src: "/corporate/enterprise_safety_ai.png",
      titleKey: "corporate.gallery.img4Title",
      descKey: "corporate.gallery.img4Desc",
      aspect: "aspect-[4/5]",
    },
    {
      id: "gal-5",
      src: "/corporate/enterprise_command_center.png",
      titleKey: "corporate.gallery.img5Title",
      descKey: "corporate.gallery.img5Desc",
      aspect: "aspect-[16/10]",
    },
    {
      id: "gal-6",
      src: "/corporate/enterprise_muster_upgraded.png",
      titleKey: "corporate.gallery.img6Title",
      descKey: "corporate.gallery.img6Desc",
      aspect: "aspect-[16/10]",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900">
            <Camera className="size-3.5" />
            <span>{t("corporate.gallery.sectionTitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Healthcare Infrastructure in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("corporate.gallery.sectionSubtitle")}
          </p>
        </div>

        {/* Responsive Masonry / Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className={`relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800/80 bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer ${item.aspect}`}
              onClick={() =>
                setLightboxImg({
                  src: item.src,
                  title: t(item.titleKey),
                  desc: t(item.descKey),
                })
              }
            >
              <img
                src={item.src}
                alt={t(item.titleKey)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Hover Overlay with expand icon & titles */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="self-end p-2.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                  <Expand className="size-4" />
                </div>
                <div className="space-y-1 text-white">
                  <h3 className="text-base font-bold">{t(item.titleKey)}</h3>
                  <p className="text-xs text-slate-300">{t(item.descKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxImg} onOpenChange={(open) => !open && setLightboxImg(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden rounded-3xl bg-slate-950 border-slate-800 text-white">
          {lightboxImg && (
            <div className="space-y-4 p-4 sm:p-6">
              <div className="rounded-2xl overflow-hidden max-h-[70vh] bg-black">
                <img
                  src={lightboxImg.src}
                  alt={lightboxImg.title}
                  className="w-full h-full object-contain mx-auto"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">{lightboxImg.title}</h3>
                <p className="text-xs text-slate-400">{lightboxImg.desc}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
