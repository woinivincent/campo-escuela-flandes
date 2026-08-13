"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  createMaterial,
  updateMaterial,
  toggleMaterialActivo,
  deleteMaterial,
} from "@/lib/db";
import type { TipoMaterial } from "@/lib/db";

function revalidar() {
  revalidatePath("/biblioteca");
  revalidatePath("/admin/biblioteca");
}

export async function saveMaterialAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string | null;
  const titulo = (formData.get("titulo") as string).trim();
  const descripcion = (formData.get("descripcion") as string).trim();
  const tipo = formData.get("tipo") as TipoMaterial;
  const url = ((formData.get("url") as string) ?? "").trim();

  if (!titulo) return;

  if (id) {
    await updateMaterial(id, { titulo, descripcion, tipo, url });
  } else {
    await createMaterial({ titulo, descripcion, tipo, url, activo: 1 });
  }
  revalidar();
}

export async function toggleMaterialAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) await toggleMaterialActivo(id);
  revalidar();
}

export async function deleteMaterialAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) await deleteMaterial(id);
  revalidar();
}
