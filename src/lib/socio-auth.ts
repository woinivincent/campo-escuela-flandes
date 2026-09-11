import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSocioById, getSocioByEmail, updateSocioPassword, type Socio,
} from "@/lib/db";
import {
  verifyPassword, hashPassword, necesitaMigracion,
} from "@/lib/crypto-utils";
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
  if (!(await verifyPassword(password, socio.salt, socio.password_hash))) return null;

  // Un hash del esquema viejo solo se puede convertir con la contraseña en
  // texto plano, y este es el único momento en que se la tiene. Se regraba acá.
  //
  // Si la regrabación falla, el login sigue adelante igual: el socio ya se
  // autenticó bien y dejarlo afuera por un problema de escritura sería peor.
  // La próxima vez que entre, se vuelve a intentar.
  if (necesitaMigracion(socio.password_hash)) {
    try {
      await updateSocioPassword(socio.id, await hashPassword(password), "");
    } catch (e) {
      console.error("[socios] no se pudo migrar el hash de", socio.email, e);
    }
  }

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
