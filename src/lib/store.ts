/**
 * Capa de persistencia del sitio.
 *
 * En Netlify usa Netlify Blobs (persistente entre despliegues e instancias).
 * En desarrollo local usa archivos JSON dentro de `.data/`.
 *
 * Se eligió Blobs en lugar de SQLite porque en un entorno serverless el
 * filesystem es de solo lectura y `/tmp` es efímero por instancia: los datos
 * cargados desde el panel se perdían en cada arranque en frío.
 */

const STORE_NAME = "site-data";

function isNetlify(): boolean {
  return Boolean(process.env.NETLIFY);
}

function localDir(): string {
  return process.env.DATA_DIR ?? ".data";
}

async function readRaw<T>(key: string): Promise<T | null> {
  if (isNetlify()) {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore(STORE_NAME);
    return (await store.get(key, { type: "json" })) as T | null;
  }

  const { readFile } = await import("fs/promises");
  const { join } = await import("path");
  try {
    const raw = await readFile(join(process.cwd(), localDir(), `${key}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null; // todavía no existe: se usan los datos de ejemplo
  }
}

async function writeRaw(key: string, value: unknown): Promise<void> {
  if (isNetlify()) {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore(STORE_NAME);
    await store.setJSON(key, value);
    return;
  }

  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");
  const dir = join(process.cwd(), localDir());
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${key}.json`), JSON.stringify(value, null, 2), "utf8");
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

/** Lee el mapa de configuración, completando con los valores por defecto. */
export async function readConfig(
  defaults: Record<string, string>
): Promise<Record<string, string>> {
  try {
    const stored = await readRaw<Record<string, string>>("config");
    return { ...defaults, ...(stored ?? {}) };
  } catch (e) {
    console.error("[store] No se pudo leer la configuración:", String(e));
    return { ...defaults };
  }
}

/** Guarda (mergeando) claves de configuración. */
export async function writeConfig(
  defaults: Record<string, string>,
  patch: Record<string, string>
): Promise<void> {
  const current = await readConfig(defaults);
  await writeRaw("config", { ...current, ...patch });
}
