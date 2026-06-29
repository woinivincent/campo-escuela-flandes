import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageFrame from "@/components/ui/ImageFrame";
import ContactoForm from "@/components/contacto/ContactoForm";
import {
  whatsappLink,
  mailtoLink,
  getDynamicContactConfig,
  getDynamicSocialConfig,
} from "@/lib/siteConfigService";
import {
  WhatsAppIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "Contacto",
  description:
    "Contactate con el Campo Escuela Flandes. WhatsApp, email, redes sociales y formulario de consulta.",
};

export default async function ContactoPage() {
  const contact = getDynamicContactConfig();
  const social = getDynamicSocialConfig();

  const canales = [
    {
      tipo: "WhatsApp",
      label: contact.whatsappDisplay,
      sub: "Lorem ipsum dolor sit amet",
      href: whatsappLink(),
      icon: WhatsAppIcon,
      external: true,
    },
    {
      tipo: "Email",
      label: contact.email,
      sub: "Lorem ipsum dolor sit amet",
      href: mailtoLink(),
      icon: MailIcon,
      external: false,
    },
    {
      tipo: "Ubicación",
      label: contact.location,
      sub: "Lorem ipsum dolor sit amet",
      href: "#ubicacion",
      icon: MapPinIcon,
      external: false,
    },
    {
      tipo: "Horario",
      label: "Lun a Sáb · 9 a 18 h",
      sub: "Lorem ipsum dolor sit amet",
      href: "#",
      icon: ClockIcon,
      external: false,
    },
  ];

  const redes = [
    { label: "Facebook", href: social.facebook, icon: FacebookIcon },
    { label: "Instagram", href: social.instagram, icon: InstagramIcon },
    { label: "YouTube", href: social.youtube, icon: YoutubeIcon },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Lorem ipsum dolor sit amet"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        src="/images/contacto-portada.jpg"
      />

      {/* ---- CANALES DE CONTACTO ---- */}
      <section className="border-b border-sand-dark bg-white">
        <div className="container-flandes grid gap-px bg-forest/10 sm:grid-cols-2 lg:grid-cols-4">
          {canales.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-3 bg-white px-6 py-8 transition hover:bg-forest-pale/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-pale text-forest transition group-hover:bg-flandes-red group-hover:text-white">
                <c.icon width={22} height={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest/50">
                  {c.tipo}
                </p>
                <p className="mt-0.5 font-display text-base font-bold text-forest-dark">
                  {c.label}
                </p>
                {c.sub && (
                  <p className="mt-0.5 text-xs text-forest/60">{c.sub}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ---- FORMULARIO + UBICACIÓN ---- */}
      <section className="container-flandes py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Formulario */}
          <div>
            <SectionHeading
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
              className="mb-8"
            />
            <ContactoForm waNumber={contact.whatsapp} />
          </div>

          {/* Info de ubicación */}
          <div className="space-y-8">
            <div>
              <SectionHeading
                eyebrow="Lorem ipsum"
                title="Lorem ipsum dolor sit amet"
                className="mb-6"
              />
              <ImageFrame
                src="/images/mapa-ubicacion.jpg"
                label="Mapa de ubicación — agregar imagen en public/images/mapa-ubicacion.jpg"
                className="aspect-[4/3] w-full"
              />
              <address className="mt-5 not-italic space-y-3">
                <div className="flex items-start gap-3 text-sm text-forest/80">
                  <MapPinIcon
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 text-flandes-red"
                  />
                  <div>
                    <p className="font-semibold text-forest-dark">Dirección</p>
                    <p>{contact.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-forest/80">
                  <ClockIcon
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 text-flandes-red"
                  />
                  <div>
                    <p className="font-semibold text-forest-dark">
                      Horario de atención
                    </p>
                    <p>Lunes a sábado de 9 a 18 h</p>
                    <p>Domingos con cita previa</p>
                  </div>
                </div>
              </address>
            </div>

            {/* Redes sociales */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-forest/50">
                Seguinos en redes
              </p>
              <div className="flex flex-wrap gap-3">
                {redes.map((r) => (
                  <a
                    key={r.label}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-sm font-semibold text-forest-dark transition hover:border-forest/30 hover:shadow-card"
                  >
                    <r.icon width={18} height={18} />
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA RESERVAS ---- */}
      <section className="bg-forest-pale/50 py-16">
        <div className="container-flandes flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase text-forest-dark">
              Lorem ipsum dolor sit amet?
            </h2>
            <p className="mt-1 text-sm text-forest/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <Link href="/reservas" className="btn-primary shrink-0">
            Ir a reservas
            <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
