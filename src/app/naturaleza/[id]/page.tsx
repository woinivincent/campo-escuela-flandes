import Link from "next/link";
import { notFound } from "next/navigation";
import ImageFrame from "@/components/ui/ImageFrame";
import { getEspecie, getEspecies } from "@/lib/db";
import { getSiteSettings } from "@/lib/siteConfigService";
import {
  LeafIcon,
  QrIcon,
  ArrowRightIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const especie = await getEspecie(id);
  if (!especie) return { title: "Especie no encontrada" };
  return {
    title: especie.nombreComun,
    description: `${especie.nombreComun} (${especie.nombreCientifico}) — ficha de la ${especie.categoria.toLowerCase()} del Campo Escuela Flandes.`,
  };
}

export default async function EspeciePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cfg = await getSiteSettings();
  const especie = await getEspecie(id);
  if (!especie) notFound();

  const relacionadas = (await getEspecies())
    .filter((e) => e.categoria === especie.categoria && e.id !== especie.id)
    .slice(0, 3);

  return (
    <>
      {/* ---- CABECERA ---- */}
      <section className="border-b border-sand-dark bg-forest-dark py-6">
        <div className="container-flandes">
          <Link
            href="/naturaleza"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sand/60 transition hover:text-gold"
          >
            <span className="rotate-180">
              <ArrowRightIcon width={13} height={13} />
            </span>
            Volver a naturaleza
          </Link>
        </div>
      </section>

      {/* ---- FICHA ---- */}
      <section className="container-flandes py-8 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-8 sm:grid-cols-[1fr_1.2fr] sm:items-start">
            <ImageFrame
              src={`/images/especie-${especie.id}.jpg`}
              label={`Foto de ${especie.nombreComun}`}
              className="aspect-square w-full"
            />

            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  especie.categoria === "Flora"
                    ? "bg-forest-pale text-forest"
                    : "bg-gold/15 text-gold-dark"
                }`}
              >
                {especie.categoria}
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-forest-dark sm:text-4xl">
                {especie.nombreComun}
              </h1>
              <p className="mt-1 text-base italic text-forest/50">
                {especie.nombreCientifico}
              </p>

              {especie.qrDisponible && (
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-flandes-red/10 px-3 py-1.5 text-xs font-semibold text-flandes-red">
                  <QrIcon width={14} height={14} />
                  Señalizada con QR en el predio
                </span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-10 space-y-6">
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-gold-dark">
                Sobre la especie
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-forest/85">
                {especie.descripcion}
              </p>
            </div>

            <div className="rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-gold-dark">
                  <LeafIcon width={18} height={18} />
                </span>
                <div>
                  <p className="font-display text-xs font-bold uppercase tracking-wide text-forest-dark">
                    ¿Sabías que…?
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-forest/80">
                    {especie.curiosidad}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Relacionadas */}
          {relacionadas.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-forest/45">
                Otras especies de {especie.categoria.toLowerCase()}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {relacionadas.map((r) => (
                  <Link
                    key={r.id}
                    href={`/naturaleza/${r.id}`}
                    className="card card-hover group !p-4"
                  >
                    <p className="font-display text-sm font-bold uppercase tracking-tight text-forest-dark group-hover:text-flandes-red">
                      {r.nombreComun}
                    </p>
                    <p className="mt-0.5 text-xs italic text-forest/45">
                      {r.nombreCientifico}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 flex flex-wrap gap-3 border-t border-forest/10 pt-8">
            <Link href="/naturaleza" className="btn-forest">
              Ver todas las especies
              <ArrowRightIcon width={18} height={18} />
            </Link>
            <a
              href={cfg.whatsappLink(
                `Hola! Quiero consultar sobre ${especie.nombreComun} en el Campo Escuela Flandes.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
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
