"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface LiquidTextProps {
  children: React.ReactNode
  className?: string
}

// Período da onda do WebGL shader: time += 0.01/frame a 60fps → ~10.5s por ciclo
const WAVE_PERIOD_S = 10.5

export function LiquidText({ children, className }: LiquidTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const turbRef      = useRef<SVGFETurbulenceElement>(null)
  const dispRef      = useRef<SVGFEDisplacementMapElement>(null)
  const redOffRef    = useRef<SVGFEOffsetElement>(null)
  const blueOffRef   = useRef<SVGFEOffsetElement>(null)

  useEffect(() => {
    let t = 0
    let animId: number
    let lastTime: number | null = null

    const animate = (now: number) => {
      if (lastTime === null) lastTime = now
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      t += dt

      // --- PULSO DE INTERFERÊNCIA ---
      // Onda principal sincronizada com o shader (~10.5s)
      const phase = (t / WAVE_PERIOD_S) * Math.PI * 2

      // Pico abrupto: eleva ao quadrado e corta negativo → spike rápido
      const rawPulse = Math.sin(phase)
      const spike    = rawPulse > 0 ? rawPulse ** 2 : 0

      // Micro-glitches rápidos sobrepostos (simula dropout de sinal)
      const microGlitch = Math.random() < 0.015 ? Math.random() * 0.4 : 0

      const pulse = Math.min(spike + microGlitch, 1)

      // --- TURBULÊNCIA: type="turbulence" dá padrão geométrico/chapado (≠ fluido) ---
      // Alta freq Y → bandas horizontais = interferência de áudio
      const freqX = 0.025 + Math.sin(t * 0.18) * 0.008
      const freqY = 0.065 + pulse * 0.04

      if (turbRef.current) {
        turbRef.current.setAttribute("baseFrequency", `${freqX.toFixed(4)} ${freqY.toFixed(4)}`)
      }

      // --- DESLOCAMENTO: sobe de 3px (base) até 28px no pico ---
      const scale = 3 + pulse * 25
      if (dispRef.current) {
        dispRef.current.setAttribute("scale", scale.toFixed(2))
      }

      // --- ABERRAÇÃO CROMÁTICA: RGB split horizontal cresce com o pulso ---
      // Canal vermelho desloca para a esquerda, azul para a direita
      const chromaticOffset = (pulse * 6).toFixed(1)
      if (redOffRef.current)  redOffRef.current.setAttribute("dx", `-${chromaticOffset}`)
      if (blueOffRef.current) blueOffRef.current.setAttribute("dx", chromaticOffset)

      // --- DERIVA: movimento orgânico no mar ---
      if (containerRef.current) {
        const driftY = Math.sin(t * 0.28) * 9  + Math.sin(t * 0.61) * 4
        const driftX = Math.sin(t * 0.19) * 3  + Math.sin(t * 0.44) * 1.5
        const rot    = Math.sin(t * 0.22) * 0.35 + Math.sin(t * 0.53) * 0.15
        containerRef.current.style.transform =
          `translate(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <>
      {/* SVG com filtro de interferência — fora do fluxo visual */}
      <svg
        className="fixed w-0 h-0 overflow-hidden"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="sonic-filter"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            {/* Ruído tipo "turbulence" → padrão geométrico/chapado, não fluido */}
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency="0.025 0.065"
              numOctaves="1"
              seed="9"
              result="noise"
            />

            {/* Deslocamento principal */}
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />

            {/* --- Aberração cromática --- */}
            {/* Extrai canal vermelho */}
            <feColorMatrix
              in="displaced"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red_ch"
            />
            {/* Extrai canal verde (centro — não se move) */}
            <feColorMatrix
              in="displaced"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green_ch"
            />
            {/* Extrai canal azul */}
            <feColorMatrix
              in="displaced"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue_ch"
            />

            {/* Desloca vermelho para esquerda */}
            <feOffset ref={redOffRef}  in="red_ch"   dx="0" dy="0" result="red_off" />
            {/* Desloca azul para direita */}
            <feOffset ref={blueOffRef} in="blue_ch"  dx="0" dy="0" result="blue_off" />

            {/* Combina os 3 canais com screen blend */}
            <feBlend in="red_off"  in2="green_ch" mode="screen" result="rg" />
            <feBlend in="rg"       in2="blue_off" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Texto com filtro + movimento de deriva */}
      <span
        ref={containerRef}
        className={cn("inline-block", className)}
        style={{
          filter: "url(#sonic-filter)",
          willChange: "transform, filter",
        }}
      >
        {children}
      </span>
    </>
  )
}
