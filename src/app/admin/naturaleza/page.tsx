import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getEspecies, getEspecie } from "@/lib/db";
import { saveEspecieAction, deleteEspecieAction } from "./actions";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata = { title: "Naturaleza — Admin Flandes" };

export default async function AdminNaturalezaPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await requireAuth();
  const { edit, new: isNew } = await searchParams;
  const especies = await getEspecies();
  const editando = edit ? await getEspecie(edit) : undefined;
  const showForm = !!editando || isNew === "1";

  const flora = especies.filter((e) => e.categoria === "Flora");
  const fauna = especies.filter((e) => e.categoria === "Fauna");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">Especies</h1>
          <p className="mt-0.5 text-sm text-white/40">Flora y fauna que aparecen en la página Naturaleza.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/naturaleza" target="_blank" className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70">
            Ver página <ArrowRightIcon width={12} height={12} />
          </Link>
          <Link href="/admin/naturaleza/qr" className="rounded-xl border border-gold/30 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-gold transition hover:border-gold/60 hover:bg-gold/10">
            Códigos QR
          </Link>
          {!showForm && (
            <Link href="/admin/naturaleza?new=1" className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark">
              + Nueva especie
            </Link>
          )}
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-5 font-display text-base font-bold uppercase tracking-wide text-white">
            {editando ? "Editar especie" : "Nueva especie"}
          </h2>
          <form action={saveEspecieAction} className="space-y-4">
            {editando && <input type="hidden" name="id" value={editando.id} />}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Nombre común</label>
                <input name="nombreComun" type="text" defaultValue={editando?.nombreComun ?? ""} placeholder="Ceibo" required className="admin-input" />
              </div>
              <div>
                <label className="field-label">Nombre científico</label>
                <input name="nombreCientifico" type="text" defaultValue={editando?.nombreCientifico ?? ""} placeholder="Erythrina crista-galli" required className="admin-input" />
              </div>
              <div>
                <label className="field-label">Categoría</label>
                <select name="categoria" defaultValue={editando?.categoria ?? "Flora"} className="admin-input">
                  <option value="Flora">Flora</option>
                  <option value="Fauna">Fauna</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input type="hidden" name="qrDisponible" value="0" />
                <input
                  id="qrDisponible"
                  name="qrDisponible"
                  type="checkbox"
                  value="1"
                  defaultChecked={editando?.qrDisponible ?? false}
                  className="h-4 w-4 rounded accent-gold"
                />
                <label htmlFor="qrDisponible" className="text-sm text-white/70">QR disponible en el predio</label>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Descripción</label>
                <textarea name="descripcion" rows={3} defaultValue={editando?.descripcion ?? ""} placeholder="Descripción de la especie…" required className="admin-input resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Dato / Curiosidad</label>
                <input name="curiosidad" type="text" defaultValue={editando?.curiosidad ?? ""} placeholder="Dato interesante sobre la especie…" required className="admin-input" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark">
                {editando ? "Guardar cambios" : "Agregar especie"}
              </button>
              <Link href="/admin/naturaleza" className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/50 transition hover:text-white/80">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Lista — Flora */}
      {[{ label: "Flora", list: flora }, { label: "Fauna", list: fauna }].map(({ label, list }) => (
        <div key={label}>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-white/50">{label}</h2>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {list.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/30">Sin especies de {label.toLowerCase()} cargadas.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Nombre común</th>
                    <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40 sm:table-cell">Nombre científico</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">QR</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {list.map((e) => (
                    <tr key={e.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-semibold text-white">{e.nombreComun}</td>
                      <td className="hidden px-4 py-3 italic text-white/50 sm:table-cell">{e.nombreCientifico}</td>
                      <td className="px-4 py-3 text-xs text-white/40">{e.qrDisponible ? "Sí" : "No"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/naturaleza?edit=${e.id}`} className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 hover:text-white/80">
                            Editar
                          </Link>
                          <form action={deleteEspecieAction}>
                            <input type="hidden" name="id" value={e.id} />
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
      ))}
    </div>
  );
}
