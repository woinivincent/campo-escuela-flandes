import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { getCursosPublicos } from "@/lib/db";
import { getSiteSettings } from "@/lib/siteConfigService";
import TopoPattern from "@/components/ui/TopoPattern";
import {
  GraduationIcon,
  CalendarIcon,
  UsersIcon,
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
  const cursos = await getCursosPublicos();
  const cfg = await getSiteSettings();
  const social = cfg.social;
  return (
    <>
      <PageHero
        eyebrow="Adiestramiento"
        title="Adiestramiento"
        subtitle="Cursos, charlas y videos de formación para dirigentes y scouts."
        src="/images/adiestramiento-portada.jpg"
      />

      {/* ---- PRÓXIMOS CURSOS ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          eyebrow="Formación"
          title="Próximos cursos"
          subtitle="Inscribite por WhatsApp desde cada curso."
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
                  href={cfg.whatsappLink(waMsg)}
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

      {/* ---- BORDÓN DIGITAL (vive en Biblioteca) ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="Bordón digital"
                title="El boletín del campo, en video"
                subtitle="Las ediciones del Bordón digital se publican en el canal de YouTube del campo y están reunidas en la biblioteca."
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/biblioteca" className="btn-forest">
                  Ver el Bordón digital
                  <ArrowRightIcon width={18} height={18} />
                </Link>
                <a
                  href={social.youtube || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <YoutubeIcon width={18} height={18} />
                  Ir al canal
                  <ExternalLinkIcon width={14} height={14} />
                </a>
              </div>
            </div>
            <div className="card flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-flandes-red/10 text-flandes-red">
                <PlayIcon width={30} height={30} />
              </span>
              <p className="font-display text-lg font-bold uppercase text-forest-dark">
                Bordón digital
              </p>
              <p className="max-w-xs text-sm text-forest/65">
                Todas las ediciones publicadas, en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="container-flandes py-20">
        <div className="relative overflow-hidden rounded-3xl bg-forest-dark px-8 py-14 text-center text-sand">
          <TopoPattern className="absolute inset-0 h-full w-full text-gold/10" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold uppercase text-white sm:text-4xl">
              ¿Querés dictar un curso?
            </h2>
            <p className="mt-4 text-lg text-sand/80">
              Si tenés una propuesta de formación para compartir con otros grupos,
              escribinos y lo coordinamos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={cfg.whatsappLink(
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
