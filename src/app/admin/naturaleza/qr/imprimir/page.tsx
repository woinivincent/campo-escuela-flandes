import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getEspecies } from "@/lib/db";
import { getSiteSettings } from "@/lib/siteConfigService";
import { siteConfig } from "@/config/site";
import { especieQrUrl, fichaQrSvg, FICHA } from "@/lib/qr";

export const metadata = { title: "Planilla de QR — Admin Flandes" };

export default async function ImprimirQrPage({
  searchParams,
}: {
  searchParams: Promise<{ todas?: string }>;
}) {
  await requireAuth();
  const { todas } = await searchParams;
  const { siteUrl } = await getSiteSettings();

  const especies = (await getEspecies()).filter(
    (e) => todas === "1" || e.qrDisponible
  );

  // La misma ficha que se descarga desde el panel, para que lo impreso y lo
  // descargado sean exactamente lo mismo.
  const items = await Promise.all(
    especies.map(async (e) => ({
      especie: e,
      svg: await fichaQrSvg(e, especieQrUrl(siteUrl, e.id), siteConfig.shortName),
    }))
  );

  return (
    <div className="bg-white text-black">
      {/* Barra de acciones — no se imprime */}
      <div className="print-hide mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
            Planilla para imprimir
          </p>
          <p className="mt-0.5 text-xs text-white/40">
            {items.length} etiqueta{items.length === 1 ? "" : "s"} ·{" "}
            {todas === "1"
              ? "todas las especies"
              : "solo las marcadas como señalizadas"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={
              todas === "1"
                ? "/admin/naturaleza/qr/imprimir"
                : "/admin/naturaleza/qr/imprimir?todas=1"
            }
            className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:text-white"
          >
            {todas === "1" ? "Ver solo señalizadas" : "Incluir todas"}
          </Link>
          <Link
            href="/admin/naturaleza/qr"
            className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:text-white"
          >
            Volver
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="print-hide rounded-2xl border border-white/10 py-10 text-center text-sm text-white/30">
          No hay especies marcadas como señalizadas. Activá “QR disponible en el
          predio” al editar una especie, o{" "}
          <Link
            href="/admin/naturaleza/qr/imprimir?todas=1"
            className="text-gold underline"
          >
            imprimí todas
          </Link>
          .
        </p>
      ) : (
        <div className="print-sheet flex flex-wrap justify-center gap-2">
          {items.map(({ especie, svg }) => (
            <div
              key={especie.id}
              className="print-label"
              style={{ width: `${FICHA.ancho}mm`, height: `${FICHA.alto}mm` }}
              // La ficha ya es un SVG completo y armado en el servidor: acá solo
              // se inserta. El contenido no viene de afuera, sale del catálogo.
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
