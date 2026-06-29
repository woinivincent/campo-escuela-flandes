import { existsSync } from "fs";
import path from "path";
import { IMAGE_SLOTS, GROUPS } from "./imageSlots";
import ImageUploadCard from "./ImageUploadCard";

export const metadata = { title: "Imágenes — Admin" };

export default function AdminImagenesPage() {
  const ts = Date.now();

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
                {slots.map((slot) => {
                  const exists = existsSync(
                    path.join(process.cwd(), "public", "images", `${slot.id}.jpg`)
                  );
                  return (
                    <ImageUploadCard
                      key={slot.id}
                      slotId={slot.id}
                      label={slot.label}
                      desc={slot.desc}
                      exists={exists}
                      ts={ts}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
