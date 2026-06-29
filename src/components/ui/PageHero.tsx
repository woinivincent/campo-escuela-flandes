import TopoPattern from "@/components/ui/TopoPattern";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** Imagen de fondo opcional (ej: /images/institucional.jpg). */
  src?: string;
}

/** Encabezado oscuro estándar para páginas internas. */
export default function PageHero({
  title,
  subtitle,
  eyebrow = "Sección",
  src,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest-dark text-sand">
      <div className="absolute inset-0 bg-gradient-to-br from-forest-dark to-[#15331d]" />
      {src && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${src}')` }}
        />
      )}
      <TopoPattern className="absolute inset-0 h-full w-full text-gold/15" />
      <div className="container-flandes relative pb-14 pt-28 lg:pb-16 lg:pt-32">
        <p className="eyebrow text-gold-light">
          <span className="h-px w-8 bg-gold" />
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-sand/80">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
