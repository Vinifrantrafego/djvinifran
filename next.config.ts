import type { NextConfig } from "next";

// ─── Security Headers ─────────────────────────────────────────────────────────
// X-Frame-Options + frame-ancestors → protege contra Clickjacking
// X-Content-Type-Options            → protege contra MIME sniffing
// Referrer-Policy                   → limita dados enviados em redirects
// Permissions-Policy                → desabilita câmera/microfone/geolocalização
// Content-Security-Policy           → restringe fontes de script, estilo, iframes
// Cache-Control (áudio)             → reduz redownloads, economiza cota da Vercel
// ─────────────────────────────────────────────────────────────────────────────

const securityHeaders = [
  // Bloqueia o site de ser carregado dentro de iframes externos (anti-clickjacking)
  { key: "X-Frame-Options", value: "DENY" },

  // Impede que o browser "adivinhe" o tipo de arquivo (anti-MIME-sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Controla quais informações de origem são enviadas em requisições cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Desabilita APIs sensíveis que o site não usa
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },

  // DNS prefetch melhora performance sem custo de privacidade para este caso
  { key: "X-DNS-Prefetch-Control", value: "on" },

  // Content-Security-Policy — principal barreira contra injeção de scripts
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js 15 exige unsafe-inline/unsafe-eval para hydration inline
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Estilo inline (Tailwind JIT) + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Google Fonts arquivos de fonte
      "font-src 'self' https://fonts.gstatic.com data:",
      // Imagens: self + data URIs + thumbnails do YouTube + placehold.co
      "img-src 'self' data: blob: https://placehold.co https://i.ytimg.com https://i3.ytimg.com",
      // Áudio local
      "media-src 'self'",
      // Somente YouTube pode ser embutido via iframe
      "frame-src https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
      // Bloqueia este site de ser embutido em qualquer outro domínio (reforça X-Frame-Options)
      "frame-ancestors 'none'",
      // Conexões de rede: apenas self + Vercel analytics (caso seja ativado depois)
      "connect-src 'self' https://vitals.vercel-insights.com",
      // Web Workers do Three.js
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Aplica security headers em todas as rotas
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Cache longo para o áudio ambiente (1 ano)
        // Reduz re-downloads em visitas repetidas → economiza cota da Vercel
        source: "/ambient.mp3",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
