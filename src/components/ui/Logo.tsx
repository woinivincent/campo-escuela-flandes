interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 44, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={(size * 76) / 56}
      viewBox="0 0 56 76"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Anillo dorado exterior */}
      <ellipse cx="28" cy="38" rx="27" ry="37" fill="#F2B705" />
      <ellipse cx="28" cy="38" rx="27" ry="37" stroke="#1E4527" strokeWidth="1.5" />
      {/* Aro rojo */}
      <ellipse cx="28" cy="38" rx="21.5" ry="30" fill="#D52B1E" />
      {/* Centro rojo más oscuro */}
      <ellipse cx="28" cy="38" rx="18" ry="26" fill="#B91C13" />
      {/* Llama / flor de lis estilizada (dorado) */}
      <g fill="#F2B705">
        <path d="M28 18c-1.6 3-1.4 6.2-.2 9.1.5 1.2.4 2.1-.2 2.7-1-1.6-2.4-3.4-4.6-4.3 1.3 3 1.6 5.9 1.5 8.5-.05 1.3.4 2.2 1.3 2.7v9.2c0 1.6 1 2.4 2.2 2.4s2.2-.8 2.2-2.4v-9.2c.9-.5 1.35-1.4 1.3-2.7-.1-2.6.2-5.5 1.5-8.5-2.2.9-3.6 2.7-4.6 4.3-.6-.6-.7-1.5-.2-2.7 1.2-2.9 1.4-6.1-.2-9.1Z" />
        {/* Aspa / X */}
        <path d="M19 52.5l4.2-2.4L28 55l4.8-4.9 4.2 2.4-5.7 5.8 5.7 5.8-4.2 2.4L28 61.6l-4.8 4.9-4.2-2.4 5.7-5.8-5.7-5.8Z" />
      </g>
    </svg>
  );
}
