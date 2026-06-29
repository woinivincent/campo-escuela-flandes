import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getEventos, getEvento } from "@/lib/db";
import type { TipoEvento, Evento } from "@/lib/db";
import { saveEventoAction, deleteEventoAction } from "./actions";

export const metadata = { title: "Agenda — Admin Flandes" };

const TIPOS: TipoEvento[] = ["Acampe", "Curso", "Charla", "Actividad"];

const tipoBadge: Record<TipoEvento, string> = {
  Acampe: "bg-flandes-red/15 text-flandes-red",
  Curso: "bg-[#1E4527]/20 text-forest-light",
  Charla: "bg-gold/15 text-gold-dark",
  Actividad: "bg-white/10 text-white/70",
};

export default async function AdminAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await requireAuth();

  const { edit, new: isNew } = await searchParams;
  const eventos = getEventos();
  const editando = edit ? getEvento(edit) : undefined;
  const showForm = !!editando || isNew === "1";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Agenda
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            {eventos.length} eventos en total
          </p>
        </div>
        {!showForm && (
          <Link
            href="/admin/agenda?new=1"
            className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark"
          >
            + Nuevo evento
          </Link>
        )}
      </div>

      {/* Formulario (crear o editar) */}
      {showForm && (
        <EventoForm evento={editando} />
      )}

      {/* Lista de eventos */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {eventos.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/30">
            No hay eventos cargados.
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
                  Tipo
                </th>
                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40 md:table-cell">
                  Destinatarios
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {eventos.map((ev, i) => (
                <tr
                  key={ev.id}
                  className={`border-b border-white/5 transition hover:bg-white/5 ${
                    editando?.id === ev.id ? "bg-gold/5" : ""
                  } ${i === eventos.length - 1 ? "border-0" : ""}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-white/60">
                    {ev.fecha}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {ev.titulo}
                    {ev.hora && (
                      <span className="ml-2 text-xs text-white/30">
                        {ev.hora}
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tipoBadge[ev.tipo]}`}
                    >
                      {ev.tipo}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-white/40 md:table-cell">
                    {ev.destinatarios}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/agenda?edit=${ev.id}`}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/50 transition hover:border-white/25 hover:text-white"
                      >
                        Editar
                      </Link>
                      <form action={deleteEventoAction}>
                        <input type="hidden" name="id" value={ev.id} />
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

function EventoForm({ evento }: { evento?: Evento }) {
  const isEdit = !!evento;

  return (
    <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-gold">
          {isEdit ? "Editando evento" : "Nuevo evento"}
        </h2>
        <Link
          href="/admin/agenda"
          className="text-xs text-white/30 transition hover:text-white/60"
        >
          Cancelar ✕
        </Link>
      </div>

      <form action={saveEventoAction} className="grid gap-4 sm:grid-cols-2">
        {isEdit && (
          <input type="hidden" name="id" value={evento.id} />
        )}

        <div className="sm:col-span-2">
          <label className="field-label">Título *</label>
          <input
            name="titulo"
            type="text"
            required
            defaultValue={evento?.titulo}
            className="admin-input"
            placeholder="Ej: Curso de orientación con brújula y mapa"
          />
        </div>

        <div>
          <label className="field-label">Fecha *</label>
          <input
            name="fecha"
            type="date"
            required
            defaultValue={evento?.fecha}
            className="admin-input"
          />
        </div>

        <div>
          <label className="field-label">Hora</label>
          <input
            name="hora"
            type="text"
            defaultValue={evento?.hora}
            className="admin-input"
            placeholder="Ej: 9:00 h"
          />
        </div>

        <div>
          <label className="field-label">Tipo *</label>
          <select name="tipo" defaultValue={evento?.tipo ?? "Actividad"} className="admin-input">
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
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
            defaultValue={evento?.destinatarios}
            className="admin-input"
            placeholder="Ej: Scouts y dirigentes"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label">Descripción *</label>
          <textarea
            name="descripcion"
            required
            defaultValue={evento?.descripcion}
            rows={3}
            className="admin-input resize-none"
            placeholder="Descripción del evento..."
          />
        </div>

        <div>
          <label className="field-label">Cupos (opcional)</label>
          <input
            name="cupos"
            type="text"
            defaultValue={evento?.cupos}
            className="admin-input"
            placeholder="Ej: 20 personas"
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95"
          >
            {isEdit ? "Guardar cambios" : "Crear evento"}
          </button>
        </div>
      </form>
    </div>
  );
}
