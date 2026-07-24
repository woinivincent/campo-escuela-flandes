import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { siteConfig } from "@/config/site";
import { getHitos } from "@/lib/db";
// siteConfig used for website footer only
import { getSiteSettings } from "@/lib/siteConfigService";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Institucional",
  description:
    "Historia del Campo Escuela Flandes, galería de recuerdos, hitos y redes sociales.",
};

export default async function InstitucionalPage() {
  const hitos = await getHitos();
  const { social } = await getSiteSettings();
  const redes = [
    { label: "Facebook",  href: social.facebook,  icon: FacebookIcon },
    { label: "Instagram", href: social.instagram, icon: InstagramIcon },
    { label: "YouTube",   href: social.youtube,   icon: YoutubeIcon },
  ];
  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title="Nuestra historia"
        subtitle="De dónde viene el campo, quiénes lo sostienen y cómo llegó hasta hoy."
        src="/images/institucional-portada.jpg"
      />

      {/* ---------- HISTORIA ---------- */}
      <section className="container-flandes py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Institucional"
              title="Cómo nació el campo"
            />
            <div className="mt-5 space-y-4 leading-relaxed text-forest/85">
              <p>
                Acá va la historia del campo: cómo se consiguió el predio, en qué
                año empezó a funcionar y quiénes impulsaron el proyecto.
              </p>
              <p>
                Un segundo párrafo puede contar cómo fue creciendo, las obras que
                se hicieron y qué lugar ocupa hoy dentro del escultismo.
              </p>
            </div>
          </div>
          <ImageFrame
            src="/images/historia.jpg"
            label="Foto histórica del campo"
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* ---------- HITOS / LÍNEA DE TIEMPO ---------- */}
      <section className="bg-forest-pale/50 py-20">
        <div className="container-flandes">
          <SectionHeading
            align="center"
            eyebrow="Línea de tiempo"
            title="Los hitos del campo"
            className="mb-12"
          />
          <ol className="relative mx-auto max-w-3xl border-l-2 border-gold/40 pl-8">
            {hitos.map((h) => (
              <li key={h.id} className="relative mb-8 last:mb-0">
                <span className="absolute -left-[2.6rem] flex h-7 w-7 items-center justify-center rounded-full bg-flandes-red text-[0.7rem] font-bold text-white ring-4 ring-forest-pale/50">
                  ●
                </span>
                <span className="font-display text-2xl font-bold text-flandes-red">
                  {h.anio}
                </span>
                <p className="mt-1 text-forest/85">{h.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- GALERÍA DE RECUERDOS ---------- */}
      <section className="container-flandes py-20">
        <SectionHeading
          align="center"
          eyebrow="Galería"
          title="Recuerdos del campo"
          subtitle="Fotos de campamentos, obras y actividades a lo largo de los años."
          className="mb-12"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ImageFrame
              key={i}
              src={`/images/galeria-${i + 1}.jpg`}
              label={`Recuerdo ${i + 1}`}
              className={`w-full ${i % 5 === 0 ? "aspect-square sm:row-span-2 sm:aspect-[3/4]" : "aspect-square"}`}
            />
          ))}
        </div>
      </section>

      {/* ---------- REDES SOCIALES ---------- */}
      <section className="container-flandes pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-forest-dark px-8 py-14 text-center text-sand">
          <SectionHeading
            align="center"
            tone="dark"
            eyebrow="Redes"
            title="Seguinos"
            subtitle="Ahí publicamos las novedades, las fechas y las fotos de cada acampe."
            className="mb-8"
          />
          <div className="flex flex-wrap justify-center gap-4">
            {redes.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <r.icon width={24} height={24} />
                {r.label}
              </a>
            ))}
          </div>
          <p className="mt-8 text-sm text-sand/70">{siteConfig.website}</p>
        </div>

        <div className="mt-10 text-center">
          <Link href="/contacto" className="btn-primary">
            ¿Tenés una consulta? Escribinos
            <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

