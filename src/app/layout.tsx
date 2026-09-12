import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { siteConfig, URL_SITIO } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  // Sin esto, las URLs relativas de canónicas e imágenes no se resuelven y
  // Next avisa en cada build.
  metadataBase: new URL(URL_SITIO),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // La canónica le dice a Google cuál es la dirección oficial de cada página.
  // Importa acá porque el sitio responde en dos dominios —el .org y el de
  // Netlify— y sin canónica los buscadores los tratan como contenido duplicado.
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    // Sin url: puesta acá valía para todas las páginas, y al compartir una ficha
    // la vista previa decía que era la home. Las redes toman la URL real.
    siteName: "Campo Escuela Flandes",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/images/hero-campo.jpg", width: 1920, height: 1200 }],
  },
};

/**
 * Datos estructurados de la organización.
 *
 * El campo ya tiene ficha en Google Maps, Facebook e Instagram. `sameAs` le
 * dice a Google que este sitio es de la misma entidad, que es la forma de que
 * empiece a asociarlo con esa ficha en vez de tratarlo como un sitio suelto.
 */
const DATOS_ORGANIZACION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Campo Escuela Flandes",
  alternateName: "Campo de Ejercicios Scouts Flandes",
  url: URL_SITIO,
  logo: `${URL_SITIO}/images/logo-flandes.png`,
  foundingDate: "1958",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jáuregui",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  sameAs: [
    "https://www.facebook.com/Campo.Escuela.Flande",
    "https://www.instagram.com/campoescuela",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const isSocioPortal = pathname.startsWith("/socios/portal") || pathname.startsWith("/socios/login");

  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <script
          type="application/ld+json"
          // Contenido fijo armado en el código, sin nada que venga del usuario.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(DATOS_ORGANIZACION) }}
        />
        {!isAdmin && !isSocioPortal && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isAdmin && !isSocioPortal && <Footer />}
        {!isAdmin && !isSocioPortal && <WhatsAppFloat />}
      </body>
    </html>
  );
}
