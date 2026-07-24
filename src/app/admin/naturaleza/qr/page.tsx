import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getEspecies } from "@/lib/db";
import { getSiteSettings } from "@/lib/siteConfigService";
import { qrDataUrl, especieQrUrl, qrFileName } from "@/lib/qr";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata = { title: "Códigos QR — Admin Flandes" };

export default async function AdminQrPage() {
  await requireAuth();
  const { siteUrl } = await getSiteSettings();
  const especies = await getEspecies();

  // Genera todos los QR en paralelo
  const items = await Promise.all(
    especies.map(async (e) => {
      const url = especieQrUrl(siteUrl, e.id);
      return {
        especie: e,
        url,
        dataUrl: await qrDataUrl(url),
        fileName: qrFileName(e.nombreComun),
      };
    })
  );

  const conQr = items.filter((i) => i.especie.qrDisponible);
  const sinQr = items.filter((i) => !i.especie.qrDisponible);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Códigos QR
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            Cada QR abre la ficha de la especie. Descargalos o imprimí la planilla
            para señalizar el predio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/naturaleza"
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
          >
            Volver a especies <ArrowRightIcon width={12} height={12} />
          </Link>
          <Link
            href="/admin/naturaleza/qr/imprimir"
            target="_blank"
            className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark"
          >
            Imprimir planilla
          </Link>
        </div>
      </div>

      {/* Aviso de URL base */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
          Los QR apuntan a
        </p>
        <p className="mt-1 break-all font-mono text-sm text-gold">
          {siteUrl || "(sin configurar)"}/naturaleza/…
        </p>
        {!siteUrl ? (
          <p className="mt-2 text-xs text-flandes-red">
            Falta configurar la URL del sitio. Los QR no van a funcionar hasta que
            la cargues en{" "}
            <Link href="/admin/config" className="underline">
              Configuración
            </Link>
            .
          </p>
        ) : (
          <p className="mt-2 text-xs text-white/35">
            Si cambiás el dominio, actualizalo en{" "}
            <Link href="/admin/config" className="underline hover:text-white/60">
              Configuración
            </Link>{" "}
            y volvé a descargar los QR.
          </p>
        )}
      </div>

      {/* Grillas */}
      {[
        { label: "Señalizadas en el predio", list: conQr, empty: "Ninguna especie está marcada como “QR disponible”. Activá la opción al editar una especie." },
        { label: "Sin señalizar todavía", list: sinQr, empty: "Todas las especies están señalizadas." },
      ].map(({ label, list, empty }) => (
        <div key={label}>
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-white/50">
            {label}{" "}
            <span className="ml-1 text-white/25">({list.length})</span>
          </h2>

          {list.length === 0 ? (
            <p className="rounded-2xl border border-white/10 py-8 text-center text-sm text-white/30">
              {empty}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {list.map(({ especie, url, dataUrl, fileName }) => (
                <div
                  key={especie.id}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dataUrl}
                    alt={`Código QR de ${especie.nombreComun}`}
                    className="aspect-square w-full rounded-xl bg-white p-2"
                  />
                  <p className="mt-3 font-display text-sm font-bold uppercase tracking-tight text-white">
                    {especie.nombreComun}
                  </p>
                  <p className="text-xs italic text-white/40">
                    {especie.nombreCientifico}
                  </p>
                  <p className="mt-1 break-all text-[0.65rem] text-white/25">
                    {url}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <a
                      href={dataUrl}
                      download={fileName}
                      className="flex-1 rounded-lg border border-gold/30 px-3 py-1.5 text-center text-xs font-semibold text-gold transition hover:border-gold/60 hover:bg-gold/10"
                    >
                      Descargar
                    </a>
                    <Link
                      href={`/naturaleza/${especie.id}`}
                      target="_blank"
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:text-white/80"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
