import { cache } from "react";
import { getAllConfigValues } from "@/lib/db";
import { siteConfig } from "@/config/site";

/** Áreas que pueden tener su propio número de WhatsApp. */
export type AreaWhatsApp = "formaciones" | "biblioteca" | "socios";

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
  /** Coordenadas del predio para el mapa satelital. */
  mapa: { lat: string; lng: string };
  whatsappLink(msg?: string): string;
  mailtoLink(subject?: string): string;

  /** Número de cada área ya resuelto: el propio, o el general si no tiene. */
  whatsappAreas: Record<AreaWhatsApp, string>;
  whatsappLinkArea(area: AreaWhatsApp, msg?: string): string;

  /** Referente de socios. Sin nombre, o sin marcar público, no se muestra. */
  responsableSocios: { nombre: string; contacto: string; publico: boolean };
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

  // Un área sin número propio cae en el general: el sitio se comporta igual
  // que antes hasta que alguien cargue el número del área.
  const numeroArea = (key: string) => {
    const v = cfg[key];
    return v && v.trim() !== "" ? v.trim() : whatsapp;
  };
  const whatsappAreas: Record<AreaWhatsApp, string> = {
    formaciones: numeroArea("whatsapp_formaciones"),
    biblioteca: numeroArea("whatsapp_biblioteca"),
    socios: numeroArea("whatsapp_socios"),
  };

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
    mapa: {
      lat: pick("mapa_lat", "-34.546312"),
      lng: pick("mapa_lng", "-59.146240"),
    },

    whatsappAreas,

    responsableSocios: {
      nombre: (cfg.responsable_socios_nombre ?? "").trim(),
      contacto: (cfg.responsable_socios_contacto ?? "").trim(),
      publico: (cfg.responsable_socios_publico ?? "") === "1",
    },

    whatsappLink(msg?: string) {
      const base = `https://wa.me/${whatsapp}`;
      return msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
    },
    whatsappLinkArea(area: AreaWhatsApp, msg?: string) {
      const base = `https://wa.me/${whatsappAreas[area]}`;
      return msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
    },
    mailtoLink(subject?: string) {
      return subject
        ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
        : `mailto:${email}`;
    },
  };
});
