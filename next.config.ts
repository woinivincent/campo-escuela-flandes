import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  /**
   * Cabeceras de seguridad.
   *
   * No se agrega Content-Security-Policy todavía: el sitio embebe el mapa de
   * Google y los videos del Bordón de YouTube, y una política mal armada los
   * rompe sin avisar. Conviene armarla aparte y probarla primero en modo
   * Report-Only.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // El panel no tiene por qué mostrarse dentro de un iframe ajeno:
          // así no se puede montar un clickjacking sobre el login.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Al salir del sitio se manda el dominio, no la ruta completa: las
          // URLs del panel no viajan a terceros.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // El sitio no usa ninguna de estas, así que se apagan.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      /**
       * beforeFiles: /images/* se resuelve SIEMPRE por el API route, incluso si
       * existe un archivo con ese nombre en public/. Si no fuera así, una foto
       * versionada en el repo taparía la que se sube desde el panel y el cambio
       * no se vería nunca.
       */
      beforeFiles: [
        { source: "/images/:path*", destination: "/api/img/:path*" },
        { source: "/docs/:path*", destination: "/api/doc/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
