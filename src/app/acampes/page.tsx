import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { getTextos } from "@/lib/textosService";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { getSiteSettings } from "@/lib/siteConfigService";
import MapaSubcampos from "@/components/acampes/MapaSubcampos";
import MapaGoogle from "@/components/ui/MapaGoogle";
import {
  DropletIcon,
  ZapIcon,
  FlameIcon,
  HomeIcon,
  CarIcon,
  ShieldIcon,
  ShowerIcon,
  PotIcon,
  BedIcon,
  ChurchIcon,
  FlagIcon,
  LeafIcon,
  TentIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Acampes",
  description:
    "Conocé el predio del Campo Escuela Flandes: cuatro subcampos, servicios e instalaciones para grupos scouts.",
};

export default async function AcampesPage() {
  const t = await getTextos("acampes");
  const { subcampos, mapa } = await getSiteSettings();

    const subcamposDetalle = [
    {
      id: "1", nombre: subcampos[0].nombre,
      descripcion: "Sector agreste, en el extremo norte del predio junto al río, donde se puede cocinar a leña y hacer construcciones con troncos caídos. El plano señala álamos, araucarias y eucaliptos.",
      caracteristicas: [
        { label: "Instalaciones", valor: "Sin cocina ni quincho", icon: HomeIcon },
        { label: "Fogón", valor: "Dentro, junto al mástil", icon: FlameIcon },
        { label: "Baños", valor: "Los del sector cocina", icon: ShowerIcon },
        { label: "Agua y luz", valor: "No llegan al subcampo", icon: DropletIcon },
      ],
      servicios: ["Mástil propio", "Área de fogón", "Baños compartidos con Ntra. Sra. de Luján"],
    },
    {
      id: "2", nombre: subcampos[1].nombre,
      descripcion: "El subcampo más extenso, sobre el sector oeste que da al Río Luján, y el único con servicios. Agreste igual que el resto: se cocina a leña y se construye con troncos caídos. El plano señala robles y álamos.",
      caracteristicas: [
        { label: "Instalaciones", valor: "Cocina, quincho y bungalows", icon: PotIcon },
        { label: "Fogón", valor: "Frente a la capilla", icon: FlameIcon },
        { label: "Baños", valor: "8 inodoros y 6 duchas", icon: ShowerIcon },
        { label: "Mástil", valor: "El principal del campo", icon: FlagIcon },
      ],
      servicios: ["Cocina con heladera y freezer", "Quincho para unas 60 personas", "Bungalows para la rama menor", "Agua caliente con termo a leña"],
    },
    {
      id: "3", nombre: subcampos[2].nombre,
      descripcion: "Sobre el sector este del predio, del lado de la calle. Subcampo agreste: se puede cocinar a leña y hacer construcciones con troncos caídos.",
      caracteristicas: [
        { label: "Instalaciones", valor: "Sin cocina ni quincho", icon: HomeIcon },
        { label: "Fogón", valor: "Dentro, junto al mástil", icon: FlameIcon },
        { label: "Baños", valor: "Detrás del tanque de agua", icon: ShowerIcon },
        { label: "Agua y luz", valor: "Canilla y toma cercanas", icon: DropletIcon },
      ],
      servicios: ["Mástil propio", "Área de fogón", "Baños compartidos con San Francisco de Asís"],
    },
    {
      id: "4", nombre: subcampos[3].nombre,
      descripcion: "En el sector sudeste. Subcampo agreste: se puede cocinar a leña y hacer construcciones con troncos caídos. Si el contingente viene con rama menor, puede usar un bungalow. El plano señala robles y cipreses.",
      caracteristicas: [
        { label: "Instalaciones", valor: "Un bungalow con rama menor", icon: BedIcon },
        { label: "Fogón", valor: "Dentro, junto al mástil", icon: FlameIcon },
        { label: "Baños", valor: "4 inodoros y 2 duchas", icon: ShowerIcon },
        { label: "Agua y luz", valor: "Canilla y toma cercanas", icon: DropletIcon },
      ],
      servicios: ["Mástil propio", "Área de fogón", "Baños compartidos con San Jorge"],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("hero_eyebrow")}
        title={t("hero_titulo")}
        subtitle={t("hero_bajada")}
        src="/images/acampes-portada.jpg"
      />

      {/* ---- INTRO DEL PREDIO ---- */}
      <section className="container-flandes py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="El campo"
              title={t("intro_titulo")}
            />
            <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-forest/85">
              <p>
                {t("intro_texto")}
              </p>
              <p>
                Fue forestado en diferentes etapas, lo que permite hoy diferenciar
                varios ambientes y contar con comodidades suficientes para una
                estadía confortable en plena naturaleza.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-forest/10 bg-forest-pale/60 px-4 py-5 text-center"
                >
                  <span className="font-display text-2xl font-bold text-flandes-red">
                    {s.valor}
                  </span>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-forest/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <MapaGoogle
            lat={mapa.lat}
            lng={mapa.lng}
            vista="k"
            zoom={16}
            titulo="Vista satelital del Campo Escuela Flandes"
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* ---- MAPA DEL PREDIO ---- */}
      <section className="bg-sand-dark/40 py-20" id="mapa">
        <div className="container-flandes">
          <SectionHeading
            align="center"
            eyebrow="Mapa"
            title="Cómo está distribuido el predio"
            subtitle="Tocá una zona del plano para ver la foto, las instalaciones y los servicios de ese subcampo."
            className="mb-10"
          />
          <MapaSubcampos
            subcampos={subcamposDetalle.map((s) => ({
              id: s.id,
              nombre: s.nombre,
              descripcion: s.descripcion,
              // solo texto: los íconos no se pueden pasar a un componente interactivo
              caracteristicas: s.caracteristicas.map((c) => ({
                label: c.label,
                valor: c.valor,
              })),
              servicios: s.servicios,
            }))}
          />
        </div>
      </section>

      {/* ---- SERVICIOS E INSTALACIONES ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Servicios"
          title="Qué encontrás en el campo"
          subtitle="Instalaciones disponibles para todos los grupos."
          className="mb-12"
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servicios.map((sv) => (
            <li key={sv.titulo} className="card text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-pale text-forest">
                <sv.icon width={26} height={26} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-forest-dark">
                {sv.titulo}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest/70">
                {sv.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- GALERÍA ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Galería"
          title="El campo en fotos"
          subtitle="Imágenes del predio y de los acampes."
          className="mb-12"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ImageFrame
              key={i}
              src={`/images/acampe-galeria-${i + 1}.jpg`}
              label={`Foto del predio ${i + 1}`}
              className={`w-full ${
                i === 0
                  ? "col-span-2 aspect-[2/1] sm:aspect-[4/3]"
                  : "aspect-square"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="container-flandes pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-forest-dark px-8 py-14 text-center text-sand">
          <div className="absolute inset-0 bg-[url('/images/hero-campo.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold uppercase text-white sm:text-4xl">
              ¿Querés acampar acá?
            </h2>
            <p className="mt-4 text-lg text-sand/80">
              Pedí tu fecha y coordinamos el subcampo que mejor le sirva a tu grupo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/reservas" className="btn-primary">
                Hacer una reserva
                <ArrowRightIcon width={18} height={18} />
              </Link>
              <Link href="/contacto" className="btn-ghost">
                Consultar al campo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// La superficie en hectáreas la tiene que confirmar el campo.
const stats = [
  { valor: "4", label: "Subcampos" },
  { valor: "1958", label: "Desde" },
  { valor: "—", label: "Hectáreas" },
];

const servicios = [
  { titulo: "Agua potable", desc: "Canillas cerca de cada subcampo. Hay agua en todo el predio, salvo en Santa Clara de Asís.", icon: DropletIcon },
  { titulo: "Baños y duchas", desc: "Dos cuerpos de baños: uno de 4 inodoros y 2 duchas, y otro de 8 inodoros y 6 duchas.", icon: ShowerIcon },
  { titulo: "Electricidad", desc: "Luz en todo el predio, menos en Santa Clara. En los postes hay tomas para cargar equipos a batería.", icon: ZapIcon },
  { titulo: "Cocina", desc: "Freezer, heladera y mechero a gas de doble hornalla, de uso compartido. El horno pizzero se pide aparte.", icon: PotIcon },
  { titulo: "Quincho y parrillas", desc: "Quincho abierto para unas 60 personas, con un sector de parrillas de uso general.", icon: HomeIcon },
  { titulo: "Bungalows", desc: "Dos bungalows para el pernocte de la rama menor. Los asigna la administración según el contingente.", icon: BedIcon },
  { titulo: "Fogones", desc: "Cada subcampo tiene su área de fogón. Solo se prende fuego en los lugares señalados.", icon: FlameIcon },
  { titulo: "Leña y bosque", desc: "Amplias áreas de bosque con leña para cocinar y armar rincones de patrulla. Pedimos usarla con criterio.", icon: LeafIcon },
  { titulo: "Armado de carpas", desc: "Cada subcampo tiene su sector para carpas. No se arman debajo de los árboles ni sobre los caminos.", icon: TentIcon },
  { titulo: "Capilla", desc: "Una capilla abierta para celebraciones religiosas, disponible para todos los contingentes.", icon: ChurchIcon },
  { titulo: "Estacionamiento", desc: "Amplio, para autos y motos. Los vehículos de mayor porte quedan en la calle: no se ingresa al predio.", icon: CarIcon },
  { titulo: "Guardias y ayuda médica", desc: "Cobertura de ayuda médica para emergencias y guardias pasivas rotativas de la comisión.", icon: ShieldIcon },
];

