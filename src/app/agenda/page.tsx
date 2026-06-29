import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { whatsappLink } from "@/lib/siteConfigService";
import { getEventosPublicos, type TipoEvento, type Evento } from "@/lib/db";
import {
  CalendarIcon,
  WhatsAppIcon,
  ArrowRightIcon,
  UsersIcon,
  GraduationIcon,
  LeafIcon,
  TentIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Agenda",
  description:
    "Próximos eventos del Campo Escuela Flandes: acampes, cursos, charlas y actividades.",
};

const tipoBadge: Record<TipoEvento, string> = {
  Acampe: "bg-flandes-red/10 text-flandes-red",
  Curso: "bg-forest/10 text-forest-dark",
  Charla: "bg-gold/15 text-gold-dark",
  Actividad: "bg-forest-pale text-forest",
};

const tipoIcono: Record<TipoEvento, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Acampe: TentIcon,
  Curso: GraduationIcon,
  Charla: LeafIcon,
  Actividad: UsersIcon,
};

function groupByMonth(eventos: Evento[]) {
  const map = new Map<string, Evento[]>();
  for (const e of eventos) {
    const key = e.fecha.slice(0, 7); // "YYYY-MM"
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return Array.from(map.entries()).map(([key, evts]) => ({ key, evts }));
}

const MESES: Record<string, string> = {
  "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
  "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
  "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre",
};

const MESES_SHORT: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

export default function AgendaPage() {
  const grupos = groupByMonth(getEventosPublicos());

  return (
    <>
      <PageHero
        eyebrow="Agenda"
        title="Próximos eventos"
        subtitle="Acampes, cursos, charlas y actividades del Campo Escuela Flandes. Inscribite por WhatsApp."
        src="/images/agenda-portada.jpg"
      />

      {/* ---- LEYENDA ---- */}
      <section className="border-b border-sand-dark bg-sand py-3">
        <div className="container-flandes flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-forest/40">
            Leyenda:
          </span>
          {(["Acampe", "Curso", "Charla", "Actividad"] as TipoEvento[]).map(
            (t) => (
              <span
                key={t}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tipoBadge[t]}`}
              >
                {t}
              </span>
            )
          )}
        </div>
      </section>

      {/* ---- EVENTOS ---- */}
      <section className="container-flandes py-16">
        {grupos.length === 0 && (
          <p className="text-center text-forest/60">
            No hay eventos próximos cargados.
          </p>
        )}

        <div className="space-y-12">
          {grupos.map(({ key, evts }) => {
            const [anio, mes] = key.split("-");
            return (
              <div key={key}>
                {/* Cabecera de mes */}
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="font-display text-xl font-bold uppercase tracking-wide text-forest-dark">
                    {MESES[mes]} {anio}
                  </h2>
                  <div className="h-px flex-1 bg-forest/10" />
                </div>

                <ul className="space-y-4">
                  {evts.map((ev) => {
                    const [, evMes, evDia] = ev.fecha.split("-");
                    const diaDisplay = evDia;
                    const mesDisplay = MESES_SHORT[evMes] ?? evMes;
                    const IconoTipo = tipoIcono[ev.tipo];
                    const waMsg = `Hola! Quiero inscribirme al evento "${ev.titulo}" del ${diaDisplay} de ${mesDisplay}.`;
                    return (
                      <li
                        key={ev.id}
                        className="card card-hover flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
                      >
                        {/* Bloque de fecha */}
                        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-forest-dark text-sand">
                          <span className="font-display text-2xl font-bold leading-none text-gold">
                            {diaDisplay}
                          </span>
                          <span className="text-[0.62rem] uppercase tracking-wide text-sand/70">
                            {mesDisplay}
                          </span>
                        </div>

                        {/* Contenido */}
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tipoBadge[ev.tipo]}`}
                              >
                                <IconoTipo width={13} height={13} />
                                {ev.tipo}
                              </span>
                              {ev.hora && (
                                <span className="text-xs text-forest/50">
                                  {ev.hora}
                                </span>
                              )}
                            </div>
                            <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-tight text-forest-dark">
                              {ev.titulo}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-forest/75">
                              {ev.descripcion}
                            </p>
                            <p className="mt-1.5 text-xs text-forest/50">
                              <strong>Destinatarios:</strong>{" "}
                              {ev.destinatarios}
                            </p>
                            {ev.cupos && (
                              <p className="mt-0.5 text-xs font-medium text-flandes-red">
                                Cupos: {ev.cupos}
                              </p>
                            )}
                          </div>

                          <a
                            href={whatsappLink(waMsg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp shrink-0 self-start px-4 py-2 text-sm"
                          >
                            <WhatsAppIcon width={16} height={16} />
                            Inscribirme
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {grupos.length > 0 && (
          <p className="mt-10 text-center text-xs text-forest/45">
            Los eventos se actualizan desde el panel de administración.
          </p>
        )}
      </section>

      {/* ---- PROPONER UN EVENTO ---- */}
      <section className="bg-sand-dark/40 py-16">
        <div className="container-flandes grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow="¿Tenés una propuesta?"
              title="Organizá tu evento en el campo"
              subtitle="Si querés coordinar un curso, charla o actividad abierta en el predio, contactanos para evaluarlo juntos."
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <a
              href={whatsappLink(
                "Hola! Quiero proponer un evento o actividad en el Campo Escuela Flandes."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon width={18} height={18} />
              Proponer por WhatsApp
            </a>
            <Link href="/contacto" className="btn-outline">
              Formulario de contacto
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

