import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async rewrites() {
    return {
      /**
       * beforeFiles: /images/* se resuelve SIEMPRE por el API route, incluso si
       * existe un archivo con ese nombre en public/. Si no fuera así, una foto
       * versionada en el repo taparía la que se sube desde el panel y el cambio
       * no se vería nunca.
       */
      beforeFiles: [{ source: "/images/:path*", destination: "/api/img/:path*" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
