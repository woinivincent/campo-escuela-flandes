"use client";

import { useState, FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { WhatsAppIcon, CheckCircleIcon } from "@/components/ui/icons";

const inputCls =
  "rounded-xl border border-forest/20 bg-sand px-4 py-3 text-sm text-forest-dark placeholder:text-forest/35 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/10 w-full";

const labelCls = "text-xs font-semibold uppercase tracking-wide text-forest/65";

export default function ReservaForm({ waNumber = "5491100000000" }: { waNumber?: string }) {
  const [form, setForm] = useState({
    grupo: "",
    responsable: "",
    subcampo: "",
    llegada: "",
    salida: "",
    personas: "",
    notas: "",
  });
  const [enviado, setEnviado] = useState(false);

  function set(field: string) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const lineas = [
      "Hola! Quiero hacer una preinscripción en Campo Escuela Flandes.",
      "",
      `*Grupo:* ${form.grupo}`,
      `*Responsable:* ${form.responsable}`,
      `*Subcampo preferido:* ${form.subcampo || "Sin preferencia"}`,
      `*Llegada:* ${form.llegada}`,
      `*Salida:* ${form.salida}`,
      `*Cantidad de personas:* ${form.personas}`,
    ];
    if (form.notas.trim()) lineas.push(`*Comentarios:* ${form.notas.trim()}`);
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(lineas.join("\n"))}`, "_blank");
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="card flex flex-col items-center gap-4 py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
          <CheckCircleIcon width={32} height={32} />
        </span>
        <h3 className="font-display text-xl font-bold uppercase text-forest-dark">
          ¡Listo!
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-forest/75">
          Se abrió WhatsApp con los datos ya cargados. Revisalos y enviá el
          mensaje para completar tu preinscripción.
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="btn-outline mt-2"
        >
          Hacer otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Nombre del grupo <span className="text-flandes-red">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="Ej: 5.º Grupo Scout Palermo"
          value={form.grupo}
          onChange={set("grupo")}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Responsable <span className="text-flandes-red">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="Nombre y apellido"
          value={form.responsable}
          onChange={set("responsable")}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>Subcampo preferido</label>
        <select
          value={form.subcampo}
          onChange={set("subcampo")}
          className={inputCls}
        >
          <option value="">Sin preferencia</option>
          {siteConfig.subcampos.map((s) => (
            <option key={s.id} value={s.nombre}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Cantidad de personas <span className="text-flandes-red">*</span>
        </label>
        <input
          required
          type="number"
          min="1"
          max="500"
          placeholder="Ej: 30"
          value={form.personas}
          onChange={set("personas")}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Fecha de llegada <span className="text-flandes-red">*</span>
        </label>
        <input
          required
          type="date"
          value={form.llegada}
          onChange={set("llegada")}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Fecha de salida <span className="text-flandes-red">*</span>
        </label>
        <input
          required
          type="date"
          value={form.salida}
          onChange={set("salida")}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className={labelCls}>Comentarios / necesidades especiales</label>
        <textarea
          rows={4}
          placeholder="Contanos si tienen alguna necesidad especial, si vienen con vehículos, horarios aproximados, etc."
          value={form.notas}
          onChange={set("notas")}
          className={inputCls}
        />
      </div>

      <button type="submit" className="btn-whatsapp sm:col-span-2">
        <WhatsAppIcon width={20} height={20} />
        Enviar preinscripción por WhatsApp
      </button>

      <p className="sm:col-span-2 text-center text-xs text-forest/45">
        Al presionar el botón se abrirá WhatsApp con los datos ya cargados.
        Revisalos antes de enviar.
      </p>
    </form>
  );
}
