"use server";

import { revalidatePath } from "next/cache";
import { setConfigValues } from "@/lib/db";

export async function saveConfigAction(formData: FormData) {
  const data: Record<string, string> = {};
  for (const key of [
    "whatsapp",
    "whatsappDisplay",
    "email",
    "location",
    "facebook",
    "instagram",
    "youtube",
    "subcampo1",
    "subcampo2",
    "subcampo3",
    "subcampo4",
    "cuota_mensual",
    "site_url",
    "mapa_lat",
    "mapa_lng",
    "whatsapp_formaciones",
    "whatsapp_biblioteca",
    "whatsapp_socios",
    "responsable_socios_nombre",
    "responsable_socios_contacto",
  ]) {
    const val = formData.get(key);
    if (typeof val === "string") data[key] = val.trim();
  }

  // El checkbox no viaja cuando está destildado. Hay que escribirlo siempre:
  // setConfigValues mergea, así que si no, la clave nunca se podría apagar.
  data.responsable_socios_publico = formData.get("responsable_socios_publico")
    ? "1"
    : "";

  await setConfigValues(data);
  revalidatePath("/", "layout");
}
