"use server";

import { revalidatePath } from "next/cache";
import { getBlobStore } from "@/lib/blobs";
import { IMAGE_SLOTS } from "./imageSlots";

const VALID_IDS = new Set(IMAGE_SLOTS.map((s) => s.id));

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("image") as File;
  const slot = formData.get("slot") as string;

  if (!VALID_IDS.has(slot as never)) throw new Error("Slot de imagen inválido");
  if (!file || file.size === 0) throw new Error("No se seleccionó ningún archivo");
  if (file.size > 10 * 1024 * 1024) throw new Error("La imagen supera el límite de 10 MB");
  if (!file.type.startsWith("image/")) throw new Error("El archivo no es una imagen");

  const bytes = await file.arrayBuffer();

  // Se intenta Blobs primero; el filesystem solo sirve en desarrollo local
  // (en serverless es de solo lectura).
  const store = await getBlobStore("site-images");
  if (store) {
    await store.set(slot, bytes, { metadata: { contentType: file.type } });
  } else {
    try {
      const { writeFile, mkdir } = await import("fs/promises");
      const { existsSync } = await import("fs");
      const { join } = await import("path");
      const dir = join(process.cwd(), "public", "images");
      if (!existsSync(dir)) await mkdir(dir, { recursive: true });
      await writeFile(join(dir, `${slot}.jpg`), Buffer.from(bytes));
    } catch (e) {
      throw new Error(
        "No se pudo guardar la imagen: el almacenamiento del sitio no está disponible. " +
          `Detalle: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  revalidatePath("/", "layout");
}
