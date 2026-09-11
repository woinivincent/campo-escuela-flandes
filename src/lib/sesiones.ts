/**
 * Sesiones guardadas en el servidor.
 *
 * Antes la cookie llevaba el dato directamente: el panel guardaba
 * `flandes_admin=1` y el portal guardaba el id del socio. Las dos eran
 * falsificables sin saber ninguna contraseña —bastaba escribir la cookie a
 * mano— y en el caso del panel no había siquiera nada que adivinar.
 *
 * Ahora la cookie lleva un token aleatorio que no significa nada por sí mismo:
 * solo vale si está en este almacén, que es lo único que sabe a quién
 * corresponde. Se eligió un token guardado y no una cookie firmada para no
 * depender de un secreto nuevo en el entorno: si esa variable faltara, o
 * cambiara entre despliegues, las sesiones se romperían en silencio.
 *
 * Efecto secundario útil: se puede cerrar una sesión concreta, que con un valor
 * fijo era imposible.
 *
 * Si el almacenamiento no responde, `readRecord` devuelve un mapa vacío y
 * ninguna sesión valida. Para autenticación es el lado correcto en el que
 * fallar: deja a todos afuera, no a todos adentro.
 */

import crypto from "crypto";
import { readRecord, reemplazarRecord } from "@/lib/store";

const CLAVE = "sesiones";
const SEPARADOR = "|";

/** Qué tipo de sesión es, para que un token del portal no sirva en el panel. */
export type TipoSesion = "admin" | "socio";

/** Token de 256 bits: no se adivina ni se deriva de nada público. */
function nuevoToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function vencida(vencimiento: string): boolean {
  const t = Date.parse(vencimiento);
  return Number.isNaN(t) || t < Date.now();
}

/** Saca las vencidas. Se llama al escribir, que es cuando ya se lee el mapa. */
function sinVencidas(mapa: Record<string, string>): Record<string, string> {
  const limpio: Record<string, string> = {};
  for (const [token, valor] of Object.entries(mapa)) {
    const [, , vencimiento] = valor.split(SEPARADOR);
    if (vencimiento && !vencida(vencimiento)) limpio[token] = valor;
  }
  return limpio;
}

/**
 * Abre una sesión y devuelve el token que va en la cookie.
 *
 * `dato` es lo que hay que recordar: el id del socio, o "admin" en el panel,
 * donde la contraseña es compartida y no hay a quién identificar.
 */
export async function crearSesion(
  tipo: TipoSesion,
  dato: string,
  dias: number
): Promise<string> {
  const token = nuevoToken();
  const vence = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();

  const mapa = sinVencidas(await readRecord(CLAVE, {}));
  mapa[token] = [tipo, dato, vence].join(SEPARADOR);
  await reemplazarRecord(CLAVE, mapa);

  return token;
}

/**
 * Devuelve el dato guardado si el token vale para ese tipo y no venció.
 * Null en cualquier otro caso.
 */
export async function leerSesion(
  tipo: TipoSesion,
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;

  const valor = (await readRecord(CLAVE, {}))[token];
  if (!valor) return null;

  const [tipoGuardado, dato, vencimiento] = valor.split(SEPARADOR);
  if (tipoGuardado !== tipo) return null;
  if (!vencimiento || vencida(vencimiento)) return null;

  return dato ?? null;
}

/** Cierra una sesión. Si el token no existe, no hay nada que hacer. */
export async function borrarSesion(token: string | undefined): Promise<void> {
  if (!token) return;

  const mapa = await readRecord(CLAVE, {});
  if (!(token in mapa)) return;

  delete mapa[token];
  await reemplazarRecord(CLAVE, sinVencidas(mapa));
}
