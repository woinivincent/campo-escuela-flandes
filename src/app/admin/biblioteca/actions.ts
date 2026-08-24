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
import { guardarDocumento, borrarDocumento } from "@/lib/docs";

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
  let url = ((formData.get("url") as string) ?? "").trim();

  if (!titulo) return;

  // Si se adjuntó un PDF, se guarda y su ruta reemplaza al enlace escrito.
  const archivo = formData.get("archivo") as File | null;
  if (archivo && archivo.size > 0) {
    url = await guardarDocumento(archivo);
  }

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
  if (!id) return;
  // Si el material tenía un PDF subido, se borra también el archivo.
  const url = ((formData.get("url") as string) ?? "").trim();
  if (url.startsWith("/docs/")) await borrarDocumento(url);
  await deleteMaterial(id);
  revalidar();
}
