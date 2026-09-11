"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCurso, updateCurso, deleteCurso } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function saveCursoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string | null;
  const data = {
    titulo: formData.get("titulo") as string,
    descripcion: formData.get("descripcion") as string,
    fecha: formData.get("fecha") as string,
    hora: (formData.get("hora") as string) ?? "",
    nivel: (formData.get("nivel") as string) ?? "Básico",
    destinatarios: formData.get("destinatarios") as string,
    cupos: (formData.get("cupos") as string) ?? "",
  };

  if (id) {
    await updateCurso(id, data);
  } else {
    await createCurso(data);
  }

  revalidatePath("/adiestramiento");
  revalidatePath("/admin/cursos");
  revalidatePath("/admin");
  redirect("/admin/cursos");
}

export async function deleteCursoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  await deleteCurso(id);
  revalidatePath("/adiestramiento");
  revalidatePath("/admin/cursos");
  revalidatePath("/admin");
  redirect("/admin/cursos");
}
