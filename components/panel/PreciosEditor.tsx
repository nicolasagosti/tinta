"use client";

import { ETIQUETA_TAMANO, type Tamano } from "@/data/tatuadores";

type Fila = { desde: number; hasta: number };

export default function PreciosEditor({
  precios,
  tamanos,
  onChange,
}: {
  precios: Record<Tamano, Fila>;
  tamanos: Tamano[];
  onChange: (tamano: Tamano, campo: keyof Fila, valor: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-tinta-800 bg-tinta-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-tinta-800/60 text-xs uppercase tracking-wide text-tinta-500">
          <tr>
            <th className="px-4 py-3 font-medium">Tamaño</th>
            <th className="px-4 py-3 font-medium">Desde</th>
            <th className="px-4 py-3 font-medium">Hasta</th>
          </tr>
        </thead>
        <tbody>
          {tamanos.map((tamano) => (
            <tr key={tamano} className="border-t border-tinta-800">
              <td className="px-4 py-3 font-medium">{ETIQUETA_TAMANO[tamano]}</td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="0"
                  value={precios[tamano].desde || ""}
                  onChange={(e) => onChange(tamano, "desde", e.target.value)}
                  className="w-28 rounded-lg border border-tinta-700 bg-tinta-950 px-2 py-1.5 text-tinta-100 focus:border-acento focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="0"
                  value={precios[tamano].hasta || ""}
                  onChange={(e) => onChange(tamano, "hasta", e.target.value)}
                  className="w-28 rounded-lg border border-tinta-700 bg-tinta-950 px-2 py-1.5 text-tinta-100 focus:border-acento focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
