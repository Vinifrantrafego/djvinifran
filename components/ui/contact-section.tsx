"use client"

import { useState, useEffect } from "react"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── DADOS DE CONTATO (codificados em base64) ────────────────────────────────
// Para atualizar: abra o terminal e rode:
//   node -e "console.log(Buffer.from('seu-dado-aqui').toString('base64'))"
// Cole o resultado no campo correspondente abaixo.
//
// Por que base64? Bots de scraping leem o HTML puro do servidor.
// O componente só decodifica os dados após o JavaScript rodar no browser,
// então o HTML inicial entregue ao bot não contém e-mail nem telefone em texto claro.
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT_ENCODED = {
  whatsapp: {
    number:  "NTUxOTk5NDMxMDg0NA==",  // 5519994310844
    display: "KzU1ICgxOSkgOTk0MzEtMDg0NA==", // +55 (19) 99431-0844
  },
  phone: {
    number:  "KzU1MTk5OTQzMTA4NDQ=",  // +5519994310844
    display: "KzU1ICgxOSkgOTk0MzEtMDg0NA==", // +55 (19) 99431-0844
  },
  email:     "dmluaS5mcmFuQGhvdG1haWwuY29t", // vini.fran@hotmail.com
  instagram: "dmluaWZyYW5tdXNpYw==",          // vinifranmusic
  wa_text:   "T2zDoSwgdmltIHBlbG8gc2l0ZSBkbyB2aW5pZnJhbg==", // Olá, vim pelo site do vinifran
}

// Tipo decodificado — preenchido apenas no client após mount
type ContactDecoded = {
  whatsapp: { number: string; display: string; url: string }
  phone:    { number: string; display: string }
  email:    string
  instagram: string
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.23 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const linkBase = "flex items-center gap-3 group w-fit mx-auto text-white/50 hover:text-white transition-colors duration-200"
const labelBase = "text-sm tracking-[0.15em] uppercase group-hover:underline underline-offset-4"

export function ContactSection() {
  // Antes do mount: null → links não são renderizados (bots SSR não veem os dados)
  const [contact, setContact] = useState<ContactDecoded | null>(null)

  useEffect(() => {
    // atob() decodifica base64 — só roda no browser, nunca no servidor
    const d = (s: string) => atob(s)
    const waNumber  = d(CONTACT_ENCODED.whatsapp.number)
    const waText    = encodeURIComponent(d(CONTACT_ENCODED.wa_text))
    const waUrl     = `https://wa.me/${waNumber}?text=${waText}`

    setContact({
      whatsapp: {
        number:  waNumber,
        display: d(CONTACT_ENCODED.whatsapp.display),
        url:     waUrl,
      },
      phone: {
        number:  d(CONTACT_ENCODED.phone.number),
        display: d(CONTACT_ENCODED.phone.display),
      },
      email:     d(CONTACT_ENCODED.email),
      instagram: d(CONTACT_ENCODED.instagram),
    })
  }, [])

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
          {/* WhatsApp — link só aparece após decode client-side */}
          {contact ? (
            <a
              href={contact.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkBase}
              aria-label="Abrir WhatsApp"
            >
              <WhatsappIcon className="w-4 h-4 flex-shrink-0" />
              <span className={labelBase} style={{ fontFamily: "var(--font-inter)" }}>
                {contact.whatsapp.display}
              </span>
            </a>
          ) : (
            <div className={cn(linkBase, "pointer-events-none")}>
              <WhatsappIcon className="w-4 h-4 flex-shrink-0 opacity-30" />
              <span className={cn(labelBase, "opacity-30 blur-sm")} style={{ fontFamily: "var(--font-inter)" }}>
                ···············
              </span>
            </div>
          )}

          {/* Telefone */}
          {contact ? (
            <a
              href={`tel:${contact.phone.number}`}
              className={linkBase}
              aria-label="Ligar"
            >
              <Phone size={16} className="flex-shrink-0" />
              <span className={labelBase} style={{ fontFamily: "var(--font-inter)" }}>
                {contact.phone.display}
              </span>
            </a>
          ) : (
            <div className={cn(linkBase, "pointer-events-none")}>
              <Phone size={16} className="flex-shrink-0 opacity-30" />
              <span className={cn(labelBase, "opacity-30 blur-sm")} style={{ fontFamily: "var(--font-inter)" }}>
                ···············
              </span>
            </div>
          )}

          {/* E-mail */}
          {contact ? (
            <a
              href={`mailto:${contact.email}`}
              className={linkBase}
              aria-label="Enviar e-mail"
            >
              <Mail size={16} className="flex-shrink-0" />
              <span className={labelBase} style={{ fontFamily: "var(--font-inter)" }}>
                {contact.email}
              </span>
            </a>
          ) : (
            <div className={cn(linkBase, "pointer-events-none")}>
              <Mail size={16} className="flex-shrink-0 opacity-30" />
              <span className={cn(labelBase, "opacity-30 blur-sm")} style={{ fontFamily: "var(--font-inter)" }}>
                ···············
              </span>
            </div>
          )}

          {/* Instagram */}
          {contact ? (
            <a
              href={`https://instagram.com/${contact.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkBase}
              aria-label="Abrir Instagram"
            >
              <InstagramIcon className="w-4 h-4 flex-shrink-0" />
              <span className={labelBase} style={{ fontFamily: "var(--font-inter)" }}>
                @{contact.instagram}
              </span>
            </a>
          ) : (
            <div className={cn(linkBase, "pointer-events-none")}>
              <InstagramIcon className="w-4 h-4 flex-shrink-0 opacity-30" />
              <span className={cn(labelBase, "opacity-30 blur-sm")} style={{ fontFamily: "var(--font-inter)" }}>
                ···············
              </span>
            </div>
          )}
        </nav>

        {/* CTA — botão usa CONTACT_ENCODED para garantir consistência com os links acima */}
        <LiquidButton
          className="text-white/90 border border-white/15 rounded-full tracking-[0.2em] uppercase text-xs"
          size="xl"
          onClick={() => contact && window.open(contact.whatsapp.url, "_blank")}
        >
          vamos conversar
        </LiquidButton>
      </div>

      {/* ── Botão Flutuante do WhatsApp ── */}
      {contact && (
        <a
          href={contact.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className={cn(
            "fixed bottom-6 right-[5.5rem] z-20",
            "flex items-center justify-center",
            "w-12 h-12 rounded-full",
            "bg-[#25D366] text-white",
            "shadow-lg backdrop-blur-sm",
            "transition-all duration-500 ease-out",
            "hover:scale-110"
          )}
        >
          <WhatsappIcon className="w-7 h-7" />
        </a>
      )}

    </div>
  )
}
