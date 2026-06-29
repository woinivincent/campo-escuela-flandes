import Link from "next/link";
import { siteConfig } from "@/config/site";
import TopoPattern from "@/components/ui/TopoPattern";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import {
  TentIcon,
  CalendarIcon,
  LeafIcon,
  GraduationIcon,
  MapIcon,
  UsersIcon,
  ShieldIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export default function HomePage() {
  return (
    <>
      {/* ---------- HERO (foto aérea a sangre completa) ---------- */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden">
        {/* Respaldo otoñal (se ve hasta que exista la foto real) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a2e1c] via-[#5a4a2a] to-[#26341f]" />
        <TopoPattern className="absolute inset-0 h-full w-full text-[#caa24a]/25" />
        {/* Foto del predio (queda por encima del respaldo cuando exista) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-campo.jpg')" }}
        />
        {/* Overlays para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
        <div className="absolute inset-0 bg-forest-dark/20 mix-blend-multiply" />

        {/* Contenido centrado */}
        <div className="container-flandes relative pt-20 text-center">
          <h1 className="font-display text-[2.6rem] font-bold uppercase leading-[0.95] tracking-[0.02em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
            Campo Escuela Flandes
          </h1>
          <div className="mt-6 flex justify-center">
            <span className="bg-white px-3 py-2 font-display text-sm font-semibold uppercase tracking-[0.28em] text-forest-dark sm:text-base">
              Campo de Ejercicios Scout
            </span>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Un predio natural para acampar, formarse y crecer en comunidad.
            Conocé los subcampos y reservá el lugar para tu grupo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/reservas" className="btn-primary">
              Reservar lugar
              <ArrowRightIcon width={18} height={18} />
            </Link>
            <Link href="/acampes" className="btn-ghost">
              Conocer el predio
            </Link>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/70">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
            <path d="M12 5v14m-6-6 6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* Franja de datos institucional */}
      <section className="border-b border-sand-dark bg-forest-dark text-sand">
        <dl className="container-flandes grid grid-cols-3 divide-x divide-white/10 py-7 text-center">
          {stats.map((s) => (
            <div key={s.label} className="px-2">
              <dt className="font-display text-3xl font-bold text-gold sm:text-4xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-[0.7rem] uppercase tracking-wide text-sand/70 sm:text-xs">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- BIENVENIDA ---------- */}
      <section className="container-flandes py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ImageFrame
            src="/images/predio-bienvenida.jpg"
            label="Foto del predio / actividad"
            className="aspect-[4/3] w-full"
          />
          <div>
            <SectionHeading
              eyebrow="Bienvenidos"
              title="Un lugar con historia para la vida scout"
              subtitle="El Campo Escuela “Flandes” es un predio natural destinado a campamentos, ejercicios y formación scout. Un espacio pensado para que cada grupo viva la experiencia del campo con seguridad, naturaleza e instalaciones adecuadas."
            />
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {bienvenidaPuntos.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-forest/85">
                  <span className="mt-0.5 text-flandes-red">
                    <ShieldIcon width={18} height={18} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/institucional" className="btn-outline mt-8">
              Conocer la institución
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- ACCESOS RÁPIDOS ---------- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
        <div className="mb-10 max-w-2xl">
          <p className="section-eyebrow">Explorá el campo</p>
          <h2 className="section-title">Todo lo que necesitás, a un clic</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q) => (
            <Link key={q.href} href={q.href} className="card card-hover group">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-pale text-forest transition-colors group-hover:bg-flandes-red group-hover:text-white">
                <q.icon width={24} height={24} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-forest-dark">
                {q.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest/80">
                {q.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-flandes-red">
                Ver más
                <ArrowRightIcon
                  width={15}
                  height={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* ---------- SUBCAMPOS ---------- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="El predio"
          title="Cuatro subcampos para elegir"
          subtitle="Cada grupo puede acampar en el subcampo que mejor se adapte a su actividad. Conocelos y elegí el tuyo al momento de reservar."
          className="mb-12"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.subcampos.map((s, i) => (
            <div key={s.id} className="card card-hover group overflow-hidden !p-0">
              <ImageFrame
                src={`/images/subcampo-${s.id}.jpg`}
                label={`Foto ${s.nombre}`}
                rounded="rounded-none"
                className="aspect-[4/3] w-full"
              />
              <div className="p-5">
                <span className="font-display text-sm font-bold uppercase tracking-wide text-gold-dark">
                  0{i + 1}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-forest-dark">
                  {s.nombre}
                </h3>
                <p className="mt-1 text-sm text-forest/75">
                  Espacio para acampar con servicios cercanos.
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/acampes" className="btn-forest">
            Ver el predio completo
            <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </section>

      {/* ---------- POR QUÉ FLANDES ---------- */}
      <section className="bg-forest-pale/50 py-20">
        <div className="container-flandes grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="section-eyebrow">Por qué elegirnos</p>
            <h2 className="section-title">
              Un campo pensado para la experiencia scout
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-forest/80">
              Más de cuatro décadas recibiendo grupos, familias y cursos de
              formación. Naturaleza, instalaciones y un equipo que acompaña cada
              actividad.
            </p>
            <Link href="/institucional" className="btn-outline mt-8">
              Conocer nuestra historia
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f.title} className="card flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                  <f.icon width={22} height={22} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-forest-dark">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-forest/75">
                    {f.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- CÓMO RESERVAR ---------- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Reservar es fácil"
          title="Tu lugar en tres pasos"
          className="mb-12"
        />
        <ol className="grid gap-6 md:grid-cols-3">
          {pasos.map((p, i) => (
            <li key={p.title} className="relative card">
              <span className="absolute right-5 top-5 font-display text-4xl font-bold text-sand-dark">
                0{i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-flandes-red/10 text-flandes-red">
                <p.icon width={24} height={24} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-tight text-forest-dark">
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest/80">
                {p.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- AGENDA (preview) ---------- */}
      <section className="bg-forest-pale/50 py-20">
        <div className="container-flandes">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Agenda"
              title="Próximos eventos"
              subtitle="Charlas, cursos y actividades abiertas del campo."
            />
            <Link
              href="/agenda"
              className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-flandes-red"
            >
              Ver agenda completa
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          <ul className="mt-10 divide-y divide-forest/10 overflow-hidden rounded-2xl border border-forest/10 bg-white">
            {eventos.map((e) => (
              <li
                key={e.titulo}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-forest-dark text-sand">
                  <span className="font-display text-2xl font-bold leading-none text-gold">
                    {e.dia}
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-wide text-sand/80">
                    {e.mes}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-forest-dark">
                    {e.titulo}
                  </h3>
                  <p className="text-sm text-forest/70">{e.detalle}</p>
                </div>
                <span className="self-start rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dark sm:self-center">
                  {e.tipo}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-xs text-forest/50">
            Eventos de ejemplo — se cargan desde el panel de administración.
          </p>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="container-flandes py-20">
        <div className="relative overflow-hidden rounded-3xl bg-flandes-red px-8 py-14 text-center text-white sm:px-16">
          <TopoPattern className="absolute inset-0 h-full w-full text-white/10" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              ¿Listos para vivir el campo?
            </h2>
            <p className="mt-4 text-lg text-white/85">
              Preinscribí a tu grupo en minutos. Te respondemos directamente por
              WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/reservas"
                className="btn-primary bg-white text-flandes-red hover:bg-sand"
              >
                Hacer una reserva
                <ArrowRightIcon width={18} height={18} />
              </Link>
              <Link href="/contacto" className="btn-ghost">
                Contactar al campo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const stats = [
  { value: "4", label: "Subcampos disponibles" },
  { value: "40+", label: "Años de trayectoria" },
  { value: "100%", label: "Naturaleza scout" },
];

const quickLinks = [
  { title: "Acampes", desc: "Predio, servicios e instalaciones.", href: "/acampes", icon: TentIcon },
  { title: "Reservas", desc: "Preinscribí a tu grupo online.", href: "/reservas", icon: CalendarIcon },
  { title: "Naturaleza", desc: "Flora y fauna del campo.", href: "/naturaleza", icon: LeafIcon },
  { title: "Adiestramiento", desc: "Charlas, cursos y videos.", href: "/adiestramiento", icon: GraduationIcon },
];

const features = [
  { title: "4 subcampos", desc: "Espacios diferenciados para que cada grupo elija su lugar.", icon: MapIcon },
  { title: "Reserva simple", desc: "Formulario que llega directo al WhatsApp del campo.", icon: CalendarIcon },
  { title: "Entorno natural", desc: "Flora y fauna autóctona con fichas y señalética.", icon: LeafIcon },
  { title: "Comunidad scout", desc: "Un espacio de formación y encuentro para grupos.", icon: UsersIcon },
];

const bienvenidaPuntos = [
  "Predio amplio en entorno natural",
  "Instalaciones y servicios para grupos",
  "Actividades de formación y adiestramiento",
  "Acompañamiento del equipo del campo",
];

const pasos = [
  { title: "Elegí tu subcampo", desc: "Revisá el predio y seleccioná el espacio que mejor se adapte a tu grupo.", icon: MapIcon },
  { title: "Completá la reserva", desc: "Cargá los datos de tu grupo y la fecha en el formulario de preinscripción.", icon: CalendarIcon },
  { title: "Confirmamos por WhatsApp", desc: "Te contactamos para coordinar los detalles y confirmar tu acampe.", icon: ShieldIcon },
];

const eventos = [
  { dia: "12", mes: "Jul", titulo: "Curso de adiestramiento scout", detalle: "Jornada de formación para dirigentes.", tipo: "Curso" },
  { dia: "26", mes: "Jul", titulo: "Acampe de invierno", detalle: "Encuentro abierto de grupos.", tipo: "Acampe" },
  { dia: "09", mes: "Ago", titulo: "Charla de naturaleza", detalle: "Flora y fauna del predio.", tipo: "Charla" },
];
