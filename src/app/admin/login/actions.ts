"use server";

import { redirect } from "next/navigation";
import { ADMIN_PASSWORD, setAdminSession, clearAdminSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (password === ADMIN_PASSWORD) {
    await setAdminSession();
    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
