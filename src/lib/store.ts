/**
 * Capa de persistencia del sitio.
 *
 * Usa Netlify Blobs cuando está disponible (producción) y archivos JSON en
 * `.data/` cuando no lo está (desarrollo local). La elección no se hace por
 * variable de entorno sino intentando abrir el store, porque `process.env.NETLIFY`
 * no es confiable en tiempo de ejecución dentro de las funciones.
 *
 * Se eligió Blobs en lugar de SQLite porque en un entorno serverless el
 * filesystem es de solo lectura y `/tmp` es efímero por instancia: los datos
 * cargados desde el panel se perdían en cada arranque en frío.
 */

import { getBlobStore } from "@/lib/blobs";

const STORE_NAME = "site-data";

function localDir(): string {
  return process.env.DATA_DIR ?? ".data";
}

async function readFromDisk<T>(key: string): Promise<T | null> {
  const { readFile } = await import("fs/promises");
  const { join } = await import("path");
  try {
    const raw = await readFile(join(process.cwd(), localDir(), `${key}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null; // todavía no existe: se usan los datos de ejemplo
  }
}

async function writeToDisk(key: string, value: unknown): Promise<void> {
  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");
  const dir = join(process.cwd(), localDir());
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${key}.json`), JSON.stringify(value, null, 2), "utf8");
}

async function readRaw<T>(key: string): Promise<T | null> {
  const store = await getBlobStore(STORE_NAME);
  if (store) {
    return (await store.get(key, { type: "json" })) as T | null;
  }
  return readFromDisk<T>(key);
}

async function writeRaw(key: string, value: unknown): Promise<void> {
  const store = await getBlobStore(STORE_NAME);
  if (store) {
    await store.setJSON(key, value);
    return;
  }
  try {
    await writeToDisk(key, value);
  } catch (e) {
    throw new Error(
      "No se pudo guardar: el almacenamiento del sitio no está disponible. " +
        `Detalle: ${e instanceof Error ? e.message : String(e)}`
    );
  }
}

/**
 * Lee una colección. Si todavía no se guardó nada, devuelve los datos de
 * ejemplo sin escribirlos (la primera escritura los materializa).
 */
export async function readCollection<T>(key: string, seed: T[]): Promise<T[]> {
  try {
    const stored = await readRaw<T[]>(key);
    return Array.isArray(stored) ? stored : [...seed];
  } catch (e) {
    console.error(`[store] No se pudo leer "${key}", usando datos de ejemplo:`, String(e));
    return [...seed];
  }
}

/**
 * Cuántas filas hay realmente guardadas, o null si la colección todavía no
 * existe en el store.
 *
 * readCollection no distingue esos dos casos: devuelve el seed cuando no hay
 * nada. Para el diagnóstico hace falta saber cuál de los dos es, porque una
 * colección ya guardada le gana al código para siempre.
 */
export async function contarGuardadas(key: string): Promise<number | null> {
  try {
    const stored = await readRaw<unknown[]>(key);
    return Array.isArray(stored) ? stored.length : null;
  } catch {
    return null;
  }
}

/** El mapa de configuración tal como está guardado, sin completar con defaults. */
export async function leerConfigCruda(): Promise<Record<string, string> | null> {
  try {
    return await readRaw<Record<string, string>>("config");
  } catch {
    return null;
  }
}

/** Sobrescribe una colección completa. */
export async function writeCollection<T>(key: string, rows: T[]): Promise<void> {
  await writeRaw(key, rows);
}

/**
 * Lee-modifica-escribe una colección.
 *
 * Nota: no es atómico. Dos escrituras simultáneas sobre la misma colección
 * pueden pisarse. Es aceptable para un panel usado por una o dos personas.
 */
export async function mutateCollection<T, R>(
  key: string,
  seed: T[],
  fn: (rows: T[]) => { rows: T[]; result: R }
): Promise<R> {
  const current = await readCollection<T>(key, seed);
  const { rows, result } = fn(current);
  await writeCollection(key, rows);
  return result;
}

/**
 * Lee un mapa de clave/valor, completando con los valores por defecto.
 * Si el almacenamiento falla se devuelven los defaults: el sitio sigue en pie
 * mostrando los textos del código en vez de romperse.
 */
export async function readRecord(
  key: string,
  defaults: Record<string, string>
): Promise<Record<string, string>> {
  try {
    const stored = await readRaw<Record<string, string>>(key);
    return { ...defaults, ...(stored ?? {}) };
  } catch (e) {
    console.error(`[store] No se pudo leer "${key}", usando valores por defecto:`, String(e));
    return { ...defaults };
  }
}

/**
 * Reemplaza el mapa entero.
 *
 * writeRecord mergea y por eso nunca puede borrar una clave. Para las sesiones
 * hace falta poder sacarlas: al cerrar sesión y al limpiar las vencidas.
 */
export async function reemplazarRecord(
  key: string,
  valor: Record<string, string>
): Promise<void> {
  await writeRaw(key, valor);
}

/** Guarda (mergeando) claves en un mapa de clave/valor. */
export async function writeRecord(
  key: string,
  defaults: Record<string, string>,
  patch: Record<string, string>
): Promise<void> {
  const current = await readRecord(key, defaults);
  await writeRaw(key, { ...current, ...patch });
}

/** Lee el mapa de configuración, completando con los valores por defecto. */
export async function readConfig(
  defaults: Record<string, string>
): Promise<Record<string, string>> {
  return readRecord("config", defaults);
}

/** Guarda (mergeando) claves de configuración. */
export async function writeConfig(
  defaults: Record<string, string>,
  patch: Record<string, string>
): Promise<void> {
  await writeRecord("config", defaults, patch);
}
