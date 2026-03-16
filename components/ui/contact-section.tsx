"use client"

import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { MessageCircle, Phone, Mail, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── EDITE SEUS DADOS DE CONTATO AQUI ────────────────────────────────────────
const CONTACT = {
  whatsapp: { number: "5519994310844", display: "+55 (19) 99431-0844" },
  phone:    { number: "+5519994310844", display: "+55 (19) 99431-0844" },
  email:    "vini.fran@hotmail.com",
  instagram: "vinifranmusic",
}
// ─────────────────────────────────────────────────────────────────────────────

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.23 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const linkBase = "flex items-center gap-3 group w-fit mx-auto text-white/50 hover:text-white transition-colors duration-200"
const labelBase = "text-sm tracking-[0.15em] uppercase group-hover:underline underline-offset-4"

export function ContactSection() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 gap-12">

      {/* ── Contato ── */}
      <div className="flex flex-col items-center gap-8 w-full max-w-xs">
        <h2
          className="text-white/20 text-xs tracking-[0.4em] uppercase"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          contato
        </h2>

        <nav className="flex flex-col gap-5 w-full" aria-label="Links de contato">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${CONTACT.whatsapp.number}?text=Ol%C3%A1%2C%20vim%20pelo%20site%20do%20vinifran`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBase}
            aria-label="Abrir WhatsApp"
          >
            <WhatsappIcon className="w-4 h-4 flex-shrink-0" />
            <span className={labelBase} style={{ fontFamily: "var(--font-inter)" }}>
              {CONTACT.whatsapp.display}
            </span>
          </a>

          {/* Telefone */}
          <a
            href={`tel:${CONTACT.phone.number}`}
            className={linkBase}
            aria-label="Ligar"
          >
            <Phone size={16} className="flex-shrink-0" />
            <span className={labelBase} style={{ fontFamily: "var(--font-inter)" }}>
              {CONTACT.phone.display}
            </span>
          </a>

          {/* E-mail */}
          <a
            href={`mailto:${CONTACT.email}`}
            className={linkBase}
            aria-label="Enviar e-mail"
          >
            <Mail size={16} className="flex-shrink-0" />
            <span className={labelBase} style={{ fontFamily: "var(--font-inter)" }}>
              {CONTACT.email}
            </span>
          </a>

          {/* Instagram */}
          <a
            href={`https://instagram.com/${CONTACT.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBase}
            aria-label="Abrir Instagram"
          >
            <Instagram size={16} className="flex-shrink-0" />
            <span className={labelBase} style={{ fontFamily: "var(--font-inter)" }}>
              @{CONTACT.instagram}
            </span>
          </a>
        </nav>

        {/* CTA */}
        <LiquidButton
          className="text-white/90 border border-white/15 rounded-full tracking-[0.2em] uppercase text-xs"
          size="xl"
          onClick={() => window.open(`https://wa.me/${CONTACT.whatsapp.number}?text=Ol%C3%A1%2C%20vim%20pelo%20site%20do%20vinifran`, '_blank')}
        >
          vamos conversar
        </LiquidButton>
      </div>

      {/* ── Botão Flutuante do WhatsApp ── */}
      <a
        href={`https://wa.me/${CONTACT.whatsapp.number}?text=Ol%C3%A1%2C%20vim%20pelo%20site%20do%20vinifran`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className={cn(
          "fixed bottom-6 right-[5.5rem] z-20", // posicionado à esquerda do botão de play (right-6 + w-12 do play + gap)
          "flex items-center justify-center",
          "w-12 h-12 rounded-full",
          "bg-[#25D366] text-white", // Cor oficial do WhatsApp
          "shadow-lg backdrop-blur-sm",
          "transition-all duration-500 ease-out",
          "hover:scale-110"
        )}
      >
        <WhatsappIcon className="w-7 h-7" />
      </a>

    </div>
  )
}
