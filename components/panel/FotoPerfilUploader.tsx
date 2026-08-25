"use client";

import { useRef } from "react";

export default function FotoPerfilUploader({
  previewUrl,
  onSeleccionar,
}: {
  previewUrl: string | null;
  onSeleccionar: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-tinta-800 bg-tinta-900 p-5">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-tinta-700 bg-tinta-800">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSeleccionar(file);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-tinta-700 px-3 py-1.5 text-sm text-tinta-100 transition-colors hover:border-tinta-500"
        >
          Cambiar foto
        </button>
        <p className="mt-2 text-xs text-tinta-500">Se sube cuando guardás los cambios.</p>
      </div>
    </div>
  );
}
