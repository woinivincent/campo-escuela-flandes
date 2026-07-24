/**
 * Acceso a Netlify Blobs.
 *
 * No se detecta el entorno con `process.env.NETLIFY`: esa variable existe
 * durante el build pero no siempre en tiempo de ejecución dentro de las
 * funciones, y confiar en ella hacía que en producción se intentara escribir
 * en el filesystem —que es de solo lectura— devolviendo un 500.
 *
 * En su lugar se intenta abrir el store: si responde, se usa Blobs; si no,
 * el llamador cae al filesystem local (desarrollo).
 */

export interface BlobStore {
  get(key: string, opts: { type: "json" }): Promise<unknown>;
  get(key: string, opts: { type: "arrayBuffer" }): Promise<ArrayBuffer | null>;
  set(
    key: string,
    value: ArrayBuffer | string,
    opts?: { metadata?: Record<string, unknown> }
  ): Promise<unknown>;
  setJSON(key: string, value: unknown): Promise<unknown>;
  list(): Promise<{ blobs: { key: string }[] }>;
}

/** Último error de Blobs, para poder mostrarlo en el diagnóstico del panel. */
let ultimoError: string | null = null;

export function getUltimoErrorBlobs(): string | null {
  return ultimoError;
}

/**
 * Devuelve el store pedido, o null si Blobs no está disponible en este entorno.
 * Nunca lanza: el llamador decide qué hacer cuando no hay store.
 */
export async function getBlobStore(name: string): Promise<BlobStore | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore(name) as unknown as BlobStore;
    ultimoError = null;
    return store;
  } catch (e) {
    ultimoError = e instanceof Error ? e.message : String(e);
    return null;
  }
}

/**
 * Comprueba que Blobs esté realmente operativo (no alcanza con abrir el store:
 * la configuración puede fallar recién al primer pedido). Usado por el
 * diagnóstico del panel.
 */
export async function verificarBlobs(
  name: string
): Promise<{ ok: boolean; error: string | null }> {
  const store = await getBlobStore(name);
  if (!store) return { ok: false, error: ultimoError ?? "Store no disponible" };
  try {
    await store.list();
    return { ok: true, error: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
