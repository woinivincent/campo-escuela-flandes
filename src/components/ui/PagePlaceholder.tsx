import Link from "next/link";
import TopoPattern from "@/components/ui/TopoPattern";
import { ArrowRightIcon } from "@/components/ui/icons";

interface PagePlaceholderProps {
  title: string;
  modulo: string;
  description: string;
}

/**
 * Placeholder de sección en construcción.
 * Se reemplaza por el contenido real en el módulo correspondiente.
 */
export default function PagePlaceholder({
  title,
  modulo,
  description,
}: PagePlaceholderProps) {
  return (
    <>
      {/* Encabezado de sección */}
      <section className="relative overflow-hidden bg-forest-dark text-sand">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-dark to-[#15331d]" />
        <TopoPattern className="absolute inset-0 h-full w-full text-gold/15" />
        <div className="container-flandes relative pb-16 pt-28 lg:pb-20 lg:pt-32">
          <p className="eyebrow text-gold-light">
            <span className="h-px w-8 bg-gold" />
            Sección
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-sand/80">{description}</p>
        </div>
      </section>

      {/* Estado */}
      <section className="container-flandes py-16">
        <div className="card flex flex-col items-start gap-4 border-dashed">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold-dark">
            En desarrollo — {modulo}
          </span>
          <p className="max-w-xl text-forest/80">
            Esta sección está siendo construida y se habilitará próximamente.
            Mientras tanto, podés volver al inicio o contactarnos directamente.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn-outline">
              Volver al inicio
            </Link>
            <Link href="/contacto" className="btn-primary">
              Contacto
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
