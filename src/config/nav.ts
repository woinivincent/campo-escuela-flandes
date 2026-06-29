/** Estructura de navegación principal del sitio público. */

export interface NavItem {
  label: string;
  href: string;
  /** Destacado visualmente (las secciones más buscadas). */
  highlight?: boolean;
}

export const mainNav: NavItem[] = [
  { label: "Institucional", href: "/institucional" },
  { label: "Acampes", href: "/acampes", highlight: true },
  { label: "Reservas", href: "/reservas", highlight: true },
  { label: "Adiestramiento", href: "/adiestramiento" },
  { label: "Naturaleza", href: "/naturaleza" },
  { label: "Librería", href: "/libreria" },
  { label: "Agenda", href: "/agenda" },
  { label: "Contacto", href: "/contacto" },
];

/** Enlaces del área de socios / acceso privado. */
export const memberNav: NavItem[] = [
  { label: "Acceso socios", href: "/socios" },
];
