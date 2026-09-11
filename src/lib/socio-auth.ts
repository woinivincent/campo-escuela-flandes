import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSocioById, getSocioByEmail, type Socio } from "@/lib/db";
import { verifyPassword } from "@/lib/crypto-utils";
import { crearSesion, leerSesion, borrarSesion } from "@/lib/sesiones";

const COOKIE_NAME = "flandes_socio";
const DIAS = 30;

/**
 * La cookie lleva un token aleatorio, no el id del socio.
 *
 * Antes guardaba el id directamente, y los ids se arman con la marca de tiempo
 * del alta (`socio-1789013554233`). Bastaba con probar marcas de tiempo
 * cercanas para entrar al portal como otra persona sin saber su contraseña.
 */
export async function getSocioSession(): Promise<Socio | null> {
  const store = await cookies();
  const socioId = await leerSesion("socio", store.get(COOKIE_NAME)?.value);
  if (!socioId) return null;

  const socio = await getSocioById(socioId);
  // Un socio dado de baja deja de entrar aunque su sesión siga vigente.
  if (!socio || !socio.activo) return null;
  return socio;
}

export async function requireSocioAuth(): Promise<Socio> {
  const socio = await getSocioSession();
  if (!socio) redirect("/socios/login");
  return socio;
}

export async function loginSocio(email: string, password: string): Promise<Socio | null> {
  const socio = await getSocioByEmail(email.trim().toLowerCase());
  if (!socio || !socio.activo) return null;
  if (!verifyPassword(password, socio.salt, socio.password_hash)) return null;
  return socio;
}

export async function setSocioSession(socioId: string): Promise<void> {
  const token = await crearSesion("socio", socioId, DIAS);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * DIAS,
  });
}

export async function clearSocioSession(): Promise<void> {
  const store = await cookies();
  await borrarSesion(store.get(COOKIE_NAME)?.value);
  store.delete(COOKIE_NAME);
}
