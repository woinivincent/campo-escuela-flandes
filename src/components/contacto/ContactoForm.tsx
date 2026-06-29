"use client";

import { useState, FormEvent } from "react";
import { WhatsAppIcon, CheckCircleIcon } from "@/components/ui/icons";

const inputCls =
  "rounded-xl border border-forest/20 bg-sand px-4 py-3 text-sm text-forest-dark placeholder:text-forest/35 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/10 w-full";
const labelCls = "text-xs font-semibold uppercase tracking-wide text-forest/65";

export default function ContactoForm({ waNumber = "5491100000000" }: { waNumber?: string }) {
  const [form, setForm] = useState({
    nombre: "",
    contacto: "",
    asunto: "",
    mensaje: "",
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
      "Hola, me comunico desde el sitio web del Campo Escuela Flandes.",
      "",
      `*Nombre:* ${form.nombre}`,
      `*Contacto:* ${form.contacto}`,
      `*Asunto:* ${form.asunto}`,
      "",
      `*Mensaje:* ${form.mensaje}`,
    ];
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
          ¡Mensaje enviado!
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-forest/75">
          Se abrió WhatsApp con tu mensaje. Te respondemos a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ nombre: "", contacto: "", asunto: "", mensaje: "" });
            setEnviado(false);
          }}
          className="btn-outline mt-2"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Nombre <span className="text-flandes-red">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={set("nombre")}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>
          Email o teléfono <span className="text-flandes-red">*</span>
        </label>
        <input
          required
          type="text"
          placeholder="Para que podamos responderte"
          value={form.contacto}
          onChange={set("contacto")}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className={labelCls}>
          Asunto <span className="text-flandes-red">*</span>
        </label>
        <select
          required
          value={form.asunto}
          onChange={set("asunto")}
          className={inputCls}
        >
          <option value="">Seleccioná un asunto</option>
          <option value="Consulta general">Consulta general</option>
          <option value="Reservas">Reservas</option>
          <option value="Adiestramiento / cursos">Adiestramiento / cursos</option>
          <option value="Librería">Librería</option>
          <option value="Prensa / redes sociales">Prensa / redes sociales</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className={labelCls}>
          Mensaje <span className="text-flandes-red">*</span>
        </label>
        <textarea
          required
          rows={5}
          placeholder="Escribí tu consulta o comentario..."
          value={form.mensaje}
          onChange={set("mensaje")}
          className={inputCls}
        />
      </div>

      <button type="submit" className="btn-whatsapp sm:col-span-2">
        <WhatsAppIcon width={20} height={20} />
        Enviar por WhatsApp
      </button>

      <p className="sm:col-span-2 text-center text-xs text-forest/45">
        Al presionar el botón se abrirá WhatsApp con tu mensaje listo. Revisalo
        antes de enviar.
      </p>
    </form>
  );
}
