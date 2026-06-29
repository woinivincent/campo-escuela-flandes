import TopoPattern from "@/components/ui/TopoPattern";

interface ImageFrameProps {
  /** Ruta de la imagen (ej: /images/predio.jpg). Si no existe, se ve el respaldo. */
  src?: string;
  /** Texto guía que se muestra sobre el respaldo mientras no haya foto. */
  label?: string;
  className?: string;
  rounded?: string;
}

/**
 * Marco de imagen con respaldo elegante.
 * El respaldo (degradé + topografía + etiqueta) se renderiza siempre como base;
 * si la foto existe queda por encima y lo tapa. Si la foto falta, se ve el
 * respaldo con el texto indicando qué imagen va ahí.
 */
export default function ImageFrame({
  src,
  label = "Foto del predio",
  className,
  rounded = "rounded-2xl",
}: ImageFrameProps) {
  return (
    <div
      className={`relative overflow-hidden ${rounded} bg-gradient-to-br from-forest to-forest-dark shadow-card ${className ?? ""}`}
    >
      {/* Base: respaldo con etiqueta */}
      <TopoPattern className="absolute inset-0 h-full w-full text-gold/15" />
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-wide text-sand/85 backdrop-blur">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.5-3.5L9 20" />
          </svg>
          {label}
        </span>
      </div>
      {/* Foto real (tapa el respaldo cuando existe) */}
      {src && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${src}')` }}
        />
      )}
    </div>
  );
}
