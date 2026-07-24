import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getSocios, getRecursosSocios } from "@/lib/db";
import {
  createSocioAction, toggleSocioAction, deleteSocioAction, resetSocioPasswordAction,
  saveRecursoAction, toggleRecursoAction, deleteRecursoAction,
} from "./actions";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata = { title: "Socios — Admin Flandes" };

const ICONOS = ["book", "shield", "users", "calendar", "star", "map", "leaf", "lock"] as const;

export default async function AdminSociosPage({
  searchParams,
}: {
  searchParams: Promise<{ editRec?: string; newRec?: string }>;
}) {
  await requireAuth();
  const { editRec, newRec } = await searchParams;
  const socios = await getSocios();
  const recursos = await getRecursosSocios();

  const showRecForm = newRec === "1" || !!editRec;
  const editandoRec = editRec ? recursos.find((r) => r.id === editRec) : undefined;

  return (
    <div className="space-y-12">
      {/* ── SOCIOS ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">Socios</h1>
            <p className="mt-0.5 text-sm text-white/40">{socios.length} socios registrados · acceso al portal</p>
          </div>
          <Link href="/socios/portal" target="_blank" className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70">
            Ver portal <ArrowRightIcon width={12} height={12} />
          </Link>
        </div>

        {/* Agregar nuevo socio */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-gold/70">Agregar nuevo socio</h2>
          <form action={createSocioAction} className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="field-label">Nombre completo</label>
              <input name="nombre" type="text" required placeholder="Juan Pérez" className="admin-input" />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input name="email" type="email" required placeholder="juan@ejemplo.com" className="admin-input" />
            </div>
            <div>
              <label className="field-label">Contraseña inicial</label>
              <input name="password" type="text" required placeholder="••••••••" className="admin-input" />
            </div>
            <div className="flex items-end sm:col-span-3">
              <button type="submit" className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark">
                Crear socio
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de socios */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {socios.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/30">No hay socios registrados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Nombre</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Estado</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Desde</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {socios.map((s) => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-white">{s.nombre}</td>
                    <td className="px-4 py-3 text-white/60">{s.email}</td>
                    <td className="px-4 py-3">
                      <form action={toggleSocioAction} className="inline">
                        <input type="hidden" name="id" value={s.id} />
                        <button type="submit" className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${s.activo ? "bg-forest/15 text-forest-light hover:bg-flandes-red/15 hover:text-flandes-red" : "bg-flandes-red/15 text-flandes-red hover:bg-forest/15 hover:text-forest-light"}`}>
                          {s.activo ? "Activo" : "Inactivo"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40">{s.created_at}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <details className="relative inline-block">
                          <summary className="cursor-pointer rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 hover:text-white/80 list-none">
                            Nueva contraseña
                          </summary>
                          <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-xl border border-white/10 bg-[#1a2a1e] p-3 shadow-xl">
                            <form action={resetSocioPasswordAction} className="flex gap-2">
                              <input type="hidden" name="id" value={s.id} />
                              <input name="password" type="text" required placeholder="Nueva clave" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-gold" />
                              <button type="submit" className="rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-forest-dark">OK</button>
                            </form>
                          </div>
                        </details>
                        <form action={deleteSocioAction}>
                          <input type="hidden" name="id" value={s.id} />
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
      </section>

      {/* ── RECURSOS DEL PORTAL ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white">Recursos del portal</h2>
            <p className="mt-0.5 text-sm text-white/40">Documentos y enlaces visibles para socios logueados.</p>
          </div>
          {!showRecForm && (
            <Link href="/admin/socios?newRec=1" className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark">
              + Nuevo recurso
            </Link>
          )}
        </div>

        {/* Formulario de recurso */}
        {showRecForm && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wide text-white">
              {editandoRec ? "Editar recurso" : "Nuevo recurso"}
            </h3>
            <form action={saveRecursoAction} className="space-y-4">
              {editandoRec && <input type="hidden" name="id" value={editandoRec.id} />}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Título</label>
                  <input name="titulo" type="text" defaultValue={editandoRec?.titulo ?? ""} placeholder="Reglamento del campo" required className="admin-input" />
                </div>
                <div>
                  <label className="field-label">Categoría</label>
                  <input name="categoria" type="text" defaultValue={editandoRec?.categoria ?? "General"} placeholder="Formación, Técnicas, General…" className="admin-input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label">Descripción</label>
                  <textarea name="descripcion" rows={2} defaultValue={editandoRec?.descripcion ?? ""} placeholder="Breve descripción del recurso…" className="admin-input resize-none" />
                </div>
                <div>
                  <label className="field-label">URL del recurso</label>
                  <input name="url" type="url" defaultValue={editandoRec?.url ?? ""} placeholder="https://drive.google.com/…" className="admin-input" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Tipo</label>
                    <select name="tipo" defaultValue={editandoRec?.tipo ?? "link"} className="admin-input">
                      <option value="link">Enlace externo</option>
                      <option value="archivo">Archivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Ícono</label>
                    <select name="icono" defaultValue={editandoRec?.icono ?? "book"} className="admin-input">
                      {ICONOS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark">
                  {editandoRec ? "Guardar cambios" : "Agregar recurso"}
                </button>
                <Link href="/admin/socios" className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/50 transition hover:text-white/80">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de recursos */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {recursos.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/30">No hay recursos cargados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Título</th>
                  <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40 sm:table-cell">Categoría</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {recursos.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-white">{r.titulo}</td>
                    <td className="hidden px-4 py-3 text-white/60 sm:table-cell">{r.categoria}</td>
                    <td className="px-4 py-3">
                      <form action={toggleRecursoAction} className="inline">
                        <input type="hidden" name="id" value={r.id} />
                        <button type="submit" className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${r.activo ? "bg-forest/15 text-forest-light hover:bg-flandes-red/15 hover:text-flandes-red" : "bg-flandes-red/15 text-flandes-red hover:bg-forest/15 hover:text-forest-light"}`}>
                          {r.activo ? "Visible" : "Oculto"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/socios?editRec=${r.id}`} className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 hover:text-white/80">
                          Editar
                        </Link>
                        <form action={deleteRecursoAction}>
                          <input type="hidden" name="id" value={r.id} />
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
      </section>
    </div>
  );
}
