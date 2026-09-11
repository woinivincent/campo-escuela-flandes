import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Contraseñas de los socios.
 *
 * Se usa bcrypt y no SHA-256. SHA-256 está hecho para ser rápido —es su razón
 * de ser, verificar integridad de datos— y esa velocidad juega en contra acá:
 * si el padrón se filtrara, un atacante puede probar miles de millones de
 * combinaciones por segundo con una placa de video común. bcrypt es lento a
 * propósito y el costo se puede subir con los años.
 *
 * Las contraseñas viejas siguen entrando: `verifyPassword` reconoce los dos
 * formatos y `necesitaMigracion` avisa cuáles conviene regrabar. La migración
 * se hace en el login, que es el único momento en que se conoce la contraseña
 * en texto plano; un hash no se puede convertir al otro sin ella.
 */

/**
 * Cuánto trabajo cuesta cada hash. Cada punto duplica el tiempo.
 * 12 son unas décimas de segundo, aceptable para un login y caro para quien
 * quiera probar de a millones.
 */
const RONDAS = 12;

/** Los hashes de bcrypt empiezan con $2a$, $2b$ o $2y$ según la variante. */
function esBcrypt(hash: string): boolean {
  return /^\$2[aby]\$/.test(hash);
}

/** El esquema viejo, que se conserva solo para poder validar lo ya guardado. */
function hashHeredado(password: string, salt: string): string {
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}

/**
 * Hash de una contraseña nueva.
 *
 * No recibe salt: bcrypt genera el suyo y lo guarda adentro del hash, así que
 * el campo `salt` del socio queda vacío en los registros nuevos.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, RONDAS);
}

/**
 * Valida una contraseña contra cualquiera de los dos esquemas.
 *
 * La comparación de bcrypt es de tiempo constante. La del esquema viejo no lo
 * era y tampoco lo es ahora, pero se compara contra un hash, no contra la
 * contraseña: lo que se podría inferir midiendo tiempos es un hash que el
 * atacante ya tendría si llegó a la base.
 */
export async function verifyPassword(
  password: string,
  salt: string,
  hash: string
): Promise<boolean> {
  if (esBcrypt(hash)) return bcrypt.compare(password, hash);
  return hashHeredado(password, salt) === hash;
}

/** True si el hash guardado es del esquema viejo y conviene regrabarlo. */
export function necesitaMigracion(hash: string): boolean {
  return !esBcrypt(hash);
}

/**
 * Salt del esquema viejo.
 *
 * Ya no se usa para contraseñas nuevas; queda porque el tipo `Socio` tiene el
 * campo y los registros viejos lo necesitan para validarse.
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}
