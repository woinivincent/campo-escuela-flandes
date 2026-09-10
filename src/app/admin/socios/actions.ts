"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  createSocio, toggleSocioActivo, deleteSocio, updateSocioPassword,
  createRecursoSocio, updateRecursoSocio, toggleRecursoActivo, deleteRecursoSocio,
  createSociosBulk, getSocios,
} from "@/lib/db";
import { hashPassword, generateSalt } from "@/lib/crypto-utils";
import crypto from "crypto";
import {
  revisarFilas, MAX_FILAS,
  type FilaPadron, type EstadoFila,
} from "@/lib/padron";

/** Alfabeto sin caracteres que se confunden al dictar: l, o, 0, 1. */
const ABC_CLAVE = "abcdefghijkmnpqrstuvwxyz23456789";

/**
 * Clave inicial legible, del tipo "k7m-2xq-f4d".
 * El alfabeto tiene 32 letras y 256 es múltiplo de 32, así que tomar el resto
 * de cada byte no favorece a ninguna.
 */
function generarClave(): string {
  const bytes = crypto.randomBytes(9);
  let s = "";
  for (const b of bytes) s += ABC_CLAVE[b % ABC_CLAVE.length];
  return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6, 9)}`;
}

export interface ResultadoImport {
  ok: boolean;
  mensaje: string;
  /** Los que se dieron de alta, con su clave. Se muestran una sola vez. */
  importados: { nombre: string; email: string; clave: string }[];
  /** Los que quedaron afuera, con el motivo. */
  omitidos: { nombre: string; email: string; estado: EstadoFila }[];
}

/**
 * Da de alta el padrón que llega del panel.
 *
 * Las filas ya vienen revisadas por el navegador, pero acá se revisan de nuevo:
 * lo que llega en el formulario lo puede escribir cualquiera.
 */
export async function importarPadronAction(
  _previo: ResultadoImport | null,
  formData: FormData
): Promise<ResultadoImport> {
  await requireAuth();
  const vacio = { importados: [], omitidos: [] };

  let crudas: FilaPadron[];
  try {
    const json = formData.get("filas");
    if (typeof json !== "string") throw new Error("sin filas");
    const parseado = JSON.parse(json);
    if (!Array.isArray(parseado)) throw new Error("formato inesperado");
    crudas = parseado.map((f) => ({
      nombre: String(f?.nombre ?? ""),
      email: String(f?.email ?? ""),
    }));
  } catch {
    return { ok: false, mensaje: "No se pudo leer la planilla.", ...vacio };
  }

  if (crudas.length === 0) {
    return { ok: false, mensaje: "La planilla no tenía filas.", ...vacio };
  }
  if (crudas.length > MAX_FILAS) {
    return {
      ok: false,
      mensaje: `La planilla tiene ${crudas.length} filas y el máximo es ${MAX_FILAS}.`,
      ...vacio,
    };
  }

  const yaExisten = new Set((await getSocios()).map((s) => s.email.toLowerCase()));
  const revisadas = revisarFilas(crudas, yaExisten);

  const aCrear = revisadas.filter((r) => r.estado === "ok");
  const omitidos = revisadas
    .filter((r) => r.estado !== "ok")
    .map((r) => ({ nombre: r.fila.nombre, email: r.fila.email, estado: r.estado }));

  const conClave = aCrear.map((r) => {
    const clave = generarClave();
    const salt = generateSalt();
    return {
      nombre: r.fila.nombre,
      email: r.fila.email,
      clave,
      salt,
      password_hash: hashPassword(clave, salt),
    };
  });

  await createSociosBulk(
    conClave.map(({ nombre, email, password_hash, salt }) => ({
      nombre, email, password_hash, salt,
    }))
  );

  revalidatePath("/admin/socios");

  const importados = conClave.map(({ nombre, email, clave }) => ({ nombre, email, clave }));
  return {
    ok: true,
    mensaje:
      importados.length === 0
        ? "No se importó ningún socio: revisá los motivos."
        : `Se importaron ${importados.length} socios.`,
    importados,
    omitidos,
  };
}

export async function createSocioAction(formData: FormData) {
  await requireAuth();
  const nombre = (formData.get("nombre") as string).trim();
  const email = (formData.get("email") as string).trim();
  const password = (formData.get("password") as string);
  if (!nombre || !email || !password) return;

  const salt = generateSalt();
  const password_hash = hashPassword(password, salt);
  await createSocio({ nombre, email, password_hash, salt });
  revalidatePath("/admin/socios");
}

export async function toggleSocioAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) await toggleSocioActivo(id);
  revalidatePath("/admin/socios");
}

export async function resetSocioPasswordAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  const password = (formData.get("password") as string);
  if (!id || !password) return;
  const salt = generateSalt();
  await updateSocioPassword(id, hashPassword(password, salt), salt);
  revalidatePath("/admin/socios");
}

export async function deleteSocioAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) await deleteSocio(id);
  revalidatePath("/admin/socios");
}

export async function saveRecursoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string | null;
  const data = {
    titulo: (formData.get("titulo") as string).trim(),
    descripcion: (formData.get("descripcion") as string).trim(),
    tipo: (formData.get("tipo") as string) || "link",
    url: (formData.get("url") as string).trim(),
    categoria: (formData.get("categoria") as string).trim() || "General",
    icono: (formData.get("icono") as string) || "book",
    activo: 1,
  };
  if (!data.titulo) return;

  if (id) {
    await updateRecursoSocio(id, data);
  } else {
    await createRecursoSocio(data);
  }
  revalidatePath("/admin/socios");
  revalidatePath("/socios/portal");
}

export async function toggleRecursoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) await toggleRecursoActivo(id);
  revalidatePath("/admin/socios");
  revalidatePath("/socios/portal");
}

export async function deleteRecursoAction(formData: FormData) {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) await deleteRecursoSocio(id);
  revalidatePath("/admin/socios");
  revalidatePath("/socios/portal");
}
