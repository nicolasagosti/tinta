"use client";

import { useState } from "react";

const OTRO = "__otro__";

export default function EstilosEditor({
  estilos,
  estilosDisponibles,
  onChange,
}: {
  estilos: string[];
  estilosDisponibles: string[];
  onChange: (nuevos: string[]) => void;
}) {
  const [seleccion, setSeleccion] = useState("");
  const [otro, setOtro] = useState("");

  const opciones = estilosDisponibles.filter((e) => !estilos.includes(e));
  const mostrarOtro = seleccion === OTRO;

  const agregar = (valorCrudo: string) => {
    const valor = valorCrudo.trim();
    if (!valor || estilos.includes(valor)) return;
    onChange([...estilos, valor]);
  };

  const onCambiarSeleccion = (valor: string) => {
    setSeleccion(valor);
    if (valor && valor !== OTRO) {
      agregar(valor);
      setSeleccion("");
    }
  };

  const agregarOtro = () => {
    agregar(otro);
    setOtro("");
    setSeleccion("");
  };

  const quitar = (estilo: string) => onChange(estilos.filter((e) => e !== estilo));

  return (
    <div className="rounded-2xl border border-tinta-800 bg-tinta-900 p-5">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {estilos.length === 0 && (
          <p className="text-sm text-tinta-500">Todavía no agregaste ningún estilo.</p>
        )}
        {estilos.map((estilo) => (
          <span
            key={estilo}
            className="flex items-center gap-1.5 rounded-full border border-acento bg-acento/15 px-3 py-1 text-xs text-acento-suave"
          >
            {estilo}
            <button
              type="button"
              onClick={() => quitar(estilo)}
              aria-label={`Quitar ${estilo}`}
              className="text-acento-suave/70 hover:text-acento-suave"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <select
        value={seleccion}
        onChange={(e) => onCambiarSeleccion(e.target.value)}
        className="w-full rounded-lg border border-tinta-700 bg-tinta-950 px-3 py-2 text-sm text-tinta-100 focus:border-acento focus:outline-none"
      >
        <option value="">Elegí un estilo…</option>
        {opciones.map((estilo) => (
          <option key={estilo} value={estilo}>
            {estilo}
          </option>
        ))}
        <option value={OTRO}>Otro (no está en la lista)</option>
      </select>

      {mostrarOtro && (
        <div className="mt-2 flex gap-2">
          <input
            value={otro}
            onChange={(e) => setOtro(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                agregarOtro();
              }
            }}
            placeholder="Escribí el estilo"
            autoFocus
            className="flex-1 rounded-lg border border-tinta-700 bg-tinta-950 px-3 py-2 text-sm text-tinta-100 placeholder:text-tinta-500 focus:border-acento focus:outline-none"
          />
          <button
            type="button"
            onClick={agregarOtro}
            className="rounded-lg border border-tinta-700 px-3 py-2 text-sm text-tinta-100 transition-colors hover:border-tinta-500"
          >
            Agregar
          </button>
        </div>
      )}
    </div>
  );
}
