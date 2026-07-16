import path from "path";
import type BetterSQLite3 from "better-sqlite3";
import { hashPassword } from "@/lib/crypto-utils";

const DB_PATH =
  process.env.DB_PATH ??
  (process.env.NODE_ENV === "production"
    ? "/tmp/flandes.db"
    : path.join(process.cwd(), "flandes.db"));

type DBInstance = BetterSQLite3.Database;

declare global {
  // eslint-disable-next-line no-var
  var __flandesDB: DBInstance | null | undefined;
}

function getDB(): DBInstance | null {
  if (typeof globalThis.__flandesDB !== "undefined") {
    return globalThis.__flandesDB ?? null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3") as new (p: string) => DBInstance;
    const db = new Database(DB_PATH);
    initSchema(db);
    seedIfEmpty(db);
    globalThis.__flandesDB = db;
  } catch (e) {
    console.error("[db] SQLite no disponible, usando datos de ejemplo:", String(e));
    globalThis.__flandesDB = null;
  }
  return globalThis.__flandesDB ?? null;
}

function initSchema(db: DBInstance) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS eventos (
      id            TEXT PRIMARY KEY,
      titulo        TEXT NOT NULL,
      fecha         TEXT NOT NULL,
      hora          TEXT NOT NULL DEFAULT '',
      tipo          TEXT NOT NULL,
      descripcion   TEXT NOT NULL,
      destinatarios TEXT NOT NULL,
      cupos         TEXT NOT NULL DEFAULT ''
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

    CREATE TABLE IF NOT EXISTS hitos (
      id    TEXT PRIMARY KEY,
      anio  TEXT NOT NULL,
      texto TEXT NOT NULL,
      orden INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS especies (
      id               TEXT PRIMARY KEY,
      nombreComun      TEXT NOT NULL,
      nombreCientifico TEXT NOT NULL,
      categoria        TEXT NOT NULL,
      descripcion      TEXT NOT NULL,
      curiosidad       TEXT NOT NULL,
      qrDisponible     INTEGER NOT NULL DEFAULT 0,
      orden            INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS socios (
      id            TEXT PRIMARY KEY,
      nombre        TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt          TEXT NOT NULL,
      activo        INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS recursos_socios (
      id          TEXT PRIMARY KEY,
      titulo      TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      tipo        TEXT NOT NULL DEFAULT 'link',
      url         TEXT NOT NULL DEFAULT '',
      categoria   TEXT NOT NULL DEFAULT 'General',
      icono       TEXT NOT NULL DEFAULT 'book',
      orden       INTEGER NOT NULL DEFAULT 0,
      activo      INTEGER NOT NULL DEFAULT 1
    );
  `);
}

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

// ─── Seed ─────────────────────────────────────────────────────────────────────

function seedIfEmpty(db: DBInstance) {
  const evCount = db.prepare("SELECT COUNT(*) as c FROM eventos").get() as { c: number };
  if (evCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO eventos (id,titulo,fecha,hora,tipo,descripcion,destinatarios,cupos) VALUES (?,?,?,?,?,?,?,?)"
    );
    for (const e of SEED_EVENTOS) {
      ins.run(e.id, e.titulo, e.fecha, e.hora, e.tipo, e.descripcion, e.destinatarios, e.cupos);
    }
  }

  const libCount = db.prepare("SELECT COUNT(*) as c FROM libros").get() as { c: number };
  if (libCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO libros (id,titulo,autor,categoria,precio,descripcion,disponible) VALUES (?,?,?,?,?,?,?)"
    );
    for (const l of SEED_LIBROS) {
      ins.run(l.id, l.titulo, l.autor, l.categoria, l.precio, l.descripcion, l.disponible ? 1 : 0);
    }
  }

  const cursosCount = db.prepare("SELECT COUNT(*) as c FROM cursos").get() as { c: number };
  if (cursosCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO cursos (id,titulo,descripcion,fecha,hora,nivel,destinatarios,cupos) VALUES (?,?,?,?,?,?,?,?)"
    );
    for (const c of SEED_CURSOS) {
      ins.run(c.id, c.titulo, c.descripcion, c.fecha, c.hora, c.nivel, c.destinatarios, c.cupos);
    }
  }

  const cfgCount = db.prepare("SELECT COUNT(*) as c FROM config").get() as { c: number };
  if (cfgCount.c === 0) {
    const ins = db.prepare("INSERT INTO config (key,value) VALUES (?,?)");
    for (const [key, value] of Object.entries(SEED_CONFIG)) {
      ins.run(key, value);
    }
  } else {
    // Add new config keys if missing (for existing DBs)
    const stmt = db.prepare("INSERT OR IGNORE INTO config (key,value) VALUES (?,?)");
    for (const [key, value] of Object.entries(SEED_CONFIG)) {
      stmt.run(key, value);
    }
  }

  const hitosCount = db.prepare("SELECT COUNT(*) as c FROM hitos").get() as { c: number };
  if (hitosCount.c === 0) {
    const ins = db.prepare("INSERT INTO hitos (id,anio,texto,orden) VALUES (?,?,?,?)");
    for (const h of SEED_HITOS) {
      ins.run(h.id, h.anio, h.texto, h.orden);
    }
  }

  const especiesCount = db.prepare("SELECT COUNT(*) as c FROM especies").get() as { c: number };
  if (especiesCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO especies (id,nombreComun,nombreCientifico,categoria,descripcion,curiosidad,qrDisponible,orden) VALUES (?,?,?,?,?,?,?,?)"
    );
    for (const e of SEED_ESPECIES) {
      ins.run(e.id, e.nombreComun, e.nombreCientifico, e.categoria, e.descripcion, e.curiosidad, e.qrDisponible ? 1 : 0, e.orden);
    }
  }

  const sociosCount = db.prepare("SELECT COUNT(*) as c FROM socios").get() as { c: number };
  if (sociosCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO socios (id,nombre,email,password_hash,salt,activo,created_at) VALUES (?,?,?,?,?,?,?)"
    );
    for (const s of SEED_SOCIOS) {
      ins.run(s.id, s.nombre, s.email, s.password_hash, s.salt, s.activo, s.created_at);
    }
  }

  const recursosCount = db.prepare("SELECT COUNT(*) as c FROM recursos_socios").get() as { c: number };
  if (recursosCount.c === 0) {
    const ins = db.prepare(
      "INSERT INTO recursos_socios (id,titulo,descripcion,tipo,url,categoria,icono,orden,activo) VALUES (?,?,?,?,?,?,?,?,?)"
    );
    for (const r of SEED_RECURSOS) {
      ins.run(r.id, r.titulo, r.descripcion, r.tipo, r.url, r.categoria, r.icono, r.orden, r.activo);
    }
  }
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

export function getEventos(): Evento[] {
  const db = getDB();
  if (!db) return [...SEED_EVENTOS].sort((a, b) => a.fecha.localeCompare(b.fecha));
  return db.prepare("SELECT * FROM eventos ORDER BY fecha ASC").all() as Evento[];
}

export function getEventosPublicos(): Evento[] {
  const today = new Date().toISOString().slice(0, 10);
  const db = getDB();
  if (!db) return SEED_EVENTOS.filter((e) => e.fecha >= today).sort((a, b) => a.fecha.localeCompare(b.fecha));
  return db.prepare("SELECT * FROM eventos WHERE fecha >= ? ORDER BY fecha ASC").all(today) as Evento[];
}

export function getEvento(id: string): Evento | undefined {
  const db = getDB();
  if (!db) return SEED_EVENTOS.find((e) => e.id === id);
  return db.prepare("SELECT * FROM eventos WHERE id=?").get(id) as Evento | undefined;
}

export function createEvento(data: Omit<Evento, "id">): string {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  const id = `ev-${Date.now()}`;
  db.prepare(
    "INSERT INTO eventos (id,titulo,fecha,hora,tipo,descripcion,destinatarios,cupos) VALUES (?,?,?,?,?,?,?,?)"
  ).run(id, data.titulo, data.fecha, data.hora, data.tipo, data.descripcion, data.destinatarios, data.cupos);
  return id;
}

export function updateEvento(id: string, data: Omit<Evento, "id">): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare(
    "UPDATE eventos SET titulo=?,fecha=?,hora=?,tipo=?,descripcion=?,destinatarios=?,cupos=? WHERE id=?"
  ).run(data.titulo, data.fecha, data.hora, data.tipo, data.descripcion, data.destinatarios, data.cupos, id);
}

export function deleteEvento(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("DELETE FROM eventos WHERE id=?").run(id);
}

// ─── Libros ──────────────────────────────────────────────────────────────────

type LibroRow = Omit<Libro, "disponible"> & { disponible: number };

export function getLibros(): Libro[] {
  const db = getDB();
  if (!db) return SEED_LIBROS;
  const rows = db.prepare("SELECT * FROM libros ORDER BY titulo ASC").all() as LibroRow[];
  return rows.map((r) => ({ ...r, disponible: r.disponible === 1 }));
}

export function getLibro(id: string): Libro | undefined {
  const db = getDB();
  if (!db) return SEED_LIBROS.find((l) => l.id === id);
  const row = db.prepare("SELECT * FROM libros WHERE id=?").get(id) as LibroRow | undefined;
  return row ? { ...row, disponible: row.disponible === 1 } : undefined;
}

export function createLibro(data: Omit<Libro, "id">): string {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  const id = `lib-${Date.now()}`;
  db.prepare(
    "INSERT INTO libros (id,titulo,autor,categoria,precio,descripcion,disponible) VALUES (?,?,?,?,?,?,?)"
  ).run(id, data.titulo, data.autor, data.categoria, data.precio, data.descripcion, data.disponible ? 1 : 0);
  return id;
}

export function updateLibro(id: string, data: Omit<Libro, "id">): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare(
    "UPDATE libros SET titulo=?,autor=?,categoria=?,precio=?,descripcion=?,disponible=? WHERE id=?"
  ).run(data.titulo, data.autor, data.categoria, data.precio, data.descripcion, data.disponible ? 1 : 0, id);
}

export function deleteLibro(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("DELETE FROM libros WHERE id=?").run(id);
}

// ─── Cursos ──────────────────────────────────────────────────────────────────

export function getCursos(): Curso[] {
  const db = getDB();
  if (!db) return [...SEED_CURSOS].sort((a, b) => a.fecha.localeCompare(b.fecha));
  return db.prepare("SELECT * FROM cursos ORDER BY fecha ASC").all() as Curso[];
}

export function getCursosPublicos(): Curso[] {
  const today = new Date().toISOString().slice(0, 10);
  const db = getDB();
  if (!db) return SEED_CURSOS.filter((c) => c.fecha >= today).sort((a, b) => a.fecha.localeCompare(b.fecha));
  return db.prepare("SELECT * FROM cursos WHERE fecha >= ? ORDER BY fecha ASC").all(today) as Curso[];
}

export function getCurso(id: string): Curso | undefined {
  const db = getDB();
  if (!db) return SEED_CURSOS.find((c) => c.id === id);
  return db.prepare("SELECT * FROM cursos WHERE id=?").get(id) as Curso | undefined;
}

export function createCurso(data: Omit<Curso, "id">): string {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  const id = `cur-${Date.now()}`;
  db.prepare(
    "INSERT INTO cursos (id,titulo,descripcion,fecha,hora,nivel,destinatarios,cupos) VALUES (?,?,?,?,?,?,?,?)"
  ).run(id, data.titulo, data.descripcion, data.fecha, data.hora, data.nivel, data.destinatarios, data.cupos);
  return id;
}

export function updateCurso(id: string, data: Omit<Curso, "id">): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare(
    "UPDATE cursos SET titulo=?,descripcion=?,fecha=?,hora=?,nivel=?,destinatarios=?,cupos=? WHERE id=?"
  ).run(data.titulo, data.descripcion, data.fecha, data.hora, data.nivel, data.destinatarios, data.cupos, id);
}

export function deleteCurso(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("DELETE FROM cursos WHERE id=?").run(id);
}

// ─── Config ──────────────────────────────────────────────────────────────────

export function getConfigValue(key: string): string | undefined {
  const db = getDB();
  if (!db) return SEED_CONFIG[key];
  const row = db.prepare("SELECT value FROM config WHERE key=?").get(key) as { value: string } | undefined;
  return row?.value;
}

export function getAllConfigValues(): Record<string, string> {
  const db = getDB();
  if (!db) return { ...SEED_CONFIG };
  const rows = db.prepare("SELECT key, value FROM config").all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function setConfigValues(data: Record<string, string>): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  const stmt = db.prepare(
    "INSERT INTO config (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value"
  );
  for (const [key, value] of Object.entries(data)) {
    stmt.run(key, value);
  }
}

// ─── Hitos ───────────────────────────────────────────────────────────────────

export function getHitos(): Hito[] {
  const db = getDB();
  if (!db) return SEED_HITOS;
  return db.prepare("SELECT * FROM hitos ORDER BY orden ASC").all() as Hito[];
}

export function getHito(id: string): Hito | undefined {
  const db = getDB();
  if (!db) return SEED_HITOS.find((h) => h.id === id);
  return db.prepare("SELECT * FROM hitos WHERE id=?").get(id) as Hito | undefined;
}

export function createHito(data: Omit<Hito, "id">): string {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  const id = `hito-${Date.now()}`;
  const maxOrden = (db.prepare("SELECT MAX(orden) as m FROM hitos").get() as { m: number | null }).m ?? -1;
  db.prepare("INSERT INTO hitos (id,anio,texto,orden) VALUES (?,?,?,?)").run(
    id, data.anio, data.texto, maxOrden + 1
  );
  return id;
}

export function updateHito(id: string, data: Pick<Hito, "anio" | "texto">): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("UPDATE hitos SET anio=?,texto=? WHERE id=?").run(data.anio, data.texto, id);
}

export function deleteHito(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("DELETE FROM hitos WHERE id=?").run(id);
}

// ─── Especies ─────────────────────────────────────────────────────────────────

type EspecieRow = Omit<Especie, "qrDisponible"> & { qrDisponible: number };

export function getEspecies(): Especie[] {
  const db = getDB();
  if (!db) return SEED_ESPECIES;
  const rows = db.prepare("SELECT * FROM especies ORDER BY orden ASC, categoria ASC").all() as EspecieRow[];
  return rows.map((r) => ({ ...r, qrDisponible: r.qrDisponible === 1 }));
}

export function getEspecie(id: string): Especie | undefined {
  const db = getDB();
  if (!db) return SEED_ESPECIES.find((e) => e.id === id);
  const row = db.prepare("SELECT * FROM especies WHERE id=?").get(id) as EspecieRow | undefined;
  return row ? { ...row, qrDisponible: row.qrDisponible === 1 } : undefined;
}

export function createEspecie(data: Omit<Especie, "id" | "orden">): string {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  const id = `esp-${Date.now()}`;
  const maxOrden = (db.prepare("SELECT MAX(orden) as m FROM especies").get() as { m: number | null }).m ?? -1;
  db.prepare(
    "INSERT INTO especies (id,nombreComun,nombreCientifico,categoria,descripcion,curiosidad,qrDisponible,orden) VALUES (?,?,?,?,?,?,?,?)"
  ).run(id, data.nombreComun, data.nombreCientifico, data.categoria, data.descripcion, data.curiosidad, data.qrDisponible ? 1 : 0, maxOrden + 1);
  return id;
}

export function updateEspecie(id: string, data: Omit<Especie, "id" | "orden">): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare(
    "UPDATE especies SET nombreComun=?,nombreCientifico=?,categoria=?,descripcion=?,curiosidad=?,qrDisponible=? WHERE id=?"
  ).run(data.nombreComun, data.nombreCientifico, data.categoria, data.descripcion, data.curiosidad, data.qrDisponible ? 1 : 0, id);
}

export function deleteEspecie(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("DELETE FROM especies WHERE id=?").run(id);
}

// ─── Socios ──────────────────────────────────────────────────────────────────

export function getSocios(): Socio[] {
  const db = getDB();
  if (!db) return SEED_SOCIOS;
  return db.prepare("SELECT * FROM socios ORDER BY nombre ASC").all() as Socio[];
}

export function getSocioById(id: string): Socio | undefined {
  const db = getDB();
  if (!db) return SEED_SOCIOS.find((s) => s.id === id);
  return db.prepare("SELECT * FROM socios WHERE id=?").get(id) as Socio | undefined;
}

export function getSocioByEmail(email: string): Socio | undefined {
  const db = getDB();
  if (!db) return SEED_SOCIOS.find((s) => s.email === email.toLowerCase());
  return db.prepare("SELECT * FROM socios WHERE email=?").get(email.toLowerCase()) as Socio | undefined;
}

export function createSocio(data: { nombre: string; email: string; password_hash: string; salt: string }): string {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  const id = `socio-${Date.now()}`;
  db.prepare(
    "INSERT INTO socios (id,nombre,email,password_hash,salt,activo,created_at) VALUES (?,?,?,?,?,1,date('now'))"
  ).run(id, data.nombre, data.email.toLowerCase(), data.password_hash, data.salt);
  return id;
}

export function toggleSocioActivo(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("UPDATE socios SET activo = CASE WHEN activo=1 THEN 0 ELSE 1 END WHERE id=?").run(id);
}

export function updateSocioPassword(id: string, password_hash: string, salt: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("UPDATE socios SET password_hash=?,salt=? WHERE id=?").run(password_hash, salt, id);
}

export function deleteSocio(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("DELETE FROM socios WHERE id=?").run(id);
}

// ─── Recursos socios ──────────────────────────────────────────────────────────

export function getRecursosSocios(soloActivos = false): RecursoSocio[] {
  const db = getDB();
  if (!db) return soloActivos ? SEED_RECURSOS.filter((r) => r.activo === 1) : SEED_RECURSOS;
  const q = soloActivos
    ? "SELECT * FROM recursos_socios WHERE activo=1 ORDER BY orden ASC, categoria ASC"
    : "SELECT * FROM recursos_socios ORDER BY orden ASC, categoria ASC";
  return db.prepare(q).all() as RecursoSocio[];
}

export function getRecursoSocio(id: string): RecursoSocio | undefined {
  const db = getDB();
  if (!db) return SEED_RECURSOS.find((r) => r.id === id);
  return db.prepare("SELECT * FROM recursos_socios WHERE id=?").get(id) as RecursoSocio | undefined;
}

export function createRecursoSocio(data: Omit<RecursoSocio, "id" | "orden">): string {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  const id = `rec-${Date.now()}`;
  const maxOrden = (db.prepare("SELECT MAX(orden) as m FROM recursos_socios").get() as { m: number | null }).m ?? -1;
  db.prepare(
    "INSERT INTO recursos_socios (id,titulo,descripcion,tipo,url,categoria,icono,orden,activo) VALUES (?,?,?,?,?,?,?,?,?)"
  ).run(id, data.titulo, data.descripcion, data.tipo, data.url, data.categoria, data.icono, maxOrden + 1, data.activo);
  return id;
}

export function updateRecursoSocio(id: string, data: Omit<RecursoSocio, "id" | "orden">): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare(
    "UPDATE recursos_socios SET titulo=?,descripcion=?,tipo=?,url=?,categoria=?,icono=?,activo=? WHERE id=?"
  ).run(data.titulo, data.descripcion, data.tipo, data.url, data.categoria, data.icono, data.activo, id);
}

export function toggleRecursoActivo(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("UPDATE recursos_socios SET activo = CASE WHEN activo=1 THEN 0 ELSE 1 END WHERE id=?").run(id);
}

export function deleteRecursoSocio(id: string): void {
  const db = getDB();
  if (!db) throw new Error("Base de datos no disponible");
  db.prepare("DELETE FROM recursos_socios WHERE id=?").run(id);
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
