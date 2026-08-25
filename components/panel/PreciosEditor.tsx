"use client";

import { DETALLE_TAMANO, ETIQUETA_TAMANO, type Tamano } from "@/data/tatuadores";

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
  const cambiarEnMiles = (tamano: Tamano, campo: keyof Fila, miles: string) => {
    const pesos = (Number(miles) || 0) * 1000;
    onChange(tamano, campo, String(pesos));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-tinta-800 bg-tinta-900">
      <p className="border-b border-tinta-800 px-4 py-3 text-xs text-tinta-500">
        Los valores son en miles de pesos: escribí <span className="text-tinta-300">50</span> para $50.000.
      </p>
      <table className="w-full text-left text-sm">
        <thead className="bg-tinta-800/60 text-xs uppercase tracking-wide text-tinta-500">
          <tr>
            <th className="px-4 py-3 font-medium">Tamaño</th>
            <th className="px-4 py-3 font-medium">Desde (miles)</th>
            <th className="px-4 py-3 font-medium">Hasta (miles)</th>
          </tr>
        </thead>
        <tbody>
          {tamanos.map((tamano) => (
            <tr key={tamano} className="border-t border-tinta-800">
              <td className="px-4 py-3">
                <div className="font-medium">{ETIQUETA_TAMANO[tamano]}</div>
                <div className="text-xs text-tinta-500">{DETALLE_TAMANO[tamano]}</div>
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="0"
                  value={precios[tamano].desde ? precios[tamano].desde / 1000 : ""}
                  onChange={(e) => cambiarEnMiles(tamano, "desde", e.target.value)}
                  className="w-24 rounded-lg border border-tinta-700 bg-tinta-950 px-2 py-1.5 text-tinta-100 focus:border-acento focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="0"
                  value={precios[tamano].hasta ? precios[tamano].hasta / 1000 : ""}
                  onChange={(e) => cambiarEnMiles(tamano, "hasta", e.target.value)}
                  className="w-24 rounded-lg border border-tinta-700 bg-tinta-950 px-2 py-1.5 text-tinta-100 focus:border-acento focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
