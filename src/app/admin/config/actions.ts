"use server";

import { revalidatePath } from "next/cache";
import { setConfigValues } from "@/lib/db";

export async function saveConfigAction(formData: FormData) {
  const data: Record<string, string> = {};
  for (const key of [
    "whatsapp",
    "whatsappDisplay",
    "email",
    "facebook",
    "instagram",
    "youtube",
  ]) {
    const val = formData.get(key);
    if (typeof val === "string") data[key] = val.trim();
  }
  setConfigValues(data);
  revalidatePath("/", "layout");
}
