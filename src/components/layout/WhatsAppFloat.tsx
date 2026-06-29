import { whatsappLink } from "@/lib/siteConfigService";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Botón flotante de WhatsApp, presente en todo el sitio. */
export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(
        "Hola! Me comunico desde el sitio del Campo Escuela Flandes.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 ring-[#25D366]/20 transition hover:scale-105 hover:bg-[#1da851]"
    >
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}
