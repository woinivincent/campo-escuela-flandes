import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "./login/actions";
import { CalendarIcon, BookIcon, GraduationIcon, ArrowRightIcon } from "@/components/ui/icons";

export const metadata = { title: { absolute: "Admin — Campo Escuela Flandes" } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await isAuthenticated();

  // Login page: render without shell
  if (!auth) {
    return <div className="min-h-screen bg-[#0f1a13]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f1a13] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1a13]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          {/* Brand */}
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-display text-sm font-bold uppercase tracking-wider text-gold"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold text-forest-dark text-xs font-bold">
              F
            </span>
            Admin Flandes
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <Link
              href="/admin/agenda"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <CalendarIcon width={14} height={14} />
              Agenda
            </Link>
            <Link
              href="/admin/libreria"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <BookIcon width={14} height={14} />
              Librería
            </Link>
            <Link
              href="/admin/cursos"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <GraduationIcon width={14} height={14} />
              Cursos
            </Link>
            <Link
              href="/admin/imagenes"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Imágenes
            </Link>
            <Link
              href="/admin/config"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Config
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-white/40 transition hover:text-white/60"
            >
              Ver sitio
              <ArrowRightIcon width={12} height={12} />
            </Link>
          </nav>

          {/* Logout */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:text-white/80"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
