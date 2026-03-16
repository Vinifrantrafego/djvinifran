"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface AmbientPlayerProps {
  src: string
  className?: string
}

export function AmbientPlayer({ src, className }: AmbientPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [hasChosen, setHasChosen] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Ajusta o volume para 6.5 (escala de 0.0 a 1.0)
    audio.volume = 0.65
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }, [playing])

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />

      {/* ── Pop-up Inicial de Confirmação de Áudio ── */}
      {!hasChosen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="max-w-md w-full flex flex-col items-center gap-8">
            <h2 className="text-white text-lg tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-inter)" }}>
              Experiência Sonora
            </h2>
            <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              Este site foi desenhado com uma trilha sonora para uma experiência imersiva. Deseja iniciar com o áudio ativado?
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-4">
              <button
                onClick={() => {
                  setPlaying(true)
                  setHasChosen(true)
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-full border border-white/20 bg-white/10 text-white text-xs tracking-[0.15em] uppercase hover:bg-white/20 transition-all duration-300"
              >
                Entrar com Som
              </button>
              <button
                onClick={() => {
                  setPlaying(false)
                  setHasChosen(true)
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-full border border-transparent text-white/50 text-xs tracking-[0.15em] uppercase hover:text-white transition-all duration-300"
              >
                Mudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante de controle do Player */}
      <button
        onClick={() => setPlaying((prev) => !prev)}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        className={cn(
          "fixed bottom-6 right-6 z-20",
          "flex items-center justify-center",
          "w-12 h-12 rounded-full",
          "bg-white/10 border border-white/20",
          "text-white backdrop-blur-sm",
          "transition-all duration-300",
          "hover:bg-white/20 hover:scale-110",
          playing && "shadow-[0_0_20px_rgba(255,255,255,0.15)]",
          className
        )}
      >
        {playing ? (
          <Pause className="w-4 h-4 fill-white stroke-none" />
        ) : (
          <Play className="w-4 h-4 fill-white stroke-none translate-x-px" />
        )}
      </button>
    </>
  )
}
