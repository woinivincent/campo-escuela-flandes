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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filename = segments.join("/");
  const slot = filename.replace(/\.[^.]+$/, ""); // strip extension

  const store = await getBlobStore("site-images");
  if (store) {
    try {
      const data = await store.get(slot, { type: "arrayBuffer" });
      if (!data) return new NextResponse(null, { status: 404 });
      return new NextResponse(data, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": CACHE_MUTABLE,
        },
      });
    } catch {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Desarrollo local: leer desde public/images/
  const { readFile } = await import("fs/promises");
  const { join } = await import("path");
  try {
    const data = await readFile(join(process.cwd(), "public", "images", filename));
    return new NextResponse(data, {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": CACHE_MUTABLE },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
