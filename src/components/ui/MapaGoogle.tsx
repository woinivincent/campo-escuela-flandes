interface Props {
  lat: string;
  lng: string;
  /** "k" satélite · "h" satélite con nombres de calles · "m" mapa común. */
  vista?: "k" | "h" | "m";
  zoom?: number;
  titulo?: string;
  className?: string;
}

/**
 * Mapa de Google embebido.
 *
 * Usa el endpoint clásico de embed, que no necesita clave de API — con la
 * Embed API oficial habría que crear y pagar una clave de Google Cloud.
 * Se carga en diferido para no penalizar la carga de la página.
 */
export default function MapaGoogle({
  lat,
  lng,
  vista = "k",
  zoom = 17,
  titulo = "Ubicación del Campo Escuela Flandes",
  className,
}: Props) {
  const src =
    `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}` +
    `&t=${vista}&z=${zoom}&hl=es&output=embed`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-forest/10 bg-forest-pale shadow-card ${className ?? ""}`}
    >
      <iframe
        src={src}
        title={titulo}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block h-full w-full border-0"
      />
    </div>
  );
}
