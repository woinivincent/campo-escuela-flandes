interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Sello del Campo Escuela "Flandes".
 *
 * Es el logo original, recortado del cartel de bienvenida del predio y
 * recortado con máscara elíptica para que quede sin fondo. Se sirve por
 * /images, así que puede reemplazarse desde el panel (espacio "logo-flandes")
 * si aparece una versión mejor.
 */
export default function Logo({ size = 44, className }: LogoProps) {
  // Proporción del sello: alto ≈ 1,34 × ancho
  const alto = Math.round((size * 536) / 400);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-flandes.png"
      alt='Campo Escuela "Flandes" — Campo de ejercicios Scouts'
      width={size}
      height={alto}
      className={className}
      style={{ width: size, height: alto }}
    />
  );
}
