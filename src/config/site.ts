/**
 * Configuración central del sitio.
 * Datos de contacto, redes y textos institucionales en un solo lugar.
 */

export const siteConfig = {
  name: 'Campo Escuela "Flandes"',
  shortName: "Campo Flandes",
  tagline: "Campo de Ejercicios Scouts",
  description:
    'Sitio institucional del Campo Escuela "Flandes" — Campo de Ejercicios Scouts. ' +
    "Acampes, reservas, naturaleza, adiestramiento y recursos para grupos scouts y familias.",

  contact: {
    // Número en formato internacional sin "+" ni espacios (para enlaces wa.me)
    whatsapp: "5491100000000",
    whatsappDisplay: "+54 9 11 0000-0000",
    email: "contacto@campoflandes.org.ar",
    location: "Provincia de Buenos Aires, Argentina",
  },

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },

  // --- Web pública mostrada en piezas gráficas ---
  website: "www.campoescuelaflandes.com",

  // --- Subcampos del predio ---
  subcampos: [
    { id: "1", nombre: "Subcampo 1" },
    { id: "2", nombre: "Subcampo 2" },
    { id: "3", nombre: "Subcampo 3" },
    { id: "4", nombre: "Subcampo 4" },
  ],
} as const;

/** Construye un enlace de WhatsApp con mensaje pre-cargado. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Construye un enlace mailto con asunto opcional. */
export function mailtoLink(subject?: string): string {
  const base = `mailto:${siteConfig.contact.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
