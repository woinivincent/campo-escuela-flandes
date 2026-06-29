import { loginAction } from "./actions";
import { LockIcon } from "@/components/ui/icons";

export const metadata = { title: "Acceso — Admin Flandes" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
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
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-white/50">Campo Escuela Flandes</p>
        </div>

        {/* Formulario */}
        <form action={loginAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none ring-0 transition focus:border-gold focus:bg-white/10 focus:ring-2 focus:ring-gold/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-flandes-red/30 bg-flandes-red/10 px-4 py-2.5 text-sm text-flandes-red-light">
              Contraseña incorrecta. Intentá de nuevo.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/25">
          Contraseña por defecto:{" "}
          <code className="text-white/40">flandes2024</code>
          <br />
          Cambiala con la variable de entorno{" "}
          <code className="text-white/40">ADMIN_PASSWORD</code>
        </p>
      </div>
    </div>
  );
}
