import {
  readCollection,
  writeCollection,
  mutateCollection,
  readConfig,
  writeConfig,
  readRecord,
  writeRecord,
  contarGuardadas,
  leerConfigCruda,
} from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TipoEvento = "Acampe" | "Curso" | "Charla" | "Actividad";
export type CategoriaLibro = "Escultismo" | "Naturaleza" | "Formación" | "Literatura";
export type CategoriaEspecie = "Flora" | "Fauna";

export interface Evento {
  id: string; titulo: string; fecha: string; hora: string;
  tipo: TipoEvento; descripcion: string; destinatarios: string; cupos: string;
}

export interface Libro {
  id: string; titulo: string; autor: string; categoria: CategoriaLibro;
  precio: number; descripcion: string; disponible: boolean;
}

export interface Curso {
  id: string; titulo: string; descripcion: string; fecha: string;
  hora: string; nivel: string; destinatarios: string; cupos: string;
}

export interface Hito {
  id: string; anio: string; texto: string; orden: number;
}

export interface Especie {
  id: string; nombreComun: string; nombreCientifico: string;
  categoria: CategoriaEspecie; descripcion: string; curiosidad: string;
  qrDisponible: boolean; orden: number;
}

export interface Socio {
  id: string; nombre: string; email: string;
  password_hash: string; salt: string; activo: number; created_at: string;
}

export interface RecursoSocio {
  id: string; titulo: string; descripcion: string; tipo: string;
  url: string; categoria: string; icono: string; orden: number; activo: number;
}

/** Bordón: las ediciones del boletín. Digital: material descargable. Físico: libros para consultar en el campo. */
export type TipoMaterial = "Bordón" | "Digital" | "Físico";

export interface MaterialBiblioteca {
  id: string; titulo: string; descripcion: string;
  tipo: TipoMaterial; url: string; orden: number; activo: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const byFecha = (a: { fecha: string }, b: { fecha: string }) => a.fecha.localeCompare(b.fecha);
const byOrden = (a: { orden: number }, b: { orden: number }) => a.orden - b.orden;
const hoy = () => new Date().toISOString().slice(0, 10);

function nextOrden(rows: { orden: number }[]): number {
  return rows.reduce((max, r) => Math.max(max, r.orden), -1) + 1;
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

export async function getEventos(): Promise<Evento[]> {
  const rows = await readCollection<Evento>("eventos", SEED_EVENTOS);
  return [...rows].sort(byFecha);
}

export async function getEventosPublicos(): Promise<Evento[]> {
  const rows = await getEventos();
  return rows.filter((e) => e.fecha >= hoy());
}

export async function getEvento(id: string): Promise<Evento | undefined> {
  const rows = await readCollection<Evento>("eventos", SEED_EVENTOS);
  return rows.find((e) => e.id === id);
}

export async function createEvento(data: Omit<Evento, "id">): Promise<string> {
  const id = `ev-${Date.now()}`;
  return mutateCollection<Evento, string>("eventos", SEED_EVENTOS, (rows) => ({
    rows: [...rows, { ...data, id }],
    result: id,
  }));
}

export async function updateEvento(id: string, data: Omit<Evento, "id">): Promise<void> {
  await mutateCollection<Evento, void>("eventos", SEED_EVENTOS, (rows) => ({
    rows: rows.map((e) => (e.id === id ? { ...data, id } : e)),
    result: undefined,
  }));
}

export async function deleteEvento(id: string): Promise<void> {
  await mutateCollection<Evento, void>("eventos", SEED_EVENTOS, (rows) => ({
    rows: rows.filter((e) => e.id !== id),
    result: undefined,
  }));
}

// ─── Libros ──────────────────────────────────────────────────────────────────

export async function getLibros(): Promise<Libro[]> {
  const rows = await readCollection<Libro>("libros", SEED_LIBROS);
  return [...rows].sort((a, b) => a.titulo.localeCompare(b.titulo));
}

export async function getLibro(id: string): Promise<Libro | undefined> {
  const rows = await readCollection<Libro>("libros", SEED_LIBROS);
  return rows.find((l) => l.id === id);
}

export async function createLibro(data: Omit<Libro, "id">): Promise<string> {
  const id = `lib-${Date.now()}`;
  return mutateCollection<Libro, string>("libros", SEED_LIBROS, (rows) => ({
    rows: [...rows, { ...data, id }],
    result: id,
  }));
}

export async function updateLibro(id: string, data: Omit<Libro, "id">): Promise<void> {
  await mutateCollection<Libro, void>("libros", SEED_LIBROS, (rows) => ({
    rows: rows.map((l) => (l.id === id ? { ...data, id } : l)),
    result: undefined,
  }));
}

export async function deleteLibro(id: string): Promise<void> {
  await mutateCollection<Libro, void>("libros", SEED_LIBROS, (rows) => ({
    rows: rows.filter((l) => l.id !== id),
    result: undefined,
  }));
}

// ─── Cursos ──────────────────────────────────────────────────────────────────

export async function getCursos(): Promise<Curso[]> {
  const rows = await readCollection<Curso>("cursos", SEED_CURSOS);
  return [...rows].sort(byFecha);
}

export async function getCursosPublicos(): Promise<Curso[]> {
  const rows = await getCursos();
  return rows.filter((c) => c.fecha >= hoy());
}

export async function getCurso(id: string): Promise<Curso | undefined> {
  const rows = await readCollection<Curso>("cursos", SEED_CURSOS);
  return rows.find((c) => c.id === id);
}

export async function createCurso(data: Omit<Curso, "id">): Promise<string> {
  const id = `cur-${Date.now()}`;
  return mutateCollection<Curso, string>("cursos", SEED_CURSOS, (rows) => ({
    rows: [...rows, { ...data, id }],
    result: id,
  }));
}

export async function updateCurso(id: string, data: Omit<Curso, "id">): Promise<void> {
  await mutateCollection<Curso, void>("cursos", SEED_CURSOS, (rows) => ({
    rows: rows.map((c) => (c.id === id ? { ...data, id } : c)),
    result: undefined,
  }));
}

export async function deleteCurso(id: string): Promise<void> {
  await mutateCollection<Curso, void>("cursos", SEED_CURSOS, (rows) => ({
    rows: rows.filter((c) => c.id !== id),
    result: undefined,
  }));
}

// ─── Config ──────────────────────────────────────────────────────────────────

export async function getAllConfigValues(): Promise<Record<string, string>> {
  return readConfig(SEED_CONFIG);
}

export async function getConfigValue(key: string): Promise<string | undefined> {
  const cfg = await readConfig(SEED_CONFIG);
  return cfg[key];
}

export async function setConfigValues(data: Record<string, string>): Promise<void> {
  await writeConfig(SEED_CONFIG, data);
}

// ─── Textos de las páginas ───────────────────────────────────────────────────
//
// Solo se guarda lo que alguien editó. Los textos por defecto viven en
// src/config/textos.ts, así que cambiarlos en el código se ve enseguida en
// todos los campos que nadie tocó.

export async function getAllTextos(): Promise<Record<string, string>> {
  return readRecord("textos", {});
}

export async function setTextos(data: Record<string, string>): Promise<void> {
  await writeRecord("textos", {}, data);
}

// ─── Hitos ───────────────────────────────────────────────────────────────────

export async function getHitos(): Promise<Hito[]> {
  const rows = await readCollection<Hito>("hitos", SEED_HITOS);
  return [...rows].sort(byOrden);
}

export async function getHito(id: string): Promise<Hito | undefined> {
  const rows = await readCollection<Hito>("hitos", SEED_HITOS);
  return rows.find((h) => h.id === id);
}

export async function createHito(data: Omit<Hito, "id" | "orden">): Promise<string> {
  const id = `hito-${Date.now()}`;
  return mutateCollection<Hito, string>("hitos", SEED_HITOS, (rows) => ({
    rows: [...rows, { ...data, id, orden: nextOrden(rows) }],
    result: id,
  }));
}

export async function updateHito(id: string, data: Pick<Hito, "anio" | "texto">): Promise<void> {
  await mutateCollection<Hito, void>("hitos", SEED_HITOS, (rows) => ({
    rows: rows.map((h) => (h.id === id ? { ...h, ...data } : h)),
    result: undefined,
  }));
}

export async function deleteHito(id: string): Promise<void> {
  await mutateCollection<Hito, void>("hitos", SEED_HITOS, (rows) => ({
    rows: rows.filter((h) => h.id !== id),
    result: undefined,
  }));
}

// ─── Especies ─────────────────────────────────────────────────────────────────

export async function getEspecies(): Promise<Especie[]> {
  const rows = await readCollection<Especie>("especies", SEED_ESPECIES);
  return [...rows].sort((a, b) => a.orden - b.orden || a.categoria.localeCompare(b.categoria));
}

export async function getEspecie(id: string): Promise<Especie | undefined> {
  const rows = await readCollection<Especie>("especies", SEED_ESPECIES);
  return rows.find((e) => e.id === id);
}

export async function createEspecie(data: Omit<Especie, "id" | "orden">): Promise<string> {
  const id = `esp-${Date.now()}`;
  return mutateCollection<Especie, string>("especies", SEED_ESPECIES, (rows) => ({
    rows: [...rows, { ...data, id, orden: nextOrden(rows) }],
    result: id,
  }));
}

export async function updateEspecie(id: string, data: Omit<Especie, "id" | "orden">): Promise<void> {
  await mutateCollection<Especie, void>("especies", SEED_ESPECIES, (rows) => ({
    rows: rows.map((e) => (e.id === id ? { ...e, ...data } : e)),
    result: undefined,
  }));
}

export async function deleteEspecie(id: string): Promise<void> {
  await mutateCollection<Especie, void>("especies", SEED_ESPECIES, (rows) => ({
    rows: rows.filter((e) => e.id !== id),
    result: undefined,
  }));
}

// ─── Socios ──────────────────────────────────────────────────────────────────

export async function getSocios(): Promise<Socio[]> {
  const rows = await readCollection<Socio>("socios", SEED_SOCIOS);
  return [...rows].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function getSocioById(id: string): Promise<Socio | undefined> {
  const rows = await readCollection<Socio>("socios", SEED_SOCIOS);
  return rows.find((s) => s.id === id);
}

export async function getSocioByEmail(email: string): Promise<Socio | undefined> {
  const rows = await readCollection<Socio>("socios", SEED_SOCIOS);
  return rows.find((s) => s.email === email.toLowerCase());
}

export async function createSocio(data: {
  nombre: string; email: string; password_hash: string; salt: string;
}): Promise<string> {
  const id = `socio-${Date.now()}`;
  return mutateCollection<Socio, string>("socios", SEED_SOCIOS, (rows) => ({
    rows: [
      ...rows,
      {
        id,
        nombre: data.nombre,
        email: data.email.toLowerCase(),
        password_hash: data.password_hash,
        salt: data.salt,
        activo: 1,
        created_at: hoy(),
      },
    ],
    result: id,
  }));
}

/**
 * Alta de varios socios en una sola escritura.
 *
 * No es createSocio en un bucle por dos razones: cada vuelta leería y
 * escribiría la colección entera, y el id sale de Date.now(), así que dos
 * altas dentro de la misma milésima compartirían id.
 */
export async function createSociosBulk(
  socios: { nombre: string; email: string; password_hash: string; salt: string }[]
): Promise<number> {
  if (socios.length === 0) return 0;
  const base = Date.now();
  const fecha = hoy();
  return mutateCollection<Socio, number>("socios", SEED_SOCIOS, (rows) => ({
    rows: [
      ...rows,
      ...socios.map((s, i) => ({
        id: `socio-${base}-${i}`,
        nombre: s.nombre,
        email: s.email.toLowerCase(),
        password_hash: s.password_hash,
        salt: s.salt,
        activo: 1 as const,
        created_at: fecha,
      })),
    ],
    result: socios.length,
  }));
}

export async function toggleSocioActivo(id: string): Promise<void> {
  await mutateCollection<Socio, void>("socios", SEED_SOCIOS, (rows) => ({
    rows: rows.map((s) => (s.id === id ? { ...s, activo: s.activo === 1 ? 0 : 1 } : s)),
    result: undefined,
  }));
}

export async function updateSocioPassword(
  id: string, password_hash: string, salt: string
): Promise<void> {
  await mutateCollection<Socio, void>("socios", SEED_SOCIOS, (rows) => ({
    rows: rows.map((s) => (s.id === id ? { ...s, password_hash, salt } : s)),
    result: undefined,
  }));
}

export async function deleteSocio(id: string): Promise<void> {
  await mutateCollection<Socio, void>("socios", SEED_SOCIOS, (rows) => ({
    rows: rows.filter((s) => s.id !== id),
    result: undefined,
  }));
}

// ─── Recursos socios ──────────────────────────────────────────────────────────

export async function getRecursosSocios(soloActivos = false): Promise<RecursoSocio[]> {
  const rows = await readCollection<RecursoSocio>("recursos_socios", SEED_RECURSOS);
  const sorted = [...rows].sort(
    (a, b) => a.orden - b.orden || a.categoria.localeCompare(b.categoria)
  );
  return soloActivos ? sorted.filter((r) => r.activo === 1) : sorted;
}

export async function getRecursoSocio(id: string): Promise<RecursoSocio | undefined> {
  const rows = await readCollection<RecursoSocio>("recursos_socios", SEED_RECURSOS);
  return rows.find((r) => r.id === id);
}

export async function createRecursoSocio(
  data: Omit<RecursoSocio, "id" | "orden">
): Promise<string> {
  const id = `rec-${Date.now()}`;
  return mutateCollection<RecursoSocio, string>("recursos_socios", SEED_RECURSOS, (rows) => ({
    rows: [...rows, { ...data, id, orden: nextOrden(rows) }],
    result: id,
  }));
}

export async function updateRecursoSocio(
  id: string, data: Omit<RecursoSocio, "id" | "orden">
): Promise<void> {
  await mutateCollection<RecursoSocio, void>("recursos_socios", SEED_RECURSOS, (rows) => ({
    rows: rows.map((r) => (r.id === id ? { ...r, ...data } : r)),
    result: undefined,
  }));
}

export async function toggleRecursoActivo(id: string): Promise<void> {
  await mutateCollection<RecursoSocio, void>("recursos_socios", SEED_RECURSOS, (rows) => ({
    rows: rows.map((r) => (r.id === id ? { ...r, activo: r.activo === 1 ? 0 : 1 } : r)),
    result: undefined,
  }));
}

export async function deleteRecursoSocio(id: string): Promise<void> {
  await mutateCollection<RecursoSocio, void>("recursos_socios", SEED_RECURSOS, (rows) => ({
    rows: rows.filter((r) => r.id !== id),
    result: undefined,
  }));
}

// ─── Biblioteca ───────────────────────────────────────────────────────────────

export async function getMateriales(soloActivos = false): Promise<MaterialBiblioteca[]> {
  const rows = await readCollection<MaterialBiblioteca>("biblioteca", SEED_BIBLIOTECA);
  const sorted = [...rows].sort(byOrden);
  return soloActivos ? sorted.filter((m) => m.activo === 1) : sorted;
}

export async function getMaterial(id: string): Promise<MaterialBiblioteca | undefined> {
  const rows = await readCollection<MaterialBiblioteca>("biblioteca", SEED_BIBLIOTECA);
  return rows.find((m) => m.id === id);
}

export async function createMaterial(
  data: Omit<MaterialBiblioteca, "id" | "orden">
): Promise<string> {
  const id = `mat-${Date.now()}`;
  return mutateCollection<MaterialBiblioteca, string>("biblioteca", SEED_BIBLIOTECA, (rows) => ({
    rows: [...rows, { ...data, id, orden: nextOrden(rows) }],
    result: id,
  }));
}

/** No toca `activo`: mostrar u ocultar se hace con toggleMaterialActivo. */
export async function updateMaterial(
  id: string,
  data: Omit<MaterialBiblioteca, "id" | "orden" | "activo">
): Promise<void> {
  await mutateCollection<MaterialBiblioteca, void>("biblioteca", SEED_BIBLIOTECA, (rows) => ({
    rows: rows.map((m) => (m.id === id ? { ...m, ...data } : m)),
    result: undefined,
  }));
}

export async function toggleMaterialActivo(id: string): Promise<void> {
  await mutateCollection<MaterialBiblioteca, void>("biblioteca", SEED_BIBLIOTECA, (rows) => ({
    rows: rows.map((m) => (m.id === id ? { ...m, activo: m.activo === 1 ? 0 : 1 } : m)),
    result: undefined,
  }));
}

export async function deleteMaterial(id: string): Promise<void> {
  await mutateCollection<MaterialBiblioteca, void>("biblioteca", SEED_BIBLIOTECA, (rows) => ({
    rows: rows.filter((m) => m.id !== id),
    result: undefined,
  }));
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_EVENTOS: Evento[] = [
  {
    id: "ev-seed-1",
    titulo: "Curso de adiestramiento: primeros auxilios",
    fecha: "2026-07-19", hora: "9:00 h", tipo: "Curso",
    descripcion: "Formación práctica en primeros auxilios orientada a situaciones de campamento. Incluye práctica de RCP y manejo de emergencias.",
    destinatarios: "Dirigentes y caminantes", cupos: "20 personas",
  },
  {
    id: "ev-seed-2",
    titulo: "Acampe de invierno",
    fecha: "2026-07-25", hora: "", tipo: "Acampe",
    descripcion: "Acampe de invierno abierto para grupos scouts de todas las ramas. Subcampos disponibles por orden de reserva.",
    destinatarios: "Grupos scouts", cupos: "",
  },
  {
    id: "ev-seed-3",
    titulo: "Charla: flora nativa bonaerense",
    fecha: "2026-08-15", hora: "15:00 h", tipo: "Charla",
    descripcion: "Recorrida guiada por el predio con un especialista en botánica. Identificación de especies nativas y su importancia ecológica.",
    destinatarios: "Abierto a la comunidad", cupos: "30 personas",
  },
  {
    id: "ev-seed-4",
    titulo: "Jornada de mantenimiento del predio",
    fecha: "2026-09-05", hora: "8:00 h", tipo: "Actividad",
    descripcion: "Día de trabajo comunitario para el mantenimiento de infraestructura y limpieza del campo. Se agradece la participación.",
    destinatarios: "Socios y voluntarios", cupos: "",
  },
  {
    id: "ev-seed-5",
    titulo: "Curso de orientación con brújula y mapa",
    fecha: "2026-10-10", hora: "9:00 h", tipo: "Curso",
    descripcion: "Introducción a la lectura de mapas topográficos y uso de la brújula. Práctica en el terreno del predio.",
    destinatarios: "Scouts mayores y dirigentes", cupos: "20 personas",
  },
  {
    id: "ev-seed-6",
    titulo: "Campamento de primavera",
    fecha: "2026-11-07", hora: "", tipo: "Acampe",
    descripcion: "Campamento de primavera multi-grupo. Actividades de naturaleza, técnicas de campismo y fogón de cierre.",
    destinatarios: "Grupos scouts", cupos: "",
  },
];

const SEED_LIBROS: Libro[] = [
  {
    id: "escultismo-muchos",
    titulo: "Escultismo para muchachos", autor: "Robert Baden-Powell",
    categoria: "Escultismo", precio: 3500,
    descripcion: "El libro fundacional del movimiento scout. Técnicas de campismo, valores y el método scout explicados por su creador.",
    disponible: true,
  },
  {
    id: "flora-bonaerense",
    titulo: "Guía de flora nativa bonaerense", autor: "D. Roitman y A. Trucco",
    categoria: "Naturaleza", precio: 4200,
    descripcion: "Identificación de especies vegetales nativas de la provincia de Buenos Aires. Con fotos y fichas detalladas.",
    disponible: true,
  },
  {
    id: "manual-dirigente",
    titulo: "Manual del dirigente scout", autor: "Movimiento Scout Argentino",
    categoria: "Formación", precio: 2800,
    descripcion: "Guía práctica para dirigentes: pedagogía scout, planificación de actividades, técnicas de liderazgo y trabajo con grupos.",
    disponible: true,
  },
  {
    id: "nudos",
    titulo: "Nudos: técnicas y aplicaciones", autor: "C. H. Torres",
    categoria: "Escultismo", precio: 1900,
    descripcion: "Guía ilustrada de los nudos más usados en el campismo: ballestrinque, as de guía, vuelta de escota y más.",
    disponible: true,
  },
  {
    id: "libro-selva",
    titulo: "El libro de la selva", autor: "Rudyard Kipling",
    categoria: "Literatura", precio: 2500,
    descripcion: "La obra clásica que inspiró al fundador del escultismo. Ideal para lecturas compartidas en campamentos.",
    disponible: false,
  },
  {
    id: "supervivencia",
    titulo: "Supervivencia en la naturaleza", autor: "P. N. Díaz",
    categoria: "Naturaleza", precio: 3100,
    descripcion: "Técnicas de supervivencia adaptadas al entorno pampeano: refugio, agua, fuego, primeros auxilios y orientación.",
    disponible: true,
  },
];

const SEED_CURSOS: Curso[] = [
  {
    id: "cur-seed-1",
    titulo: "Nudos y técnicas de campismo",
    descripcion: "Taller práctico de nudos esenciales, montaje de carpas y técnicas básicas de supervivencia en el campo.",
    fecha: "2026-07-05", hora: "9:00 h", nivel: "Básico",
    destinatarios: "Scouts y dirigentes", cupos: "25 personas",
  },
  {
    id: "cur-seed-2",
    titulo: "Primeros auxilios en el campo",
    descripcion: "Formación práctica en primeros auxilios orientada a situaciones de campamento. Incluye práctica de RCP y manejo de emergencias.",
    fecha: "2026-07-19", hora: "9:00 h", nivel: "Intermedio",
    destinatarios: "Dirigentes y caminantes", cupos: "20 personas",
  },
  {
    id: "cur-seed-3",
    titulo: "Orientación con brújula y mapa",
    descripcion: "Introducción a la lectura de mapas topográficos y uso de la brújula. Práctica en el terreno del predio.",
    fecha: "2026-08-02", hora: "9:00 h", nivel: "Básico",
    destinatarios: "Scouts mayores y dirigentes", cupos: "20 personas",
  },
];

const SEED_CONFIG: Record<string, string> = {
  whatsapp: "5491100000000",
  whatsappDisplay: "+54 9 11 0000-0000",
  // El mail real de reservas, publicado por el Consejo de Campo en el blog.
  email: "reservascampoescuelaflandes@gmail.com",
  facebook: "https://www.facebook.com/Campo.Escuela.Flande",
  instagram: "https://www.instagram.com/campoescuela",
  youtube: "https://youtube.com/",
  location: "Jáuregui, Buenos Aires, Argentina",
  subcampo1: "Santa Clara de Asís",
  subcampo2: "Ntra. Sra. de Luján",
  subcampo3: "San Jorge",
  subcampo4: "San Francisco de Asís",
  cuota_mensual: "",
  // Números por área. Vacío = se usa el número general de arriba.
  whatsapp_formaciones: "",
  whatsapp_biblioteca: "",
  whatsapp_socios: "",
  // Responsable de socios. Sin nombre no se muestra nada en el sitio.
  responsable_socios_nombre: "",
  responsable_socios_contacto: "",
  responsable_socios_publico: "",
  site_url: "https://campoescuelaflandes.org",
  // Coordenadas del predio, para el mapa satelital embebido.
  mapa_lat: "-34.546312",
  mapa_lng: "-59.146240",
};

const SEED_HITOS: Hito[] = [
  { id: "hito-1", anio: "1958", texto: "Se funda el Campo Escuela Flandes. Algodonera Flandria cede el predio a los Scouts para que puedan realizar allí sus actividades.", orden: 0 },
  { id: "hito-2", anio: "Desde entonces", texto: "Se conservan y mejoran de forma ininterrumpida la estructura edilicia y los distintos ambientes naturales del predio.", orden: 1 },
  { id: "hito-3", anio: "2000", texto: "El predio es declarado Área Forestal Protegida junto con otros terrenos locales lindantes al río (Decreto Municipal 787/00).", orden: 2 },
  { id: "hito-4", anio: "Hoy", texto: "El campo sigue abierto a los grupos y su equipo de Adiestramiento dicta cursos para dirigentes. Se sostiene con el aporte de quienes acampan y con los servicios al campo, jornadas en las que scouts y guías vienen a trabajar en el mantenimiento del predio.", orden: 3 },
];

// Especies con respaldo documental de que están en el predio o en su ribera.
// Fuentes: el plano del campo (nombra álamos, araucarias, eucaliptos y robles
// por subcampo); el censo forestal de Tuis en el Campo Escuela Flandes, citado
// por el atlas del SIAI-UNLu; la enciclopedia del Jardín Botánico de la UNLu
// (jardinbotanico.unlu.edu.ar/enciclopedia), de donde salen los datos botánicos;
// y Guichón et al. 2007 (Ecología Austral 17:81-90), que relevó la fauna
// ribereña a lo largo de los 166 km del Río Luján.
// Los textos son redacción propia: de las fuentes se toman los datos, no la prosa.
// Están escritos para un chico que escanea el QR parado frente a la especie.
const SEED_ESPECIES: Especie[] = [
  {
    id: "araucaria",
    nombreComun: "Araucaria",
    nombreCientifico: "Araucaria angustifolia",
    categoria: "Flora",
    descripcion:
      "Se reconoce de lejos: tronco alto y derecho, pelado abajo, y una copa que de grande parece un paraguas. Las hojas son duras y punzantes, y se acomodan en espiral alrededor de la rama. Pasa los 30 metros de alto.",
    curiosidad:
      "No es de acá. Crece naturalmente en las selvas de Misiones, donde llueve casi tres veces más que en Luján: las del campo las plantó alguien. Sus piñones se comen, y fueron un alimento importante para los pueblos originarios de esa región.",
    qrDisponible: false,
    orden: 0,
  },
  {
    id: "roble",
    nombreComun: "Roble europeo",
    nombreCientifico: "Quercus robur",
    categoria: "Flora",
    descripcion:
      "De hoja caduca: en otoño queda pelado y en primavera vuelve a brotar entero. Su fruto es la bellota, que cae al suelo al final del verano. Es uno de los árboles más abundantes del campo.",
    curiosidad:
      "Vino de Europa. En el censo de árboles que se hizo acá en el campo, los robles jóvenes estaban entre los más numerosos: crecieron solos a partir de las bellotas caídas, incluso con la poca luz que llega debajo de los árboles grandes.",
    qrDisponible: false,
    orden: 1,
  },
  {
    id: "ceibo",
    nombreComun: "Ceibo",
    nombreCientifico: "Erythrina crista-galli",
    categoria: "Flora",
    descripcion:
      "Árbol de la orilla, de 4 a 12 metros. Sus flores rojas se agrupan en racimos largos y no se confunden con ninguna otra. Las hojas vienen de a tres, y el tallo tiene aguijones: se mira, no se agarra.",
    curiosidad:
      "Su flor es la flor nacional argentina. El nombre científico la describe entera: Erythrina viene del griego \"rojo\", y crista-galli quiere decir \"cresta de gallo\".",
    qrDisponible: false,
    orden: 2,
  },
  {
    id: "sauce",
    nombreComun: "Sauce criollo",
    nombreCientifico: "Salix humboldtiana",
    categoria: "Flora",
    descripcion:
      "Crece con los pies casi en el agua, sobre la barranca del río. Las hojas son finitas y largas, de hasta 15 centímetros, con el borde apenas serruchado. Llega a 18 metros y el tronco puede superar el metro de ancho.",
    curiosidad:
      "Lleva el apellido de Alexander von Humboldt, un naturalista alemán que recorrió América hace más de doscientos años. Sus flores son melíferas: si te parás cerca en primavera, vas a escuchar las abejas antes de verlas.",
    qrDisponible: false,
    orden: 3,
  },
  {
    id: "tala",
    nombreComun: "Tala",
    nombreCientifico: "Celtis tala",
    categoria: "Flora",
    descripcion:
      "Árbol chico y muy ramificado, de 3 a 12 metros, con espinas en las ramas. Las hojas son ovaladas, de verde brillante y con el borde dentado. Da frutos anaranjados del tamaño de una arveja, dulces.",
    curiosidad:
      "Su leña da tanto calor que la llaman \"leña fuerte\". En la provincia de Buenos Aires el tala forma bosques enteros, que por él se llaman talares.",
    qrDisponible: false,
    orden: 4,
  },
  {
    id: "espinillo",
    nombreComun: "Espinillo",
    nombreCientifico: "Vachellia caven",
    categoria: "Flora",
    descripcion:
      "Árbol chico y espinoso, de copa abierta y rala. En primavera se llena de flores amarillas y redondas como pompones, muy perfumadas. Las espinas son largas y salen de a dos.",
    curiosidad:
      "Con sus flores se llegó a preparar perfume. Es de los primeros en florecer cuando termina el invierno, así que suele ser la primera mancha amarilla del año.",
    qrDisponible: false,
    orden: 5,
  },
  {
    id: "carpincho",
    nombreComun: "Carpincho",
    nombreCientifico: "Hydrochoerus hydrochaeris",
    categoria: "Fauna",
    descripcion:
      "El roedor más grande del mundo. Vive cerca del agua, casi siempre en grupo, y come pasto. Nada muy bien: puede quedarse sumergido dejando afuera nada más que los ojos y la nariz.",
    curiosidad:
      "Tiene los ojos, las orejas y los agujeros de la nariz alineados en lo alto de la cabeza, justo para poder mirar, oír y respirar con todo el resto del cuerpo bajo el agua.",
    qrDisponible: false,
    orden: 6,
  },
  {
    id: "coipo",
    nombreComun: "Coipo o nutria",
    nombreCientifico: "Myocastor coypus",
    categoria: "Fauna",
    descripcion:
      "Roedor de río, bastante más chico que el carpincho, con la cola larga y pelada y los dientes de adelante anaranjados. Hace sus cuevas en la barranca de la orilla y se mueve sobre todo de noche.",
    curiosidad:
      "Las hembras tienen las tetas en el costado del lomo y no en la panza: así pueden amamantar a las crías mientras van nadando.",
    qrDisponible: false,
    orden: 7,
  },
  {
    id: "lobito-de-rio",
    nombreComun: "Lobito de río",
    nombreCientifico: "Lontra longicaudis",
    categoria: "Fauna",
    descripcion:
      "Un carnívoro que nada. Cuerpo largo y bajo, patas cortas con membranas entre los dedos y una cola gruesa que usa de timón. Come peces y cangrejos.",
    curiosidad:
      "Es el más difícil de ver de los tres mamíferos que un relevamiento encontró en la ribera del Río Luján. Si aparece, casi siempre es al amanecer o al atardecer, y lo más común es ver la huella y no al animal.",
    qrDisponible: false,
    orden: 8,
  },
  {
    id: "hornero",
    nombreComun: "Hornero",
    nombreCientifico: "Furnarius rufus",
    categoria: "Fauna",
    descripcion:
      "El pájaro más conocido del campo. Levanta con barro un nido en forma de horno, con la entrada al costado y una cámara adentro. Anda casi siempre caminando por el suelo, buscando bichos.",
    curiosidad:
      "Es el ave nacional argentina. Cada nido lo usa una sola temporada: después queda vacío y lo aprovechan otros pájaros para criar.",
    qrDisponible: false,
    orden: 9,
  },
  {
    id: "martin-pescador",
    nombreComun: "Martín pescador",
    nombreCientifico: "Megaceryle torquata",
    categoria: "Fauna",
    descripcion:
      "Se lo ve posado y quieto sobre una rama que da al agua, mirando para abajo. Cuando marca un pez se tira de golpe, de cabeza. Tiene la cabeza grande, el pico largo y recto, y el pecho colorado.",
    curiosidad:
      "Antes de zambullirse queda un momento suspendido en el aire batiendo las alas, como si estuviera clavado en el cielo, para calcular el tiro.",
    qrDisponible: false,
    orden: 10,
  },

  // ── Las doce del Bordón ───────────────────────────────────────────────────
  // Cada capítulo de "Conociendo el Campo Escuela Flandes" presenta un árbol y
  // un animal del predio. Es el respaldo más directo que hay: los filmó el área
  // de Adiestramiento del campo, en el campo.
  {
    id: "cipres-calvo",
    nombreComun: "Ciprés calvo",
    nombreCientifico: "Taxodium distichum",
    categoria: "Flora",
    descripcion:
      "Una conífera que se queda pelada en invierno, cosa rara entre los cipreses: de ahí lo de calvo. Las hojas son finitas y planas, y antes de caerse se ponen color óxido. Aguanta el suelo empapado como pocos.",
    curiosidad:
      "Cuando le toca terreno anegado, le brotan alrededor del tronco unos bultos de madera que salen del suelo como rodillas. Le sirven para respirar cuando las raíces quedan bajo el agua. Es el árbol del capítulo 1 del Bordón.",
    qrDisponible: false,
    orden: 11,
  },
  {
    id: "cipres-arizona",
    nombreComun: "Ciprés Arizona",
    nombreCientifico: "Cupressus arizonica",
    categoria: "Flora",
    descripcion:
      "Copa densa y cónica, de un verde grisáceo que tira a celeste: es lo que lo separa a simple vista de los otros cipreses del campo. Las hojas son escamas diminutas pegadas a la ramita, y los conos, bolitas leñosas del tamaño de una uva.",
    curiosidad:
      "Viene de las zonas secas del sudoeste de Estados Unidos y del norte de México, así que acá vive con más agua de la que necesita. Es el árbol del capítulo 2 del Bordón.",
    qrDisponible: false,
    orden: 12,
  },
  {
    id: "casuarina",
    nombreComun: "Casuarina",
    nombreCientifico: "Casuarina cunninghamiana",
    categoria: "Flora",
    descripcion:
      "De lejos parece un pino, pero no lo es. Lo que parecen agujas son ramitas verdes finísimas, y si las mirás de cerca tienen anillos, como un dedo. Cuando sopla viento hace un silbido muy suyo.",
    curiosidad:
      "Es australiana, y sus hojas de verdad son unas escamas mínimas en cada anillo de la ramita: lo verde que ves no son hojas, son ramas. Es el árbol del capítulo 3 del Bordón.",
    qrDisponible: false,
    orden: 13,
  },
  {
    id: "pino-elliotti",
    nombreComun: "Pino Elliotti",
    nombreCientifico: "Pinus elliottii",
    categoria: "Flora",
    descripcion:
      "Pino alto y derecho, con la corteza gruesa partida en placas. Las agujas salen de a dos o tres por manojo y son largas, de más de quince centímetros. Las piñas son grandes y pinchudas.",
    curiosidad:
      "Es del sudeste de Estados Unidos y se planta mucho por su resina, que se junta haciéndole un corte al tronco. Es el árbol del capítulo 4 del Bordón.",
    qrDisponible: false,
    orden: 14,
  },
  {
    id: "arbol-del-cielo",
    nombreComun: "Árbol del cielo",
    nombreCientifico: "Ailanthus altissima",
    categoria: "Flora",
    descripcion:
      "Crece rapidísimo y aparece por todos lados. La hoja es compuesta y muy larga, con muchos folíolos enfrentados de a pares. Si rompés una, larga un olor fuerte y feo.",
    curiosidad:
      "Es de China y acá se porta como invasora: si la cortás, rebrota desde la raíz con más fuerza. En el censo de árboles del campo estaba entre las más numerosas. Es el árbol del capítulo 5 del Bordón.",
    qrDisponible: false,
    orden: 15,
  },
  {
    id: "cipres-piramidal",
    nombreComun: "Ciprés piramidal",
    nombreCientifico: "Cupressus sempervirens",
    categoria: "Flora",
    descripcion:
      "El ciprés angosto y altísimo que parece una columna verde clavada en el pasto. Casi no tiene ramas hacia afuera: le crecen todas pegadas al tronco, apuntando para arriba.",
    curiosidad:
      "Es del Mediterráneo y puede vivir varios siglos. Su nombre científico, sempervirens, quiere decir \"siempre verde\". Es el árbol del capítulo 6 del Bordón.",
    qrDisponible: false,
    orden: 16,
  },
  {
    id: "liebre",
    nombreComun: "Liebre europea",
    nombreCientifico: "Lepus europaeus",
    categoria: "Fauna",
    descripcion:
      "Más grande que un conejo, con las orejas largas de punta negra y las patas de atrás enormes. No hace cueva: se queda agachada y quieta en el pasto, y recién cuando estás encima sale disparada.",
    curiosidad:
      "Corre a más de sesenta kilómetros por hora y cambia de dirección de golpe para despistar al que la persigue. Es el animal del capítulo 1 del Bordón.",
    qrDisponible: false,
    orden: 17,
  },
  {
    id: "zorzal-colorado",
    nombreComun: "Zorzal colorado",
    nombreCientifico: "Turdus rufiventris",
    categoria: "Fauna",
    descripcion:
      "Del tamaño de una mano, marrón arriba y con la panza color ladrillo. Anda por el pasto a los saltitos, frenando en seco cada tanto para escuchar antes de tirar del pico una lombriz.",
    curiosidad:
      "Es de los primeros en cantar antes de que salga el sol y de los últimos en callarse cuando oscurece. Es el animal del capítulo 2 del Bordón.",
    qrDisponible: false,
    orden: 18,
  },
  {
    id: "carpintero-real",
    nombreComun: "Carpintero real",
    nombreCientifico: "Colaptes melanochloros",
    categoria: "Fauna",
    descripcion:
      "Se escucha antes de verse: golpea el tronco con el pico, rápido y seco. Tiene el lomo rayado en amarillo y negro, la panza con manchitas, y el macho un bigote rojo.",
    curiosidad:
      "Su lengua es larguísima y pegajosa, y le da la vuelta al cráneo por dentro cuando la guarda. Con ella saca las hormigas del fondo de una galería. Es el animal del capítulo 3 del Bordón.",
    qrDisponible: false,
    orden: 19,
  },
  {
    id: "ratona",
    nombreComun: "Ratona común",
    nombreCientifico: "Troglodytes aedon",
    categoria: "Fauna",
    descripcion:
      "Una de las aves más chicas del campo: doce centímetros de pájaro marrón que no se queda quieto nunca. Lleva la cola parada para arriba y se mete entre los troncos y los huecos.",
    curiosidad:
      "Acá se le dice ratucha justamente por eso: es chiquita, marrón y se mueve como un ratón. Anida en cualquier agujero, incluso en un tarro o un buzón. Es el animal del capítulo 4 del Bordón.",
    qrDisponible: false,
    orden: 20,
  },
  {
    id: "lechuza-campanario",
    nombreComun: "Lechuza de campanario",
    nombreCientifico: "Tyto alba",
    categoria: "Fauna",
    descripcion:
      "La de cara blanca en forma de corazón. Sale de noche y no canta: chista y chilla. De día duerme metida en un hueco alto, en un árbol o en un techo.",
    curiosidad:
      "Vuela sin hacer ningún ruido, porque el borde de sus plumas es aterciopelado y no corta el aire. Su cara con forma de plato le junta el sonido hacia los oídos, y le alcanza para cazar a oscuras. Es el animal del capítulo 5 del Bordón.",
    qrDisponible: false,
    orden: 21,
  },
  {
    id: "torcacita",
    nombreComun: "Torcacita común",
    nombreCientifico: "Columbina picui",
    categoria: "Fauna",
    descripcion:
      "La palomita más chica que vas a ver en el campo, gris clarita y del largo de un lápiz. Anda por el suelo en pareja o de a varias, picoteando semillas.",
    curiosidad:
      "Al levantar vuelo muestra una franja blanca en el ala y las alas le hacen un silbido corto. Es el animal del capítulo 6 del Bordón.",
    qrDisponible: false,
    orden: 22,
  },
];

// Sin socios de ejemplo: el padrón se carga desde el panel. Había acá un socio
// de prueba con la clave escrita en el código, y el repositorio es público.
// Además, si el almacenamiento falla, readCollection cae en este seed: un seed
// con credenciales habría abierto el portal justo durante una caída.
const SEED_SOCIOS: Socio[] = [];

const SEED_RECURSOS: RecursoSocio[] = [
  { id: "rec-seed-1", titulo: "Manual del dirigente",      descripcion: "Cargar acá el enlace al documento.", tipo: "link", url: "", categoria: "Formación", icono: "book",     orden: 0, activo: 1 },
  { id: "rec-seed-2", titulo: "Protocolos del campo",      descripcion: "Cargar acá el enlace al documento.", tipo: "link", url: "", categoria: "Formación", icono: "shield",   orden: 1, activo: 1 },
  { id: "rec-seed-3", titulo: "Fichas de actividades",     descripcion: "Cargar acá el enlace al documento.", tipo: "link", url: "", categoria: "Técnicas",  icono: "users",    orden: 2, activo: 1 },
  { id: "rec-seed-4", titulo: "Planificación anual",       descripcion: "Cargar acá el enlace al documento.", tipo: "link", url: "", categoria: "Técnicas",  icono: "calendar", orden: 3, activo: 1 },
  { id: "rec-seed-5", titulo: "Novedades para socios",     descripcion: "Cargar acá el enlace al documento.", tipo: "link", url: "", categoria: "General",   icono: "star",     orden: 4, activo: 1 },
  { id: "rec-seed-6", titulo: "Mapa del predio",           descripcion: "Cargar acá el enlace al documento.", tipo: "link", url: "", categoria: "General",   icono: "map",      orden: 5, activo: 1 },
];

// La serie se llama "Conociendo el Campo Escuela Flandes" y la hizo el área de
// Adiestramiento del campo en 2020. Cada capítulo cuenta un tramo de la historia
// del predio y presenta un árbol y un animal que viven ahí.
//
// Títulos tomados del canal del campo en YouTube. Ojo: los capítulos 1 y 2
// estaban invertidos respecto de los videos reales, y quedó corregido acá.
const SEED_BIBLIOTECA: MaterialBiblioteca[] = [
  { id: "bordon-1", titulo: "Capítulo 1 — Los inicios del campo", descripcion: "El ciprés calvo y la liebre.", tipo: "Bordón", url: "https://youtu.be/hRMVZiSJyQ4", orden: 0, activo: 1 },
  { id: "bordon-2", titulo: "Capítulo 2 — El Parque Algodonera Flandria", descripcion: "El ciprés Arizona y el zorzal colorado.", tipo: "Bordón", url: "https://youtu.be/KSIpD4xacyw", orden: 1, activo: 1 },
  { id: "bordon-3", titulo: "Capítulo 3 — 1956, nace el Campo Escuela", descripcion: "La casuarina y el carpintero real.", tipo: "Bordón", url: "https://youtu.be/Ml5t6EDs-wg", orden: 2, activo: 1 },
  { id: "bordon-4", titulo: "Capítulo 4 — Cómo era el campo", descripcion: "El pino Elliotti y la ratucha.", tipo: "Bordón", url: "https://youtu.be/2hOKzy371X8", orden: 3, activo: 1 },
  { id: "bordon-5", titulo: "Capítulo 5 — El campo en los 70", descripcion: "El árbol del cielo y la lechuza de campanario.", tipo: "Bordón", url: "https://youtu.be/gkm_ZsRQbyc", orden: 4, activo: 1 },
  { id: "bordon-6", titulo: "Capítulo 6 — La capilla del campo", descripcion: "El ciprés piramidal y la torcacita.", tipo: "Bordón", url: "https://youtu.be/gP07CuF3q-k", orden: 5, activo: 1 },

  // Biblioteca física del campo, relevada de las tapas.
  { id: "libro-manual-lobatos", titulo: "Manual de Lobatos", descripcion: "Lord Baden-Powell of Gilwell", tipo: "Físico", url: "", orden: 10, activo: 1 },
  { id: "libro-educacion-escultismo", titulo: "Educación y Escultismo", descripcion: "Piero Bertolini", tipo: "Físico", url: "", orden: 11, activo: 1 },
  { id: "libro-escultismo-muchachos", titulo: "Escultismo para Muchachos", descripcion: "Robert Baden-Powell", tipo: "Físico", url: "", orden: 12, activo: 1 },
  { id: "libro-cinco-minutos", titulo: "Los cinco minutos del Jefe de Tropa", descripcion: "", tipo: "Físico", url: "", orden: 13, activo: 1 },
  { id: "libro-manos-habiles", titulo: "Manos Hábiles", descripcion: "Albert Boekholt · Trabajos manuales de campamento y al aire libre", tipo: "Físico", url: "", orden: 14, activo: 1 },
  { id: "libro-roverismo-exito", titulo: "Roverismo hacia el Éxito", descripcion: "Robert Baden-Powell", tipo: "Físico", url: "", orden: 15, activo: 1 },
  { id: "libro-para-ti-guia", titulo: "Para ti… Guía de Patrulla", descripcion: "", tipo: "Físico", url: "", orden: 16, activo: 1 },
  { id: "libro-libro-selva", titulo: "El Libro de la Selva", descripcion: "Rudyard Kipling", tipo: "Físico", url: "", orden: 17, activo: 1 },
  { id: "libro-manual-guia-patrulla", titulo: "Manual del Guía de Patrulla", descripcion: "", tipo: "Físico", url: "", orden: 18, activo: 1 },
  { id: "libro-baloo-lepard", titulo: "Baloo de Lepard", descripcion: "Bérmari · Editorial Dunken", tipo: "Físico", url: "", orden: 19, activo: 1 },
  { id: "libro-roverismo-reto", titulo: "Roverismo, un reto de nuestro tiempo", descripcion: "Campo Escuela Flandes", tipo: "Físico", url: "", orden: 20, activo: 1 },
  { id: "libro-cartilla-tecnica", titulo: "Cartilla Técnica para Rovers y Guías Mayores", descripcion: "Campo Escuela Flandes · Ayudas para la progresión en el Clan", tipo: "Físico", url: "", orden: 21, activo: 1 },
  { id: "libro-vida-del-clan", titulo: "La Vida del Clan", descripcion: "Campo Escuela Flandes · De Rovers y de Guías Mayores", tipo: "Físico", url: "", orden: 22, activo: 1 },
  { id: "libro-escultismo-ruta", titulo: "Escultismo, ruta de la libertad", descripcion: "M. D. Forestier", tipo: "Físico", url: "", orden: 23, activo: 1 },
  { id: "libro-mi-patrulla", titulo: "Mi Patrulla", descripcion: "Campo Escuela Flandes · Una ayuda para los guías de patrulla", tipo: "Físico", url: "", orden: 24, activo: 1 },
  { id: "libro-scout-novicio", titulo: "Scout Novicio", descripcion: "Campo Escuela Flandes · Segunda edición", tipo: "Físico", url: "", orden: 25, activo: 1 },
  { id: "libro-especialidades", titulo: "Especialidades en la Rama Scout", descripcion: "Campo Escuela Flandes", tipo: "Físico", url: "", orden: 26, activo: 1 },
  { id: "libro-escultismo-ruta-2", titulo: "Escultismo, ruta de libertad", descripcion: "M. D. Forestier", tipo: "Físico", url: "", orden: 27, activo: 1 },
  { id: "libro-campismo-ilustrado", titulo: "Campismo Ilustrado", descripcion: "Enrique Brito Zaragoza", tipo: "Físico", url: "", orden: 28, activo: 1 },
  { id: "libro-guia-jefe-tropa", titulo: "Guía para el Jefe de Tropa", descripcion: "Lord Baden-Powell · Teoría del Escultismo para los Maestros Scout", tipo: "Físico", url: "", orden: 29, activo: 1 },
  { id: "libro-manual-jefe-grupo", titulo: "Manual para el Jefe de Grupo", descripcion: "Campo Escuela Flandes · Misión y tareas del Cuarto Hombre", tipo: "Físico", url: "", orden: 30, activo: 1 },
  { id: "libro-arboles-flandes", titulo: "Árboles del Campo Escuela Flandes", descripcion: "Campo Escuela Flandes · Las especies que habitan el predio", tipo: "Físico", url: "", orden: 31, activo: 1 },
  { id: "libro-arboles-argentinos", titulo: "Árboles argentinos", descripcion: "Demaio, Karlin y Medina · 30 especies emblemáticas", tipo: "Físico", url: "", orden: 32, activo: 1 },
  { id: "libro-aves-argentinas", titulo: "Aves argentinas", descripcion: "Tito Narosky · 30 especies emblemáticas", tipo: "Físico", url: "", orden: 33, activo: 1 },
  { id: "libro-joven-caracter", titulo: "La joven de Carácter", descripcion: "Tihamer Toth", tipo: "Físico", url: "", orden: 34, activo: 1 },
  { id: "libro-san-jorge", titulo: "San Jorge, el caballero que venció al dragón", descripcion: "Paula Verónica Reingold · Patrono de los Scouts", tipo: "Físico", url: "", orden: 35, activo: 1 },
  { id: "libro-religion-escultismo", titulo: "B.P.: La Religión en el Escultismo", descripcion: "Padre Guido Guerra, IMC", tipo: "Físico", url: "", orden: 36, activo: 1 },
  { id: "libro-vida-san-pablo", titulo: "Vida de San Pablo", descripcion: "Antonio Salas", tipo: "Físico", url: "", orden: 37, activo: 1 },
  { id: "libro-espiritualidad-scout", titulo: "Espiritualidad Scout", descripcion: "M. E. Mozichuk", tipo: "Físico", url: "", orden: 38, activo: 1 },
  { id: "libro-santa-catalina", titulo: "Santa Catalina de Siena", descripcion: "Intérprete del Amor de Dios", tipo: "Físico", url: "", orden: 39, activo: 1 },
];

// ─── Sincronización entre el código y lo guardado ────────────────────────────
//
// readCollection le da prioridad a lo guardado: una vez que la colección existe
// en el store, cambiar el seed del código no se ve nunca más. Es útil —es lo
// que hace que el panel mande— pero hace que un contenido nuevo escrito en el
// código pase desapercibido en producción. Estas funciones sirven para ver
// cuándo está pasando y para volcar el código encima a propósito.

/** Las colecciones que tienen datos de ejemplo en el código. */
const SEEDS: Record<string, readonly unknown[]> = {
  eventos: SEED_EVENTOS,
  libros: SEED_LIBROS,
  cursos: SEED_CURSOS,
  hitos: SEED_HITOS,
  especies: SEED_ESPECIES,
  socios: SEED_SOCIOS,
  recursos_socios: SEED_RECURSOS,
  biblioteca: SEED_BIBLIOTECA,
};

export type NombreColeccion = keyof typeof SEEDS;

export interface EstadoColeccion {
  nombre: string;
  /** Filas guardadas en el store, o null si todavía no se guardó nunca. */
  guardadas: number | null;
  /** Filas que trae el código. */
  enElCodigo: number;
}

export function nombresDeColecciones(): string[] {
  return Object.keys(SEEDS);
}

/** Para cada colección, si manda lo guardado o el código. */
export async function estadoDeColecciones(): Promise<EstadoColeccion[]> {
  return Promise.all(
    Object.entries(SEEDS).map(async ([nombre, seed]) => ({
      nombre,
      guardadas: await contarGuardadas(nombre),
      enElCodigo: seed.length,
    }))
  );
}

/**
 * Pisa una colección con lo que trae el código.
 * Es destructivo: lo que haya cargado el panel en esa colección se pierde.
 */
export async function restaurarColeccionDelCodigo(nombre: string): Promise<number> {
  const seed = SEEDS[nombre];
  if (!seed) throw new Error(`No existe la colección "${nombre}".`);
  await writeCollection(nombre, [...seed]);
  return seed.length;
}

export interface ClaveDesincronizada {
  clave: string;
  guardado: string;
  enElCodigo: string;
}

/**
 * Claves de configuración cuyo valor guardado difiere del que trae el código.
 * No se tocan solas: cambiarlas es decisión de quien administra, porque acá
 * viven cosas como el número de WhatsApp real del campo.
 */
export async function configDesincronizada(): Promise<ClaveDesincronizada[]> {
  const guardada = (await leerConfigCruda()) ?? {};
  return Object.entries(SEED_CONFIG)
    .filter(([clave, valorCodigo]) => {
      const g = guardada[clave];
      return g !== undefined && g !== valorCodigo;
    })
    .map(([clave, valorCodigo]) => ({
      clave,
      guardado: guardada[clave],
      enElCodigo: valorCodigo,
    }));
}
