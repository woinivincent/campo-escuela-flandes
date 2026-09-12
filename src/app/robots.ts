import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/config/site";

/**
 * Qué pueden indexar los buscadores.
 *
 * El panel y el portal de socios quedan afuera: no tienen nada que buscar y no
 * conviene que la pantalla de login aparezca en un resultado de Google.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/socios/portal", "/socios/login", "/api/"],
      },
    ],
    sitemap: `${URL_SITIO}/sitemap.xml`,
    host: URL_SITIO,
  };
}
