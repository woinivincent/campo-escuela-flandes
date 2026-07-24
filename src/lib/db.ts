import { hashPassword } from "@/lib/crypto-utils";
import {
  readCollection,
  writeCollection,
  mutateCollection,
  readConfig,
  writeConfig,
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
  email: "contacto@campoflandes.org.ar",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  youtube: "https://youtube.com/",
  location: "Provincia de Buenos Aires, Argentina",
  subcampo1: "Subcampo 1",
  subcampo2: "Subcampo 2",
  subcampo3: "Subcampo 3",
  subcampo4: "Subcampo 4",
  cuota_mensual: "",
  site_url: "https://campoescuelaflandes.netlify.app",
};

const SEED_HITOS: Hito[] = [
  { id: "hito-1", anio: "1980s", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", orden: 0 },
  { id: "hito-2", anio: "1990s", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", orden: 1 },
  { id: "hito-3", anio: "2000s", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", orden: 2 },
  { id: "hito-4", anio: "Hoy",   texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", orden: 3 },
];

const SEED_ESPECIES: Especie[] = [
  { id: "espinillo",      nombreComun: "Espinillo",        nombreCientifico: "Vachellia caven",        categoria: "Flora", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.", curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", qrDisponible: false, orden: 0 },
  { id: "ceibo",          nombreComun: "Ceibo",            nombreCientifico: "Erythrina crista-galli", categoria: "Flora", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.", curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", qrDisponible: false, orden: 1 },
  { id: "sauce",          nombreComun: "Sauce criollo",    nombreCientifico: "Salix humboldtiana",     categoria: "Flora", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.", curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", qrDisponible: false, orden: 2 },
  { id: "tala",           nombreComun: "Tala",             nombreCientifico: "Celtis ehrenbergiana",   categoria: "Flora", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.", curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", qrDisponible: false, orden: 3 },
  { id: "carpincho",      nombreComun: "Carpincho",        nombreCientifico: "Hydrochoerus hydrochaeris", categoria: "Fauna", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.", curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", qrDisponible: false, orden: 4 },
  { id: "hornero",        nombreComun: "Hornero",          nombreCientifico: "Furnarius rufus",        categoria: "Fauna", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.", curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", qrDisponible: false, orden: 5 },
  { id: "martin-pescador",nombreComun: "Martín pescador",  nombreCientifico: "Megaceryle torquata",    categoria: "Fauna", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.", curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", qrDisponible: false, orden: 6 },
  { id: "coipo",          nombreComun: "Coipo / Nutria",   nombreCientifico: "Myocastor coypus",       categoria: "Fauna", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.", curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", qrDisponible: false, orden: 7 },
];

const SEED_SALT = "flandes-seed-salt-demo-001";
const SEED_SOCIOS: Socio[] = [
  {
    id: "socio-seed-1",
    nombre: "Socio Demo",
    email: "demo@campoflandes.org.ar",
    password_hash: hashPassword("socio2024", SEED_SALT),
    salt: SEED_SALT,
    activo: 1,
    created_at: "2026-01-01",
  },
];

const SEED_RECURSOS: RecursoSocio[] = [
  { id: "rec-seed-1", titulo: "Lorem ipsum dolor sit amet", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", tipo: "link", url: "", categoria: "Formación", icono: "book",     orden: 0, activo: 1 },
  { id: "rec-seed-2", titulo: "Lorem ipsum dolor sit amet", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", tipo: "link", url: "", categoria: "Formación", icono: "shield",   orden: 1, activo: 1 },
  { id: "rec-seed-3", titulo: "Lorem ipsum dolor sit amet", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", tipo: "link", url: "", categoria: "Técnicas",  icono: "users",    orden: 2, activo: 1 },
  { id: "rec-seed-4", titulo: "Lorem ipsum dolor sit amet", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", tipo: "link", url: "", categoria: "Técnicas",  icono: "calendar", orden: 3, activo: 1 },
  { id: "rec-seed-5", titulo: "Lorem ipsum dolor sit amet", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", tipo: "link", url: "", categoria: "General",   icono: "star",     orden: 4, activo: 1 },
  { id: "rec-seed-6", titulo: "Lorem ipsum dolor sit amet", descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", tipo: "link", url: "", categoria: "General",   icono: "map",      orden: 5, activo: 1 },
];
