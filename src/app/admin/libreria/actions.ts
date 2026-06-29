"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createLibro, updateLibro, deleteLibro } from "@/lib/db";
import type { CategoriaLibro } from "@/lib/db";

export async function saveLibroAction(formData: FormData) {
  const id = (formData.get("id") as string) || null;
  const data = {
    titulo: (formData.get("titulo") as string).trim(),
    autor: (formData.get("autor") as string).trim(),
    categoria: (formData.get("categoria") as CategoriaLibro) || "Escultismo",
    precio: parseInt(formData.get("precio") as string, 10) || 0,
    descripcion: (formData.get("descripcion") as string).trim(),
    disponible: formData.get("disponible") === "1",
  };

  if (id) {
    updateLibro(id, data);
  } else {
    createLibro(data);
  }

  revalidatePath("/libreria");
  revalidatePath("/admin/libreria");
  revalidatePath("/admin");
  redirect("/admin/libreria");
}

export async function deleteLibroAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) deleteLibro(id);
  revalidatePath("/libreria");
  revalidatePath("/admin/libreria");
  revalidatePath("/admin");
  redirect("/admin/libreria");
}
