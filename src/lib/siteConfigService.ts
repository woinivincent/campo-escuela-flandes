import { cache } from "react";
import { getAllConfigValues } from "@/lib/db";
import { siteConfig } from "@/config/site";

export interface SiteSettings {
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  location: string;
  social: { facebook: string; instagram: string; youtube: string };
  subcampos: { id: string; nombre: string }[];
  cuota: string;
  /** URL pública del sitio, sin barra final. Usada para armar los QR. */
  siteUrl: string;
  whatsappLink(msg?: string): string;
  mailtoLink(subject?: string): string;
}

/**
 * Configuración del sitio para el request actual.
 *
 * `cache()` la resuelve una sola vez por render, así layout y página no
 * golpean el store por separado. Los helpers que devuelve son sincrónicos,
 * para poder usarlos en línea dentro del JSX.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const cfg = await getAllConfigValues();

  const pick = (key: string, fallback: string) => {
    const v = cfg[key];
    return v && v.trim() !== "" ? v : fallback;
  };

  const whatsapp = pick("whatsapp", siteConfig.contact.whatsapp);
  const email = pick("email", siteConfig.contact.email);

  return {
    whatsapp,
    whatsappDisplay: pick("whatsappDisplay", siteConfig.contact.whatsappDisplay),
    email,
    location: pick("location", siteConfig.contact.location),
    social: {
      facebook: pick("facebook", siteConfig.social.facebook),
      instagram: pick("instagram", siteConfig.social.instagram),
      youtube: pick("youtube", siteConfig.social.youtube),
    },
    subcampos: siteConfig.subcampos.map((s, i) => ({
      id: s.id,
      nombre: pick(`subcampo${i + 1}`, s.nombre),
    })),
    cuota: cfg.cuota_mensual ?? "",
    siteUrl: (cfg.site_url ?? "").replace(/\/+$/, ""),

    whatsappLink(msg?: string) {
      const base = `https://wa.me/${whatsapp}`;
      return msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
    },
    mailtoLink(subject?: string) {
      return subject
        ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
        : `mailto:${email}`;
    },
  };
});
