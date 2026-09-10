import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getAllTextos } from "@/lib/db";
import { PAGINAS_TEXTOS, claveTexto, type PaginaTextos } from "@/config/textos";
import { saveTextosAction } from "./actions";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata = { title: "Textos — Admin Flandes" };

function FormularioPagina({
  pagina,
  guardados,
}: {
  pagina: PaginaTextos;
  guardados: Record<string, string>;
}) {
  return (
    <form
      action={saveTextosAction}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <input type="hidden" name="pagina" value={pagina.id} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-gold/70">
          {pagina.nombre}
        </h2>
        <Link
          href={pagina.ruta}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-gold"
        >
          Ver la página
          <ArrowRightIcon width={13} height={13} />
        </Link>
      </div>

      <div className="space-y-5">
        {pagina.campos.map((campo) => {
          const guardado = guardados[claveTexto(pagina.id, campo.clave)] ?? "";
          const editado = guardado.trim() !== "";

          return (
            <div key={campo.clave}>
              <label htmlFor={`${pagina.id}-${campo.clave}`} className="field-label">
                {campo.etiqueta}
                {editado && (
                  <span className="ml-2 rounded bg-gold/15 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-gold/80">
                    editado
                  </span>
                )}
              </label>

              {campo.tipo === "parrafo" ? (
                <textarea
                  id={`${pagina.id}-${campo.clave}`}
                  name={campo.clave}
                  rows={3}
                  defaultValue={guardado}
                  placeholder={campo.valor}
                  className="admin-input resize-y"
                />
              ) : (
                <input
                  id={`${pagina.id}-${campo.clave}`}
                  name={campo.clave}
                  type="text"
                  defaultValue={guardado}
                  placeholder={campo.valor}
                  className="admin-input"
                />
              )}

              <p className="mt-1 text-xs text-white/30">
                {campo.ayuda ? `${campo.ayuda} ` : ""}
                {editado
                  ? "Borrá el campo para volver al texto original."
                  : "Vacío: se muestra el texto original, el que aparece en gris."}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
        <button
          type="submit"
          className="rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95"
        >
          Guardar {pagina.nombre}
        </button>
      </div>
    </form>
  );
}

export default async function AdminTextosPage() {
  await requireAuth();
  const guardados = await getAllTextos();

  const editados = PAGINAS_TEXTOS.reduce(
    (total, p) =>
      total +
      p.campos.filter(
        (c) => (guardados[claveTexto(p.id, c.clave)] ?? "").trim() !== ""
      ).length,
    0
  );
  const totalCampos = PAGINAS_TEXTOS.reduce((n, p) => n + p.campos.length, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
          Textos del sitio
        </h1>
        <p className="mt-0.5 text-sm text-white/40">
          Títulos y textos principales de cada página. {editados} de {totalCampos}{" "}
          campos editados; el resto muestra el texto original.
        </p>
      </div>

      <div className="rounded-2xl border border-gold/20 bg-gold/[0.06] px-5 py-4 text-sm text-white/60">
        Cada página se guarda por separado. El texto en gris de cada campo es el
        original: si dejás el campo vacío, es ese el que se ve en el sitio.
      </div>

      <div className="space-y-6">
        {PAGINAS_TEXTOS.map((pagina) => (
          <FormularioPagina
            key={pagina.id}
            pagina={pagina}
            guardados={guardados}
          />
        ))}
      </div>
    </div>
  );
}
