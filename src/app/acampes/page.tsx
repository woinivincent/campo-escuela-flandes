import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { siteConfig } from "@/config/site";
import {
  DropletIcon,
  ZapIcon,
  FlameIcon,
  HomeIcon,
  CarIcon,
  UsersIcon,
  ShieldIcon,
  MapIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Acampes",
  description:
    "Conocé el predio del Campo Escuela Flandes: cuatro subcampos, servicios e instalaciones para grupos scouts.",
};

export default function AcampesPage() {
  return (
    <>
      <PageHero
        eyebrow="Acampes"
        title="Conocé el predio"
        subtitle="Cuatro subcampos en un entorno natural, con servicios e instalaciones pensados para grupos scouts y familias."
        src="/images/acampes-portada.jpg"
      />

      {/* ---- INTRO DEL PREDIO ---- */}
      <section className="container-flandes py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="El campo"
              title="Un predio natural para acampar"
            />
            <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-forest/85">
              <p>
                El Campo Escuela &ldquo;Flandes&rdquo; cuenta con un predio
                amplio de entorno natural, dividido en cuatro subcampos
                diferenciados que permiten alojar a varios grupos de manera
                simultánea, cada uno con su propio espacio.
              </p>
              <p>
                El campo dispone de instalaciones comunes —sanitarios, agua
                corriente, fogones habilitados y un quincho central— que
                complementan la experiencia de acampe con el confort necesario
                para grupos de distintas edades.
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

          <ImageFrame
            src="/images/predio-aereo.jpg"
            label="Vista aérea del predio"
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* ---- SUBCAMPOS ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
          <SectionHeading
            align="center"
            eyebrow="El predio"
            title="Los cuatro subcampos"
            subtitle="Cada subcampo tiene su propio espacio, servicios y características. Elegí el que mejor se adapta a tu grupo."
            className="mb-12"
          />

          <div className="grid gap-8 lg:gap-10">
            {subcamposDetalle.map((s, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={s.id}
                  className={`grid items-center gap-8 md:grid-cols-[1fr_1fr] ${
                    isEven ? "" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  <ImageFrame
                    src={`/images/subcampo-${s.id}.jpg`}
                    label={`Foto ${s.nombre}`}
                    className="aspect-[4/3] w-full"
                  />
                  <div className="card">
                    <span className="font-display text-xs font-bold uppercase tracking-widest text-gold-dark">
                      Subcampo 0{i + 1}
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-forest-dark">
                      {s.nombre}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-forest/75">
                      {s.descripcion}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {s.caracteristicas.map((c) => (
                        <div key={c.label} className="flex items-start gap-2.5">
                          <span className="mt-0.5 text-forest">
                            <c.icon width={16} height={16} />
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-forest-dark">
                              {c.label}
                            </p>
                            <p className="text-xs text-forest/60">{c.valor}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 border-t border-forest/10 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-forest/55">
                        Servicios incluidos
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {s.servicios.map((srv) => (
                          <li
                            key={srv}
                            className="rounded-full bg-forest-pale px-3 py-1 text-xs font-medium text-forest-dark"
                          >
                            {srv}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ---- SERVICIOS E INSTALACIONES ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Instalaciones"
          title="Servicios del campo"
          subtitle="El campo dispone de instalaciones comunes disponibles para todos los grupos."
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

      {/* ---- MAPA DEL PREDIO ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
          <SectionHeading
            align="center"
            eyebrow="El predio"
            title="Mapa del campo"
            subtitle="Ubicación de los subcampos, instalaciones y accesos."
            className="mb-10"
          />
          <ImageFrame
            src="/images/mapa-predio.jpg"
            label="Mapa aéreo del predio — agregar imagen en public/images/mapa-predio.jpg"
            className="mx-auto aspect-[16/9] max-w-4xl w-full"
          />
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {siteConfig.subcampos.map((s, i) => (
              <span
                key={s.id}
                className="flex items-center gap-2 text-sm text-forest/70"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-flandes-red font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
                {s.nombre}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- GALERÍA ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Galería"
          title="El campo en imágenes"
          subtitle="Fotos del predio, las instalaciones y los grupos en actividad."
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
              ¿Ya sabés cuál subcampo querés?
            </h2>
            <p className="mt-4 text-lg text-sand/80">
              Hacé tu preinscripción en minutos. Te respondemos por WhatsApp.
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

const stats = [
  { valor: "4", label: "Subcampos" },
  { valor: "40+", label: "Años" },
  { valor: "—", label: "Hectáreas" },
];

const servicios = [
  {
    titulo: "Agua corriente",
    desc: "Tomas de agua distribuidas en todos los subcampos.",
    icon: DropletIcon,
  },
  {
    titulo: "Sanitarios",
    desc: "Baños y duchas disponibles para todos los grupos del predio.",
    icon: UsersIcon,
  },
  {
    titulo: "Electricidad",
    desc: "Energía eléctrica disponible en zonas comunes. Consultar disponibilidad por subcampo.",
    icon: ZapIcon,
  },
  {
    titulo: "Fogones",
    desc: "Fogones habilitados en cada subcampo, seguros y delimitados.",
    icon: FlameIcon,
  },
  {
    titulo: "Quincho / techado",
    desc: "Espacio cubierto para actividades, reuniones y días de lluvia.",
    icon: HomeIcon,
  },
  {
    titulo: "Estacionamiento",
    desc: "Ingreso vehicular y estacionamiento con capacidad para varios grupos.",
    icon: CarIcon,
  },
  {
    titulo: "Seguridad",
    desc: "El campo cuenta con personal y está delimitado perimetralmente.",
    icon: ShieldIcon,
  },
  {
    titulo: "Orientación",
    desc: "Señalética y mapas de los subcampos para facilitar el movimiento en el predio.",
    icon: MapIcon,
  },
];

const subcamposDetalle = [
  {
    id: "1",
    nombre: siteConfig.subcampos[0].nombre,
    descripcion:
      "Espacio amplio con acceso central, ideal para grupos numerosos que llegan en vehículos propios. Cuenta con fogón habilitado y acceso rápido a los sanitarios comunes del campo.",
    caracteristicas: [
      { label: "Capacidad", valor: "Hasta 80 personas", icon: UsersIcon },
      { label: "Acceso", valor: "Vehicular y peatonal", icon: CarIcon },
      { label: "Fogón", valor: "Habilitado", icon: FlameIcon },
      { label: "Agua", valor: "Toma propia", icon: DropletIcon },
    ],
    servicios: ["Agua corriente", "Baños a 50 m", "Fogón habilitado", "Estacionamiento"],
  },
  {
    id: "2",
    nombre: siteConfig.subcampos[1].nombre,
    descripcion:
      "Zona arbolada con abundante sombra natural. Recomendado para grupos que buscan mayor contacto con el entorno natural. Más tranquilo y alejado del acceso principal.",
    caracteristicas: [
      { label: "Capacidad", valor: "Hasta 50 personas", icon: UsersIcon },
      { label: "Acceso", valor: "Solo peatonal", icon: MapIcon },
      { label: "Fogón", valor: "Habilitado", icon: FlameIcon },
      { label: "Agua", valor: "Toma compartida", icon: DropletIcon },
    ],
    servicios: ["Agua corriente", "Baños a 100 m", "Fogón habilitado"],
  },
  {
    id: "3",
    nombre: siteConfig.subcampos[2].nombre,
    descripcion:
      "El subcampo más próximo al quincho y las instalaciones centrales. Ideal para grupos que realizarán actividades de formación o que necesitan acceso frecuente a espacios cubiertos.",
    caracteristicas: [
      { label: "Capacidad", valor: "Hasta 60 personas", icon: UsersIcon },
      { label: "Acceso", valor: "Vehicular y peatonal", icon: CarIcon },
      { label: "Techado", valor: "Quincho central cercano", icon: HomeIcon },
      { label: "Agua", valor: "Toma propia", icon: DropletIcon },
    ],
    servicios: ["Agua corriente", "Baños propios", "Fogón habilitado", "Quincho cercano"],
  },
  {
    id: "4",
    nombre: siteConfig.subcampos[3].nombre,
    descripcion:
      "El sector más alejado del acceso, con mayor privacidad e inmersión en el entorno. Recomendado para grupos que buscan una experiencia de campo más auténtica.",
    caracteristicas: [
      { label: "Capacidad", valor: "Hasta 40 personas", icon: UsersIcon },
      { label: "Acceso", valor: "Solo peatonal", icon: MapIcon },
      { label: "Fogón", valor: "Habilitado", icon: FlameIcon },
      { label: "Agua", valor: "Toma cercana", icon: DropletIcon },
    ],
    servicios: ["Agua corriente", "Baños a 150 m", "Fogón habilitado"],
  },
];
