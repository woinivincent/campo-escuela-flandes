"use client";

import { useActionState, useMemo, useState } from "react";
import { importarPadronAction, type ResultadoImport } from "./actions";
import { parseCsv } from "@/lib/csv";
import {
  revisarFilas,
  adivinarColumna,
  MOTIVOS,
  MAX_FILAS,
  type FilaPadron,
} from "@/lib/padron";

const MAX_PREVIA = 8;

export default function ImportarPadron({ emailsExistentes }: { emailsExistentes: string[] }) {
  const [abierto, setAbierto] = useState(false);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [encabezados, setEncabezados] = useState<string[]>([]);
  const [filasCrudas, setFilasCrudas] = useState<string[][]>([]);
  const [colNombre, setColNombre] = useState(-1);
  const [colEmail, setColEmail] = useState(-1);
  const [errorLectura, setErrorLectura] = useState("");

  const [resultado, enviar, enviando] = useActionState<ResultadoImport | null, FormData>(
    importarPadronAction,
    null
  );

  const yaExisten = useMemo(
    () => new Set(emailsExistentes.map((e) => e.toLowerCase())),
    [emailsExistentes]
  );

  /** Las filas de la planilla llevadas a nombre/email según el mapeo elegido. */
  const filas: FilaPadron[] = useMemo(() => {
    if (colNombre < 0 || colEmail < 0) return [];
    return filasCrudas.map((f) => ({
      nombre: f[colNombre] ?? "",
      email: f[colEmail] ?? "",
    }));
  }, [filasCrudas, colNombre, colEmail]);

  const revisadas = useMemo(() => revisarFilas(filas, yaExisten), [filas, yaExisten]);
  const entran = revisadas.filter((r) => r.estado === "ok");
  const quedanAfuera = revisadas.filter((r) => r.estado !== "ok");

  async function alElegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setErrorLectura("");
    setNombreArchivo(archivo.name);

    try {
      const texto = await archivo.text();
      const { encabezados: heads, filas: fs } = parseCsv(texto);
      if (heads.length === 0 || fs.length === 0) {
        setErrorLectura("El archivo no tiene filas de datos debajo del encabezado.");
        setEncabezados([]);
        setFilasCrudas([]);
        return;
      }
      setEncabezados(heads);
      setFilasCrudas(fs);
      setColNombre(adivinarColumna(heads, "nombre"));
      setColEmail(adivinarColumna(heads, "email"));
    } catch {
      setErrorLectura("No se pudo leer el archivo. ¿Es un CSV?");
    }
  }

  function limpiar() {
    setNombreArchivo("");
    setEncabezados([]);
    setFilasCrudas([]);
    setColNombre(-1);
    setColEmail(-1);
    setErrorLectura("");
  }

  // ── Resultado de una importación terminada ────────────────────────────────
  if (resultado) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-gold/70">
          Importación terminada
        </h2>
        <p className="mt-2 text-sm text-white/70">{resultado.mensaje}</p>

        {resultado.importados.length > 0 && (
          <>
            <div className="mt-5 rounded-xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-sm text-white/70">
              <strong className="text-gold-light">Estas claves se muestran una sola vez.</strong>{" "}
              Copiálas ahora y mandáselas a cada socio; después no se pueden volver a ver, solo
              cambiar una por una.
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-white/40">
                    <th className="py-2 pr-4">Nombre</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2">Clave inicial</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  {resultado.importados.map((s) => (
                    <tr key={s.email} className="border-t border-white/5">
                      <td className="py-2 pr-4">{s.nombre}</td>
                      <td className="py-2 pr-4 text-white/60">{s.email}</td>
                      <td className="py-2 font-mono text-gold-light">{s.clave}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(
                  resultado.importados
                    .map((s) => `${s.nombre}\t${s.email}\t${s.clave}`)
                    .join("\n")
                )
              }
              className="mt-4 rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-gold/40 hover:text-gold"
            >
              Copiar la tabla
            </button>
          </>
        )}

        {resultado.omitidos.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
              Quedaron afuera {resultado.omitidos.length}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/60">
              {resultado.omitidos.map((o, i) => (
                <li key={i}>
                  {o.nombre || <em className="text-white/30">sin nombre</em>}{" "}
                  <span className="text-white/40">{o.email}</span> —{" "}
                  <span className="text-flandes-red-light">{MOTIVOS[o.estado]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-xs text-white/30">
          Recargá la página para volver a importar. La lista de socios ya está actualizada.
        </p>
      </div>
    );
  }

  // ── Botón cerrado ─────────────────────────────────────────────────────────
  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-gold/40 hover:text-gold"
      >
        Importar padrón
      </button>
    );
  }

  // ── Formulario ────────────────────────────────────────────────────────────
  return (
    <form action={enviar} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-gold/70">
            Importar padrón
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Un archivo CSV. Desde Excel: <em>Guardar como → CSV UTF-8</em>. Hasta {MAX_FILAS} filas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            limpiar();
            setAbierto(false);
          }}
          className="text-xs text-white/40 transition hover:text-white/70"
        >
          Cancelar
        </button>
      </div>

      <input
        type="file"
        accept=".csv,text/csv"
        onChange={alElegirArchivo}
        className="mt-5 block w-full text-sm text-white/60 file:mr-4 file:rounded-xl file:border-0 file:bg-gold file:px-4 file:py-2 file:font-display file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-forest-dark hover:file:bg-gold-dark"
      />

      {errorLectura && (
        <p className="mt-3 rounded-xl border border-flandes-red/30 bg-flandes-red/10 px-4 py-2.5 text-sm text-flandes-red-light">
          {errorLectura}
        </p>
      )}

      {encabezados.length > 0 && (
        <>
          <p className="mt-4 text-xs text-white/40">
            {nombreArchivo} · {filasCrudas.length} filas · {encabezados.length} columnas
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Columna con el nombre</label>
              <select
                value={colNombre}
                onChange={(e) => setColNombre(Number(e.target.value))}
                className="admin-input"
              >
                <option value={-1}>Elegir…</option>
                {encabezados.map((h, i) => (
                  <option key={i} value={i}>
                    {h || `Columna ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Columna con el email</label>
              <select
                value={colEmail}
                onChange={(e) => setColEmail(Number(e.target.value))}
                className="admin-input"
              >
                <option value={-1}>Elegir…</option>
                {encabezados.map((h, i) => (
                  <option key={i} value={i}>
                    {h || `Columna ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {colNombre >= 0 && colEmail >= 0 && (
            <>
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <span className="text-white/70">
                  Entran <strong className="text-gold">{entran.length}</strong>
                </span>
                {quedanAfuera.length > 0 && (
                  <span className="text-white/70">
                    Quedan afuera{" "}
                    <strong className="text-flandes-red-light">{quedanAfuera.length}</strong>
                  </span>
                )}
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-white/40">
                      <th className="py-2 pr-4">Nombre</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    {revisadas.slice(0, MAX_PREVIA).map((r, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-2 pr-4">
                          {r.fila.nombre || <em className="text-white/30">—</em>}
                        </td>
                        <td className="py-2 pr-4 text-white/60">
                          {r.fila.email || <em className="text-white/30">—</em>}
                        </td>
                        <td
                          className={`py-2 ${
                            r.estado === "ok" ? "text-white/40" : "text-flandes-red-light"
                          }`}
                        >
                          {MOTIVOS[r.estado]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {revisadas.length > MAX_PREVIA && (
                  <p className="mt-2 text-xs text-white/30">
                    y {revisadas.length - MAX_PREVIA} filas más
                  </p>
                )}
              </div>

              <input type="hidden" name="filas" value={JSON.stringify(filas)} />

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <p className="text-xs text-white/30">
                  A cada socio se le genera una clave inicial, que vas a ver una sola vez.
                </p>
                <button
                  type="submit"
                  disabled={entran.length === 0 || enviando}
                  className="rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {enviando ? "Importando…" : `Importar ${entran.length}`}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </form>
  );
}
