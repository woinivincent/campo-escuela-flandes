"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  // En home, la barra es transparente sobre el hero hasta hacer scroll.
  const transparent = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        transparent
          ? "bg-transparent"
          : "border-b border-sand-dark bg-sand/95 shadow-sm backdrop-blur"
      }`}
    >
      <nav className="container-flandes flex h-16 items-center justify-between lg:h-[72px]">
        {/* Logo / marca */}
        <Link href="/" className="flex flex-none items-center gap-2">
          <Logo size={44} className="shrink-0" />
          <span
            className={`hidden whitespace-nowrap font-display text-sm font-bold uppercase tracking-wide sm:block ${
              transparent ? "text-white" : "text-forest-dark"
            }`}
          >
            Campo Escuela Flandes
          </span>
        </Link>

        {/* Navegación desktop */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-lg px-2.5 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  transparent
                    ? isActive(item.href)
                      ? "text-gold-light"
                      : "text-white/90 hover:text-gold-light"
                    : isActive(item.href)
                      ? "text-flandes-red"
                      : "text-forest-dark hover:text-flandes-red"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/socios" className="btn-primary ml-2 px-4 py-2 text-sm">
              Socios
            </Link>
          </li>
        </ul>

        {/* Botón menú mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`rounded-lg p-2 lg:hidden ${
            transparent ? "text-white" : "text-forest-dark"
          }`}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Navegación mobile */}
      {open && (
        <ul className="container-flandes flex flex-col gap-1 border-t border-sand-dark bg-sand pb-4 pt-2 lg:hidden">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wide ${
                  isActive(item.href)
                    ? "bg-forest-pale text-forest-dark"
                    : "text-forest-dark hover:bg-forest-pale"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-2">
            <Link
              href="/socios"
              onClick={() => setOpen(false)}
              className="btn-primary w-full"
            >
              Acceso socios
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
