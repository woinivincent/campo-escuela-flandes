import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getMateriales, getMaterial, type TipoMaterial } from "@/lib/db";
import {
  saveMaterialAction,
  toggleMaterialAction,
  deleteMaterialAction,
} from "./actions";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata = { title: "Biblioteca — Admin Flandes" };
export const dynamic = "force-dynamic";

const TIPOS: TipoMaterial[] = ["Bordón", "Digital", "Físico"];

const AYUDA: Record<TipoMaterial, string> = {
  "Bordón": "Ediciones del Bordón digital. Pegá el enlace del video de YouTube.",
  "Digital": "Documentos para descargar. Pegá el enlace al archivo.",
  "Físico": "Libros para consultar en el campo. El enlace es opcional.",
};

export default async function AdminBibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await requireAuth();
  const { edit, new: isNew } = await searchParams;
  const materiales = await getMateriales();
  const editando = edit ? await getMaterial(edit) : undefined;
  const showForm = !!editando || isNew === "1";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Biblioteca
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            El Bordón digital, material para descargar y libros del campo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/biblioteca"
            target="_blank"
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
          >
            Ver página <ArrowRightIcon width={12} height={12} />
          </Link>
          {!showForm && (
            <Link
              href="/admin/biblioteca?new=1"
              className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark"
            >
              + Nuevo material
            </Link>
          )}
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 font-display text-base font-bold uppercase tracking-wide text-white">
            {editando ? "Editar material" : "Nuevo material"}
          </h2>
          <form action={saveMaterialAction} className="space-y-4">
            {editando && <input type="hidden" name="id" value={editando.id} />}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Título</label>
                <input
                  name="titulo"
                  type="text"
                  defaultValue={editando?.titulo ?? ""}
                  placeholder="Bordón digital — Capítulo 7"
                  required
                  className="admin-input"
                />
              </div>
              <div>
                <label className="field-label">Tipo</label>
                <select
                  name="tipo"
                  defaultValue={editando?.tipo ?? "Bordón"}
                  className="admin-input"
                >
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-white/30">
                  {AYUDA[editando?.tipo ?? "Bordón"]}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Enlace</label>
                <input
                  name="url"
                  type="url"
                  defaultValue={editando?.url ?? ""}
                  placeholder="https://youtu.be/…"
                  className="admin-input"
                />
                <p className="mt-1 text-xs text-white/30">
                  Para el Bordón, el enlace del video. Para los libros del campo se puede dejar vacío.
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Descripción</label>
                <textarea
                  name="descripcion"
                  rows={2}
                  defaultValue={editando?.descripcion ?? ""}
                  placeholder="De qué trata esta edición o este material…"
                  className="admin-input resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark"
              >
                {editando ? "Guardar cambios" : "Agregar material"}
              </button>
              <Link
                href="/admin/biblioteca"
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/50 transition hover:text-white/80"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Listas por tipo */}
      {TIPOS.map((tipo) => {
        const lista = materiales.filter((m) => m.tipo === tipo);
        return (
          <div key={tipo}>
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-white/50">
              {tipo} <span className="ml-1 text-white/25">({lista.length})</span>
            </h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {lista.length === 0 ? (
                <p className="py-8 text-center text-sm text-white/30">
                  Sin material de tipo {tipo.toLowerCase()}.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-left">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Título</th>
                      <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40 md:table-cell">Enlace</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((m) => (
                      <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-semibold text-white">{m.titulo}</td>
                        <td className="hidden max-w-[16rem] truncate px-4 py-3 text-xs text-white/40 md:table-cell">
                          {m.url || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <form action={toggleMaterialAction}>
                            <input type="hidden" name="id" value={m.id} />
                            <button
                              type="submit"
                              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                m.activo === 1
                                  ? "bg-forest-light/20 text-forest-light hover:bg-forest-light/30"
                                  : "bg-white/5 text-white/35 hover:bg-white/10"
                              }`}
                            >
                              {m.activo === 1 ? "Visible" : "Oculto"}
                            </button>
                          </form>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/biblioteca?edit=${m.id}`}
                              className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 hover:text-white/80"
                            >
                              Editar
                            </Link>
                            <form action={deleteMaterialAction}>
                              <input type="hidden" name="id" value={m.id} />
                              <button
                                type="submit"
                                className="rounded-lg border border-flandes-red/20 px-3 py-1 text-xs text-flandes-red/70 hover:border-flandes-red/40 hover:text-flandes-red"
                              >
                                Eliminar
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
