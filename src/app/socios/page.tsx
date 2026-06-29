import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { whatsappLink } from "@/lib/siteConfigService";
import {
  ShieldIcon,
  BookIcon,
  UsersIcon,
  CalendarIcon,
  LockIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  StarIcon,
  InfoIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Acceso socios",
  description:
    "Área exclusiva para socios del Campo Escuela Flandes. Acceso a recursos digitales, beneficios y más.",
};

export default function SociosPage() {
  return (
    <>
      <PageHero
        eyebrow="Socios"
        title="Lorem ipsum dolor sit amet"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        src="/images/socios-portada.jpg"
      />

      {/* ---- QUÉ ES SER SOCIO ---- */}
      <section className="container-flandes py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
            />
            <ul className="mt-7 space-y-3">
              {beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                    <b.icon width={16} height={16} />
                  </span>
                  <p className="text-sm text-forest/85">{b.texto}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuota info */}
          <div className="card border-2 border-forest/10 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-dark text-gold">
              <StarIcon width={30} height={30} />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold uppercase text-forest-dark">
              Socio del campo
            </h3>
            <div className="my-5 border-y border-forest/10 py-5">
              <p className="font-display text-4xl font-bold text-flandes-red">
                $XXXX
              </p>
              <p className="mt-1 text-xs text-forest/55">
                cuota mensual
              </p>
            </div>
            <ul className="space-y-2 text-left">
              {categorias.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-forest/75"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-flandes-red" />
                  {c}
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink(
                "Hola! Quiero información para hacerme socio del Campo Escuela Flandes."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 w-full"
            >
              <WhatsAppIcon width={18} height={18} />
              Consultar por WhatsApp
            </a>
            <p className="mt-3 text-xs text-forest/45">
              Lorem ipsum dolor sit amet, consectetur adipiscing.
            </p>
          </div>
        </div>
      </section>

      {/* ---- RECURSOS DIGITALES (preview bloqueado) ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
          <SectionHeading
            align="center"
            eyebrow="Lorem ipsum"
            title="Lorem ipsum dolor sit amet"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
            className="mb-10"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recursos.map((r, i) => (
              <div
                key={i}
                className="card relative overflow-hidden opacity-80"
              >
                {/* Overlay de bloqueo */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-sm">
                  <LockIcon width={24} height={24} className="text-forest/40" />
                  <p className="text-xs font-semibold text-forest/50">
                    Solo socios
                  </p>
                </div>
                {/* Contenido (difuminado debajo) */}
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-pale text-forest">
                  <r.icon width={22} height={22} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold uppercase text-forest-dark">
                  {r.titulo}
                </h3>
                <p className="mt-1 text-sm text-forest/60">{r.desc}</p>
                <span className="mt-3 text-xs text-forest/40">{r.cantidad}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-forest/10 bg-white px-5 py-4">
            <InfoIcon
              width={18}
              height={18}
              className="mt-0.5 shrink-0 text-forest/40"
            />
            <p className="text-sm text-forest/65">
              <strong className="text-forest-dark">Lorem ipsum dolor sit amet.</strong>{" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          </div>
        </div>
      </section>

      {/* ---- CÓMO ASOCIARSE ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Lorem ipsum"
          title="Lorem ipsum dolor sit amet"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          className="mb-12"
        />

        <ol className="mx-auto grid max-w-3xl gap-5 md:grid-cols-3">
          {pasos.map((p, i) => (
            <li key={i} className="card relative text-center">
              <span className="absolute right-5 top-5 font-display text-4xl font-bold text-sand-dark">
                0{i + 1}
              </span>
              <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-flandes-red/10 text-flandes-red">
                <p.icon width={24} height={24} />
              </span>
              <h3 className="mt-5 font-display text-base font-bold uppercase tracking-tight text-forest-dark">
                {p.titulo}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest/70">
                {p.desc}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappLink(
              "Hola! Quiero información para asociarme al Campo Escuela Flandes."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon width={18} height={18} />
            Asociarme por WhatsApp
          </a>
          <Link href="/contacto" className="btn-outline">
            Formulario de contacto
            <ArrowRightIcon width={18} height={18} />
          </Link>
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
          <div className="flex flex-wrap gap-3">
            <Link href="/acampes" className="btn-forest shrink-0">
              Ver el predio
              <ArrowRightIcon width={18} height={18} />
            </Link>
            <Link href="/reservas" className="btn-outline shrink-0">
              Reservar un lugar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const beneficios = [
  {
    texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: BookIcon,
  },
  {
    texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: CalendarIcon,
  },
  {
    texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: ShieldIcon,
  },
  {
    texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: UsersIcon,
  },
  {
    texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: StarIcon,
  },
];

const categorias = [
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
];

const recursos = [
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cantidad: "12 documentos",
    icon: BookIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cantidad: "8 archivos",
    icon: ShieldIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cantidad: "20+ fichas",
    icon: UsersIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cantidad: "15 recursos",
    icon: CalendarIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cantidad: "Actualizado mensual",
    icon: StarIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cantidad: "Actualizado",
    icon: UsersIcon,
  },
];

const pasos = [
  {
    titulo: "Lorem ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: WhatsAppIcon,
  },
  {
    titulo: "Lorem ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: UsersIcon,
  },
  {
    titulo: "Lorem ipsum",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: StarIcon,
  },
];
