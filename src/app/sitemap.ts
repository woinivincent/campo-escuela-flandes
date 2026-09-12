import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/config/site";
import { getEspecies } from "@/lib/db";

/**
 * Mapa del sitio para los buscadores.
 *
 * Sin esto, Google tiene que descubrir las páginas siguiendo enlaces, y un
 * dominio nuevo al que casi nadie enlaza todavía tarda mucho en ser recorrido.
 * Las fichas de especies se leen del almacén, así que una especie cargada desde
 * el panel aparece acá sola.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();

  const secciones: { ruta: string; prioridad: number }[] = [
    { ruta: "", prioridad: 1 },
    { ruta: "/acampes", prioridad: 0.9 },
    { ruta: "/reservas", prioridad: 0.9 },
    { ruta: "/institucional", prioridad: 0.8 },
    { ruta: "/naturaleza", prioridad: 0.8 },
    { ruta: "/agenda", prioridad: 0.7 },
    { ruta: "/adiestramiento", prioridad: 0.7 },
    { ruta: "/biblioteca", prioridad: 0.6 },
    { ruta: "/libreria", prioridad: 0.6 },
    { ruta: "/socios", prioridad: 0.6 },
    { ruta: "/contacto", prioridad: 0.7 },
  ];

  const paginas: MetadataRoute.Sitemap = secciones.map((s) => ({
    url: `${URL_SITIO}${s.ruta}`,
    lastModified: ahora,
    changeFrequency: "monthly",
    priority: s.prioridad,
  }));

  // Si el almacén no responde, el mapa sale igual con las secciones: mejor un
  // sitemap incompleto que uno que devuelve error.
  let especies: MetadataRoute.Sitemap = [];
  try {
    especies = (await getEspecies()).map((e) => ({
      url: `${URL_SITIO}/naturaleza/${e.id}`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.5,
    }));
  } catch {
    especies = [];
  }

  return [...paginas, ...especies];
}
