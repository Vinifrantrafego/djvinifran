"use client"

import { useEffect, useRef } from "react"
import { WebGLShader } from "@/components/ui/web-gl-shader"

const WAVE_PERIOD_S = 10.5

// ─── ESTILOS MUSICAIS FLUTUANTES ─────────────────────────────────────────────
const GENRES = [
  { label: "Halftime",          x:  7, y: 10, sx: 0.12, sy: 0.09, ax: 3, ay: 5, phase: 0.0, fontSize: 13 },
  { label: "Glitch Hop",        x: 58, y:  6, sx: 0.09, sy: 0.13, ax: 4, ay: 3, phase: 1.1, fontSize: 11 },
  { label: "IDM",               x: 83, y: 13, sx: 0.15, sy: 0.10, ax: 2, ay: 4, phase: 0.4, fontSize: 22 },
  { label: "Psydub",            x:  4, y: 38, sx: 0.07, sy: 0.14, ax: 3, ay: 5, phase: 4.2, fontSize: 11 },
  { label: "Neurohop",          x: 74, y: 32, sx: 0.14, sy: 0.08, ax: 2, ay: 6, phase: 2.3, fontSize: 14 },
  { label: "Jazz House",        x: 36, y: 44, sx: 0.08, sy: 0.11, ax: 4, ay: 4, phase: 3.0, fontSize: 13 },
  { label: "House",             x: 18, y: 55, sx: 0.13, sy: 0.07, ax: 5, ay: 4, phase: 1.9, fontSize: 18 },
  { label: "Swing Jazz",        x: 20, y: 22, sx: 0.10, sy: 0.09, ax: 3, ay: 3, phase: 1.7, fontSize: 11 },
  { label: "Hip Hop",           x: 48, y: 18, sx: 0.11, sy: 0.13, ax: 3, ay: 5, phase: 3.6, fontSize: 16 },
  { label: "Lo-fi",             x: 78, y: 56, sx: 0.06, sy: 0.12, ax: 2, ay: 5, phase: 2.8, fontSize: 20 },
  { label: "Zenonesque",        x:  9, y: 68, sx: 0.11, sy: 0.12, ax: 5, ay: 4, phase: 0.7, fontSize: 11 },
  { label: "Psybass",           x: 62, y: 70, sx: 0.08, sy: 0.15, ax: 3, ay: 6, phase: 3.5, fontSize: 17 },
  { label: "Experimental Bass", x:  4, y: 86, sx: 0.13, sy: 0.07, ax: 4, ay: 3, phase: 1.8, fontSize: 10 },
  { label: "Minimal Bass",      x: 30, y: 78, sx: 0.09, sy: 0.14, ax: 4, ay: 6, phase: 4.5, fontSize: 15 },
  { label: "Breakbeat",         x: 85, y: 38, sx: 0.14, sy: 0.09, ax: 5, ay: 3, phase: 0.9, fontSize: 14 },
  { label: "Tech House",        x: 44, y: 90, sx: 0.10, sy: 0.11, ax: 6, ay: 3, phase: 2.9, fontSize: 12 },
  { label: "Techno",            x: 68, y: 92, sx: 0.12, sy: 0.09, ax: 3, ay: 5, phase: 2.1, fontSize: 19 },
  { label: "Downtempo",         x: 88, y: 88, sx: 0.09, sy: 0.08, ax: 3, ay: 4, phase: 5.1, fontSize: 11 },
]

// ─── BIO TEXT ─────────────────────────────────────────────────────────────────
const BIO_PT =
  "Movido por um amor incondicional pela música e pela arte que a cerca, especialmente música eletrônica e suas subculturas underground.\n\n" +
  "Profundamente inspirado pelo sound design de Tipper, os grooves pesados de Seppa e os ritmos " +
  "hipnóticos de Grouch, Smilk, LuSiD, Chalky e Mickman.\n\n" +
  "Apreciação pura pela arte e aos artistas e organizadores que moldam a cena."

const BIO_EN =
  "Pure appreciation for the frequencies, the groove, " +
  "and the artists and organizers who shape the scene."
// ─────────────────────────────────────────────────────────────────────────────

export function BioSection() {
  // ── Refs: filtro intenso (tags) ──
  const turbTagRef  = useRef<SVGFETurbulenceElement>(null)
  const dispTagRef  = useRef<SVGFEDisplacementMapElement>(null)
  const redTagRef   = useRef<SVGFEOffsetElement>(null)
  const blueTagRef  = useRef<SVGFEOffsetElement>(null)

  // ── Refs: filtro suave (textos bio + label) ──
  const turbTextRef = useRef<SVGFETurbulenceElement>(null)
  const dispTextRef = useRef<SVGFEDisplacementMapElement>(null)
  const redTextRef  = useRef<SVGFEOffsetElement>(null)
  const blueTextRef = useRef<SVGFEOffsetElement>(null)

  // ── Refs: movimento ──
  const tagRefs       = useRef<(HTMLSpanElement | null)[]>([])
  const bioContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let t = 0
    let animId: number
    let lastTime: number | null = null

    const animate = (now: number) => {
      if (lastTime === null) lastTime = now
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      t += dt

      // ── Pulso sincronizado com o shader ──
      const phase    = (t / WAVE_PERIOD_S) * Math.PI * 2
      const rawPulse = Math.sin(phase)
      const spike    = rawPulse > 0 ? rawPulse ** 2 : 0
      const micro    = Math.random() < 0.015 ? Math.random() * 0.4 : 0
      const pulse    = Math.min(spike + micro, 1)

      const freqX = 0.025 + Math.sin(t * 0.18) * 0.008
      const freqY = 0.065 + pulse * 0.04

      // ── Filtro intenso — genre tags ──
      turbTagRef.current?.setAttribute("baseFrequency", `${freqX.toFixed(4)} ${freqY.toFixed(4)}`)
      dispTagRef.current?.setAttribute("scale", (2 + pulse * 18).toFixed(2))
      redTagRef.current?.setAttribute("dx",  `${-(pulse * 4).toFixed(1)}`)
      blueTagRef.current?.setAttribute("dx",   (pulse * 4).toFixed(1))

      // ── Filtro suave — textos (escala e aberração menores) ──
      turbTextRef.current?.setAttribute("baseFrequency", `${(freqX * 0.7).toFixed(4)} ${(freqY * 0.6).toFixed(4)}`)
      dispTextRef.current?.setAttribute("scale", (0.5 + pulse * 4).toFixed(2))
      redTextRef.current?.setAttribute("dx",  `${-(pulse * 1.2).toFixed(1)}`)
      blueTextRef.current?.setAttribute("dx",   (pulse * 1.2).toFixed(1))

      // ── Drift das genre tags ──
      GENRES.forEach((g, i) => {
        const el = tagRefs.current[i]
        if (!el) return
        const dx = Math.sin(t * g.sx + g.phase) * g.ax
        const dy = Math.sin(t * g.sy + g.phase * 1.3) * g.ay
        el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`
      })

      // ── Drift mínimo do bloco de texto bio ──
      if (bioContainerRef.current) {
        const bx = Math.sin(t * 0.07) * 1.5
        const by = Math.sin(t * 0.05) * 2.5
        bioContainerRef.current.style.transform =
          `translate(${bx.toFixed(2)}px, ${by.toFixed(2)}px)`
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">

      {/* WebGL Shader confinado à seção */}
      <WebGLShader />

      {/* ── SVG: dois filtros no mesmo bloco ── */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" focusable="false">
        <defs>

          {/* Filtro intenso — genre tags */}
          <filter id="bio-tag-filter" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbTagRef} type="turbulence"
              baseFrequency="0.025 0.065" numOctaves="1" seed="7" result="noise" />
            <feDisplacementMap ref={dispTagRef} in="SourceGraphic" in2="noise"
              scale="2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feColorMatrix in="displaced" type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feColorMatrix in="displaced" type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="displaced" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset ref={redTagRef}  in="r" dx="0" dy="0" result="r_off" />
            <feOffset ref={blueTagRef} in="b" dx="0" dy="0" result="b_off" />
            <feBlend in="r_off" in2="g" mode="screen" result="rg" />
            <feBlend in="rg"    in2="b_off" mode="screen" />
          </filter>

          {/* Filtro suave — textos bio */}
          <filter id="bio-text-filter" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbTextRef} type="turbulence"
              baseFrequency="0.018 0.04" numOctaves="1" seed="3" result="noise" />
            <feDisplacementMap ref={dispTextRef} in="SourceGraphic" in2="noise"
              scale="0.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feColorMatrix in="displaced" type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feColorMatrix in="displaced" type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="displaced" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset ref={redTextRef}  in="r" dx="0" dy="0" result="r_off" />
            <feOffset ref={blueTextRef} in="b" dx="0" dy="0" result="b_off" />
            <feBlend in="r_off" in2="g" mode="screen" result="rg" />
            <feBlend in="rg"    in2="b_off" mode="screen" />
          </filter>

        </defs>
      </svg>

      {/* ── Genre tags flutuando (filtro intenso) ── */}
      {GENRES.map((g, i) => (
        <span
          key={g.label}
          ref={el => { tagRefs.current[i] = el }}
          className="absolute tracking-[0.18em] uppercase text-white/18 pointer-events-none select-none"
          style={{
            left: `${g.x}%`,
            top:  `${g.y}%`,
            fontSize: `${g.fontSize}px`,
            filter: "url(#bio-tag-filter)",
            willChange: "transform",
            fontFamily: "var(--font-inter)",
          }}
        >
          {g.label}
        </span>
      ))}

      {/* ── Bloco central de texto (filtro suave + drift mínimo) ── */}
      <div
        ref={bioContainerRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8 md:px-16 pointer-events-none"
        style={{ willChange: "transform" }}
      >



        {/* Bio PT — filtro suave, texto principal */}
        <p
          className="text-white/65 text-xs md:text-sm leading-[2.1] max-w-md text-center text-balance mb-8 whitespace-pre-line"
          style={{
            fontFamily: "var(--font-inter)",
            filter: "url(#bio-text-filter)",
            letterSpacing: "0.03em",
          }}
        >
          {BIO_PT}
        </p>

        {/* Bio EN — filtro suave, subtítulo sutil */}
        <p
          className="text-white/20 text-[10px] leading-[2] max-w-md text-center text-balance italic whitespace-pre-line"
          style={{
            fontFamily: "var(--font-inter)",
            filter: "url(#bio-text-filter)",
            letterSpacing: "0.04em",
          }}
        >
          {BIO_EN}
        </p>

      </div>
    </div>
  )
}
