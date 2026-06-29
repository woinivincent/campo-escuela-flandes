import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getLibros, getLibro } from "@/lib/db";
import type { CategoriaLibro, Libro } from "@/lib/db";
import { saveLibroAction, deleteLibroAction } from "./actions";

export const metadata = { title: "Librería — Admin Flandes" };

const CATEGORIAS: CategoriaLibro[] = [
  "Escultismo",
  "Naturaleza",
  "Formación",
  "Literatura",
];

const catBadge: Record<CategoriaLibro, string> = {
  Escultismo: "bg-flandes-red/15 text-flandes-red",
  Naturaleza: "bg-[#1E4527]/20 text-forest-light",
  Formación: "bg-gold/15 text-gold-dark",
  Literatura: "bg-white/10 text-white/60",
};

export default async function AdminLibreriaPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  await requireAuth();

  const { edit, new: isNew } = await searchParams;
  const libros = getLibros();
  const editando = edit ? getLibro(edit) : undefined;
  const showForm = !!editando || isNew === "1";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Librería
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            {libros.length} libros ·{" "}
            {libros.filter((l) => l.disponible).length} disponibles
          </p>
        </div>
        {!showForm && (
          <Link
            href="/admin/libreria?new=1"
            className="rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark"
          >
            + Nuevo libro
          </Link>
        )}
      </div>

      {/* Formulario */}
      {showForm && <LibroForm libro={editando} />}

      {/* Lista */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {libros.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/30">
            No hay libros cargados.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Título / Autor
                </th>
                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40 sm:table-cell">
                  Categoría
                </th>
                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40 md:table-cell">
                  Precio
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Stock
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {libros.map((lib, i) => (
                <tr
                  key={lib.id}
                  className={`border-b border-white/5 transition hover:bg-white/5 ${
                    editando?.id === lib.id ? "bg-gold/5" : ""
                  } ${i === libros.length - 1 ? "border-0" : ""}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{lib.titulo}</p>
                    <p className="text-xs text-white/40">{lib.autor}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${catBadge[lib.categoria]}`}
                    >
                      {lib.categoria}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-white/60 md:table-cell">
                    ${lib.precio.toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        lib.disponible
                          ? "bg-forest/20 text-forest-light"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {lib.disponible ? "Disponible" : "Sin stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/libreria?edit=${lib.id}`}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/50 transition hover:border-white/25 hover:text-white"
                      >
                        Editar
                      </Link>
                      <form action={deleteLibroAction}>
                        <input type="hidden" name="id" value={lib.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-flandes-red/20 px-2.5 py-1 text-xs text-flandes-red/60 transition hover:border-flandes-red/40 hover:text-flandes-red"
                        >
                          Borrar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function LibroForm({ libro }: { libro?: Libro }) {
  const isEdit = !!libro;

  return (
    <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide text-gold">
          {isEdit ? "Editando libro" : "Nuevo libro"}
        </h2>
        <Link
          href="/admin/libreria"
          className="text-xs text-white/30 transition hover:text-white/60"
        >
          Cancelar ✕
        </Link>
      </div>

      <form action={saveLibroAction} className="grid gap-4 sm:grid-cols-2">
        {isEdit && <input type="hidden" name="id" value={libro.id} />}

        <div className="sm:col-span-2">
          <label className="field-label">Título *</label>
          <input
            name="titulo"
            type="text"
            required
            defaultValue={libro?.titulo}
            className="admin-input"
            placeholder="Ej: Escultismo para muchachos"
          />
        </div>

        <div>
          <label className="field-label">Autor *</label>
          <input
            name="autor"
            type="text"
            required
            defaultValue={libro?.autor}
            className="admin-input"
            placeholder="Ej: Robert Baden-Powell"
          />
        </div>

        <div>
          <label className="field-label">Categoría *</label>
          <select
            name="categoria"
            defaultValue={libro?.categoria ?? "Escultismo"}
            className="admin-input"
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Precio (ARS) *</label>
          <input
            name="precio"
            type="number"
            required
            min={0}
            defaultValue={libro?.precio ?? 0}
            className="admin-input"
            placeholder="Ej: 3500"
          />
        </div>

        <div className="flex items-center gap-3 self-end pb-2">
          <input
            id="disponible"
            name="disponible"
            type="checkbox"
            value="1"
            defaultChecked={libro ? libro.disponible : true}
            className="h-4 w-4 rounded accent-gold"
          />
          <label
            htmlFor="disponible"
            className="text-sm font-semibold text-white/70"
          >
            Disponible en stock
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="field-label">Descripción *</label>
          <textarea
            name="descripcion"
            required
            defaultValue={libro?.descripcion}
            rows={3}
            className="admin-input resize-none"
            placeholder="Descripción del libro..."
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95"
          >
            {isEdit ? "Guardar cambios" : "Agregar libro"}
          </button>
        </div>
      </form>
    </div>
  );
}
