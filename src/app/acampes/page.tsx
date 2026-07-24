import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { getSiteSettings } from "@/lib/siteConfigService";
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

export default async function AcampesPage() {
  const { subcampos } = await getSiteSettings();

  const subcamposDetalle = [
    {
      id: "1", nombre: subcampos[0].nombre,
      descripcion: "Describir acá este subcampo: el terreno, la sombra y para qué tipo de actividad sirve mejor.",
      caracteristicas: [
        { label: "Capacidad", valor: "Hasta 80 personas", icon: UsersIcon },
        { label: "Acceso", valor: "Vehicular y peatonal", icon: CarIcon },
        { label: "Fogón", valor: "Habilitado", icon: FlameIcon },
        { label: "Agua", valor: "Toma propia", icon: DropletIcon },
      ],
      servicios: ["Agua corriente", "Baños a 50 m", "Fogón habilitado", "Estacionamiento"],
    },
    {
      id: "2", nombre: subcampos[1].nombre,
      descripcion: "Describir acá este subcampo: el terreno, la sombra y para qué tipo de actividad sirve mejor.",
      caracteristicas: [
        { label: "Capacidad", valor: "Hasta 50 personas", icon: UsersIcon },
        { label: "Acceso", valor: "Solo peatonal", icon: MapIcon },
        { label: "Fogón", valor: "Habilitado", icon: FlameIcon },
        { label: "Agua", valor: "Toma compartida", icon: DropletIcon },
      ],
      servicios: ["Agua corriente", "Baños a 100 m", "Fogón habilitado"],
    },
    {
      id: "3", nombre: subcampos[2].nombre,
      descripcion: "Describir acá este subcampo: el terreno, la sombra y para qué tipo de actividad sirve mejor.",
      caracteristicas: [
        { label: "Capacidad", valor: "Hasta 60 personas", icon: UsersIcon },
        { label: "Acceso", valor: "Vehicular y peatonal", icon: CarIcon },
        { label: "Techado", valor: "Quincho central cercano", icon: HomeIcon },
        { label: "Agua", valor: "Toma propia", icon: DropletIcon },
      ],
      servicios: ["Agua corriente", "Baños propios", "Fogón habilitado", "Quincho cercano"],
    },
    {
      id: "4", nombre: subcampos[3].nombre,
      descripcion: "Describir acá este subcampo: el terreno, la sombra y para qué tipo de actividad sirve mejor.",
      caracteristicas: [
        { label: "Capacidad", valor: "Hasta 40 personas", icon: UsersIcon },
        { label: "Acceso", valor: "Solo peatonal", icon: MapIcon },
        { label: "Fogón", valor: "Habilitado", icon: FlameIcon },
        { label: "Agua", valor: "Toma cercana", icon: DropletIcon },
      ],
      servicios: ["Agua corriente", "Baños a 150 m", "Fogón habilitado"],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Acampes"
        title="El predio"
        subtitle="Cuatro subcampos, servicios e instalaciones para que tu grupo acampe."
        src="/images/acampes-portada.jpg"
      />

      {/* ---- INTRO DEL PREDIO ---- */}
      <section className="container-flandes py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="El campo"
              title="Un predio preparado para acampar"
            />
            <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-forest/85">
              <p>
                Acá va la descripción general del predio: cuánta superficie tiene,
                cómo es el terreno y qué lo hace apto para acampar.
              </p>
              <p>
                Un segundo párrafo puede detallar los accesos, el estacionamiento y
                las áreas comunes que comparten todos los subcampos.
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
            eyebrow="Subcampos"
            title="Los cuatro subcampos"
            subtitle="Cada uno tiene su capacidad y sus servicios. Se reservan por separado."
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

      {/* ---- MAPA DEL PREDIO ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes">
          <SectionHeading
            align="center"
            eyebrow="Mapa"
            title="Cómo está distribuido el predio"
            subtitle="Ubicación de cada subcampo y de las instalaciones comunes."
            className="mb-10"
          />
          <ImageFrame
            src="/images/mapa-predio.jpg"
            label="Mapa aéreo del predio — agregar imagen en public/images/mapa-predio.jpg"
            className="mx-auto aspect-[16/9] max-w-4xl w-full"
          />
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {subcampos.map((s, i) => (
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

// Los valores con "—" los tiene que confirmar el campo.
const stats = [
  { valor: "4", label: "Subcampos" },
  { valor: "—", label: "Años" },
  { valor: "—", label: "Hectáreas" },
];

const servicios = [
  { titulo: "Agua corriente", desc: "Detallar acá las tomas de agua disponibles.", icon: DropletIcon },
  { titulo: "Sanitarios", desc: "Detallar acá los baños y su ubicación en el predio.", icon: UsersIcon },
  { titulo: "Electricidad", desc: "Detallar acá dónde hay conexión eléctrica.", icon: ZapIcon },
  { titulo: "Fogones", desc: "Detallar acá los fogones habilitados y sus normas.", icon: FlameIcon },
  { titulo: "Quincho / techado", desc: "Detallar acá los espacios techados y su capacidad.", icon: HomeIcon },
  { titulo: "Estacionamiento", desc: "Detallar acá dónde se estaciona y cuántos vehículos entran.", icon: CarIcon },
  { titulo: "Seguridad", desc: "Detallar acá las medidas de seguridad del predio.", icon: ShieldIcon },
  { titulo: "Orientación", desc: "Detallar acá la señalización y los circuitos del campo.", icon: MapIcon },
];

