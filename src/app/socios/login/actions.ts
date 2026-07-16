"use server";

import { redirect } from "next/navigation";
import { loginSocio, setSocioSession, clearSocioSession } from "@/lib/socio-auth";

export async function loginSocioAction(formData: FormData) {
  const email = (formData.get("email") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";

  const socio = await loginSocio(email, password);
  if (!socio) {
    redirect("/socios/login?error=1");
  }
  await setSocioSession(socio.id);
  redirect("/socios/portal");
}

export async function logoutSocioAction() {
  await clearSocioSession();
  redirect("/socios");
}
