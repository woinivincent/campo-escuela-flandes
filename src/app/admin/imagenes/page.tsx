import { GROUPS } from "./imageSlots";
import { getImageSlots } from "./slots";
import { imagenesExistentes } from "@/lib/imagenes";
import ImageUploadCard from "./ImageUploadCard";
import { requireAuth } from "@/lib/auth";

export const metadata = { title: "Imágenes — Admin" };

// El listado tiene que reflejar lo que se acaba de subir o quitar, sin caché.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminImagenesPage() {
  await requireAuth();
  const ts = Date.now();
  const [existing, slotsTodos] = await Promise.all([
    imagenesExistentes(),
    getImageSlots(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-gold">
          Imágenes del sitio
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Subí, reemplazá o quitá las imágenes de cada sección. Al seleccionar un archivo se sube automáticamente. Formato recomendado: JPG, máx. 10 MB.
        </p>
        <p className="mt-2 text-sm text-white/40">
          Las fotos de Flora, Fauna, Libros y Biblioteca aparecen solas cuando cargás
          una especie, un libro o un material. Las galerías crecen a medida que
          agregás: siempre queda un recuadro libre al final para sumar una más.
        </p>
      </div>

      <div className="space-y-10">
        {GROUPS.map((group) => {
          const slots = slotsTodos.filter((s) => s.group === group);
          if (slots.length === 0) return null;
          return (
            <section key={group}>
              <h2 className="mb-4 border-b border-white/10 pb-2 font-display text-sm font-bold uppercase tracking-widest text-white/40">
                {group}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {slots.map((slot) => (
                  <ImageUploadCard
                    key={slot.id}
                    slotId={slot.id}
                    label={slot.label}
                    desc={slot.desc}
                    exists={existing.has(slot.id)}
                    paraAgregar={slot.paraAgregar}
                    ts={ts}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
