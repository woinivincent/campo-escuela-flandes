import { IMAGE_SLOTS, GROUPS } from "./imageSlots";
import ImageUploadCard from "./ImageUploadCard";

export const metadata = { title: "Imágenes — Admin" };

async function getExistingSlots(): Promise<Set<string>> {
  if (process.env.NETLIFY) {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("site-images");
    const { blobs } = await store.list();
    return new Set(blobs.map((b) => b.key));
  }
  const { existsSync } = await import("fs");
  const { join } = await import("path");
  const found = new Set<string>();
  for (const slot of IMAGE_SLOTS) {
    if (existsSync(join(process.cwd(), "public", "images", `${slot.id}.jpg`))) {
      found.add(slot.id);
    }
  }
  return found;
}

export default async function AdminImagenesPage() {
  const ts = Date.now();
  const existing = await getExistingSlots();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-gold">
          Imágenes del sitio
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Subí o reemplazá las imágenes de cada sección. Al seleccionar un archivo se sube automáticamente. Formato recomendado: JPG, máx. 10 MB.
        </p>
      </div>

      <div className="space-y-10">
        {GROUPS.map((group) => {
          const slots = IMAGE_SLOTS.filter((s) => s.group === group);
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
