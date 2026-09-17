import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { getTextos } from "@/lib/textosService";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import ReservaForm from "@/components/reservas/ReservaForm";
import { getSiteSettings } from "@/lib/siteConfigService";
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
    "Consultá disponibilidad en el Campo Escuela Flandes. La reserva se tramita por mail, con la planilla completa y una seña del 50%.",
};

export default async function ReservasPage() {
  const t = await getTextos("reservas");
  const contact = await getSiteSettings();
  const sc = contact.subcampos;
  const subcamposDetalle = [
    // Todo esto sale del PDF de normas del campo. Las capacidades que había
    // acá eran inventadas: el predio no publica cupos por subcampo porque los
    // asigna la administración según el contingente.
    { id: "1", nombre: sc[0].nombre, descripcion: "El más rústico de los cuatro. No tiene cocina, quincho ni bungalow, y es el único sector del predio sin luz eléctrica ni agua potable propias. Tiene su mástil y el fogón adentro, cerca del mástil.", servicios: ["Mástil propio", "Fogón en el subcampo", "Baños del sector cocina"], capacidad: "Lo asigna la administración" },
    { id: "2", nombre: sc[1].nombre, descripcion: "El más grande y el único con servicios: cocina, quincho abierto para unas 60 personas y bungalow. Tiene el mástil principal del campo, donde solo se iza la Bandera Nacional. El fogón queda afuera del subcampo, frente a la capilla.", servicios: ["Cocina y quincho", "Bungalow", "Mástil principal"], capacidad: "Lo asigna la administración" },
    { id: "3", nombre: sc[2].nombre, descripcion: "Agreste, sin cocina, quincho ni bungalow. Se puede cocinar a leña y armar construcciones con troncos caídos. Tiene su mástil y el fogón adentro, cerca del mástil.", servicios: ["Mástil propio", "Fogón en el subcampo", "Baños detrás del tanque"], capacidad: "Lo asigna la administración" },
    { id: "4", nombre: sc[3].nombre, descripcion: "Agreste, sin cocina ni quincho. Si el contingente viene con rama menor, puede usar uno de los bungalows. Tiene su mástil y el fogón adentro, cerca del mástil.", servicios: ["Mástil propio", "Bungalow con rama menor", "Baños detrás del tanque"], capacidad: "Lo asigna la administración" },
  ];
  return (
    <>
      <PageHero
        eyebrow={t("hero_eyebrow")}
        title={t("hero_titulo")}
        subtitle={t("hero_bajada")}
        src="/images/reservas-portada.jpg"
      />

      {/* ---- NORMAS DEL ACAMPE ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          eyebrow="Normas"
          title={t("intro_titulo")}
          subtitle={t("intro_texto")}
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
          {/* El monto todavía no lo pasó el campo; lo demás sale del PDF de
              normas y ya es información útil para presupuestar. */}
          <p className="text-sm leading-relaxed text-forest-dark">
            <strong>Costos:</strong>{" "}
            Se cobra por persona y por día de reserva, contando completos el día
            de llegada y el de salida. La reserva se confirma con una seña del
            50% y el saldo se abona el día de llegada. Consultanos el valor
            vigente.
          </p>
        </div>

        {/* Quién atiende. Solo aparece si el panel cargó un nombre y lo marcó
            como público; si no, esta parte no existe. */}
        {contact.referenteReservas.publico && contact.referenteReservas.nombre && (
          <p className="mt-6 text-center text-sm text-forest/60">
            Las reservas las atiende{" "}
            <strong className="text-forest-dark">
              {contact.referenteReservas.nombre}
            </strong>
            .
          </p>
        )}
      </section>

      {/* ---- SUBCAMPOS ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
          <SectionHeading
            align="center"
            eyebrow="Subcampos"
            title="Elegí dónde acampar"
            subtitle="Capacidad y servicios de cada subcampo."
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
              eyebrow="Solicitud"
              title="Pedí tu fecha"
              subtitle="Escribinos para consultar disponibilidad. La reserva después se formaliza por mail."
            />

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-pale text-forest">
                  <CalendarIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-dark">
                    Reservá con anticipación
                  </p>
                  <p className="text-xs text-forest/65">
                    Indicar acá con cuánto tiempo conviene pedir la fecha.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-pale text-forest">
                  <UsersIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-dark">
                    Contanos cuántos son
                  </p>
                  <p className="text-xs text-forest/65">
                    Con la cantidad de personas te sugerimos el subcampo más adecuado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-pale text-forest">
                  <ShieldIcon width={18} height={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-dark">
                    Seguro y responsables
                  </p>
                  <p className="text-xs text-forest/65">
                    Indicar acá qué documentación se pide a cada grupo.
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
              ¿Todavía no conocés el predio?
            </h2>
            <p className="mt-1 text-sm text-forest/70">
              Mirá los subcampos y las instalaciones antes de reservar.
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

// Las cuatro primeras salen de las publicaciones del Consejo de Campo en el
// blog. Las dos últimas siguen pendientes: el campo nunca las publicó, así que
// no se inventan.
// Las seis salen del PDF de normas que entrega el campo. La que decía "un
// grupo por vez" era del protocolo de 2020 y ya no rige: el predio tiene cuatro
// subcampos y recibe hasta cuatro contingentes por fin de semana.
const normas = [
  { titulo: "Quiénes pueden acampar", desc: "Solo contingentes: grupos scouts, grupos guías e instituciones educativas. No se reciben particulares ni instituciones sin fines educativos.", icon: UsersIcon },
  { titulo: "Horarios", desc: "Se entra desde las 8 de la mañana y hay que retirarse antes de las 17. El día de llegada y el de salida se cobran completos.", icon: CalendarIcon },
  { titulo: "Uso del fuego", desc: "Los fogones van solo en los lugares señalados de cada subcampo. La leña del bosque se puede usar con cuidado, nunca cerca de los árboles, y al irse hay que apagar todo y tapar los pozos.", icon: FlameIcon },
  { titulo: "Las carpas y los árboles", desc: "Las carpas se arman únicamente en el área destinada: no se puede acampar debajo de los árboles, ni cortar ramas o retoños, ni dañar los troncos.", icon: MapIcon },
  { titulo: "Qué no entra al predio", desc: "No entran vehículos, ni armas de ningún tipo. Tampoco se permite cazar, ni usar guirnaldas, amplificadores de sonido o estufas eléctricas.", icon: AlertIcon },
  { titulo: "Responsable a cargo", desc: "Un mayor de edad firma las normas y responde por todo el contingente. Lleva la nómina impresa con nombre, apellido y DNI, y entrega el sector limpio y ordenado.", icon: ShieldIcon },
];

