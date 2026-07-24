import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { verificarBlobs } from "@/lib/blobs";
import {
  getEventos, getLibros, getCursos, getHitos,
  getEspecies, getSocios, getRecursosSocios, getAllConfigValues,
} from "@/lib/db";

export const metadata = { title: "Diagnóstico — Admin Flandes" };
export const dynamic = "force-dynamic";

export default async function DiagnosticoPage() {
  await requireAuth();

  const datos = await verificarBlobs("site-data");
  const imagenes = await verificarBlobs("site-images");

  const conteos = await Promise.all([
    getEventos().then((r) => ["Eventos", r.length] as const),
    getLibros().then((r) => ["Libros", r.length] as const),
    getCursos().then((r) => ["Cursos", r.length] as const),
    getHitos().then((r) => ["Hitos", r.length] as const),
    getEspecies().then((r) => ["Especies", r.length] as const),
    getSocios().then((r) => ["Socios", r.length] as const),
    getRecursosSocios().then((r) => ["Recursos del portal", r.length] as const),
    getAllConfigValues().then((r) => ["Claves de configuración", Object.keys(r).length] as const),
  ]);

  const todoOk = datos.ok && imagenes.ok;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
          Diagnóstico
        </h1>
        <p className="mt-0.5 text-sm text-white/40">
          Estado del almacenamiento del sitio. Si algo falla al guardar, la causa aparece acá.
        </p>
      </div>

      {/* Resumen */}
      <div
        className={`rounded-2xl border p-6 ${
          todoOk
            ? "border-forest-light/30 bg-forest-light/10"
            : "border-flandes-red/40 bg-flandes-red/10"
        }`}
      >
        <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
          {todoOk ? "Todo funcionando" : "Hay un problema de almacenamiento"}
        </p>
        <p className="mt-1 text-sm text-white/60">
          {todoOk
            ? "El sitio puede guardar contenido e imágenes con normalidad."
            : "Los cambios que hagas desde el panel no se van a poder guardar. El detalle está abajo."}
        </p>
      </div>

      {/* Estado de cada almacén */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Contenido del sitio", desc: "Eventos, libros, especies, socios y configuración", estado: datos },
          { label: "Imágenes", desc: "Fotos subidas desde el panel", estado: imagenes },
        ].map((x) => (
          <div key={x.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                {x.label}
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  x.estado.ok
                    ? "bg-forest-light/20 text-forest-light"
                    : "bg-flandes-red/20 text-flandes-red"
                }`}
              >
                {x.estado.ok ? "OK" : "Falla"}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/35">{x.desc}</p>
            {x.estado.error && (
              <p className="mt-3 break-words rounded-lg bg-black/30 p-3 font-mono text-[0.7rem] leading-relaxed text-flandes-red">
                {x.estado.error}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Conteos */}
      <div>
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-white/50">
          Contenido cargado
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <tbody>
              {conteos.map(([label, n]) => (
                <tr key={label} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-2.5 text-white/70">{label}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-white">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-white/30">
          Mientras no guardes nada, estos números corresponden a los datos de ejemplo.
        </p>
      </div>

      <Link href="/admin" className="inline-block text-xs text-white/40 hover:text-white/70">
        Volver al panel
      </Link>
    </div>
  );
}
