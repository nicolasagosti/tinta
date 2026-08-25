"use client";

import { useEffect, useRef, useState } from "react";

const campoClase =
  "w-full rounded-lg border border-tinta-700 bg-tinta-900 px-3 py-2 text-sm text-tinta-100 placeholder:text-tinta-500 focus:border-acento focus:outline-none";

export default function UbicacionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (valor: string) => void;
}) {
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [mostrar, setMostrar] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setMostrar(false);
      }
    };
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  const buscar = (texto: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (texto.trim().length < 3) {
      setSugerencias([]);
      return;
    }
    timeoutRef.current = setTimeout(async () => {
      try {
        const respuesta = await fetch(`/api/ubicaciones?q=${encodeURIComponent(texto)}`);
        const datos = await respuesta.json();
        setSugerencias(datos.resultados ?? []);
        setMostrar(true);
      } catch {
        setSugerencias([]);
      }
    }, 350);
  };

  return (
    <div ref={contenedorRef} className="relative">
      <input
        className={campoClase}
        placeholder="Ciudad, provincia…"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          buscar(e.target.value);
        }}
        onFocus={() => sugerencias.length > 0 && setMostrar(true)}
        autoComplete="off"
      />
      {mostrar && sugerencias.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-tinta-700 bg-tinta-900 shadow-lg">
          {sugerencias.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  onChange(s);
                  setSugerencias([]);
                  setMostrar(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-tinta-100 hover:bg-tinta-800"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
