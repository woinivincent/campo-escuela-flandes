import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getHitos, getHito } from "@/lib/db";
import { saveHitoAction, deleteHitoAction } from "./actions";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata = { title: "Institucional — Admin Flandes" };

export default async function AdminInstitucionalPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await requireAuth();
  const { edit, new: isNew } = await searchParams;
  const hitos = await getHitos();
  const editando = edit ? await getHito(edit) : undefined;
  const showForm = !!editando || isNew === "1";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">Hitos históricos</h1>
          <p className="mt-0.5 text-sm text-white/40">Línea de tiempo que aparece en la página Institucional.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/institucional" target="_blank" className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70">
            Ver página <ArrowRightIcon width={12} height={12} />
          </Link>
          {!showForm && (
            <Link href="/admin/institucional?new=1" className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark">
              + Nuevo hito
            </Link>
          )}
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 font-display text-base font-bold uppercase tracking-wide text-white">
            {editando ? "Editar hito" : "Nuevo hito"}
          </h2>
          <form action={saveHitoAction} className="space-y-4">
            {editando && <input type="hidden" name="id" value={editando.id} />}
            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <div>
                <label className="field-label">Año / Período</label>
                <input name="anio" type="text" defaultValue={editando?.anio ?? ""} placeholder="1980s" required className="admin-input" />
                <p className="mt-1 text-xs text-white/30">Ej: 1980s, 1990, Hoy</p>
              </div>
              <div>
                <label className="field-label">Texto del hito</label>
                <textarea name="texto" rows={3} defaultValue={editando?.texto ?? ""} placeholder="Descripción de lo ocurrido en ese período…" required className="admin-input resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark">
                {editando ? "Guardar cambios" : "Agregar hito"}
              </button>
              <Link href="/admin/institucional" className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/50 transition hover:text-white/80">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {hitos.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/30">No hay hitos cargados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Año</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Texto</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {hitos.map((h) => (
                <tr key={h.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-display font-bold text-flandes-red whitespace-nowrap">{h.anio}</td>
                  <td className="px-4 py-3 text-white/70 max-w-xs truncate">{h.texto}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/institucional?edit=${h.id}`} className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 hover:text-white/80">
                        Editar
                      </Link>
                      <form action={deleteHitoAction}>
                        <input type="hidden" name="id" value={h.id} />
                        <button type="submit" className="rounded-lg border border-flandes-red/20 px-3 py-1 text-xs text-flandes-red/70 hover:border-flandes-red/40 hover:text-flandes-red">
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
}
