import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { crearSesion, leerSesion, borrarSesion } from "@/lib/sesiones";

const COOKIE_NAME = "flandes_admin";
const DIAS = 7;

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

/**
 * La cookie lleva un token aleatorio que solo vale si está en el almacén de
 * sesiones. Antes llevaba el valor fijo "1", así que escribir esa cookie a mano
 * alcanzaba para entrar al panel sin conocer ninguna contraseña.
 */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return (await leerSesion("admin", token)) !== null;
}

export async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession() {
  // El panel tiene una sola contraseña compartida: no hay a quién identificar,
  // solo hace falta constancia de que alguien la ingresó bien.
  const token = await crearSesion("admin", "admin", DIAS);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * DIAS,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  // Se borra también del servidor: si no, el token seguiría sirviendo para
  // quien lo hubiera copiado.
  await borrarSesion(store.get(COOKIE_NAME)?.value);
  store.delete(COOKIE_NAME);
}
