"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Datos planos: este componente es interactivo, así que no puede recibir
 * componentes de ícono desde el servidor (no son serializables).
 */
export interface PuntoSubcampo {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: string;
  servicios: string[];
  /** Posición sobre el mapa, en porcentaje del ancho y del alto. */
  x: number;
  y: number;
}

interface Props {
  subcampos: PuntoSubcampo[];
  /** Imagen del plano. Si todavía no se subió, se muestra el respaldo. */
  src?: string;
}

export default function MapaSubcampos({ subcampos, src = "/images/mapa-predio.jpg" }: Props) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const activo = subcampos.find((s) => s.id === seleccionado) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      {/* ---- Mapa ---- */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-forest/10 bg-forest-pale shadow-card"
        onKeyDown={(e) => {
          if (e.key === "Escape") setSeleccionado(null);
        }}
      >
        {/*
          La imagen define el alto de la caja, así las coordenadas en
          porcentaje caen siempre sobre el mismo punto del plano, sea
          apaisado o vertical. Con recorte (bg-cover) se desplazarían.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Plano del predio con la ubicación de los subcampos"
          className="block w-full"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
        {/* Respaldo cuando todavía no hay plano cargado */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex min-h-[18rem] items-center justify-center bg-gradient-to-br from-forest to-forest-dark">
          <span className="rounded-full bg-black/25 px-4 py-2 text-center text-xs uppercase tracking-wide text-sand/85">
            Subí el plano del predio desde el panel
          </span>
        </div>

        {/* Marcadores */}
        {subcampos.map((s, i) => {
          const esActivo = s.id === seleccionado;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSeleccionado(esActivo ? null : s.id)}
              aria-pressed={esActivo}
              aria-label={`Subcampo ${i + 1}: ${s.nombre}`}
              title={s.nombre}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 focus:outline-none focus-visible:scale-110"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span
                className={`flex items-center justify-center rounded-full font-display font-bold shadow-lg ring-4 transition-all ${
                  esActivo
                    ? "h-11 w-11 bg-gold text-forest-dark ring-gold/40"
                    : "h-9 w-9 bg-flandes-red text-white ring-white/70"
                }`}
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- Ficha ---- */}
      <div className="lg:sticky lg:top-24">
        {activo ? (
          <div className="card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-display text-xs font-bold uppercase tracking-widest text-gold-dark">
                  Subcampo {subcampos.findIndex((s) => s.id === activo.id) + 1}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-forest-dark">
                  {activo.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSeleccionado(null)}
                aria-label="Cerrar ficha"
                className="shrink-0 rounded-lg p-1 text-forest/40 transition hover:bg-forest-pale hover:text-forest-dark"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-forest/75">
              {activo.descripcion}
            </p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-forest/55">
              {activo.capacidad}
            </p>

            <ul className="mt-2 flex flex-wrap gap-1.5">
              {activo.servicios.map((srv) => (
                <li
                  key={srv}
                  className="rounded-full bg-forest-pale px-2.5 py-1 text-xs font-medium text-forest-dark"
                >
                  {srv}
                </li>
              ))}
            </ul>

            <Link href="/reservas" className="btn-primary mt-5 w-full text-sm">
              Reservar este subcampo
            </Link>
          </div>
        ) : (
          <div className="card border-dashed text-center">
            <p className="font-display text-base font-bold uppercase tracking-tight text-forest-dark">
              Tocá un número en el mapa
            </p>
            <p className="mt-1.5 text-sm text-forest/65">
              Vas a ver la capacidad y los servicios de cada subcampo.
            </p>
            <ul className="mt-5 space-y-2 text-left">
              {subcampos.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSeleccionado(s.id)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-forest/75 transition hover:bg-forest-pale"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-flandes-red font-display text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {s.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
