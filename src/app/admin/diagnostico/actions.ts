"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { restaurarColeccionDelCodigo } from "@/lib/db";

/**
 * Pisa una colección guardada con lo que trae el código.
 *
 * Es destructivo a propósito: se usa cuando lo guardado quedó viejo —datos de
 * maqueta, contenido de una etapa anterior— y lo bueno está en el repositorio.
 */
export async function restaurarColeccionAction(formData: FormData) {
  await requireAuth();
  const nombre = formData.get("coleccion");
  if (typeof nombre !== "string" || !nombre) return;

  await restaurarColeccionDelCodigo(nombre);

  // El contenido restaurado se ve en todo el sitio, no solo en el panel.
  revalidatePath("/", "layout");
}
