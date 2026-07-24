import { NextRequest, NextResponse } from "next/server";
import { getBlobStore } from "@/lib/blobs";

export const runtime = "nodejs";

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
          "Cache-Control": "public, max-age=31536000, immutable",
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
    return new NextResponse(data, { headers: { "Content-Type": "image/jpeg" } });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
