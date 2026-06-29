"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCurso, updateCurso, deleteCurso } from "@/lib/db";

export async function saveCursoAction(formData: FormData) {
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
    updateCurso(id, data);
  } else {
    createCurso(data);
  }

  revalidatePath("/adiestramiento");
  revalidatePath("/admin/cursos");
  revalidatePath("/admin");
  redirect("/admin/cursos");
}

export async function deleteCursoAction(formData: FormData) {
  const id = formData.get("id") as string;
  deleteCurso(id);
  revalidatePath("/adiestramiento");
  revalidatePath("/admin/cursos");
  revalidatePath("/admin");
  redirect("/admin/cursos");
}
