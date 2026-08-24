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
  ]) {
    const val = formData.get(key);
    if (typeof val === "string") data[key] = val.trim();
  }
  await setConfigValues(data);
  revalidatePath("/", "layout");
}
