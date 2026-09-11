"use server";

import { revalidatePath } from "next/cache";
import { setTextos } from "@/lib/db";
import { PAGINAS_TEXTOS, claveTexto } from "@/config/textos";
import { requireAuth } from "@/lib/auth";

/**
 * Guarda los textos de una sola página.
 *
 * Las claves aceptadas salen del catálogo, no del formulario: así lo que llega
 * por POST no puede escribir cualquier cosa en el store.
 */
export async function saveTextosAction(formData: FormData) {
  await requireAuth();
  const paginaId = String(formData.get("pagina") ?? "");
  const pagina = PAGINAS_TEXTOS.find((p) => p.id === paginaId);
  if (!pagina) return;

  const data: Record<string, string> = {};
  for (const campo of pagina.campos) {
    const valor = formData.get(campo.clave);
    // Vacío se guarda como vacío a propósito: es "volver al texto original".
    if (typeof valor === "string") {
      data[claveTexto(pagina.id, campo.clave)] = valor.trim();
    }
  }

  await setTextos(data);
  revalidatePath("/", "layout");
}
