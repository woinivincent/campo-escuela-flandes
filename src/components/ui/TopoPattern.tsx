/**
 * Patrón decorativo de curvas de nivel (estilo mapa topográfico).
 * Evoca el terreno del campo. Se usa como fondo sutil en secciones oscuras.
 */
interface TopoPatternProps {
  className?: string;
  color?: string;
}

export default function TopoPattern({
  className,
  color = "currentColor",
}: TopoPatternProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth="1.5" opacity="0.9">
        <path d="M-50 120C120 60 300 160 420 110S700 20 860 90" />
        <path d="M-50 170C120 110 300 210 420 160S700 70 860 140" />
        <path d="M-50 230C140 175 310 270 430 215S700 130 860 200" />
        <path d="M-50 300C160 250 320 330 450 280S710 200 860 270" />
        <path d="M-50 380C170 330 340 410 470 360S720 280 860 350" />
        <path d="M-50 460C180 410 360 490 490 440S730 360 860 430" />
        <path d="M-50 540C190 495 370 565 500 520S740 445 860 510" />
      </g>
      {/* Curvas cerradas (cumbres) */}
      <g stroke={color} strokeWidth="1.5" opacity="0.7">
        <ellipse cx="600" cy="230" rx="90" ry="55" transform="rotate(-18 600 230)" />
        <ellipse cx="600" cy="230" rx="58" ry="34" transform="rotate(-18 600 230)" />
        <ellipse cx="600" cy="230" rx="26" ry="15" transform="rotate(-18 600 230)" />
        <ellipse cx="180" cy="420" rx="70" ry="42" transform="rotate(12 180 420)" />
        <ellipse cx="180" cy="420" rx="40" ry="23" transform="rotate(12 180 420)" />
      </g>
    </svg>
  );
}
