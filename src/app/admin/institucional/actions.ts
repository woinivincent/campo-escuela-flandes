"use server";

import { revalidatePath } from "next/cache";
import { createHito, updateHito, deleteHito } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function saveHitoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string | null;
  const anio = (formData.get("anio") as string).trim();
  const texto = (formData.get("texto") as string).trim();

  if (!anio || !texto) return;

  if (id) {
    updateHito(id, { anio, texto });
  } else {
    createHito({ anio, texto, orden: 999 });
  }
  revalidatePath("/institucional");
  revalidatePath("/admin/institucional");
}

export async function deleteHitoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) deleteHito(id);
  revalidatePath("/institucional");
  revalidatePath("/admin/institucional");
}
