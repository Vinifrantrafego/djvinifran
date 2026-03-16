"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── TROQUE os IDs do YouTube pelos seus vídeos reais ─────────────────────────
const VIDEOS = [
  { id: "dQw4w9WgXcQ", label: "deep house" },    // TODO: substituir pelo seu vídeo
  { id: "jfKfPfyJRdk", label: "lofi beats" },    // TODO: substituir pelo seu vídeo
  { id: "5qap5aO4i9A", label: "techno"     },    // TODO: substituir pelo seu vídeo
]
// ─────────────────────────────────────────────────────────────────────────────

function youtubeEmbedUrl(id: string) {
  return (
    `https://www.youtube.com/embed/${id}` +
    `?rel=0&modestbranding=1&controls=1&color=white`
  )
}

export function VideoSection() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number>(0)

  const prev = () => setCurrent(i => (i - 1 + VIDEOS.length) % VIDEOS.length)
  const next = () => setCurrent(i => (i + 1) % VIDEOS.length)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx > 50) prev()
    else if (dx < -50) next()
  }

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Slides ── */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {VIDEOS.map((video, i) => (
          <div key={video.id + i} className="relative flex-shrink-0 w-full h-full">
            <iframe
              src={youtubeEmbedUrl(video.id)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              title={video.label}
            />
          </div>
        ))}
      </div>

      {/* ── Label do tema (canto superior esquerdo) ── */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <span
          className="text-white/40 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {VIDEOS[current].label}
        </span>
      </div>

      {/* ── Contador (canto superior direito) ── */}
      <div className="absolute top-8 right-8 z-10 pointer-events-none">
        <span
          className="text-white/25 text-xs tracking-[0.2em]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {String(current + 1).padStart(2, "0")} / {String(VIDEOS.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Seta esquerda ── */}
      <button
        onClick={prev}
        aria-label="Vídeo anterior"
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10",
          "flex items-center justify-center",
          "w-10 h-10 rounded-full",
          "bg-white/5 border border-white/10",
          "text-white/50 hover:text-white hover:bg-white/10",
          "transition-all duration-200",
          "backdrop-blur-sm",
        )}
      >
        <ChevronLeft size={20} />
      </button>

      {/* ── Seta direita ── */}
      <button
        onClick={next}
        aria-label="Próximo vídeo"
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10",
          "flex items-center justify-center",
          "w-10 h-10 rounded-full",
          "bg-white/5 border border-white/10",
          "text-white/50 hover:text-white hover:bg-white/10",
          "transition-all duration-200",
          "backdrop-blur-sm",
        )}
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Dots (indicadores de posição) ── */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {VIDEOS.map((video, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir para ${video.label}`}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current
                ? "w-6 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50",
            )}
          />
        ))}
      </div>
    </div>
  )
}
