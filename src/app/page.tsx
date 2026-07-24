import Link from "next/link";
import TopoPattern from "@/components/ui/TopoPattern";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { getSiteSettings } from "@/lib/siteConfigService";
import { getEventosPublicos } from "@/lib/db";
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

export default async function HomePage() {
  const { subcampos } = await getSiteSettings();
  const eventosDB = (await getEventosPublicos()).slice(0, 3);
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
            Un campo de ejercicios scout para acampes, formación y actividades
            al aire libre.
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
              eyebrow="El campo"
              title="Un espacio pensado para el escultismo"
              subtitle="Acá va la presentación del campo: qué es, desde cuándo funciona y para quién está pensado. Con uno o dos párrafos alcanza."
            />
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {bienvenidaPuntos.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-forest/85">
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
          <p className="section-eyebrow">Explorá</p>
          <h2 className="section-title">¿Qué querés hacer?</h2>
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
          title="Cuatro subcampos"
          subtitle="Acá va una descripción general del predio y de cómo se reparten los subcampos."
          className="mb-12"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subcampos.map((s, i) => (
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
                  Breve descripción del subcampo.
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
            <p className="section-eyebrow">Por qué Flandes</p>
            <h2 className="section-title">
              Todo lo que tu grupo necesita
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-forest/80">
              Acá va el texto que cuenta qué ofrece el campo y por qué elegirlo:
              la infraestructura, el entorno y el acompañamiento a los grupos.
            </p>
            <Link href="/institucional" className="btn-outline mt-8">
              Conocer nuestra historia
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <li key={i} className="card flex gap-4">
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
          eyebrow="Reservas"
          title="Cómo reservar, paso a paso"
          className="mb-12"
        />
        <ol className="grid gap-6 md:grid-cols-3">
          {pasos.map((p, i) => (
            <li key={i} className="relative card">
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
              title="Próximas actividades"
              subtitle="Los eventos se cargan desde el panel y aparecen acá automáticamente."
            />
            <Link
              href="/agenda"
              className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-flandes-red"
            >
              Ver agenda completa
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          {eventosDB.length === 0 ? (
            <p className="rounded-2xl border border-forest/10 bg-white py-10 text-center text-sm text-forest/50">
              No hay eventos próximos. Consultanos por WhatsApp.
            </p>
          ) : (
          <ul className="divide-y divide-forest/10 overflow-hidden rounded-2xl border border-forest/10 bg-white">
            {eventosDB.map((e) => {
              const [, evMes, evDia] = e.fecha.split("-");
              const MESES_SHORT: Record<string,string> = { "01":"Ene","02":"Feb","03":"Mar","04":"Abr","05":"May","06":"Jun","07":"Jul","08":"Ago","09":"Sep","10":"Oct","11":"Nov","12":"Dic" };
              return (
              <li
                key={e.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-forest-dark text-sand">
                  <span className="font-display text-2xl font-bold leading-none text-gold">
                    {evDia}
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-wide text-sand/80">
                    {MESES_SHORT[evMes] ?? evMes}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-forest-dark">
                    {e.titulo}
                  </h3>
                  <p className="text-sm text-forest/70">{e.descripcion}</p>
                </div>
                <span className="self-start rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dark sm:self-center">
                  {e.tipo}
                </span>
              </li>
              );
            })}
          </ul>
          )}
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="container-flandes py-20">
        <div className="relative overflow-hidden rounded-3xl bg-flandes-red px-8 py-14 text-center text-white sm:px-16">
          <TopoPattern className="absolute inset-0 h-full w-full text-white/10" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              ¿Listos para acampar?
            </h2>
            <p className="mt-4 text-lg text-white/85">
              Escribinos y coordinamos la fecha, el subcampo y todo lo que
              necesite tu grupo.
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

// El valor de "Años de trayectoria" y "Hectáreas" lo tiene que confirmar el campo.
const stats = [
  { value: "4", label: "Subcampos disponibles" },
  { value: "—", label: "Años de trayectoria" },
  { value: "—", label: "Hectáreas de predio" },
];

const quickLinks = [
  { title: "Acampes", desc: "Conocé el predio y los subcampos.", href: "/acampes", icon: TentIcon },
  { title: "Reservas", desc: "Pedí fecha para tu grupo.", href: "/reservas", icon: CalendarIcon },
  { title: "Naturaleza", desc: "La flora y fauna del campo.", href: "/naturaleza", icon: LeafIcon },
  { title: "Adiestramiento", desc: "Cursos, charlas y videos.", href: "/adiestramiento", icon: GraduationIcon },
];

const features = [
  { title: "El predio", desc: "Describir acá la extensión y los espacios disponibles.", icon: MapIcon },
  { title: "Disponibilidad", desc: "Describir acá cómo es la disponibilidad durante el año.", icon: CalendarIcon },
  { title: "Entorno natural", desc: "Describir acá el entorno y la vegetación del campo.", icon: LeafIcon },
  { title: "Acompañamiento", desc: "Describir acá el apoyo que se le da a cada grupo.", icon: UsersIcon },
];

const bienvenidaPuntos = [
  "Cuatro subcampos independientes",
  "Agua, sanitarios y fogones",
  "Entorno natural para actividades",
  "Reserva coordinada por WhatsApp",
];

const pasos = [
  { title: "Elegí el subcampo", desc: "Mirá el predio y decidí cuál se ajusta mejor al tamaño de tu grupo.", icon: MapIcon },
  { title: "Completá el formulario", desc: "Cargá las fechas, la cantidad de personas y los datos de contacto.", icon: CalendarIcon },
  { title: "Confirmamos por WhatsApp", desc: "Recibís la respuesta del campo con la confirmación y las indicaciones.", icon: ShieldIcon },
];

