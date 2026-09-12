"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  createSocio, toggleSocioActivo, deleteSocio, updateSocioPassword,
  createRecursoSocio, updateRecursoSocio, toggleRecursoActivo, deleteRecursoSocio,
  createSociosBulk, getSocios,
} from "@/lib/db";
import { hashPassword } from "@/lib/crypto-utils";
import crypto from "crypto";
import {
  revisarFilas, TAMANO_TANDA,
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
 * Da de alta una tanda del padrón.
 *
 * Se importa de a tandas y no todo junto porque bcrypt tarda unos 300 ms por
 * contraseña y bcryptjs es de un solo hilo: cien socios de una vez son treinta
 * segundos de CPU y las funciones de Netlify cortan a los diez. El navegador
 * llama a esta acción varias veces seguidas hasta terminar la planilla.
 *
 * Cada tanda se escribe antes de que empiece la siguiente, así que los socios
 * ya importados aparecen en getSocios() y un email repetido entre dos tandas se
 * detecta igual que si estuviera repetido dentro de una.
 *
 * Las filas ya vienen revisadas por el navegador, pero acá se revisan de nuevo:
 * lo que llega del formulario lo puede escribir cualquiera.
 */
export async function importarTandaAction(
  filas: FilaPadron[]
): Promise<ResultadoImport> {
  await requireAuth();
  const vacio = { importados: [], omitidos: [] };

  if (!Array.isArray(filas) || filas.length === 0) {
    return { ok: false, mensaje: "La tanda llegó vacía.", ...vacio };
  }
  if (filas.length > TAMANO_TANDA) {
    return {
      ok: false,
      mensaje: `Una tanda no puede tener más de ${TAMANO_TANDA} filas.`,
      ...vacio,
    };
  }

  const crudas: FilaPadron[] = filas.map((f) => ({
    nombre: String(f?.nombre ?? ""),
    email: String(f?.email ?? ""),
  }));

  const yaExisten = new Set((await getSocios()).map((s) => s.email.toLowerCase()));
  const revisadas = revisarFilas(crudas, yaExisten);

  const aCrear = revisadas.filter((r) => r.estado === "ok");
  const omitidos = revisadas
    .filter((r) => r.estado !== "ok")
    .map((r) => ({ nombre: r.fila.nombre, email: r.fila.email, estado: r.estado }));

  const conClave = [];
  for (const r of aCrear) {
    const clave = generarClave();
    conClave.push({
      nombre: r.fila.nombre,
      email: r.fila.email,
      clave,
      salt: "",
      password_hash: await hashPassword(clave),
    });
  }

  await createSociosBulk(
    conClave.map(({ nombre, email, password_hash, salt }) => ({
      nombre, email, password_hash, salt,
    }))
  );

  revalidatePath("/admin/socios");

  return {
    ok: true,
    mensaje: `${conClave.length} de ${filas.length}`,
    importados: conClave.map(({ nombre, email, clave }) => ({ nombre, email, clave })),
    omitidos,
  };
}

export async function createSocioAction(formData: FormData) {
  await requireAuth();
  const nombre = (formData.get("nombre") as string).trim();
  const email = (formData.get("email") as string).trim();
  const password = (formData.get("password") as string);
  if (!nombre || !email || !password) return;

  // bcrypt guarda su propio salt adentro del hash: el campo queda vacío.
  await createSocio({
    nombre, email, password_hash: await hashPassword(password), salt: "",
  });
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
  await updateSocioPassword(id, await hashPassword(password), "");
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
