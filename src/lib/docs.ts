import { getBlobStore } from "@/lib/blobs";

/**
 * Tope de tamaño para los documentos.
 *
 * Netlify limita el cuerpo de cada petición a las funciones (~6 MB), y el
 * archivo viaja dentro de esa petición. Se deja margen: por encima de esto
 * conviene enlazar el archivo en vez de subirlo.
 */
export const MAX_DOC_MB = 4;

/** Convierte un nombre de archivo en una clave segura y legible. */
export function claveDocumento(nombre: string): string {
  return nombre
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/**
 * Guarda un PDF y devuelve la ruta pública para enlazarlo.
 * Lanza con un mensaje explicativo si el archivo no sirve o no se pudo guardar.
 */
export async function guardarDocumento(file: File): Promise<string> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("El archivo tiene que ser un PDF.");
  }
  if (file.size > MAX_DOC_MB * 1024 * 1024) {
    throw new Error(
      `El PDF pesa ${(file.size / 1024 / 1024).toFixed(1)} MB y el máximo es ${MAX_DOC_MB} MB. ` +
        "Para archivos más grandes, subilo a Drive y pegá el enlace."
    );
  }

  const clave = claveDocumento(file.name) || `doc-${Date.now()}`;
  const bytes = await file.arrayBuffer();

  const store = await getBlobStore("site-docs");
  if (store) {
    await store.set(clave, bytes, { metadata: { contentType: "application/pdf" } });
  } else {
    try {
      const { writeFile, mkdir } = await import("fs/promises");
      const { join } = await import("path");
      const dir = join(process.cwd(), "public", "docs");
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, `${clave}.pdf`), Buffer.from(bytes));
    } catch (e) {
      throw new Error(
        "No se pudo guardar el documento: el almacenamiento del sitio no está disponible. " +
          `Detalle: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  return `/docs/${clave}.pdf`;
}

/** Borra un documento subido. No falla si ya no existe. */
export async function borrarDocumento(rutaPublica: string): Promise<void> {
  const clave = rutaPublica.replace(/^\/docs\//, "").replace(/\.pdf$/, "");
  if (!clave) return;

  const store = await getBlobStore("site-docs");
  if (store) {
    await store.delete(clave);
    return;
  }
  const { unlink } = await import("fs/promises");
  const { join } = await import("path");
  try {
    await unlink(join(process.cwd(), "public", "docs", `${clave}.pdf`));
  } catch {
    // ya no estaba: la operación cumplió su objetivo
  }
}
