interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

/** Encabezado de sección reutilizable (eyebrow + título + subtítulo). */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className ?? ""}`}
    >
      {eyebrow && (
        <p
          className={`eyebrow mb-3 ${
            tone === "dark" ? "text-gold-light" : "text-flandes-red"
          } ${centered ? "justify-center" : ""}`}
        >
          {centered && <span className="h-px w-8 bg-current opacity-60" />}
          {eyebrow}
        </p>
      )}
      <h2
        className={`section-title ${
          tone === "dark" ? "!text-white" : ""
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 leading-relaxed ${
            tone === "dark" ? "text-sand/80" : "text-forest/80"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
