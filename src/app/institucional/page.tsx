import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import { siteConfig } from "@/config/site";
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

export default function InstitucionalPage() {
  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title="Lorem ipsum dolor sit amet"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        src="/images/institucional-portada.jpg"
      />

      {/* ---------- HISTORIA ---------- */}
      <section className="container-flandes py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
            />
            <div className="mt-5 space-y-4 leading-relaxed text-forest/85">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat duis aute irure dolor.
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
            eyebrow="Lorem ipsum"
            title="Lorem ipsum dolor sit amet"
            className="mb-12"
          />
          <ol className="relative mx-auto max-w-3xl border-l-2 border-gold/40 pl-8">
            {hitos.map((h) => (
              <li key={h.anio} className="relative mb-8 last:mb-0">
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
          eyebrow="Lorem ipsum"
          title="Lorem ipsum dolor sit amet"
          subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
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
            eyebrow="Lorem ipsum"
            title="Lorem ipsum dolor sit amet"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
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

const hitos = [
  { anio: "1980s", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { anio: "1990s", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { anio: "2000s", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { anio: "Hoy", texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];

const redes = [
  { label: "Facebook", href: siteConfig.social.facebook, icon: FacebookIcon },
  { label: "Instagram", href: siteConfig.social.instagram, icon: InstagramIcon },
  { label: "YouTube", href: siteConfig.social.youtube, icon: YoutubeIcon },
];
