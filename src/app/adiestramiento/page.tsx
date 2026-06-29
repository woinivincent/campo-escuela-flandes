import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { getCursosPublicos } from "@/lib/db";
import { whatsappLink } from "@/lib/siteConfigService";
import TopoPattern from "@/components/ui/TopoPattern";
import {
  GraduationIcon,
  CalendarIcon,
  UsersIcon,
  LeafIcon,
  PlayIcon,
  YoutubeIcon,
  WhatsAppIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Adiestramiento",
  description:
    "Charlas, cursos y videos del Canal de YouTube del Campo Escuela Flandes. Formación scout organizada por tema.",
};

const MESES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function toFechaDisplay(fecha: string): string {
  const [y, m, d] = fecha.split("-");
  return `${parseInt(d, 10)} de ${MESES_ES[parseInt(m, 10) - 1] ?? m} de ${y}`;
}

export default async function AdiestramientoPage() {
  const cursos = getCursosPublicos();
  return (
    <>
      <PageHero
        eyebrow="Adiestramiento"
        title="Lorem ipsum dolor sit amet"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        src="/images/adiestramiento-portada.jpg"
      />

      {/* ---- PRÓXIMOS CURSOS ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          eyebrow="Lorem ipsum"
          title="Lorem ipsum dolor sit amet"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
          className="mb-10"
        />

        {cursos.length === 0 && (
          <p className="py-8 text-center text-sm text-forest/50">
            No hay cursos programados próximamente. Consultanos por WhatsApp.
          </p>
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cursos.map((c) => {
            const fechaDisplay = toFechaDisplay(c.fecha);
            const waMsg = `Hola! Quiero inscribirme al curso "${c.titulo}" del ${fechaDisplay}.`;
            return (
              <article key={c.id} className="card card-hover flex flex-col gap-0">
                {/* Cabecera coloreada */}
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-pale text-forest">
                    <GraduationIcon width={22} height={22} />
                  </span>
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark">
                    {c.nivel}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-forest-dark">
                  {c.titulo}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-forest/70">
                  {c.descripcion}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-forest/10 pt-4">
                  <li className="flex items-center gap-2 text-xs text-forest/65">
                    <CalendarIcon width={14} height={14} className="text-flandes-red" />
                    {fechaDisplay}
                    {c.hora && <span>· {c.hora}</span>}
                  </li>
                  <li className="flex items-center gap-2 text-xs text-forest/65">
                    <UsersIcon width={14} height={14} className="text-flandes-red" />
                    {c.destinatarios}
                  </li>
                  {c.cupos && (
                    <li className="text-xs font-semibold text-flandes-red">
                      Cupos limitados: {c.cupos}
                    </li>
                  )}
                </ul>

                <a
                  href={whatsappLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp mt-5"
                >
                  <WhatsAppIcon width={16} height={16} />
                  Inscribirme
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/agenda" className="btn-outline">
            Ver agenda completa
            <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </section>

      {/* ---- VIDEOS POR TEMA ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            />
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 text-sm font-semibold text-flandes-red transition hover:text-flandes-red-dark"
            >
              <YoutubeIcon width={18} height={18} />
              Ver canal completo
              <ExternalLinkIcon width={14} height={14} />
            </a>
          </div>

          <div className="space-y-14">
            {categorias.map((cat, i) => (
              <div key={i}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-flandes-red/10 text-flandes-red">
                    <cat.icon width={18} height={18} />
                  </span>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-forest-dark">
                    {cat.titulo}
                  </h3>
                  <div className="h-px flex-1 bg-forest/10" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.videos.map((v) => (
                    <a
                      key={v.id}
                      href={v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        <ImageFrame
                          src={v.videoId ? `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg` : undefined}
                          label={`Video: ${v.titulo}`}
                          rounded="rounded-none"
                          className="h-full w-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-flandes-red text-white shadow-lg">
                            <PlayIcon width={22} height={22} />
                          </span>
                        </div>
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white">
                          {v.duracion}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="line-clamp-2 font-display text-sm font-bold uppercase leading-tight tracking-tight text-forest-dark group-hover:text-flandes-red">
                          {v.titulo}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-forest/60">
                          {v.descripcion}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="container-flandes py-20">
        <div className="relative overflow-hidden rounded-3xl bg-forest-dark px-8 py-14 text-center text-sand">
          <TopoPattern className="absolute inset-0 h-full w-full text-gold/10" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold uppercase text-white sm:text-4xl">
              Lorem ipsum dolor sit amet?
            </h2>
            <p className="mt-4 text-lg text-sand/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLink(
                  "Hola! Quiero proponer un curso o charla en el Campo Escuela Flandes."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon width={18} height={18} />
                Escribinos por WhatsApp
              </a>
              <Link href="/contacto" className="btn-ghost">
                Formulario de contacto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const categorias = [
  {
    titulo: "Lorem ipsum",
    icon: GraduationIcon,
    videos: [
      {
        id: "v1",
        videoId: "",
        titulo: "Lorem ipsum dolor sit amet consectetur",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        duracion: "8:24",
      },
      {
        id: "v2",
        videoId: "",
        titulo: "Lorem ipsum dolor sit amet consectetur",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        duracion: "12:10",
      },
      {
        id: "v3",
        videoId: "",
        titulo: "Lorem ipsum dolor sit amet consectetur",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        duracion: "15:45",
      },
    ],
  },
  {
    titulo: "Lorem ipsum",
    icon: LeafIcon,
    videos: [
      {
        id: "v4",
        videoId: "",
        titulo: "Lorem ipsum dolor sit amet consectetur",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        duracion: "18:32",
      },
      {
        id: "v5",
        videoId: "",
        titulo: "Lorem ipsum dolor sit amet consectetur",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        duracion: "11:07",
      },
    ],
  },
  {
    titulo: "Lorem ipsum",
    icon: UsersIcon,
    videos: [
      {
        id: "v6",
        videoId: "",
        titulo: "Lorem ipsum dolor sit amet consectetur",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        duracion: "22:15",
      },
      {
        id: "v7",
        videoId: "",
        titulo: "Lorem ipsum dolor sit amet consectetur",
        descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        duracion: "9:50",
      },
    ],
  },
];
