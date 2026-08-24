import { NextRequest, NextResponse } from "next/server";
import { getBlobStore } from "@/lib/blobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Los documentos se reemplazan desde el panel: no pueden cachearse como fijos. */
const CACHE_MUTABLE = "public, max-age=0, must-revalidate";

/**
 * Sirve los documentos (PDF) cargados desde el panel.
 * En desarrollo, donde no hay Blobs, cae a public/docs.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filename = segments.join("/");
  const clave = filename.replace(/\.[^.]+$/, "");

  const store = await getBlobStore("site-docs");
  if (store) {
    try {
      const data = await store.get(clave, { type: "arrayBuffer" });
      if (data) {
        return new NextResponse(data, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${filename}"`,
            "Cache-Control": CACHE_MUTABLE,
          },
        });
      }
    } catch {
      // Blobs no respondió: se intenta el disco
    }
  }

  const { readFile } = await import("fs/promises");
  const { join } = await import("path");
  try {
    const data = await readFile(join(process.cwd(), "public", "docs", filename));
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": CACHE_MUTABLE,
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
