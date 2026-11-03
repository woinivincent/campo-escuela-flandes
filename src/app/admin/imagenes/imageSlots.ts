/**
 * Catálogo de lugares donde va una imagen del sitio.
 *
 * Hay dos clases y conviene no mezclarlas:
 *
 * - **Fijos** (este archivo): uno por página, sección o subcampo. Son los que
 *   existen porque el diseño los tiene, no porque alguien los haya cargado.
 *   No se agregan ni se quitan desde el panel; sí se reemplaza su foto.
 *
 * - **Derivados de los datos** (`slots.ts`): una foto por especie, por libro y
 *   por material de la biblioteca, más las galerías, que crecen solas. Salen
 *   de lo que hay cargado, así que cuando el campo agrega una especie nueva su
 *   lugar para la foto aparece solo.
 *
 * Antes estaban todos acá, escritos a mano. El problema era que una especie o
 * un libro cargados desde el panel nunca podían tener foto: su id es
 * `esp-1762…` y, al no figurar en esta lista, la subida se rechazaba.
 */

export interface ImageSlot {
  id: string;
  label: string;
  group: string;
  desc: string;
}

export const SLOTS_FIJOS: ImageSlot[] = [
  // Identidad
  { id: "logo-flandes", label: "Logo del campo", group: "Portadas", desc: "Sello que aparece en el encabezado y el pie" },
  // Portadas
  { id: "hero-campo",              label: "Hero principal",         group: "Portadas",  desc: "Homepage hero + fondo CTA en Acampes" },
  { id: "acampes-portada",         label: "Portada Acampes",        group: "Portadas",  desc: "Página /acampes" },
  { id: "adiestramiento-portada",  label: "Portada Adiestramiento", group: "Portadas",  desc: "Página /adiestramiento" },
  { id: "agenda-portada",          label: "Portada Agenda",         group: "Portadas",  desc: "Página /agenda" },
  { id: "biblioteca-portada",      label: "Portada Biblioteca",     group: "Portadas",  desc: "Página /biblioteca" },
  { id: "contacto-portada",        label: "Portada Contacto",       group: "Portadas",  desc: "Página /contacto" },
  { id: "institucional-portada",   label: "Portada Institucional",  group: "Portadas",  desc: "Página /institucional" },
  { id: "libreria-portada",        label: "Portada Librería",       group: "Portadas",  desc: "Página /libreria" },
  { id: "naturaleza-portada",      label: "Portada Naturaleza",     group: "Portadas",  desc: "Página /naturaleza" },
  { id: "reservas-portada",        label: "Portada Reservas",       group: "Portadas",  desc: "Página /reservas" },
  { id: "socios-portada",          label: "Portada Socios",         group: "Portadas",  desc: "Página /socios" },
  // Secciones
  { id: "predio-bienvenida",       label: "Bienvenida al predio",   group: "Secciones", desc: "Sección sobre el campo en la homepage" },
  { id: "historia",                label: "Historia",               group: "Secciones", desc: "Sección historia en /institucional" },
  { id: "predio-aereo",            label: "Vista aérea del predio", group: "Secciones", desc: "Foto aérea del campo en /acampes" },
  { id: "mapa-predio",             label: "Mapa del predio",        group: "Secciones", desc: "Plano/mapa del campo en /acampes" },
  { id: "naturaleza-intro",        label: "Entorno natural",        group: "Secciones", desc: "Foto del entorno en /naturaleza" },
  { id: "mapa-ubicacion",          label: "Mapa de ubicación",      group: "Secciones", desc: "Mapa de cómo llegar en /contacto" },
  // Subcampos. Son cuatro y están fijos: el predio tiene cuatro.
  { id: "subcampo-1",              label: "Subcampo 1",             group: "Subcampos", desc: "Foto del subcampo 1" },
  { id: "subcampo-2",              label: "Subcampo 2",             group: "Subcampos", desc: "Foto del subcampo 2" },
  { id: "subcampo-3",              label: "Subcampo 3",             group: "Subcampos", desc: "Foto del subcampo 3" },
  { id: "subcampo-4",              label: "Subcampo 4",             group: "Subcampos", desc: "Foto del subcampo 4" },
];

/**
 * Las galerías, que crecen solas.
 *
 * `minimo` es cuántos lugares se muestran en el panel aunque estén vacíos, para
 * que no arranque en uno solo. Si ya hay más fotos que eso, se muestran todas
 * más una vacía al final para seguir agregando.
 */
export const GALERIAS = [
  { prefijo: "galeria", group: "Galería", label: "Galería institucional", desc: "Foto histórica del campo", minimo: 8 },
  { prefijo: "acampe-galeria", group: "Galería", label: "Galería de acampes", desc: "Foto del predio", minimo: 8 },
];

export const GROUPS = [
  "Portadas",
  "Secciones",
  "Subcampos",
  "Flora",
  "Fauna",
  "Libros",
  "Biblioteca",
  "Galería",
] as const;
