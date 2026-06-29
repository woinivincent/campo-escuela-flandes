import Database from "better-sqlite3";
import path from "path";

// En Lambda (Netlify/AWS) process.cwd() es read-only; /tmp es el único directorio escribible.
const DB_PATH =
  process.env.DB_PATH ??
  (process.env.NODE_ENV === "production"
    ? "/tmp/flandes.db"
    : path.join(process.cwd(), "flandes.db"));

declare global {
  // eslint-disable-next-line no-var
  var __flandesDB: Database.Database | undefined;
}

function getDB(): Database.Database {
  if (!globalThis.__flandesDB) {
    const db = new Database(DB_PATH);
    initSchema(db);
    seedIfEmpty(db);
    globalThis.__flandesDB = db;
  }
  return globalThis.__flandesDB;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS eventos (
      id       TEXT PRIMARY KEY,
      titulo   TEXT NOT NULL,
      fecha    TEXT NOT NULL,
      hora     TEXT NOT NULL DEFAULT '',
      tipo     TEXT NOT NULL,
      descripcion   TEXT NOT NULL,
      destinatarios TEXT NOT NULL,
      cupos    TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS libros (
      id          TEXT PRIMARY KEY,
      titulo      TEXT NOT NULL,
      autor       TEXT NOT NULL,
      categoria   TEXT NOT NULL,
      precio      INTEGER NOT NULL DEFAULT 0,
      descripcion TEXT NOT NULL,
      disponible  INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS cursos (
      id            TEXT PRIMARY KEY,
      titulo        TEXT NOT NULL,
      descripcion   TEXT NOT NULL,
      fecha         TEXT NOT NULL,
      hora          TEXT NOT NULL DEFAULT '',
      nivel         TEXT NOT NULL DEFAULT 'Básico',
      destinatarios TEXT NOT NULL,
      cupos         TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS config (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type TipoEvento = "Acampe" | "Curso" | "Charla" | "Actividad";
export type CategoriaLibro =
  | "Escultismo"
  | "Naturaleza"
  | "Formación"
  | "Literatura";

export interface Evento {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  tipo: TipoEvento;
  descripcion: string;
  destinatarios: string;
  cupos: string;
}

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  categoria: CategoriaLibro;
  precio: number;
  descripcion: string;
  disponible: boolean;
}

// ─── Seed ────────────────────────────────────────────────────────────────────

function seedIfEmpty(db: Database.Database) {
  const evCount = db
    .prepare("SELECT COUNT(*) as c FROM eventos")
    .get() as { c: number };
  if (evCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO eventos (id,titulo,fecha,hora,tipo,descripcion,destinatarios,cupos) VALUES (?,?,?,?,?,?,?,?)"
    );
    for (const e of SEED_EVENTOS) {
      ins.run(
        e.id, e.titulo, e.fecha, e.hora, e.tipo,
        e.descripcion, e.destinatarios, e.cupos
      );
    }
  }

  const libCount = db
    .prepare("SELECT COUNT(*) as c FROM libros")
    .get() as { c: number };
  if (libCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO libros (id,titulo,autor,categoria,precio,descripcion,disponible) VALUES (?,?,?,?,?,?,?)"
    );
    for (const l of SEED_LIBROS) {
      ins.run(
        l.id, l.titulo, l.autor, l.categoria,
        l.precio, l.descripcion, l.disponible ? 1 : 0
      );
    }
  }

  const cursosCount = db
    .prepare("SELECT COUNT(*) as c FROM cursos")
    .get() as { c: number };
  if (cursosCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO cursos (id,titulo,descripcion,fecha,hora,nivel,destinatarios,cupos) VALUES (?,?,?,?,?,?,?,?)"
    );
    for (const c of SEED_CURSOS) {
      ins.run(c.id, c.titulo, c.descripcion, c.fecha, c.hora, c.nivel, c.destinatarios, c.cupos);
    }
  }

  const cfgCount = db
    .prepare("SELECT COUNT(*) as c FROM config")
    .get() as { c: number };
  if (cfgCount.c === 0) {
    const ins = db.prepare("INSERT INTO config (key,value) VALUES (?,?)");
    for (const [key, value] of Object.entries(SEED_CONFIG)) {
      ins.run(key, value);
    }
  }
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

export function getEventos(): Evento[] {
  return getDB()
    .prepare("SELECT * FROM eventos ORDER BY fecha ASC")
    .all() as Evento[];
}

export function getEventosPublicos(): Evento[] {
  const today = new Date().toISOString().slice(0, 10);
  return getDB()
    .prepare("SELECT * FROM eventos WHERE fecha >= ? ORDER BY fecha ASC")
    .all(today) as Evento[];
}

export function getEvento(id: string): Evento | undefined {
  return getDB()
    .prepare("SELECT * FROM eventos WHERE id=?")
    .get(id) as Evento | undefined;
}

export function createEvento(data: Omit<Evento, "id">): string {
  const id = `ev-${Date.now()}`;
  getDB()
    .prepare(
      "INSERT INTO eventos (id,titulo,fecha,hora,tipo,descripcion,destinatarios,cupos) VALUES (?,?,?,?,?,?,?,?)"
    )
    .run(
      id, data.titulo, data.fecha, data.hora, data.tipo,
      data.descripcion, data.destinatarios, data.cupos
    );
  return id;
}

export function updateEvento(id: string, data: Omit<Evento, "id">): void {
  getDB()
    .prepare(
      "UPDATE eventos SET titulo=?,fecha=?,hora=?,tipo=?,descripcion=?,destinatarios=?,cupos=? WHERE id=?"
    )
    .run(
      data.titulo, data.fecha, data.hora, data.tipo,
      data.descripcion, data.destinatarios, data.cupos, id
    );
}

export function deleteEvento(id: string): void {
  getDB().prepare("DELETE FROM eventos WHERE id=?").run(id);
}

// ─── Libros ──────────────────────────────────────────────────────────────────

type LibroRow = Omit<Libro, "disponible"> & { disponible: number };

export function getLibros(): Libro[] {
  const rows = getDB()
    .prepare("SELECT * FROM libros ORDER BY titulo ASC")
    .all() as LibroRow[];
  return rows.map((r) => ({ ...r, disponible: r.disponible === 1 }));
}

export function getLibro(id: string): Libro | undefined {
  const row = getDB()
    .prepare("SELECT * FROM libros WHERE id=?")
    .get(id) as LibroRow | undefined;
  return row ? { ...row, disponible: row.disponible === 1 } : undefined;
}

export function createLibro(data: Omit<Libro, "id">): string {
  const id = `lib-${Date.now()}`;
  getDB()
    .prepare(
      "INSERT INTO libros (id,titulo,autor,categoria,precio,descripcion,disponible) VALUES (?,?,?,?,?,?,?)"
    )
    .run(
      id, data.titulo, data.autor, data.categoria,
      data.precio, data.descripcion, data.disponible ? 1 : 0
    );
  return id;
}

export function updateLibro(id: string, data: Omit<Libro, "id">): void {
  getDB()
    .prepare(
      "UPDATE libros SET titulo=?,autor=?,categoria=?,precio=?,descripcion=?,disponible=? WHERE id=?"
    )
    .run(
      data.titulo, data.autor, data.categoria,
      data.precio, data.descripcion, data.disponible ? 1 : 0, id
    );
}

export function deleteLibro(id: string): void {
  getDB().prepare("DELETE FROM libros WHERE id=?").run(id);
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const SEED_EVENTOS: Evento[] = [
  {
    id: "ev-seed-1",
    titulo: "Curso de adiestramiento: primeros auxilios",
    fecha: "2026-07-19",
    hora: "9:00 h",
    tipo: "Curso",
    descripcion:
      "Formación práctica en primeros auxilios orientada a situaciones de campamento. Incluye práctica de RCP y manejo de emergencias.",
    destinatarios: "Dirigentes y caminantes",
    cupos: "20 personas",
  },
  {
    id: "ev-seed-2",
    titulo: "Acampe de invierno",
    fecha: "2026-07-25",
    hora: "",
    tipo: "Acampe",
    descripcion:
      "Acampe de invierno abierto para grupos scouts de todas las ramas. Subcampos disponibles por orden de reserva.",
    destinatarios: "Grupos scouts",
    cupos: "",
  },
  {
    id: "ev-seed-3",
    titulo: "Charla: flora nativa bonaerense",
    fecha: "2026-08-15",
    hora: "15:00 h",
    tipo: "Charla",
    descripcion:
      "Recorrida guiada por el predio con un especialista en botánica. Identificación de especies nativas y su importancia ecológica.",
    destinatarios: "Abierto a la comunidad",
    cupos: "30 personas",
  },
  {
    id: "ev-seed-4",
    titulo: "Jornada de mantenimiento del predio",
    fecha: "2026-09-05",
    hora: "8:00 h",
    tipo: "Actividad",
    descripcion:
      "Día de trabajo comunitario para el mantenimiento de infraestructura y limpieza del campo. Se agradece la participación.",
    destinatarios: "Socios y voluntarios",
    cupos: "",
  },
  {
    id: "ev-seed-5",
    titulo: "Curso de orientación con brújula y mapa",
    fecha: "2026-10-10",
    hora: "9:00 h",
    tipo: "Curso",
    descripcion:
      "Introducción a la lectura de mapas topográficos y uso de la brújula. Práctica en el terreno del predio.",
    destinatarios: "Scouts mayores y dirigentes",
    cupos: "20 personas",
  },
  {
    id: "ev-seed-6",
    titulo: "Campamento de primavera",
    fecha: "2026-11-07",
    hora: "",
    tipo: "Acampe",
    descripcion:
      "Campamento de primavera multi-grupo. Actividades de naturaleza, técnicas de campismo y fogón de cierre.",
    destinatarios: "Grupos scouts",
    cupos: "",
  },
];

const SEED_LIBROS: Libro[] = [
  {
    id: "escultismo-muchos",
    titulo: "Escultismo para muchachos",
    autor: "Robert Baden-Powell",
    categoria: "Escultismo",
    precio: 3500,
    descripcion:
      "El libro fundacional del movimiento scout. Técnicas de campismo, valores y el método scout explicados por su creador.",
    disponible: true,
  },
  {
    id: "flora-bonaerense",
    titulo: "Guía de flora nativa bonaerense",
    autor: "D. Roitman y A. Trucco",
    categoria: "Naturaleza",
    precio: 4200,
    descripcion:
      "Identificación de especies vegetales nativas de la provincia de Buenos Aires. Con fotos y fichas detalladas.",
    disponible: true,
  },
  {
    id: "manual-dirigente",
    titulo: "Manual del dirigente scout",
    autor: "Movimiento Scout Argentino",
    categoria: "Formación",
    precio: 2800,
    descripcion:
      "Guía práctica para dirigentes: pedagogía scout, planificación de actividades, técnicas de liderazgo y trabajo con grupos.",
    disponible: true,
  },
  {
    id: "nudos",
    titulo: "Nudos: técnicas y aplicaciones",
    autor: "C. H. Torres",
    categoria: "Escultismo",
    precio: 1900,
    descripcion:
      "Guía ilustrada de los nudos más usados en el campismo: ballestrinque, as de guía, vuelta de escota y más.",
    disponible: true,
  },
  {
    id: "libro-selva",
    titulo: "El libro de la selva",
    autor: "Rudyard Kipling",
    categoria: "Literatura",
    precio: 2500,
    descripcion:
      "La obra clásica que inspiró al fundador del escultismo. Ideal para lecturas compartidas en campamentos.",
    disponible: false,
  },
  {
    id: "supervivencia",
    titulo: "Supervivencia en la naturaleza",
    autor: "P. N. Díaz",
    categoria: "Naturaleza",
    precio: 3100,
    descripcion:
      "Técnicas de supervivencia adaptadas al entorno pampeano: refugio, agua, fuego, primeros auxilios y orientación.",
    disponible: true,
  },
];

// ─── Cursos ──────────────────────────────────────────────────────────────────

export interface Curso {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  nivel: string;
  destinatarios: string;
  cupos: string;
}

export function getCursos(): Curso[] {
  return getDB()
    .prepare("SELECT * FROM cursos ORDER BY fecha ASC")
    .all() as Curso[];
}

export function getCursosPublicos(): Curso[] {
  const today = new Date().toISOString().slice(0, 10);
  return getDB()
    .prepare("SELECT * FROM cursos WHERE fecha >= ? ORDER BY fecha ASC")
    .all(today) as Curso[];
}

export function getCurso(id: string): Curso | undefined {
  return getDB()
    .prepare("SELECT * FROM cursos WHERE id=?")
    .get(id) as Curso | undefined;
}

export function createCurso(data: Omit<Curso, "id">): string {
  const id = `cur-${Date.now()}`;
  getDB()
    .prepare(
      "INSERT INTO cursos (id,titulo,descripcion,fecha,hora,nivel,destinatarios,cupos) VALUES (?,?,?,?,?,?,?,?)"
    )
    .run(id, data.titulo, data.descripcion, data.fecha, data.hora, data.nivel, data.destinatarios, data.cupos);
  return id;
}

export function updateCurso(id: string, data: Omit<Curso, "id">): void {
  getDB()
    .prepare(
      "UPDATE cursos SET titulo=?,descripcion=?,fecha=?,hora=?,nivel=?,destinatarios=?,cupos=? WHERE id=?"
    )
    .run(data.titulo, data.descripcion, data.fecha, data.hora, data.nivel, data.destinatarios, data.cupos, id);
}

export function deleteCurso(id: string): void {
  getDB().prepare("DELETE FROM cursos WHERE id=?").run(id);
}

// ─── Config ──────────────────────────────────────────────────────────────────

export function getConfigValue(key: string): string | undefined {
  const row = getDB()
    .prepare("SELECT value FROM config WHERE key=?")
    .get(key) as { value: string } | undefined;
  return row?.value;
}

export function getAllConfigValues(): Record<string, string> {
  const rows = getDB()
    .prepare("SELECT key, value FROM config")
    .all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function setConfigValues(data: Record<string, string>): void {
  const stmt = getDB().prepare(
    "INSERT INTO config (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value"
  );
  for (const [key, value] of Object.entries(data)) {
    stmt.run(key, value);
  }
}

// ─── Seed — cursos y config ───────────────────────────────────────────────────

const SEED_CURSOS: Curso[] = [
  {
    id: "cur-seed-1",
    titulo: "Nudos y técnicas de campismo",
    descripcion:
      "Taller práctico de nudos esenciales, montaje de carpas y técnicas básicas de supervivencia en el campo.",
    fecha: "2026-07-05",
    hora: "9:00 h",
    nivel: "Básico",
    destinatarios: "Scouts y dirigentes",
    cupos: "25 personas",
  },
  {
    id: "cur-seed-2",
    titulo: "Primeros auxilios en el campo",
    descripcion:
      "Formación práctica en primeros auxilios orientada a situaciones de campamento. Incluye práctica de RCP y manejo de emergencias.",
    fecha: "2026-07-19",
    hora: "9:00 h",
    nivel: "Intermedio",
    destinatarios: "Dirigentes y caminantes",
    cupos: "20 personas",
  },
  {
    id: "cur-seed-3",
    titulo: "Orientación con brújula y mapa",
    descripcion:
      "Introducción a la lectura de mapas topográficos y uso de la brújula. Práctica en el terreno del predio.",
    fecha: "2026-08-02",
    hora: "9:00 h",
    nivel: "Básico",
    destinatarios: "Scouts mayores y dirigentes",
    cupos: "20 personas",
  },
];

const SEED_CONFIG: Record<string, string> = {
  whatsapp: "5491100000000",
  whatsappDisplay: "+54 9 11 0000-0000",
  email: "contacto@campoflandes.org.ar",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  youtube: "https://youtube.com/",
};
