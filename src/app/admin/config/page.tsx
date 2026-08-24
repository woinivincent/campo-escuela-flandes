import { requireAuth } from "@/lib/auth";
import { getAllConfigValues } from "@/lib/db";
import { saveConfigAction } from "./actions";

export const metadata = { title: "Configuración — Admin Flandes" };

const CONTACTO = [
  { key: "whatsapp",        label: "Número de WhatsApp",        type: "tel",   placeholder: "5491144332211",               hint: "Solo dígitos: código de país + área + número. Sin +, espacios ni guiones." },
  { key: "whatsappDisplay", label: "WhatsApp (texto visible)",   type: "text",  placeholder: "+54 9 11 4433-2211",          hint: "Cómo aparece el número en el sitio." },
  { key: "email",           label: "Email de contacto",          type: "email", placeholder: "contacto@campoflandes.org.ar",hint: "" },
  { key: "location",        label: "Dirección / Ubicación",      type: "text",  placeholder: "Calle 123, Localidad, Pcia.", hint: "Aparece en la página de Contacto." },
];
const REDES = [
  { key: "facebook",  label: "URL de Facebook",  type: "url", placeholder: "https://facebook.com/campoflandes",  hint: "" },
  { key: "instagram", label: "URL de Instagram", type: "url", placeholder: "https://instagram.com/campoflandes", hint: "" },
  { key: "youtube",   label: "URL de YouTube",   type: "url", placeholder: "https://youtube.com/@campoflandes",  hint: "" },
];
const SUBCAMPOS = [
  { key: "subcampo1", label: "Nombre Subcampo 1", type: "text", placeholder: "Los Álamos", hint: "" },
  { key: "subcampo2", label: "Nombre Subcampo 2", type: "text", placeholder: "El Sauce",   hint: "" },
  { key: "subcampo3", label: "Nombre Subcampo 3", type: "text", placeholder: "La Laguna",  hint: "" },
  { key: "subcampo4", label: "Nombre Subcampo 4", type: "text", placeholder: "El Ceibo",   hint: "" },
];
const PORTAL = [
  { key: "cuota_mensual", label: "Cuota mensual socios (ARS)", type: "text", placeholder: "5000", hint: "Monto que aparece en la página de Socios. Dejar vacío para ocultar el precio." },
];
const SITIO = [
  { key: "site_url", label: "URL pública del sitio", type: "url", placeholder: "https://campoescuelaflandes.com.ar", hint: "Se usa para armar los códigos QR de las especies. Si cambia el dominio, hay que regenerar los QR." },
  { key: "mapa_lat", label: "Latitud del predio", type: "text", placeholder: "-34.546312", hint: "Centro del mapa satelital que se muestra en Acampes y Contacto." },
  { key: "mapa_lng", label: "Longitud del predio", type: "text", placeholder: "-59.146240", hint: "" },
];

function Section({ title, campos, cfg }: { title: string; campos: typeof CONTACTO; cfg: Record<string, string> }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-5 font-display text-sm font-bold uppercase tracking-wide text-gold/70">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {campos.map((c) => (
          <div key={c.key}>
            <label className="field-label">{c.label}</label>
            <input name={c.key} type={c.type} defaultValue={cfg[c.key] ?? ""} placeholder={c.placeholder} className="admin-input" />
            {c.hint && <p className="mt-1 text-xs text-white/30">{c.hint}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AdminConfigPage() {
  await requireAuth();
  const cfg = await getAllConfigValues();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">Configuración del sitio</h1>
        <p className="mt-0.5 text-sm text-white/40">Datos de contacto, redes, subcampos y portal de socios.</p>
      </div>

      <form action={saveConfigAction} className="space-y-6">
        <Section title="Contacto" campos={CONTACTO} cfg={cfg} />
        <Section title="Redes sociales" campos={REDES} cfg={cfg} />
        <Section title="Nombres de subcampos" campos={SUBCAMPOS} cfg={cfg} />
        <Section title="Portal de socios" campos={PORTAL} cfg={cfg} />
        <Section title="Sitio y códigos QR" campos={SITIO} cfg={cfg} />

        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <p className="text-xs text-white/30">Los cambios se aplican en todo el sitio de inmediato.</p>
          <button type="submit" className="rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-forest-dark transition hover:bg-gold-dark active:scale-95">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
