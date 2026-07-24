import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getEspecies } from "@/lib/db";
import { getSiteSettings } from "@/lib/siteConfigService";
import { siteConfig } from "@/config/site";
import { qrDataUrl, especieQrUrl } from "@/lib/qr";

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

  const items = await Promise.all(
    especies.map(async (e) => ({
      especie: e,
      dataUrl: await qrDataUrl(especieQrUrl(siteUrl, e.id), 600),
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
        <div className="print-sheet grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map(({ especie, dataUrl }) => (
            <div
              key={especie.id}
              className="print-label flex flex-col items-center rounded-xl border border-black/15 bg-white p-4 text-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt={`Código QR de ${especie.nombreComun}`}
                className="w-full max-w-[150px]"
              />
              <p className="mt-3 font-display text-sm font-bold uppercase leading-tight tracking-tight text-black">
                {especie.nombreComun}
              </p>
              <p className="text-[0.7rem] italic text-black/55">
                {especie.nombreCientifico}
              </p>
              <p className="mt-2 border-t border-black/10 pt-2 text-[0.6rem] uppercase tracking-wider text-black/45">
                {siteConfig.shortName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
