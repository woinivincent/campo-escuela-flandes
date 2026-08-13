import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { getSiteSettings } from "@/lib/siteConfigService";
import { getMateriales, type MaterialBiblioteca } from "@/lib/db";
import {
  BookIcon,
  PlayIcon,
  WhatsAppIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  InfoIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Biblioteca",
  description:
    "Biblioteca del Campo Escuela Flandes: el Bordón digital, material para descargar y libros para consultar en el campo.",
};

/** Saca el identificador de YouTube de un enlace, para poder mostrar la miniatura. */
function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default async function BibliotecaPage() {
  const cfg = await getSiteSettings();
  const materiales = await getMateriales(true);

  const bordon = materiales.filter((m) => m.tipo === "Bordón");
  const digital = materiales.filter((m) => m.tipo === "Digital");
  const fisico = materiales.filter((m) => m.tipo === "Físico");

  return (
    <>
      <PageHero
        eyebrow="Biblioteca"
        title="Biblioteca del campo"
        subtitle="El Bordón digital, material para descargar y libros para consultar en el predio."
        src="/images/biblioteca-portada.jpg"
      />

      {/* ---- BORDÓN DIGITAL ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          eyebrow="Bordón digital"
          title="Las ediciones del Bordón"
          subtitle="El boletín del campo, en video. Se abren en el canal de YouTube."
          className="mb-10"
        />

        {bordon.length === 0 ? (
          <p className="py-8 text-center text-sm text-forest/50">
            Todavía no hay ediciones cargadas.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bordon.map((m) => {
              const vid = youtubeId(m.url);
              return (
                <a
                  key={m.id}
                  href={m.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <ImageFrame
                      src={vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : undefined}
                      label={m.titulo}
                      rounded="rounded-none"
                      className="h-full w-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-flandes-red text-white shadow-lg">
                        <PlayIcon width={22} height={22} />
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold uppercase leading-tight tracking-tight text-forest-dark group-hover:text-flandes-red">
                      {m.titulo}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-forest/60">
                      {m.descripcion}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* ---- MATERIAL DIGITAL ---- */}
      <section className="bg-forest-pale/50 py-20">
        <div className="container-flandes">
          <SectionHeading
            eyebrow="Para descargar"
            title="Material digital"
            subtitle="Documentos y guías disponibles para todos."
            className="mb-10"
          />

          {digital.length === 0 ? (
            <p className="rounded-2xl border border-forest/10 bg-white py-10 text-center text-sm text-forest/50">
              Todavía no hay material digital cargado.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {digital.map((m) => (
                <li key={m.id}>
                  <MaterialCard material={m} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---- LIBROS PARA CONSULTAR ---- */}
      <section className="container-flandes py-20">
        <SectionHeading
          eyebrow="En el campo"
          title="Libros para consultar"
          subtitle="Material disponible para leer o pedir prestado durante tu estadía."
          className="mb-10"
        />

        {fisico.length === 0 ? (
          <p className="rounded-2xl border border-forest/10 py-10 text-center text-sm text-forest/50">
            Todavía no hay libros cargados en el catálogo.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fisico.map((m) => (
              <li key={m.id}>
                <MaterialCard material={m} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4">
          <InfoIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-dark" />
          <p className="text-sm leading-relaxed text-forest-dark">
            <strong>¿Buscás comprar un libro?</strong>{" "}
            La <Link href="/libreria" className="font-semibold underline underline-offset-2">librería del campo</Link>{" "}
            tiene material scout y de naturaleza a la venta.
          </p>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="bg-sand-dark/40 py-16">
        <div className="container-flandes flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase text-forest-dark">
              ¿Necesitás material que no está acá?
            </h2>
            <p className="mt-1 text-sm text-forest/70">
              Escribinos y vemos si lo tenemos disponible en el campo.
            </p>
          </div>
          <a
            href={cfg.whatsappLink(
              "Hola! Quiero consultar por material de la biblioteca del Campo Escuela Flandes."
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

function MaterialCard({ material }: { material: MaterialBiblioteca }) {
  const tieneEnlace = material.url.trim() !== "";
  const contenido = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-pale text-forest">
        <BookIcon width={22} height={22} />
      </span>
      <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-forest-dark">
        {material.titulo}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-forest/70">
        {material.descripcion}
      </p>
      {tieneEnlace ? (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-flandes-red">
          Abrir
          <ExternalLinkIcon width={14} height={14} />
        </span>
      ) : (
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-forest/45">
          Disponible en el campo
        </span>
      )}
    </>
  );

  if (!tieneEnlace) {
    return <div className="card flex h-full flex-col">{contenido}</div>;
  }
  return (
    <a
      href={material.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-hover flex h-full flex-col"
    >
      {contenido}
    </a>
  );
}
