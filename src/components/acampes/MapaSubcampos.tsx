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
  /** Pares etiqueta/valor: capacidad, acceso, fogón, agua. Solo texto. */
  caracteristicas: { label: string; valor: string }[];
  servicios: string[];
}

interface Props {
  subcampos: PuntoSubcampo[];
}

/**
 * Geometría de cada subcampo, trazada siguiendo el plano del predio.
 * Es una ilustración: respeta las posiciones y los límites relativos,
 * sin pretender ser un relevamiento a escala.
 */
const ZONAS: Record<
  string,
  {
    d: string;
    tinte: string;
    etiqueta: [number, number];
    arboles: string;
    /** Copas: [x, y, radio] dentro de la zona. */
    copas: [number, number, number][];
  }
> = {
  "1": {
    d: "M 186 62 L 640 56 Q 652 58 654 70 L 664 286 Q 664 298 652 299 L 200 306 Q 188 306 188 294 Z",
    tinte: "#cfe4c4",
    etiqueta: [420, 168],
    arboles: "Álamos · Araucarias · Eucaliptos",
    copas: [
      [246, 118, 19], [300, 96, 14], [352, 132, 16], [470, 104, 18],
      [530, 138, 14], [592, 108, 16], [268, 208, 15], [340, 248, 13],
      [556, 226, 17], [612, 254, 13], [458, 262, 15], [214, 268, 12],
    ],
  },
  "2": {
    d: "M 188 306 L 516 300 Q 528 300 528 312 L 534 690 Q 534 700 528 708 L 442 878 Q 436 890 424 889 L 180 872 Q 168 871 169 859 Z",
    tinte: "#bcd8b0",
    etiqueta: [332, 520],
    arboles: "Robles y Álamos",
    copas: [
      [226, 366, 18], [292, 404, 15], [366, 358, 17], [446, 396, 14],
      [212, 466, 14], [286, 512, 19], [400, 476, 16], [478, 520, 13],
      [232, 596, 17], [318, 632, 15], [420, 604, 18], [486, 648, 12],
      [246, 716, 16], [330, 760, 14], [396, 700, 13], [268, 822, 15],
    ],
  },
  "3": {
    d: "M 528 300 L 700 296 Q 712 296 713 308 L 722 536 Q 722 548 710 548 L 536 552 Q 526 552 526 542 Z",
    tinte: "#dbeacf",
    etiqueta: [618, 396],
    arboles: "",
    copas: [
      [566, 340, 14], [636, 324, 12], [686, 366, 15],
      [578, 452, 16], [654, 470, 13], [700, 500, 11], [606, 512, 12],
    ],
  },
  "4": {
    d: "M 526 552 L 710 548 Q 722 548 723 560 L 744 850 Q 745 862 733 864 L 448 886 Q 436 887 440 876 L 528 706 Q 532 698 530 688 Z",
    tinte: "#c6dfba",
    etiqueta: [608, 706],
    arboles: "Robles · Cipreses",
    copas: [
      [566, 606, 15], [648, 588, 13], [706, 632, 16],
      [582, 700, 14], [668, 716, 17], [716, 762, 12],
      [532, 790, 13], [618, 812, 15], [694, 838, 12],
    ],
  },
};

/** Arbolito: copa en dos tonos y tronco. */
function Arbol({ x, y, r, oscuro }: { x: number; y: number; r: number; oscuro: boolean }) {
  const verde = oscuro ? "#4a7c52" : "#5d9465";
  const luz = oscuro ? "#5d9465" : "#79ad7d";
  return (
    <g>
      <rect x={x - r * 0.1} y={y + r * 0.5} width={r * 0.2} height={r * 0.62} fill="#8a6f4e" rx={r * 0.08} />
      <circle cx={x} cy={y} r={r} fill={verde} />
      <circle cx={x - r * 0.28} cy={y - r * 0.26} r={r * 0.6} fill={luz} />
    </g>
  );
}

export default function MapaSubcampos({ subcampos }: Props) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const activo = subcampos.find((s) => s.id === seleccionado) ?? null;
  const indiceActivo = activo ? subcampos.findIndex((s) => s.id === activo.id) + 1 : 0;

  const alternar = (id: string) =>
    setSeleccionado((actual) => (actual === id ? null : id));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      {/* ---- Ilustración ---- */}
      <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-forest/10 bg-[#f6f3e9] shadow-card">
        <svg
          viewBox="0 0 800 940"
          className="block h-auto w-full"
          role="img"
          aria-label="Plano del Campo Escuela Flandes con sus cuatro subcampos"
          onKeyDown={(e) => {
            if (e.key === "Escape") setSeleccionado(null);
          }}
        >
          <defs>
            <filter id="sombraZona" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1E4527" floodOpacity="0.18" />
            </filter>
            {/* Textura suave de pasto */}
            <pattern id="pasto" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M4 14 l2 -5 M10 16 l1.5 -6 M15 13 l2 -4" stroke="#1E4527" strokeOpacity="0.07" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </pattern>
          </defs>

          {/* Manzanas vecinas, para dar contexto al este */}
          <g opacity="0.5">
            <rect x="752" y="250" width="46" height="120" rx="5" fill="#e0dccf" />
            <rect x="752" y="392" width="46" height="150" rx="5" fill="#e0dccf" />
            <rect x="752" y="566" width="46" height="180" rx="5" fill="#e0dccf" />
          </g>

          {/* Río Luján */}
          <path
            d="M 108 -20 C 62 170 130 310 80 462 C 40 604 120 736 70 898 C 42 986 80 1000 80 1000"
            fill="none" stroke="#93bacb" strokeWidth="66" strokeLinecap="round"
          />
          <path
            d="M 108 -20 C 62 170 130 310 80 462 C 40 604 120 736 70 898 C 42 986 80 1000 80 1000"
            fill="none" stroke="#b3d3de" strokeWidth="40" strokeLinecap="round"
          />
          <path
            d="M 100 60 C 70 200 128 320 86 470 M 96 620 C 70 700 108 790 78 880"
            fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round"
          />
          <text
            x="46" y="486" transform="rotate(-90 46 486)" textAnchor="middle"
            className="fill-[#4a6d7c] text-[15px] font-semibold tracking-wide"
          >
            Río Luján
          </text>

          {/* Calles */}
          <text x="420" y="30" textAnchor="middle" className="fill-forest/40 text-[13px]">
            Acceso a Algodonera Flandria
          </text>
          <text
            x="742" y="480" transform="rotate(90 742 480)" textAnchor="middle"
            className="fill-forest/40 text-[13px]"
          >
            Calle San Martín
          </text>

          {/* Zonas */}
          {subcampos.map((s, i) => {
            const z = ZONAS[s.id];
            if (!z) return null;
            const esActivo = s.id === seleccionado;
            const [lx, ly] = z.etiqueta;
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
                className="cursor-pointer outline-none [&:focus-visible>path]:stroke-gold-dark"
              >
                <path
                  d={z.d}
                  fill={esActivo ? "#F2B705" : z.tinte}
                  fillOpacity={esActivo ? 0.9 : 1}
                  stroke={esActivo ? "#C99404" : "#ffffff"}
                  strokeWidth={esActivo ? 4 : 3}
                  filter="url(#sombraZona)"
                  className="transition-all duration-200"
                />
                <path d={z.d} fill="url(#pasto)" className="pointer-events-none" />

                {/* Arboleda */}
                <g className="pointer-events-none" opacity={esActivo ? 0.55 : 0.95}>
                  {z.copas.map(([cx, cy, r], k) => (
                    <Arbol key={k} x={cx} y={cy} r={r} oscuro={k % 3 === 0} />
                  ))}
                </g>

                {/* Etiqueta */}
                <g className="pointer-events-none">
                  <circle
                    cx={lx} cy={ly - 40} r="21"
                    fill={esActivo ? "#1E4527" : "#D52B1E"}
                    stroke="#ffffff" strokeWidth="3"
                  />
                  <text x={lx} y={ly - 32} textAnchor="middle" className="fill-white text-[20px] font-bold">
                    {i + 1}
                  </text>
                  <text
                    x={lx} y={ly + 2} textAnchor="middle"
                    className="fill-forest-dark text-[18px] font-bold"
                    style={{ paintOrder: "stroke", stroke: "#ffffff", strokeWidth: 4 }}
                  >
                    {s.nombre}
                  </text>
                  {z.arboles && (
                    <text
                      x={lx} y={ly + 23} textAnchor="middle"
                      className="fill-forest/60 text-[12px]"
                      style={{ paintOrder: "stroke", stroke: "#ffffff", strokeWidth: 3 }}
                    >
                      {z.arboles}
                    </text>
                  )}
                </g>
              </g>
            );
          })}

          {/* Entrada */}
          <g className="pointer-events-none">
            <path d="M 205 900 L 205 872" stroke="#D52B1E" strokeWidth="3" strokeDasharray="5 4" />
            <circle cx="205" cy="906" r="12" fill="#D52B1E" stroke="#ffffff" strokeWidth="3" />
            <text
              x="228" y="912" className="fill-forest-dark text-[14px] font-bold"
              style={{ paintOrder: "stroke", stroke: "#f6f3e9", strokeWidth: 4 }}
            >
              Entrada
            </text>
          </g>
        </svg>
      </div>

      {/* ---- Ficha ---- */}
      <div className="lg:sticky lg:top-24">
        {activo ? (
          <div className="card overflow-hidden !p-0">
            {/* Foto del subcampo */}
            <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-forest to-forest-dark">
              {/* Respaldo visible mientras el subcampo no tenga foto cargada */}
              <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs uppercase tracking-wide text-sand/70">
                Foto de {activo.nombre}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/subcampo-${activo.id}.jpg`}
                alt={`Foto del subcampo ${activo.nombre}`}
                className="relative h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                }}
              />
              <span className="pointer-events-none absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-flandes-red font-display text-sm font-bold text-white ring-4 ring-white/40">
                {indiceActivo}
              </span>
              <button
                type="button"
                onClick={() => setSeleccionado(null)}
                aria-label="Cerrar ficha"
                className="absolute right-3 top-3 rounded-lg bg-black/35 p-1.5 text-white backdrop-blur transition hover:bg-black/55"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-forest-dark">
                {activo.nombre}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-forest/75">
                {activo.descripcion}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-y border-forest/10 py-4">
                {activo.caracteristicas.map((c) => (
                  <div key={c.label}>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-forest/45">
                      {c.label}
                    </dt>
                    <dd className="text-sm font-medium text-forest-dark">{c.valor}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-wide text-forest/45">
                Servicios
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {activo.servicios.map((srv) => (
                  <li key={srv} className="rounded-full bg-forest-pale px-2.5 py-1 text-xs font-medium text-forest-dark">
                    {srv}
                  </li>
                ))}
              </ul>

              <Link href="/reservas" className="btn-primary mt-5 w-full text-sm">
                Reservar este subcampo
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <p className="font-display text-base font-bold uppercase tracking-tight text-forest-dark">
              Elegí un subcampo
            </p>
            <p className="mt-1.5 text-sm text-forest/65">
              Tocá una zona del plano, o elegilo de la lista, para ver su foto,
              capacidad y servicios.
            </p>
            <ul className="mt-5 space-y-1.5">
              {subcampos.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSeleccionado(s.id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm font-medium text-forest-dark transition hover:border-forest/15 hover:bg-forest-pale"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-flandes-red font-display text-xs font-bold text-white">
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
