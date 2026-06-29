import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import ReservaForm from "@/components/reservas/ReservaForm";
import { siteConfig } from "@/config/site";
import { getDynamicContactConfig } from "@/lib/siteConfigService";
import {
  ShieldIcon,
  UsersIcon,
  CalendarIcon,
  AlertIcon,
  InfoIcon,
  FlameIcon,
  MapIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Reservas",
  description:
    "Preinscribí a tu grupo en el Campo Escuela Flandes. Seleccioná subcampo, fechas y enviá tu solicitud por WhatsApp.",
};

export default async function ReservasPage() {
  const contact = getDynamicContactConfig();
  return (
    <>
      <PageHero
        eyebrow="Reservas"
        title="Lorem ipsum dolor sit amet"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        src="/images/reservas-portada.jpg"
      />

      {/* ---- NORMAS DEL ACAMPE ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          eyebrow="Lorem ipsum"
          title="Lorem ipsum dolor sit amet"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
          className="mb-10"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {normas.map((n, i) => (
            <li key={i} className="card flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flandes-red/10 text-flandes-red">
                <n.icon width={20} height={20} />
              </span>
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-forest-dark">
                  {n.titulo}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-forest/70">
                  {n.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4">
          <InfoIcon
            width={18}
            height={18}
            className="mt-0.5 shrink-0 text-gold-dark"
          />
          <p className="text-sm leading-relaxed text-forest-dark">
            <strong>Costos y aranceles:</strong>{" "}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </section>

      {/* ---- SUBCAMPOS ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
          <SectionHeading
            align="center"
            eyebrow="Lorem ipsum"
            title="Lorem ipsum dolor sit amet"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
            className="mb-12"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subcamposDetalle.map((s, i) => (
              <div
                key={s.id}
                className="card card-hover flex flex-col overflow-hidden !p-0"
              >
                <ImageFrame
                  src={`/images/subcampo-${s.id}.jpg`}
                  label={`Foto ${s.nombre}`}
                  rounded="rounded-none"
                  className="aspect-[4/3] w-full"
                />
                <div className="flex flex-1 flex-col p-5">
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-gold-dark">
                    0{i + 1}
                  </span>
                  <h3 className="mt-1 font-display text-base font-bold uppercase tracking-tight text-forest-dark">
                    {s.nombre}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-forest/70">
                    {s.descripcion}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {s.servicios.map((srv) => (
                      <li
                        key={srv}
                        className="flex items-center gap-1.5 text-xs text-forest/70"
                      >
                        <span className="h-1 w-1 rounded-full bg-gold-dark" />
                        {srv}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-3 text-[0.7rem] font-semibold uppercase tracking-wide text-forest/50">
                    {s.capacidad}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FORMULARIO ---- */}
      <section className="container-flandes py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          {/* Lado izquierdo: info */}
          <div>
            <SectionHeading
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
            />

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-pale text-forest">
                  <CalendarIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-dark">
                    Lorem ipsum dolor sit amet
                  </p>
                  <p className="text-xs text-forest/65">
                    Lorem ipsum dolor sit amet, consectetur adipiscing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-pale text-forest">
                  <UsersIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-dark">
                    Lorem ipsum dolor sit amet
                  </p>
                  <p className="text-xs text-forest/65">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-pale text-forest">
                  <ShieldIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-dark">
                    Lorem ipsum dolor sit amet
                  </p>
                  <p className="text-xs text-forest/65">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-forest/10 bg-forest-pale/60 px-5 py-4">
              <p className="text-xs text-forest/70">
                <strong className="text-forest-dark">¿Preferís llamar?</strong>{" "}
                También podés contactarnos directamente al{" "}
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-forest underline underline-offset-2"
                >
                  {contact.whatsappDisplay}
                </a>
                .
              </p>
            </div>
          </div>

          {/* Lado derecho: formulario */}
          <ReservaForm waNumber={contact.whatsapp} />
        </div>
      </section>

      {/* ---- CTA FINAL ---- */}
      <section className="bg-forest-pale/50 py-16">
        <div className="container-flandes flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase text-forest-dark">
              Lorem ipsum dolor sit amet?
            </h2>
            <p className="mt-1 text-sm text-forest/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <Link href="/acampes" className="btn-forest shrink-0">
            Ver el predio completo
            <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

const normas = [
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    icon: UsersIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    icon: FlameIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    icon: ShieldIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    icon: AlertIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    icon: CalendarIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    icon: MapIcon,
  },
];

const subcamposDetalle = [
  {
    id: "1",
    nombre: siteConfig.subcampos[0].nombre,
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    servicios: ["Agua corriente", "Baños cercanos", "Fogón habilitado"],
    capacidad: "Hasta 80 personas",
  },
  {
    id: "2",
    nombre: siteConfig.subcampos[1].nombre,
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    servicios: ["Agua corriente", "Baños a 100 m", "Fogón habilitado"],
    capacidad: "Hasta 50 personas",
  },
  {
    id: "3",
    nombre: siteConfig.subcampos[2].nombre,
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    servicios: ["Agua corriente", "Baños propios", "Techado disponible"],
    capacidad: "Hasta 60 personas",
  },
  {
    id: "4",
    nombre: siteConfig.subcampos[3].nombre,
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    servicios: ["Agua corriente", "Baños cercanos", "Fogón habilitado"],
    capacidad: "Hasta 40 personas",
  },
];
