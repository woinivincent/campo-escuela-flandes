"use server";

import { redirect } from "next/navigation";
import {
  isAdminPasswordConfigured,
  isAdminPasswordValid,
  setAdminSession,
  clearAdminSession,
} from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!isAdminPasswordConfigured()) {
    redirect("/admin/login?error=sin-clave");
  }

  if (isAdminPasswordValid(password)) {
    await setAdminSession();
    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
