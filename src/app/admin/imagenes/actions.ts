"use server";

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
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
  const buffer = Buffer.from(bytes);

  const imagesDir = path.join(process.cwd(), "public", "images");
  if (!existsSync(imagesDir)) await mkdir(imagesDir, { recursive: true });

  await writeFile(path.join(imagesDir, `${slot}.jpg`), buffer);

  revalidatePath("/", "layout");
}
