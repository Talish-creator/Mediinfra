import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Sparkles,
  Radio,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoModal({ open, onOpenChange }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden rounded-3xl bg-slate-950 border-slate-800 text-white shadow-2xl">
        <div className="relative aspect-video w-full bg-slate-900 flex flex-col justify-between p-6 overflow-hidden">
          {/* Background simulated high-tech operational loop */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=85')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80" />

          {/* Top HUD Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold">
                LIVE TELEMETRY BROADCAST · DOHA HOSPITAL EXPANSION
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
              4K 60FPS · H.265 ENCRYPTED
            </span>
          </div>

          {/* Center Interactive Reel Simulation */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="size-20 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl ring-8 ring-blue-500/30 transition-all hover:scale-110 active:scale-95"
            >
              {isPlaying ? <Pause className="size-8" /> : <Play className="size-8 ml-1" />}
            </button>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                MediInfra Architectural & Safety Operations Reel
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Comprehensive walkthrough of Hamad Hospital Retrofit P875: UHF RFID turnstiles, 3D BIM spatial tracking, and NVIDIA Jetson edge vision.
              </p>
            </div>
          </div>

          {/* Bottom HUD Controls */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
              <span>03:42 / 05:18</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>Certified Ashghal LR-01 Demonstration</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
