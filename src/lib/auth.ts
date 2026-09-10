import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "flandes_admin";
/**
 * Sin ADMIN_PASSWORD configurada no entra nadie. Antes había acá una clave por
 * defecto y el repositorio es público: cualquiera podía leerla.
 */
export function isAdminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isAdminPasswordValid(password: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD;
  return Boolean(esperada) && password === esperada;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "1";
}

export async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
