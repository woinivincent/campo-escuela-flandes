import { requireAuth } from "@/lib/auth";
import { getAllConfigValues } from "@/lib/db";
import { saveConfigAction } from "./actions";

export const metadata = { title: "Configuración — Admin Flandes" };

const CAMPOS = [
  {
    key: "whatsapp",
    label: "Número de WhatsApp",
    type: "tel",
    placeholder: "5491144332211",
    hint: "Solo dígitos: código de país + área + número. Sin +, espacios ni guiones.",
  },
  {
    key: "whatsappDisplay",
    label: "WhatsApp (texto visible)",
    type: "text",
    placeholder: "+54 9 11 4433-2211",
    hint: "Cómo aparece el número en el sitio.",
  },
  {
    key: "email",
    label: "Email de contacto",
    type: "email",
    placeholder: "contacto@campoflandes.org.ar",
    hint: "",
  },
  {
    key: "facebook",
    label: "URL de Facebook",
    type: "url",
    placeholder: "https://facebook.com/campoflandes",
    hint: "",
  },
  {
    key: "instagram",
    label: "URL de Instagram",
    type: "url",
    placeholder: "https://instagram.com/campoflandes",
    hint: "",
  },
  {
    key: "youtube",
    label: "URL de YouTube",
    type: "url",
    placeholder: "https://youtube.com/@campoflandes",
    hint: "",
  },
];

export default async function AdminConfigPage() {
  await requireAuth();
  const cfg = getAllConfigValues();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
          Configuración del sitio
        </h1>
        <p className="mt-0.5 text-sm text-white/40">
          Datos de contacto y redes sociales que aparecen en todo el sitio.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <form action={saveConfigAction} className="grid gap-5 sm:grid-cols-2">
          {CAMPOS.map((campo) => (
            <div key={campo.key}>
              <label className="field-label">{campo.label}</label>
              <input
                name={campo.key}
                type={campo.type}
                defaultValue={cfg[campo.key] ?? ""}
                placeholder={campo.placeholder}
                className="admin-input"
              />
              {campo.hint && (
                <p className="mt-1 text-xs text-white/30">{campo.hint}</p>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 sm:col-span-2">
            <p className="text-xs text-white/30">
              Los cambios se aplican en todo el sitio de inmediato.
            </p>
            <button
              type="submit"
              className="rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
