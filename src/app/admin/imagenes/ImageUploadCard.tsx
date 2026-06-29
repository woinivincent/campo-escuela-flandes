"use client";

import { useRef } from "react";
import { uploadImageAction } from "./actions";
// uploadImageAction is a server action — safe to import in client component

interface Props {
  slotId: string;
  label: string;
  desc: string;
  exists: boolean;
  ts: number;
}

export default function ImageUploadCard({ slotId, label, desc, exists, ts }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5">
      {/* Preview */}
      <div className="relative aspect-video bg-white/5">
        {exists ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/${slotId}.jpg?t=${ts}`}
            alt={label}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 text-white/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-[0.65rem] uppercase tracking-wide">Sin imagen</span>
          </div>
        )}
        {exists && (
          <span className="absolute right-2 top-2 rounded-full bg-green-500/90 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-white">
            OK
          </span>
        )}
      </div>

      {/* Info + upload */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-xs font-semibold text-white/90">{label}</p>
          <p className="text-[0.65rem] text-white/40">{desc}</p>
        </div>

        <form
          ref={formRef}
          action={uploadImageAction}
          className="mt-auto"
        >
          <input type="hidden" name="slot" value={slotId} />
          <input
            ref={inputRef}
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={() => formRef.current?.requestSubmit()}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-lg border border-white/15 px-3 py-1.5 text-[0.7rem] font-semibold text-white/60 transition hover:border-white/30 hover:text-white/90"
          >
            {exists ? "Reemplazar imagen" : "Subir imagen"}
          </button>
        </form>
      </div>
    </div>
  );
}
