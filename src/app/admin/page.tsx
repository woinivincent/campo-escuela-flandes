import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getEventos, getLibros } from "@/lib/db";
import { CalendarIcon, BookIcon, ArrowRightIcon } from "@/components/ui/icons";

export default async function AdminDashboard() {
  await requireAuth();

  const eventos = getEventos();
  const libros = getLibros();
  const today = new Date().toISOString().slice(0, 10);
  const proximos = eventos.filter((e) => e.fecha >= today);
  const disponibles = libros.filter((l) => l.disponible);

  const stats = [
    {
      label: "Eventos totales",
      value: eventos.length,
      sub: `${proximos.length} próximos`,
      icon: CalendarIcon,
      href: "/admin/agenda",
      color: "bg-gold/10 text-gold-dark",
    },
    {
      label: "Libros en catálogo",
      value: libros.length,
      sub: `${disponibles.length} disponibles`,
      icon: BookIcon,
      href: "/admin/libreria",
      color: "bg-forest/10 text-forest-light",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Panel de administración del Campo Escuela Flandes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
          >
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${s.color}`}
            >
              <s.icon width={26} height={26} />
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                {s.label}
              </p>
              <p className="mt-0.5 font-display text-3xl font-bold text-white">
                {s.value}
              </p>
              <p className="text-xs text-white/40">{s.sub}</p>
            </div>
            <ArrowRightIcon
              width={16}
              height={16}
              className="text-white/20 transition group-hover:text-white/50"
            />
          </Link>
        ))}
      </div>

      {/* Próximos eventos */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold uppercase tracking-wide text-white/60">
            Próximos eventos
          </h2>
          <Link
            href="/admin/agenda"
            className="text-xs text-gold/70 transition hover:text-gold"
          >
            Ver todos →
          </Link>
        </div>

        {proximos.length === 0 ? (
          <p className="text-sm text-white/30">No hay eventos próximos.</p>
        ) : (
          <ul className="space-y-2">
            {proximos.slice(0, 5).map((ev) => {
              const [, mes, dia] = ev.fecha.split("-");
              return (
                <li
                  key={ev.id}
                  className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-white/10 font-display text-xs font-bold leading-none text-white">
                    <span className="text-lg">{dia}</span>
                    <span className="text-[0.6rem] text-white/50">{mes}</span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {ev.titulo}
                    </p>
                    <p className="text-xs text-white/40">{ev.tipo}</p>
                  </div>
                  <Link
                    href={`/admin/agenda?edit=${ev.id}`}
                    className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/40 transition hover:border-white/20 hover:text-white/70"
                  >
                    Editar
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Acciones rápidas */}
      <div>
        <h2 className="mb-4 font-display text-base font-bold uppercase tracking-wide text-white/60">
          Acciones rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/agenda?new=1"
            className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark"
          >
            <CalendarIcon width={16} height={16} />
            Nuevo evento
          </Link>
          <Link
            href="/admin/libreria?new=1"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
          >
            <BookIcon width={16} height={16} />
            Nuevo libro
          </Link>
        </div>
      </div>
    </div>
  );
}
