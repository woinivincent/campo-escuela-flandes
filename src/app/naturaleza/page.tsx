import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { whatsappLink } from "@/lib/siteConfigService";
import {
  LeafIcon,
  QrIcon,
  ShieldIcon,
  UsersIcon,
  ArrowRightIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Naturaleza",
  description:
    "Flora y fauna del Campo Escuela Flandes. Fichas de especies con códigos QR y proyectos del área de naturaleza.",
};

type Categoria = "Flora" | "Fauna";

interface Especie {
  id: string;
  nombreComun: string;
  nombreCientifico: string;
  descripcion: string;
  curiosidad: string;
  categoria: Categoria;
  qrDisponible: boolean;
}

export default function NaturalezaPage() {
  const flora = especies.filter((e) => e.categoria === "Flora");
  const fauna = especies.filter((e) => e.categoria === "Fauna");

  return (
    <>
      <PageHero
        eyebrow="Naturaleza"
        title="Lorem ipsum dolor sit amet"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        src="/images/naturaleza-portada.jpg"
      />

      {/* ---- INTRO ---- */}
      <section className="container-flandes py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
            />
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {destacados.map((d, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-forest/85"
                >
                  <span className="mt-0.5 text-flandes-red">
                    <d.icon width={17} height={17} />
                  </span>
                  {d.texto}
                </li>
              ))}
            </ul>
          </div>
          <ImageFrame
            src="/images/naturaleza-intro.jpg"
            label="Foto del entorno natural del campo"
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* ---- FLORA ---- */}
      <section className="bg-forest-pale/50 py-20">
        <div className="container-flandes">
          <SectionHeading
            eyebrow="Flora"
            title="Lorem ipsum dolor sit amet"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            className="mb-10"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {flora.map((esp) => (
              <EspecieCard key={esp.id} especie={esp} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- FAUNA ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          eyebrow="Fauna"
          title="Lorem ipsum dolor sit amet"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          className="mb-10"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fauna.map((esp) => (
            <EspecieCard key={esp.id} especie={esp} />
          ))}
        </div>
      </section>

      {/* ---- QR SYSTEM ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
            />
            <ul className="mt-6 space-y-3">
              {qrPasos.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-flandes-red/10 font-display text-sm font-bold text-flandes-red">
                    {p.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-forest-dark">
                      {p.titulo}
                    </p>
                    <p className="text-xs text-forest/65">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="card flex flex-col items-center gap-4 py-10 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-forest-dark text-gold">
                <QrIcon width={40} height={40} />
              </span>
              <p className="font-display text-lg font-bold uppercase text-forest-dark">
                Código QR
              </p>
              <p className="max-w-xs text-sm text-forest/65">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- PROYECTOS ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Lorem ipsum"
          title="Lorem ipsum dolor sit amet"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          className="mb-10"
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {proyectos.map((p, i) => (
            <div key={i} className="card text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-pale text-forest">
                <p.icon width={24} height={24} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-forest-dark">
                {p.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-forest/70">
                {p.desc}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark">
                {p.estado}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
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
            <Link href="/reservas" className="btn-primary shrink-0">
              Hacer una reserva
              <ArrowRightIcon width={18} height={18} />
            </Link>
            <a
              href={whatsappLink(
                "Hola! Quiero consultar sobre las actividades de naturaleza del Campo Escuela Flandes."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp shrink-0"
            >
              <WhatsAppIcon width={18} height={18} />
              Consultar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function EspecieCard({ especie }: { especie: Especie }) {
  return (
    <article className="card card-hover flex flex-col overflow-hidden !p-0">
      <ImageFrame
        src={`/images/especie-${especie.id}.jpg`}
        label={`Foto de ${especie.nombreComun}`}
        rounded="rounded-none"
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col p-5">
        <span
          className={`self-start rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide ${
            especie.categoria === "Flora"
              ? "bg-forest-pale text-forest"
              : "bg-gold/15 text-gold-dark"
          }`}
        >
          {especie.categoria}
        </span>
        <h3 className="mt-2 font-display text-base font-bold text-forest-dark">
          {especie.nombreComun}
        </h3>
        <p className="text-xs italic text-forest/50">{especie.nombreCientifico}</p>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-forest/70">
          {especie.descripcion}
        </p>
        <p className="mt-2 border-t border-forest/10 pt-2 text-xs text-forest/55">
          <strong className="text-forest-dark">Dato:</strong> {especie.curiosidad}
        </p>
        {especie.qrDisponible && (
          <span className="mt-3 flex items-center gap-1.5 text-xs font-medium text-flandes-red">
            <QrIcon width={14} height={14} />
            QR disponible en el predio
          </span>
        )}
      </div>
    </article>
  );
}

const destacados = [
  { texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: LeafIcon },
  { texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: ShieldIcon },
  { texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: QrIcon },
  { texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", icon: UsersIcon },
];

const especies: Especie[] = [
  {
    id: "espinillo",
    nombreComun: "Espinillo",
    nombreCientifico: "Vachellia caven",
    categoria: "Flora",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    qrDisponible: false,
  },
  {
    id: "ceibo",
    nombreComun: "Ceibo",
    nombreCientifico: "Erythrina crista-galli",
    categoria: "Flora",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    qrDisponible: false,
  },
  {
    id: "sauce",
    nombreComun: "Sauce criollo",
    nombreCientifico: "Salix humboldtiana",
    categoria: "Flora",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    qrDisponible: false,
  },
  {
    id: "tala",
    nombreComun: "Tala",
    nombreCientifico: "Celtis ehrenbergiana",
    categoria: "Flora",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    qrDisponible: false,
  },
  {
    id: "carpincho",
    nombreComun: "Carpincho",
    nombreCientifico: "Hydrochoerus hydrochaeris",
    categoria: "Fauna",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    qrDisponible: false,
  },
  {
    id: "hornero",
    nombreComun: "Hornero",
    nombreCientifico: "Furnarius rufus",
    categoria: "Fauna",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    qrDisponible: false,
  },
  {
    id: "martin-pescador",
    nombreComun: "Martín pescador",
    nombreCientifico: "Megaceryle torquata",
    categoria: "Fauna",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    qrDisponible: false,
  },
  {
    id: "coipo",
    nombreComun: "Coipo / Nutria",
    nombreCientifico: "Myocastor coypus",
    categoria: "Fauna",
    descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    curiosidad: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    qrDisponible: false,
  },
];

const qrPasos = [
  {
    n: "1",
    titulo: "Lorem ipsum dolor sit amet",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  },
  {
    n: "2",
    titulo: "Lorem ipsum dolor sit amet",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  },
  {
    n: "3",
    titulo: "Lorem ipsum dolor sit amet",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  },
];

const proyectos = [
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    estado: "En desarrollo",
    icon: QrIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    estado: "En curso",
    icon: LeafIcon,
  },
  {
    titulo: "Lorem ipsum dolor",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    estado: "Planificado",
    icon: ShieldIcon,
  },
];
