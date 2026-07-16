import { getConfigValue } from "@/lib/db";
import { siteConfig } from "@/config/site";

export function whatsappLink(msg?: string): string {
  const number = getConfigValue("whatsapp") ?? siteConfig.contact.whatsapp;
  const base = `https://wa.me/${number}`;
  return msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
}

export function mailtoLink(subject?: string): string {
  const email = getConfigValue("email") ?? siteConfig.contact.email;
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
}

export function getWhatsappNumber(): string {
  return getConfigValue("whatsapp") ?? siteConfig.contact.whatsapp;
}

export function getDynamicContactConfig() {
  return {
    whatsapp: getConfigValue("whatsapp") ?? siteConfig.contact.whatsapp,
    whatsappDisplay:
      getConfigValue("whatsappDisplay") ?? siteConfig.contact.whatsappDisplay,
    email: getConfigValue("email") ?? siteConfig.contact.email,
    location: getConfigValue("location") ?? siteConfig.contact.location,
  };
}

export function getDynamicSocialConfig() {
  return {
    facebook: getConfigValue("facebook") ?? siteConfig.social.facebook,
    instagram: getConfigValue("instagram") ?? siteConfig.social.instagram,
    youtube: getConfigValue("youtube") ?? siteConfig.social.youtube,
  };
}

export function getDynamicSubcampos(): { id: string; nombre: string }[] {
  return [
    { id: "1", nombre: getConfigValue("subcampo1") ?? siteConfig.subcampos[0].nombre },
    { id: "2", nombre: getConfigValue("subcampo2") ?? siteConfig.subcampos[1].nombre },
    { id: "3", nombre: getConfigValue("subcampo3") ?? siteConfig.subcampos[2].nombre },
    { id: "4", nombre: getConfigValue("subcampo4") ?? siteConfig.subcampos[3].nombre },
  ];
}

export function getDynamicCuota(): string {
  return getConfigValue("cuota_mensual") ?? "";
}
