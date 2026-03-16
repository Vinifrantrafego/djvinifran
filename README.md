# vinifran — Site Oficial

Site pessoal do DJ Vini Fran. Portfolio minimalista com efeitos visuais em WebGL, scroll-snap por seções e player de áudio ambiente.

**Deploy:** [Vercel](https://vercel.com) — dark theme, mobile-first

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16 (App Router) | Framework principal |
| React | 19 | UI |
| TypeScript | 5 | Tipagem |
| Tailwind CSS | v4 | Estilo |
| Three.js | 0.183 | Shader WebGL no Hero |
| shadcn/ui | 4 | Base de componentes |
| lucide-react | 0.577 | Ícones |
| Puppeteer | 24 | Screenshots para dev |

---

## Rodar localmente

```bash
# Instalar dependências (só na primeira vez)
cd vinifran-site
npm install

# Servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**

```bash
# Build de produção
npm run build
npm run start

# Verificar erros de TypeScript
npx tsc --noEmit

# Auditoria de segurança das dependências (rodar a cada 6 meses)
npm audit
```

---

## Estrutura

```
vinifran-site/
├── app/
│   ├── layout.tsx        — dark mode, fontes Cormorant Garamond + Inter
│   ├── page.tsx          — página principal (4 seções scroll-snap)
│   └── globals.css       — Tailwind + @keyframes text-drift
├── components/ui/
│   ├── web-gl-shader.tsx       — background Three.js (confinado ao Hero)
│   ├── liquid-glass-button.tsx — botão glass com SVG turbulence
│   ├── liquid-text.tsx         — efeito de interferência no nome "vinifran"
│   ├── drift-text.tsx          — deriva suave CSS para textos secundários
│   ├── ambient-player.tsx      — player de áudio ambiente (fixed bottom-right)
│   ├── video-section.tsx       — carrossel de vídeos YouTube fullscreen
│   ├── bio-section.tsx         — bio do DJ + estilos musicais
│   └── contact-section.tsx     — contato + agenda de shows
├── lib/
│   └── utils.ts          — função cn() do shadcn
├── public/
│   └── ambient.mp3       — áudio ambiente do player
└── next.config.ts        — security headers (CSP, X-Frame-Options, etc.)
```

---

## Seções

| # | Seção | Status |
|---|---|---|
| 1 | Hero — nome + tagline + CTA | ✅ Pronto |
| 2 | Vídeos — carrossel YouTube | ✅ Pronto |
| 3 | Bio / Estilos musicais | ✅ Pronto |
| 4 | Contato + Agenda | ✅ Pronto |
| 5 | Galeria de fotos | 🔲 A fazer |
| 6 | Footer com redes sociais | 🔲 A fazer |

---

## Conteúdo para atualizar

| Item | Arquivo | O que editar |
|---|---|---|
| IDs YouTube (3 vídeos) | `components/ui/video-section.tsx` linhas 7–9 | Trocar `id` pelo ID após `?v=` |
| Áudio ambiente | `public/ambient.mp3` | Substituir pelo arquivo real |
| Dados de contato | `components/ui/contact-section.tsx` | Ver seção abaixo |
| Foto do DJ | `bio-section.tsx` | Colocar em `/public/` e referenciar |
| Shows / eventos | `contact-section.tsx` | Descomentar e editar array `EVENTS` |

### Atualizar dados de contato

Os dados de contato ficam codificados em base64 no arquivo `contact-section.tsx` (proteção contra bots de spam). Para gerar o código de um novo dado:

```bash
node -e "console.log(Buffer.from('seu-dado-aqui').toString('base64'))"
```

Cole o resultado no campo correspondente em `CONTACT_ENCODED`.

---

## Segurança

- **Dados de contato ofuscados** — email e telefone são codificados em base64 e decodificados apenas no browser (invisíveis no HTML do servidor)
- **Security headers** configurados em `next.config.ts`:
  - `X-Frame-Options: DENY` — bloqueia clickjacking via iframe
  - `Content-Security-Policy` — restringe fontes de script e permite apenas YouTube nos iframes
  - `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- **Cache longo para mídia** — arquivos `.mp3`/`.mp4` têm `Cache-Control: immutable` para reduzir consumo de banda na Vercel
