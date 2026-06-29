import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { whatsappLink } from "@/lib/siteConfigService";
import { getLibros, type CategoriaLibro } from "@/lib/db";
import {
  BookIcon,
  WhatsAppIcon,
  TagIcon,
  ArrowRightIcon,
  InfoIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Librería",
  description:
    "Catálogo de libros del Campo Escuela Flandes. Material scout, naturaleza y formación disponibles para la venta.",
};

const categoriaColor: Record<CategoriaLibro, string> = {
  Escultismo: "bg-flandes-red/10 text-flandes-red",
  Naturaleza: "bg-forest-pale text-forest",
  Formación: "bg-gold/15 text-gold-dark",
  Literatura: "bg-forest/10 text-forest-dark",
};

export default function LibreriaPage() {
  const libros = getLibros();
  const categorias = Array.from(new Set(libros.map((l) => l.categoria)));

  return (
    <>
      <PageHero
        eyebrow="Librería"
        title="Material y bibliografía"
        subtitle="Libros y materiales disponibles para la venta en el campo. Pedidos por WhatsApp."
        src="/images/libreria-portada.jpg"
      />

      {/* ---- AVISO IMPORTANTE ---- */}
      <section className="border-b border-sand-dark bg-white py-6">
        <div className="container-flandes flex items-start gap-3">
          <InfoIcon
            width={18}
            height={18}
            className="mt-0.5 shrink-0 text-gold-dark"
          />
          <p className="text-sm text-forest/80">
            <strong>Precios y stock:</strong>{" "}
            Los precios son orientativos y pueden variar. Consultá disponibilidad y
            precio actualizado antes de hacer tu pedido. Stock sujeto a disponibilidad.
          </p>
        </div>
      </section>

      {/* ---- CATÁLOGO ---- */}
      <section className="container-flandes py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Catálogo"
            title="Libros disponibles"
            subtitle="Material seleccionado para scouts, dirigentes y amantes de la naturaleza."
          />
          {/* Categorías (decorativas — sin filtrado JS por ahora) */}
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <span
                key={cat}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${categoriaColor[cat as CategoriaLibro]}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {libros.map((libro) => {
            const waMsg = `Hola! Quiero consultar por el libro "${libro.titulo}" de ${libro.autor}.`;
            return (
              <article
                key={libro.id}
                className={`card card-hover flex flex-col ${!libro.disponible ? "opacity-60" : ""}`}
              >
                {/* Portada */}
                <ImageFrame
                  src={`/images/libro-${libro.id}.jpg`}
                  label={`Portada: ${libro.titulo}`}
                  className="aspect-[3/4] w-full"
                />

                {/* Info */}
                <div className="mt-5 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold ${
                        categoriaColor[libro.categoria as CategoriaLibro]
                      }`}
                    >
                      {libro.categoria}
                    </span>
                    {!libro.disponible && (
                      <span className="rounded-full bg-forest/10 px-2.5 py-1 text-[0.65rem] font-semibold text-forest/60">
                        Sin stock
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold uppercase tracking-tight text-forest-dark">
                    {libro.titulo}
                  </h3>
                  <p className="text-xs text-forest/55">{libro.autor}</p>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-forest/70">
                    {libro.descripcion}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-forest/10 pt-4">
                    <div className="flex items-center gap-1 text-forest-dark">
                      <TagIcon
                        width={14}
                        height={14}
                        className="text-flandes-red"
                      />
                      <span className="font-display text-lg font-bold">
                        ${libro.precio.toLocaleString("es-AR")}
                      </span>
                      <span className="text-xs text-forest/45">ARS</span>
                    </div>

                    {libro.disponible ? (
                      <a
                        href={whatsappLink(waMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp px-3 py-2 text-xs"
                      >
                        <WhatsAppIcon width={14} height={14} />
                        Pedir
                      </a>
                    ) : (
                      <a
                        href={whatsappLink(
                          `Hola! Quiero consultar cuándo estará disponible "${libro.titulo}".`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline px-3 py-2 text-xs"
                      >
                        Avisar cuando haya
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-forest/45">
          Catálogo de ejemplo — reemplazar con los títulos, precios y portadas
          reales de la librería del campo.
        </p>
      </section>

      {/* ---- CÓMO COMPRAR ---- */}
      <section className="bg-sand-dark/40 py-20">
        <div className="container-flandes grid gap-12 md:grid-cols-2 md:items-center">
          <SectionHeading
            eyebrow="Cómo comprar"
            title="Pedidos por WhatsApp"
            subtitle="El proceso es simple: elegís el libro, nos escribís por WhatsApp y coordinamos la entrega o el retiro en el campo."
          />
          <ol className="space-y-4">
            {pasosPedido.map((p, i) => (
              <li key={p.titulo} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-flandes-red font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-forest-dark">{p.titulo}</p>
                  <p className="text-sm text-forest/65">{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="container-flandes mt-10 flex flex-wrap gap-3">
          <a
            href={whatsappLink(
              "Hola! Quiero consultar sobre los libros disponibles en la librería del Campo Escuela Flandes."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <WhatsAppIcon width={18} height={18} />
            Consultar catálogo por WhatsApp
          </a>
          <Link href="/contacto" className="btn-outline">
            Otro medio de contacto
            <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </section>

      {/* ---- DONACIONES ---- */}
      <section className="container-flandes py-16">
        <div className="card flex flex-col gap-4 border-dashed sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest-pale text-forest">
              <BookIcon width={24} height={24} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold uppercase text-forest-dark">
                Donaciones de libros
              </h3>
              <p className="mt-1 text-sm text-forest/70">
                ¿Tenés libros scouts o de naturaleza que ya no usás? El campo acepta
                donaciones para enriquecer la librería y la biblioteca de socios.
              </p>
            </div>
          </div>
          <a
            href={whatsappLink(
              "Hola! Quiero consultar sobre la donación de libros para la librería del campo."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp shrink-0"
          >
            <WhatsAppIcon width={18} height={18} />
            Consultar
          </a>
        </div>
      </section>
    </>
  );
}


const pasosPedido = [
  {
    titulo: "Elegís el libro",
    desc: "Encontrá el título que te interesa en el catálogo de arriba.",
  },
  {
    titulo: "Nos escribís por WhatsApp",
    desc: "Hacé click en el botón \"Pedir\" del libro o escribinos directamente.",
  },
  {
    titulo: "Coordinamos la entrega",
    desc: "Retiro en el campo o consulta por envío. Confirmamos precio actualizado y disponibilidad.",
  },
  {
    titulo: "Pagás y retirás",
    desc: "Efectivo, transferencia u otros medios a confirmar al momento del pedido.",
  },
];
