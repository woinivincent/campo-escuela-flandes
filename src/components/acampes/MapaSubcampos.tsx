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
}

interface Props {
  subcampos: PuntoSubcampo[];
}

/**
 * Geometría de cada subcampo, trazada a partir del plano del predio.
 * Es una ilustración: respeta las posiciones relativas y los límites reales,
 * sin pretender ser un relevamiento a escala.
 */
const FORMAS: Record<
  string,
  { poly: string; etiqueta: [number, number]; arboles: string }
> = {
  "1": {
    poly: "185,55 645,50 660,292 190,300",
    etiqueta: [420, 165],
    arboles: "Álamos · Araucarias · Eucaliptos",
  },
  "2": {
    poly: "190,300 520,296 528,700 432,890 172,868",
    etiqueta: [335, 545],
    arboles: "Robles y Álamos",
  },
  "3": {
    poly: "520,296 705,296 718,543 528,548",
    etiqueta: [615, 405],
    arboles: "",
  },
  "4": {
    poly: "528,548 718,543 742,862 432,890 528,700",
    etiqueta: [600, 710],
    arboles: "Robles · Cipreses",
  },
};

/** Manchas de arboleda, para dar textura sin cargar la ilustración. */
const ARBOLES: [number, number, number][] = [
  [250, 120, 16], [320, 200, 12], [480, 110, 14], [560, 210, 11], [390, 250, 13],
  [230, 380, 15], [300, 470, 12], [420, 400, 14], [250, 620, 13], [360, 700, 15],
  [440, 560, 11], [300, 790, 12], [210, 720, 10],
  [580, 350, 13], [660, 460, 11], [600, 480, 9],
  [580, 620, 14], [660, 700, 12], [700, 800, 13], [520, 800, 11], [620, 840, 10],
];

export default function MapaSubcampos({ subcampos }: Props) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const activo = subcampos.find((s) => s.id === seleccionado) ?? null;

  const alternar = (id: string) =>
    setSeleccionado((actual) => (actual === id ? null : id));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      {/* ---- Ilustración ---- */}
      <div className="overflow-hidden rounded-2xl border border-forest/10 bg-[#eef3ea] shadow-card">
        <svg
          viewBox="0 0 800 1000"
          className="block h-auto w-full"
          role="img"
          aria-label="Plano del Campo Escuela Flandes con sus cuatro subcampos"
          onKeyDown={(e) => {
            if (e.key === "Escape") setSeleccionado(null);
          }}
        >
          {/* Río Luján */}
          <path
            d="M 105 -20 C 60 160 128 300 78 450 C 38 590 118 720 68 880 C 40 970 78 1020 78 1020"
            fill="none"
            stroke="#8fb8c9"
            strokeWidth="58"
            strokeLinecap="round"
          />
          <path
            d="M 105 -20 C 60 160 128 300 78 450 C 38 590 118 720 68 880 C 40 970 78 1020 78 1020"
            fill="none"
            stroke="#a9cbd8"
            strokeWidth="34"
            strokeLinecap="round"
          />
          <text
            x="52" y="470"
            transform="rotate(-90 52 470)"
            textAnchor="middle"
            className="fill-[#4c6f7d] text-[15px] font-semibold"
          >
            Río Luján
          </text>

          {/* Calles */}
          <text x="415" y="28" textAnchor="middle" className="fill-forest/45 text-[13px]">
            Acceso a Algodonera Flandria
          </text>
          <text
            x="772" y="470"
            transform="rotate(90 772 470)"
            textAnchor="middle"
            className="fill-forest/45 text-[13px]"
          >
            Calle San Martín
          </text>

          {/* Subcampos */}
          {subcampos.map((s, i) => {
            const forma = FORMAS[s.id];
            if (!forma) return null;
            const esActivo = s.id === seleccionado;
            const [lx, ly] = forma.etiqueta;
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-pressed={esActivo}
                aria-label={`Subcampo ${s.nombre}`}
                onClick={() => alternar(s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    alternar(s.id);
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <polygon
                  points={forma.poly}
                  className={`transition-all ${
                    esActivo
                      ? "fill-gold/70 stroke-gold-dark"
                      : "fill-forest-light/35 stroke-forest/40 hover:fill-forest-light/60"
                  }`}
                  strokeWidth={esActivo ? 4 : 2}
                />
                {/* Número */}
                <circle
                  cx={lx} cy={ly - 34} r="19"
                  className={esActivo ? "fill-forest-dark" : "fill-flandes-red"}
                />
                <text
                  x={lx} y={ly - 27}
                  textAnchor="middle"
                  className="fill-white text-[19px] font-bold"
                >
                  {i + 1}
                </text>
                {/* Nombre */}
                <text
                  x={lx} y={ly + 4}
                  textAnchor="middle"
                  className="fill-forest-dark text-[17px] font-bold"
                >
                  {s.nombre}
                </text>
                {forma.arboles && (
                  <text
                    x={lx} y={ly + 24}
                    textAnchor="middle"
                    className="fill-forest/55 text-[12px]"
                  >
                    {forma.arboles}
                  </text>
                )}
              </g>
            );
          })}

          {/* Arboleda decorativa, por encima del relleno pero sin bloquear el clic */}
          <g className="pointer-events-none" opacity="0.28">
            {ARBOLES.map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} className="fill-forest" />
            ))}
          </g>

          {/* Entrada */}
          <g className="pointer-events-none">
            <circle cx="205" cy="905" r="11" className="fill-flandes-red" />
            <circle cx="205" cy="905" r="5" className="fill-white" />
            <text x="228" y="911" className="fill-forest-dark text-[14px] font-semibold">
              Entrada
            </text>
          </g>
        </svg>
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
              Tocá un subcampo en el plano
            </p>
            <p className="mt-1.5 text-sm text-forest/65">
              Vas a ver la capacidad y los servicios de cada uno.
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
