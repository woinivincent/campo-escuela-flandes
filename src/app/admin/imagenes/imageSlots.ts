export const IMAGE_SLOTS = [
  // Portadas
  { id: "hero-campo",              label: "Hero principal",         group: "Portadas",  desc: "Homepage hero + fondo CTA en Acampes" },
  { id: "acampes-portada",         label: "Portada Acampes",        group: "Portadas",  desc: "Página /acampes" },
  { id: "adiestramiento-portada",  label: "Portada Adiestramiento", group: "Portadas",  desc: "Página /adiestramiento" },
  { id: "agenda-portada",          label: "Portada Agenda",         group: "Portadas",  desc: "Página /agenda" },
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
  // Subcampos
  { id: "subcampo-1",              label: "Subcampo 1",             group: "Subcampos", desc: "Foto del subcampo 1" },
  { id: "subcampo-2",              label: "Subcampo 2",             group: "Subcampos", desc: "Foto del subcampo 2" },
  { id: "subcampo-3",              label: "Subcampo 3",             group: "Subcampos", desc: "Foto del subcampo 3" },
  { id: "subcampo-4",              label: "Subcampo 4",             group: "Subcampos", desc: "Foto del subcampo 4" },
  // Flora
  { id: "especie-espinillo",       label: "Espinillo",              group: "Flora",     desc: "Vachellia caven" },
  { id: "especie-ceibo",           label: "Ceibo",                  group: "Flora",     desc: "Erythrina crista-galli" },
  { id: "especie-sauce",           label: "Sauce criollo",          group: "Flora",     desc: "Salix humboldtiana" },
  { id: "especie-tala",            label: "Tala",                   group: "Flora",     desc: "Celtis ehrenbergiana" },
  // Fauna
  { id: "especie-carpincho",       label: "Carpincho",              group: "Fauna",     desc: "Hydrochoerus hydrochaeris" },
  { id: "especie-hornero",         label: "Hornero",                group: "Fauna",     desc: "Furnarius rufus" },
  { id: "especie-martin-pescador", label: "Martín pescador",        group: "Fauna",     desc: "Megaceryle torquata" },
  { id: "especie-coipo",           label: "Coipo / Nutria",         group: "Fauna",     desc: "Myocastor coypus" },
] as const;

export type ImageSlot = (typeof IMAGE_SLOTS)[number];
export const GROUPS = ["Portadas", "Secciones", "Subcampos", "Flora", "Fauna"] as const;
