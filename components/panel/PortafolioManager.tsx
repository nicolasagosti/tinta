"use client";

import { useRef } from "react";
import type { TrabajoRow } from "./PanelCliente";

export type FotoPendiente = { id: string; file: File; previewUrl: string };

export default function PortafolioManager({
  trabajos,
  fotosNuevas,
  onAgregarFotos,
  onQuitarFotoNueva,
  onBorrarTrabajo,
}: {
  trabajos: TrabajoRow[];
  fotosNuevas: FotoPendiente[];
  onAgregarFotos: (files: File[]) => void;
  onQuitarFotoNueva: (id: string) => void;
  onBorrarTrabajo: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      {(trabajos.length > 0 || fotosNuevas.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {trabajos.map((trabajo) => (
            <div
              key={trabajo.id}
              className="group relative overflow-hidden rounded-xl border border-tinta-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trabajo.imagen_url}
                alt="Foto de trabajo"
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onBorrarTrabajo(trabajo.id)}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-tinta-950/80 text-xs text-tinta-100 opacity-0 transition-opacity hover:bg-acento group-hover:opacity-100"
                aria-label="Borrar foto"
              >
                ✕
              </button>
            </div>
          ))}

          {fotosNuevas.map((foto) => (
            <div
              key={foto.id}
              className="group relative overflow-hidden rounded-xl border border-dashed border-acento"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={foto.previewUrl}
                alt="Foto nueva, todavía sin guardar"
                className="aspect-square w-full object-cover opacity-80"
              />
              <span className="absolute left-2 top-2 rounded-full bg-acento px-2 py-0.5 text-[10px] font-medium text-white">
                Nueva
              </span>
              <button
                type="button"
                onClick={() => onQuitarFotoNueva(foto.id)}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-tinta-950/80 text-xs text-tinta-100 opacity-0 transition-opacity hover:bg-acento group-hover:opacity-100"
                aria-label="Quitar foto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-tinta-700 p-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) onAgregarFotos(files);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="text-sm text-tinta-300"
        />
        <p className="mt-2 text-xs text-tinta-500">
          Podés elegir varias fotos a la vez. Se suben cuando guardás los cambios.
        </p>
      </div>
    </div>
  );
}
