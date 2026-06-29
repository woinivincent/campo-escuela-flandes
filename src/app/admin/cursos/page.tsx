import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getCursos, getCurso } from "@/lib/db";
import type { Curso } from "@/lib/db";
import { saveCursoAction, deleteCursoAction } from "./actions";

export const metadata = { title: "Cursos — Admin Flandes" };

const NIVELES = ["Básico", "Intermedio", "Avanzado"];

const nivelBadge: Record<string, string> = {
  Básico: "bg-[#1E4527]/20 text-forest-light",
  Intermedio: "bg-gold/15 text-gold-dark",
  Avanzado: "bg-flandes-red/15 text-flandes-red",
};

export default async function AdminCursosPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await requireAuth();

  const { edit, new: isNew } = await searchParams;
  const cursos = getCursos();
  const editando = edit ? getCurso(edit) : undefined;
  const showForm = !!editando || isNew === "1";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Cursos de adiestramiento
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            {cursos.length} cursos en total
          </p>
        </div>
        {!showForm && (
          <Link
            href="/admin/cursos?new=1"
            className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark"
          >
            + Nuevo curso
          </Link>
        )}
      </div>

      {showForm && <CursoForm curso={editando} />}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        {cursos.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/30">
            No hay cursos cargados.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Fecha
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Título
                </th>
                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40 sm:table-cell">
                  Nivel
                </th>
                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40 md:table-cell">
                  Destinatarios
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cursos.map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-b border-white/5 transition hover:bg-white/5 ${
                    editando?.id === c.id ? "bg-gold/5" : ""
                  } ${i === cursos.length - 1 ? "border-0" : ""}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-white/60">
                    {c.fecha}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {c.titulo}
                    {c.hora && (
                      <span className="ml-2 text-xs text-white/30">{c.hora}</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        nivelBadge[c.nivel] ?? "bg-white/10 text-white/70"
                      }`}
                    >
                      {c.nivel}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-white/40 md:table-cell">
                    {c.destinatarios}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/cursos?edit=${c.id}`}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/50 transition hover:border-white/25 hover:text-white"
                      >
                        Editar
                      </Link>
                      <form action={deleteCursoAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-flandes-red/20 px-2.5 py-1 text-xs text-flandes-red/60 transition hover:border-flandes-red/40 hover:text-flandes-red"
                        >
                          Borrar
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
}

function CursoForm({ curso }: { curso?: Curso }) {
  const isEdit = !!curso;

  return (
    <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-gold">
          {isEdit ? "Editando curso" : "Nuevo curso"}
        </h2>
        <Link
          href="/admin/cursos"
          className="text-xs text-white/30 transition hover:text-white/60"
        >
          Cancelar ✕
        </Link>
      </div>

      <form action={saveCursoAction} className="grid gap-4 sm:grid-cols-2">
        {isEdit && <input type="hidden" name="id" value={curso.id} />}

        <div className="sm:col-span-2">
          <label className="field-label">Título *</label>
          <input
            name="titulo"
            type="text"
            required
            defaultValue={curso?.titulo}
            className="admin-input"
            placeholder="Ej: Curso de primeros auxilios en el campo"
          />
        </div>

        <div>
          <label className="field-label">Fecha *</label>
          <input
            name="fecha"
            type="date"
            required
            defaultValue={curso?.fecha}
            className="admin-input"
          />
        </div>

        <div>
          <label className="field-label">Hora</label>
          <input
            name="hora"
            type="text"
            defaultValue={curso?.hora}
            className="admin-input"
            placeholder="Ej: 9:00 h"
          />
        </div>

        <div>
          <label className="field-label">Nivel</label>
          <select
            name="nivel"
            defaultValue={curso?.nivel ?? "Básico"}
            className="admin-input"
          >
            {NIVELES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Destinatarios *</label>
          <input
            name="destinatarios"
            type="text"
            required
            defaultValue={curso?.destinatarios}
            className="admin-input"
            placeholder="Ej: Scouts y dirigentes"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label">Descripción *</label>
          <textarea
            name="descripcion"
            required
            defaultValue={curso?.descripcion}
            rows={3}
            className="admin-input resize-none"
            placeholder="Descripción del curso..."
          />
        </div>

        <div>
          <label className="field-label">Cupos (opcional)</label>
          <input
            name="cupos"
            type="text"
            defaultValue={curso?.cupos}
            className="admin-input"
            placeholder="Ej: 20 personas"
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95"
          >
            {isEdit ? "Guardar cambios" : "Crear curso"}
          </button>
        </div>
      </form>
    </div>
  );
}
