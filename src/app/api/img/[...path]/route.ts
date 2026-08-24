import { NextRequest, NextResponse } from "next/server";
import { getBlobStore } from "@/lib/blobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Las imágenes se reemplazan y se quitan desde el panel, así que no pueden
 * cachearse como inmutables: hacerlo dejaba servida la copia vieja aunque el
 * archivo ya no existiera. Se revalida en cada pedido.
 */
const CACHE_MUTABLE = "public, max-age=0, must-revalidate";

/**
 * Orden de resolución de cada imagen:
 *   1. Netlify Blobs — lo que se subió desde el panel, siempre tiene prioridad.
 *   2. public/images  — subidas locales en desarrollo.
 *   3. public/seed-images — fotos de archivo versionadas en el repo, como
 *      respaldo. Se redirige en vez de leerlas del disco, porque en producción
 *      las sirve el CDN y la función no tiene acceso al filesystem.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filename = segments.join("/");
  const slot = filename.replace(/\.[^.]+$/, ""); // sin extensión

  // 1. Lo cargado desde el panel
  const store = await getBlobStore("site-images");
  if (store) {
    try {
      const data = await store.get(slot, { type: "arrayBuffer" });
      if (data) {
        return new NextResponse(data, {
          headers: { "Content-Type": "image/jpeg", "Cache-Control": CACHE_MUTABLE },
        });
      }
    } catch {
      // Blobs no respondió: se sigue con los respaldos
    }
  }

  // 2. Subidas locales de desarrollo
  const { readFile } = await import("fs/promises");
  const { join } = await import("path");
  try {
    const data = await readFile(join(process.cwd(), "public", "images", filename));
    return new NextResponse(data, {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": CACHE_MUTABLE },
    });
  } catch {
    // sin subida local
  }

  // 3. Foto de archivo del repo (la sirve el CDN)
  return NextResponse.redirect(new URL(`/seed-images/${filename}`, _req.url), 307);
}
