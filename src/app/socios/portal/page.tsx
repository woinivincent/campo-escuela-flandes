import Link from "next/link";
import { requireSocioAuth } from "@/lib/socio-auth";
import { getRecursosSocios, type RecursoSocio } from "@/lib/db";
import { logoutSocioAction } from "@/app/socios/login/actions";
import {
  BookIcon, ShieldIcon, UsersIcon, CalendarIcon, StarIcon,
  MapIcon, LeafIcon, LockIcon, ExternalLinkIcon, ArrowRightIcon,
} from "@/components/ui/icons";

export const metadata = { title: "Portal de socios — Campo Escuela Flandes" };

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  book: BookIcon,
  shield: ShieldIcon,
  users: UsersIcon,
  calendar: CalendarIcon,
  star: StarIcon,
  map: MapIcon,
  leaf: LeafIcon,
  lock: LockIcon,
};

function RecursoCard({ r }: { r: RecursoSocio }) {
  const Icon = iconMap[r.icono] ?? BookIcon;
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold-dark">
          <Icon width={24} height={24} />
        </span>
        <div className="flex-1">
          <p className="font-display text-sm font-bold uppercase tracking-tight text-forest-dark">{r.titulo}</p>
          <p className="mt-1 text-xs leading-relaxed text-forest/65">{r.descripcion}</p>
          <span className="mt-2 inline-flex rounded-full bg-forest-pale px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-forest/60">
            {r.categoria}
          </span>
        </div>
      </div>
      {r.url ? (
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-forest/15 bg-forest-pale px-4 py-2.5 text-sm font-semibold text-forest-dark transition hover:bg-forest/10"
        >
          <ExternalLinkIcon width={15} height={15} />
          {r.tipo === "archivo" ? "Descargar" : "Abrir recurso"}
        </a>
      ) : (
        <p className="text-center text-xs text-forest/35">Enlace próximamente disponible</p>
      )}
    </div>
  );
}

export default async function SociosPortalPage() {
  const socio = await requireSocioAuth();
  const recursos = await getRecursosSocios(true);

  const categorias = Array.from(new Set(recursos.map((r) => r.categoria)));

  return (
    <div className="min-h-screen bg-sand">
      {/* Header del portal */}
      <header className="sticky top-0 z-50 border-b border-forest/10 bg-white/90 backdrop-blur">
        <div className="container-flandes flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-dark text-gold text-xs font-bold font-display">
              F
            </span>
            <div>
              <p className="text-xs font-semibold text-forest-dark">Portal de socios</p>
              <p className="text-[0.65rem] text-forest/50">Campo Escuela Flandes</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden text-sm text-forest/70 sm:block">
              Hola, <strong className="text-forest-dark">{socio.nombre}</strong>
            </p>
            <Link href="/socios" className="text-xs text-forest/50 transition hover:text-forest-dark">
              Ir al sitio
            </Link>
            <form action={logoutSocioAction}>
              <button type="submit" className="rounded-xl border border-forest/20 px-4 py-2 text-xs font-semibold text-forest/70 transition hover:border-forest/40 hover:text-forest-dark">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container-flandes py-12">
        {/* Bienvenida */}
        <div className="mb-12">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-gold-dark">Portal exclusivo</p>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-forest-dark sm:text-4xl">
            Bienvenido/a, {socio.nombre.split(" ")[0]}
          </h1>
          <p className="mt-2 text-forest/65">
            Accedé a todos los recursos digitales del Campo Escuela Flandes.
          </p>
        </div>

        {recursos.length === 0 ? (
          <div className="card text-center py-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-pale text-forest/40">
              <BookIcon width={28} height={28} />
            </span>
            <p className="mt-4 text-forest/50">Los recursos se publicarán próximamente.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {categorias.map((cat) => {
              const items = recursos.filter((r) => r.categoria === cat);
              return (
                <section key={cat}>
                  <h2 className="mb-4 font-display text-base font-bold uppercase tracking-wide text-forest-dark">
                    {cat}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((r) => (
                      <RecursoCard key={r.id} r={r} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-forest/10 bg-forest-pale/60 px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-forest-dark">¿Necesitás ayuda?</p>
            <p className="mt-0.5 text-xs text-forest/65">Contactá al campo por WhatsApp o correo electrónico.</p>
          </div>
          <Link href="/contacto" className="btn-forest shrink-0">
            Contacto
            <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
