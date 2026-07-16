"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  createSocio, toggleSocioActivo, deleteSocio, updateSocioPassword,
  createRecursoSocio, updateRecursoSocio, toggleRecursoActivo, deleteRecursoSocio,
} from "@/lib/db";
import { hashPassword, generateSalt } from "@/lib/crypto-utils";

export async function createSocioAction(formData: FormData) {
  await requireAuth();
  const nombre = (formData.get("nombre") as string).trim();
  const email = (formData.get("email") as string).trim();
  const password = (formData.get("password") as string);
  if (!nombre || !email || !password) return;

  const salt = generateSalt();
  const password_hash = hashPassword(password, salt);
  createSocio({ nombre, email, password_hash, salt });
  revalidatePath("/admin/socios");
}

export async function toggleSocioAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) toggleSocioActivo(id);
  revalidatePath("/admin/socios");
}

export async function resetSocioPasswordAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  const password = (formData.get("password") as string);
  if (!id || !password) return;
  const salt = generateSalt();
  updateSocioPassword(id, hashPassword(password, salt), salt);
  revalidatePath("/admin/socios");
}

export async function deleteSocioAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) deleteSocio(id);
  revalidatePath("/admin/socios");
}

export async function saveRecursoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string | null;
  const data = {
    titulo: (formData.get("titulo") as string).trim(),
    descripcion: (formData.get("descripcion") as string).trim(),
    tipo: (formData.get("tipo") as string) || "link",
    url: (formData.get("url") as string).trim(),
    categoria: (formData.get("categoria") as string).trim() || "General",
    icono: (formData.get("icono") as string) || "book",
    activo: 1,
  };
  if (!data.titulo) return;

  if (id) {
    updateRecursoSocio(id, data);
  } else {
    createRecursoSocio(data);
  }
  revalidatePath("/admin/socios");
  revalidatePath("/socios/portal");
}

export async function toggleRecursoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) toggleRecursoActivo(id);
  revalidatePath("/admin/socios");
  revalidatePath("/socios/portal");
}

export async function deleteRecursoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) deleteRecursoSocio(id);
  revalidatePath("/admin/socios");
  revalidatePath("/socios/portal");
}
