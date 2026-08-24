/** Estructura de navegación principal del sitio público. */

export interface NavItem {
  label: string;
  href: string;
  /** Destacado visualmente (las secciones más buscadas). */
  highlight?: boolean;
}

/** Varios enlaces agrupados bajo un desplegable, para no saturar la barra. */
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export type NavEntry = NavItem | NavGroup;

export function esGrupo(entrada: NavEntry): entrada is NavGroup {
  return (entrada as NavGroup).items !== undefined;
}

export const mainNav: NavEntry[] = [
  { label: "Institucional", href: "/institucional" },
  { label: "Acampes", href: "/acampes", highlight: true },
  { label: "Reservas", href: "/reservas", highlight: true },
  { label: "Agenda", href: "/agenda" },
  {
    label: "Recursos",
    items: [
      { label: "Adiestramiento", href: "/adiestramiento" },
      { label: "Naturaleza", href: "/naturaleza" },
      { label: "Biblioteca", href: "/biblioteca" },
      { label: "Librería", href: "/libreria" },
    ],
  },
  { label: "Contacto", href: "/contacto" },
];

/** Todos los enlaces en una sola lista, para el pie de página. */
export const allNavLinks: NavItem[] = mainNav.flatMap((e) =>
  esGrupo(e) ? e.items : [e]
);

/** Enlaces del área de socios / acceso privado. */
export const memberNav: NavItem[] = [
  { label: "Acceso socios", href: "/socios" },
];
