import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSocioById, getSocioByEmail, type Socio } from "@/lib/db";
import { verifyPassword } from "@/lib/crypto-utils";

const COOKIE_NAME = "flandes_socio";

export async function getSocioSession(): Promise<Socio | null> {
  const store = await cookies();
  const socioId = store.get(COOKIE_NAME)?.value;
  if (!socioId) return null;
  const socio = getSocioById(socioId);
  if (!socio || !socio.activo) return null;
  return socio;
}

export async function requireSocioAuth(): Promise<Socio> {
  const socio = await getSocioSession();
  if (!socio) redirect("/socios/login");
  return socio;
}

export async function loginSocio(email: string, password: string): Promise<Socio | null> {
  const socio = getSocioByEmail(email.trim().toLowerCase());
  if (!socio || !socio.activo) return null;
  if (!verifyPassword(password, socio.salt, socio.password_hash)) return null;
  return socio;
}

export async function setSocioSession(socioId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, socioId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSocioSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
