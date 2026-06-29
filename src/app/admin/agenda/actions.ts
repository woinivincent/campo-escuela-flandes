"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createEvento, updateEvento, deleteEvento } from "@/lib/db";
import type { TipoEvento } from "@/lib/db";

export async function saveEventoAction(formData: FormData) {
  const id = (formData.get("id") as string) || null;
  const data = {
    titulo: (formData.get("titulo") as string).trim(),
    fecha: formData.get("fecha") as string,
    hora: ((formData.get("hora") as string) || "").trim(),
    tipo: (formData.get("tipo") as TipoEvento) || "Actividad",
    descripcion: (formData.get("descripcion") as string).trim(),
    destinatarios: (formData.get("destinatarios") as string).trim(),
    cupos: ((formData.get("cupos") as string) || "").trim(),
  };

  if (id) {
    updateEvento(id, data);
  } else {
    createEvento(data);
  }

  revalidatePath("/agenda");
  revalidatePath("/admin/agenda");
  revalidatePath("/admin");
  redirect("/admin/agenda");
}

export async function deleteEventoAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) deleteEvento(id);
  revalidatePath("/agenda");
  revalidatePath("/admin/agenda");
  revalidatePath("/admin");
  redirect("/admin/agenda");
}
