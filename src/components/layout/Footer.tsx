import Link from "next/link";
import { mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import {
  whatsappLink,
  mailtoLink,
  getDynamicContactConfig,
  getDynamicSocialConfig,
} from "@/lib/siteConfigService";
import Logo from "@/components/ui/Logo";

export default async function Footer() {
  const contact = getDynamicContactConfig();
  const social = getDynamicSocialConfig();
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
            {siteConfig.contact.location}
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
            Secciones
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.slice(1).map((item) => (
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
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gold">
            Contacto
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand/80 hover:text-gold-light"
              >
                WhatsApp: {contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={mailtoLink()}
                className="text-sand/80 hover:text-gold-light"
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
        <div className="container-flandes flex items-center justify-between gap-4">
          <p className="text-xs text-sand/60">
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
            reservados.
          </p>
          <Link
            href="/admin"
            className="text-xs text-sand/25 transition hover:text-sand/50"
          >
            Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
