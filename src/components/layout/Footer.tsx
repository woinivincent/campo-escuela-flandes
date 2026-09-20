import Link from "next/link";
import { allNavLinks } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/siteConfigService";
import Logo from "@/components/ui/Logo";

/**
 * Crédito de quien desarrolló el sitio.
 *
 * Vive acá y no en el panel a propósito: es un dato del desarrollo, no del
 * campo, y no tiene por qué poder editarlo quien administra el contenido.
 * Si la dirección queda vacía, el nombre se muestra igual pero sin enlace.
 */
const ESTUDIO = "Atlas Soluciones Tecnológicas";
const SITIO_DEL_ESTUDIO: string = "";

export default async function Footer() {
  const contact = await getSiteSettings();
  const social = contact.social;
  return (
    <footer className="mt-20 bg-forest-dark text-sand">
      <div className="container-flandes grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <span className="font-display font-bold">{siteConfig.name}</span>
          </div>
          <p className="mt-4 text-sm text-sand/80">{siteConfig.tagline}</p>
          <p className="mt-2 text-sm text-sand/60">
            {contact.location}
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
            Secciones
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {allNavLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sand/80 hover:text-gold-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="min-w-0">
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
            Contacto
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={contact.whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand/80 hover:text-gold-light"
              >
                WhatsApp: {contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={contact.mailtoLink()}
                className="break-words text-sand/80 hover:text-gold-light"
              >
                {contact.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Redes */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
            Seguinos
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand/80 hover:text-gold-light"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand/80 hover:text-gold-light"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand/80 hover:text-gold-light"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="container-flandes flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-xs text-sand/60">
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-5">
            <p className="text-xs text-sand/45">
              Desarrollado por{" "}
              {SITIO_DEL_ESTUDIO ? (
                <a
                  href={SITIO_DEL_ESTUDIO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sand/75 transition hover:text-gold-light"
                >
                  {ESTUDIO}
                </a>
              ) : (
                <span className="font-semibold text-sand/75">{ESTUDIO}</span>
              )}
            </p>
            <Link
              href="/admin"
              className="text-xs text-sand/25 transition hover:text-sand/50"
            >
              Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
