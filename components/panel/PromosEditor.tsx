"use client";

import { useState } from "react";
import {
  ETIQUETA_TAMANO,
  TAMANOS,
  TIPOS_PROMO,
  type Promo,
  type Tamano,
  type TipoPromo,
} from "@/data/tatuadores";
import { formatearPrecio } from "@/lib/filtros";

const campoClase =
  "rounded-lg border border-tinta-700 bg-tinta-950 px-2 py-1.5 text-sm text-tinta-100 focus:border-acento focus:outline-none";

export default function PromosEditor({
  promos,
  onChange,
}: {
  promos: Promo[];
  onChange: (nuevas: Promo[]) => void;
}) {
  const [tipo, setTipo] = useState<TipoPromo>(TIPOS_PROMO[0]);
  const [tamano, setTamano] = useState<Tamano>(TAMANOS[0]);
  const [precioMiles, setPrecioMiles] = useState("");

  const agregar = () => {
    const precio = (Number(precioMiles) || 0) * 1000;
    if (precio <= 0) return;
    onChange([...promos, { id: crypto.randomUUID(), tipo, tamano, precio }]);
    setPrecioMiles("");
  };

  const quitar = (id: string) => onChange(promos.filter((p) => p.id !== id));

  return (
    <div className="rounded-2xl border border-tinta-800 bg-tinta-900 p-5">
      {promos.length === 0 ? (
        <p className="mb-4 text-sm text-tinta-500">Todavía no cargaste ninguna promo.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {promos.map((promo) => (
            <li
              key={promo.id}
              className="flex items-center justify-between rounded-lg border border-tinta-700 px-3 py-2 text-sm"
            >
              <span>
                <span className="font-semibold text-acento-suave">{promo.tipo}</span> en{" "}
                {ETIQUETA_TAMANO[promo.tamano].toLowerCase()} ·{" "}
                <span className="text-tinta-300">{formatearPrecio(promo.precio)}</span>
              </span>
              <button
                type="button"
                onClick={() => quitar(promo.id)}
                aria-label="Quitar promo"
                className="text-tinta-500 hover:text-acento-suave"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="mb-1 block text-tinta-300">Promo</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPromo)}
            className={campoClase}
          >
            {TIPOS_PROMO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-tinta-300">Tamaño</span>
          <select
            value={tamano}
            onChange={(e) => setTamano(e.target.value as Tamano)}
            className={campoClase}
          >
            {TAMANOS.map((t) => (
              <option key={t} value={t}>
                {ETIQUETA_TAMANO[t]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-tinta-300">Precio (miles)</span>
          <input
            type="number"
            min={0}
            step={1}
            placeholder="0"
            value={precioMiles}
            onChange={(e) => setPrecioMiles(e.target.value)}
            className={`w-24 ${campoClase}`}
          />
        </label>

        <button
          type="button"
          onClick={agregar}
          className="rounded-lg border border-tinta-700 px-3 py-2 text-sm text-tinta-100 transition-colors hover:border-tinta-500"
        >
          Agregar promo
        </button>
      </div>
    </div>
  );
}
