import { WebGLShader } from "@/components/ui/web-gl-shader"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { AmbientPlayer } from "@/components/ui/ambient-player"
import { LiquidText } from "@/components/ui/liquid-text"
import { DriftText } from "@/components/ui/drift-text"
import { VideoSection } from "@/components/ui/video-section"
import { BioSection } from "@/components/ui/bio-section"
import { ContactSection } from "@/components/ui/contact-section"
import { ChevronDown } from "lucide-react"

export default function Home() {
  return (
    // Scroll snap container — seções de 100vh
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">

      {/* Player de áudio ambiente — fixo, sempre visível */}
      <AmbientPlayer src="/ambient.mp3" />

      {/* ── Seção 1: Hero ── */}
      {/* WebGLShader fica DENTRO do Hero (absolute) — visível só nesta seção */}
      <section className="relative h-screen snap-start flex flex-col items-center justify-center overflow-hidden">

        {/* Background animado — confinado ao Hero */}
        <WebGLShader />

        <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 gap-8">

          {/* Nome do DJ */}
          <h1
            className="text-[clamp(4rem,18vw,14rem)] font-light leading-none tracking-[0.12em] text-white"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            <LiquidText>vinifran</LiquidText>
          </h1>

          {/* Tagline principal */}
          <DriftText delay={1.5} duration={9}>
            <p
              className="text-white/55 text-sm md:text-base lg:text-lg max-w-md tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              versatilidade como essência.
            </p>
          </DriftText>

          {/* Tagline secundária */}
          <DriftText delay={3} duration={11}>
            <p
              className="text-white/30 text-xs md:text-sm max-w-md tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              a música como experiência.
            </p>
          </DriftText>

          {/* CTA */}
          <DriftText delay={5} duration={10}>
            <LiquidButton
              className="text-white/90 border border-white/15 rounded-full tracking-[0.2em] uppercase text-xs"
              size="xl"
            >
              colaborar
            </LiquidButton>
          </DriftText>

        </main>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
          <DriftText delay={7} duration={13}>
            <ChevronDown size={16} className="text-white/20 animate-bounce" aria-hidden="true" />
          </DriftText>
        </div>

        {/* Rodapé sutil */}
        <footer className="absolute bottom-6 left-6 z-10">
          <DriftText delay={7} duration={13}>
            <p
              className="text-white/15 text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              © 2026 vinifran
            </p>
          </DriftText>
        </footer>

      </section>

      {/* ── Seção 2: Vídeos ── */}
      <section className="relative h-screen snap-start z-10 bg-black">
        <VideoSection />
      </section>

      {/* ── Seção 3: Bio + Estilos ── */}
      <section className="relative h-screen snap-start z-10 overflow-hidden">
        <BioSection />
      </section>

      {/* ── Seção 4: Contato + Agenda ── */}
      <section className="relative h-screen snap-start z-10 bg-black">
        <ContactSection />
      </section>

    </div>
  )
}
