import Link from "next/link";
import { loginSocioAction } from "./actions";
import { LockIcon, ArrowRightIcon } from "@/components/ui/icons";

export const metadata = { title: "Acceso socios — Campo Escuela Flandes" };

export default async function SociosLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-dark px-4">
      <div className="w-full max-w-sm">
        {/* Marca */}
        <div className="mb-8 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-forest-dark">
            <LockIcon width={26} height={26} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-white">
            Portal de socios
          </h1>
          <p className="mt-1 text-sm text-white/50">Campo Escuela Flandes</p>
        </div>

        {/* Formulario */}
        <form action={loginSocioAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-gold focus:bg-white/10 focus:ring-2 focus:ring-gold/30"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-gold focus:bg-white/10 focus:ring-2 focus:ring-gold/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-flandes-red/30 bg-flandes-red/10 px-4 py-2.5 text-sm text-flandes-red-light">
              Email o contraseña incorrectos.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95"
          >
            Ingresar al portal
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/socios"
            className="flex items-center justify-center gap-1 text-xs text-white/30 transition hover:text-white/60"
          >
            <ArrowRightIcon width={12} height={12} className="rotate-180" />
            Volver a la página de socios
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-white/20">
          ¿No tenés acceso? Contactá al campo para asociarte.
        </p>
      </div>
    </div>
  );
}
