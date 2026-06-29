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
        title="Flora y fauna del campo"
        subtitle="Conocé las especies que habitan el predio. Fichas descriptivas con códigos QR para identificarlas durante tu acampe."
        src="/images/naturaleza-portada.jpg"
      />

      {/* ---- INTRO ---- */}
      <section className="container-flandes py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="El entorno"
              title="Un ecosistema vivo"
              subtitle="El Campo Escuela Flandes está ubicado en un entorno natural con una diversidad significativa de flora y fauna autóctona. Cada especie forma parte de un ecosistema que el campo trabaja por preservar."
            />
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {destacados.map((d) => (
                <li
                  key={d.texto}
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
            title="Plantas del predio"
            subtitle="Especies vegetales identificadas en el Campo Escuela Flandes."
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
          title="Animales del campo"
          subtitle="Especies animales que habitan o visitan el predio."
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
              eyebrow="En el terreno"
              title="Códigos QR por especie"
              subtitle="En los próximos meses se instalarán carteles con códigos QR junto a las especies más representativas del predio. Escaneándolos accedés a la ficha completa con fotos, descripción y datos ecológicos."
            />
            <ul className="mt-6 space-y-3">
              {qrPasos.map((p) => (
                <li key={p.titulo} className="flex items-start gap-3">
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
            <p className="mt-6 text-xs italic text-forest/45">
              Sistema de QR en desarrollo — se habilitará próximamente.
            </p>
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
                Cada cartelería del predio vinculará a la ficha completa de la especie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- PROYECTOS ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Área de naturaleza"
          title="Proyectos del campo"
          subtitle="Iniciativas de conservación y educación ambiental en desarrollo."
          className="mb-10"
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {proyectos.map((p) => (
            <div key={p.titulo} className="card text-center">
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
              ¿Querés conocer el predio?
            </h2>
            <p className="mt-1 text-sm text-forest/70">
              Reservá tu lugar y viví el entorno natural desde adentro.
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
  { texto: "Vegetación nativa conservada en gran parte del predio", icon: LeafIcon },
  { texto: "Avifauna diversa, con más de 30 especies registradas", icon: ShieldIcon },
  { texto: "Programa de identificación y señalética en desarrollo", icon: QrIcon },
  { texto: "Actividades guiadas de naturaleza para grupos", icon: UsersIcon },
];

const especies: Especie[] = [
  {
    id: "espinillo",
    nombreComun: "Espinillo",
    nombreCientifico: "Vachellia caven",
    categoria: "Flora",
    descripcion:
      "Árbol espinoso de la familia de las leguminosas, muy común en la pampa. Florece con pequeñas flores amarillas muy fragantes.",
    curiosidad:
      "Sus flores son tan perfumadas que se pueden oler a metros de distancia.",
    qrDisponible: false,
  },
  {
    id: "ceibo",
    nombreComun: "Ceibo",
    nombreCientifico: "Erythrina crista-galli",
    categoria: "Flora",
    descripcion:
      "Árbol de ribera con flores rojas características. Es la flor nacional de Argentina y Uruguay.",
    curiosidad: "Sus flores son la flor nacional argentina desde 1942.",
    qrDisponible: false,
  },
  {
    id: "sauce",
    nombreComun: "Sauce criollo",
    nombreCientifico: "Salix humboldtiana",
    categoria: "Flora",
    descripcion:
      "Árbol de ribera de ramas colgantes. Crece cerca del agua y es muy longevo. Ofrece sombra generosa en verano.",
    curiosidad:
      "Puede vivir más de 100 años y sus raíces buscan el agua subterránea.",
    qrDisponible: false,
  },
  {
    id: "tala",
    nombreComun: "Tala",
    nombreCientifico: "Celtis ehrenbergiana",
    categoria: "Flora",
    descripcion:
      "Árbol mediano espinoso muy importante para la fauna local: sus frutos son alimento de aves y mamíferos.",
    curiosidad:
      "Es una especie clave del bosque nativo bonaerense y da refugio a muchas aves.",
    qrDisponible: false,
  },
  {
    id: "carpincho",
    nombreComun: "Carpincho",
    nombreCientifico: "Hydrochoerus hydrochaeris",
    categoria: "Fauna",
    descripcion:
      "El roedor más grande del mundo. Vive en grupos cerca del agua. Es herbívoro y muy tranquilo si no se lo molesta.",
    curiosidad:
      "Puede bucear y permanecer varios minutos bajo el agua para escapar de depredadores.",
    qrDisponible: false,
  },
  {
    id: "hornero",
    nombreComun: "Hornero",
    nombreCientifico: "Furnarius rufus",
    categoria: "Fauna",
    descripcion:
      "Ave parda y robusta, famosa por sus nidos de barro en forma de horno. Ave nacional de Argentina.",
    curiosidad:
      "Sus nidos de barro endurecido pueden pesar hasta 4 kg y durar muchos años.",
    qrDisponible: false,
  },
  {
    id: "martin-pescador",
    nombreComun: "Martín pescador",
    nombreCientifico: "Megaceryle torquata",
    categoria: "Fauna",
    descripcion:
      "Ave de colorido llamativo, de azul y rojizo, que caza peces lanzándose en picado al agua desde una rama.",
    curiosidad:
      "Puede ver bajo el agua y su vuelo en picada llega a más de 80 km/h.",
    qrDisponible: false,
  },
  {
    id: "coipo",
    nombreComun: "Coipo / Nutria",
    nombreCientifico: "Myocastor coypus",
    categoria: "Fauna",
    descripcion:
      "Roedor semiacuático de pelaje pardo, parecido a un castor. Vive en cañaverales y a orillas del agua.",
    curiosidad:
      "Construye refugios entre la vegetación acuática y es muy buen nadador.",
    qrDisponible: false,
  },
];

const qrPasos = [
  {
    n: "1",
    titulo: "Encontrá el cartel",
    desc: "Cada especie señalizada en el predio tiene un cartel con su nombre y un código QR.",
  },
  {
    n: "2",
    titulo: "Escaneá el QR",
    desc: "Con la cámara de tu celular apuntá al código para abrir la ficha de la especie.",
  },
  {
    n: "3",
    titulo: "Explorá la ficha",
    desc: "Nombre, descripción, hábitat, curiosidades y más datos sobre cada especie.",
  },
];

const proyectos = [
  {
    titulo: "Señalética de especies",
    desc: "Instalación de carteles identificatorios con QR para las principales especies del predio.",
    estado: "En desarrollo",
    icon: QrIcon,
  },
  {
    titulo: "Registro de avifauna",
    desc: "Relevamiento sistemático de las aves presentes en el campo a lo largo del año.",
    estado: "En curso",
    icon: LeafIcon,
  },
  {
    titulo: "Sendero natural",
    desc: "Diseño de un recorrido guiado por los ambientes más representativos del predio.",
    estado: "Planificado",
    icon: ShieldIcon,
  },
];
