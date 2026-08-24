"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, esGrupo } from "@/config/nav";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /** Etiqueta del desplegable abierto en escritorio, o null si no hay ninguno. */
  const [menu, setMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const isHome = pathname === "/";
  // En home, la barra es transparente sobre el hero hasta hacer scroll.
  const transparent = isHome && !scrolled && !open && !menu;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Al cambiar de página se cierra todo lo que haya quedado abierto.
  useEffect(() => {
    setMenu(null);
    setOpen(false);
  }, [pathname]);

  // Cerrar el desplegable al hacer clic afuera o con Escape.
  useEffect(() => {
    if (!menu) return;
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const enlaceClase = (activo: boolean) =>
    `rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
      transparent
        ? activo
          ? "text-gold-light"
          : "text-white/90 hover:text-gold-light"
        : activo
          ? "text-flandes-red"
          : "text-forest-dark hover:text-flandes-red"
    }`;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        transparent
          ? "bg-transparent"
          : "border-b border-sand-dark bg-sand/95 shadow-sm backdrop-blur"
      }`}
    >
      <nav
        ref={navRef}
        className="container-flandes flex h-16 items-center justify-between lg:h-[72px]"
      >
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

        {/* Navegación escritorio */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {mainNav.map((entrada) => {
            if (!esGrupo(entrada)) {
              return (
                <li key={entrada.href}>
                  <Link href={entrada.href} className={enlaceClase(isActive(entrada.href))}>
                    {entrada.label}
                  </Link>
                </li>
              );
            }

            const algunoActivo = entrada.items.some((i) => isActive(i.href));
            const abierto = menu === entrada.label;

            return (
              <li key={entrada.label} className="relative">
                <button
                  type="button"
                  onClick={() => setMenu(abierto ? null : entrada.label)}
                  aria-expanded={abierto}
                  aria-haspopup="true"
                  className={`${enlaceClase(algunoActivo || abierto)} inline-flex items-center gap-1`}
                >
                  {entrada.label}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${abierto ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {abierto && (
                  <ul className="absolute right-0 top-full z-50 mt-1 min-w-[13rem] overflow-hidden rounded-xl border border-forest/10 bg-white py-1.5 shadow-card-hover">
                    {entrada.items.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className={`block px-4 py-2.5 text-sm font-medium transition ${
                            isActive(sub.href)
                              ? "bg-forest-pale text-flandes-red"
                              : "text-forest-dark hover:bg-forest-pale/60"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
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

      {/* Navegación mobile — en vertical hay lugar, así que se listan todos */}
      {open && (
        <ul className="container-flandes flex flex-col gap-1 border-t border-sand-dark bg-sand pb-4 pt-2 lg:hidden">
          {mainNav.map((entrada) => {
            if (!esGrupo(entrada)) {
              return (
                <li key={entrada.href}>
                  <Link
                    href={entrada.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wide ${
                      isActive(entrada.href)
                        ? "bg-forest-pale text-forest-dark"
                        : "text-forest-dark hover:bg-forest-pale"
                    }`}
                  >
                    {entrada.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={entrada.label} className="mt-2">
                <p className="px-3 pb-1 text-[0.65rem] font-bold uppercase tracking-widest text-forest/40">
                  {entrada.label}
                </p>
                <ul className="flex flex-col gap-1">
                  {entrada.items.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wide ${
                          isActive(sub.href)
                            ? "bg-forest-pale text-forest-dark"
                            : "text-forest-dark hover:bg-forest-pale"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
          <li className="mt-3">
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
