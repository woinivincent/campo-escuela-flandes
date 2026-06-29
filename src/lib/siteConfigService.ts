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
    location: siteConfig.contact.location,
  };
}

export function getDynamicSocialConfig() {
  return {
    facebook: getConfigValue("facebook") ?? siteConfig.social.facebook,
    instagram: getConfigValue("instagram") ?? siteConfig.social.instagram,
    youtube: getConfigValue("youtube") ?? siteConfig.social.youtube,
  };
}
