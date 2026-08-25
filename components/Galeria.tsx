"use client";

import { useEffect, useState } from "react";
import type { Trabajo } from "@/data/tatuadores";

export default function Galeria({
  trabajos,
  autor,
}: {
  trabajos: Trabajo[];
  autor: string;
}) {
  const [abierto, setAbierto] = useState<number | null>(null);

  useEffect(() => {
    if (abierto === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(null);
      if (e.key === "ArrowRight") setAbierto((i) => ((i ?? 0) + 1) % trabajos.length);
      if (e.key === "ArrowLeft")
        setAbierto((i) => ((i ?? 0) - 1 + trabajos.length) % trabajos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, trabajos.length]);

  const actual = abierto === null ? null : trabajos[abierto];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {trabajos.map((trabajo, i) => (
          <button
            key={trabajo.id}
            onClick={() => setAbierto(i)}
            className="group relative overflow-hidden rounded-xl border border-tinta-800"
          >
            <img
              src={trabajo.imagen}
              alt={trabajo.titulo ? `${trabajo.titulo} por ${autor}` : `Trabajo de ${autor}`}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {trabajo.titulo && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinta-950 to-transparent p-2 text-left text-xs text-tinta-100 opacity-0 transition-opacity group-hover:opacity-100">
                {trabajo.titulo}
              </span>
            )}
          </button>
        ))}
      </div>

      {actual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={actual.titulo || `Trabajo de ${autor}`}
          onClick={() => setAbierto(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-tinta-950/90 p-4 backdrop-blur-sm"
        >
          <button
            onClick={() => setAbierto(null)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-tinta-700 text-tinta-300 hover:text-tinta-100"
          >
            ✕
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-2xl">
            <img
              src={actual.imagen}
              alt={actual.titulo ? `${actual.titulo} por ${autor}` : `Trabajo de ${autor}`}
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />
            {(actual.titulo || actual.estilo) && (
              <figcaption className="mt-3 text-center text-sm text-tinta-300">
                {actual.titulo}
                {actual.titulo && actual.estilo && " · "}
                <span className="text-tinta-500">{actual.estilo}</span>
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
