"use server";

import { revalidatePath } from "next/cache";
import { createEspecie, updateEspecie, deleteEspecie } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import type { CategoriaEspecie } from "@/lib/db";

export async function saveEspecieAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string | null;
  const data = {
    nombreComun: (formData.get("nombreComun") as string).trim(),
    nombreCientifico: (formData.get("nombreCientifico") as string).trim(),
    categoria: (formData.get("categoria") as CategoriaEspecie),
    descripcion: (formData.get("descripcion") as string).trim(),
    curiosidad: (formData.get("curiosidad") as string).trim(),
    qrDisponible: formData.get("qrDisponible") === "1",
  };
  if (!data.nombreComun) return;

  if (id) {
    await updateEspecie(id, data);
  } else {
    await createEspecie(data);
  }
  revalidatePath("/naturaleza");
  revalidatePath("/admin/naturaleza");
}

export async function deleteEspecieAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) await deleteEspecie(id);
  revalidatePath("/naturaleza");
  revalidatePath("/admin/naturaleza");
}
