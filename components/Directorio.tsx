"use client";

import { useMemo, useState } from "react";
import {
  ETIQUETA_TAMANO,
  TAMANOS,
  type Tamano,
  type Tatuador,
} from "@/data/tatuadores";
import {
  FILTROS_INICIALES,
  filtrarTatuadores,
  formatearPrecio,
  topePrecio,
  type Filtros,
  type Orden,
} from "@/lib/filtros";
import TarjetaTatuador from "./TarjetaTatuador";

type Props = {
  tatuadores: Tatuador[];
  estilos: string[];
  ciudades: string[];
};

const ORDENES: { valor: Orden; etiqueta: string }[] = [
  { valor: "relevancia", etiqueta: "Nombre (A-Z)" },
  { valor: "precio-asc", etiqueta: "Precio: menor a mayor" },
  { valor: "precio-desc", etiqueta: "Precio: mayor a menor" },
  { valor: "experiencia", etiqueta: "Más experiencia" },
];

export default function Directorio({ tatuadores, estilos, ciudades }: Props) {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);
  const [precioMax, setPrecioMax] = useState<number | null>(null);

  const tope = useMemo(
    () => topePrecio(tatuadores, filtros.tamano),
    [tatuadores, filtros.tamano]
  );

  // `null` = sin límite de precio; el slider se muestra en el tope.
  const valorSlider = precioMax ?? tope;

  const resultados = useMemo(
    () =>
      filtrarTatuadores(tatuadores, {
        ...filtros,
        precioMax: precioMax ?? Number.POSITIVE_INFINITY,
      }),
    [tatuadores, filtros, precioMax]
  );

  const alternarEstilo = (estilo: string) => {
    setFiltros((f) => ({
      ...f,
      estilos: f.estilos.includes(estilo)
        ? f.estilos.filter((e) => e !== estilo)
        : [...f.estilos, estilo],
    }));
  };

  const cambiarTamano = (tamano: Tamano | "todos") => {
    setFiltros((f) => ({ ...f, tamano }));
    setPrecioMax(null); // el rango de precios cambia con el tamaño
  };

  const limpiar = () => {
    setFiltros(FILTROS_INICIALES);
    setPrecioMax(null);
  };

  const hayFiltros =
    filtros.texto !== "" ||
    filtros.estilos.length > 0 ||
    filtros.ciudad !== "" ||
    filtros.tamano !== "todos" ||
    precioMax !== null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <label htmlFor="busqueda" className="sr-only">
          Buscar tatuadores
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinta-500">
            ⌕
          </span>
          <input
            id="busqueda"
            type="search"
            value={filtros.texto}
            onChange={(e) => setFiltros((f) => ({ ...f, texto: e.target.value }))}
            placeholder="Buscá por nombre, estilo, ciudad, barrio o promo (2x1, 3x1…)"
            className="w-full rounded-xl border border-tinta-800 bg-tinta-900 py-3 pl-10 pr-4 text-tinta-100 placeholder:text-tinta-500 focus:border-acento focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-tinta-300">
                Filtros
              </h2>
              {hayFiltros && (
                <button
                  onClick={limpiar}
                  className="text-xs text-acento-suave hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>

            <h3 className="mb-2 text-xs uppercase tracking-wide text-tinta-500">
              Tipo de tatuaje
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {estilos.map((estilo) => {
                const activo = filtros.estilos.includes(estilo);
                return (
                  <button
                    key={estilo}
                    onClick={() => alternarEstilo(estilo)}
                    aria-pressed={activo}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      activo
                        ? "border-acento bg-acento text-white"
                        : "border-tinta-700 text-tinta-300 hover:border-tinta-500"
                    }`}
                  >
                    {estilo}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs uppercase tracking-wide text-tinta-500">
              Tamaño
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => cambiarTamano("todos")}
                aria-pressed={filtros.tamano === "todos"}
                className={`rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                  filtros.tamano === "todos"
                    ? "border-acento bg-acento/15 text-acento-suave"
                    : "border-tinta-700 text-tinta-300 hover:border-tinta-500"
                }`}
              >
                Cualquiera
              </button>
              {TAMANOS.map((tamano) => (
                <button
                  key={tamano}
                  onClick={() => cambiarTamano(tamano)}
                  aria-pressed={filtros.tamano === tamano}
                  className={`rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                    filtros.tamano === tamano
                      ? "border-acento bg-acento/15 text-acento-suave"
                      : "border-tinta-700 text-tinta-300 hover:border-tinta-500"
                  }`}
                >
                  {ETIQUETA_TAMANO[tamano]}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-xs uppercase tracking-wide text-tinta-500">
                Presupuesto
              </h3>
              <span className="text-xs text-tinta-300">
                {precioMax === null ? "Sin límite" : `hasta ${formatearPrecio(precioMax)}`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={tope}
              step={5000}
              value={valorSlider}
              onChange={(e) => {
                const valor = Number(e.target.value);
                setPrecioMax(valor >= tope ? null : valor);
              }}
              className="w-full"
              aria-label="Precio máximo"
            />
            <div className="mt-1 flex justify-between text-[11px] text-tinta-500">
              <span>{formatearPrecio(0)}</span>
              <span>{formatearPrecio(tope)}+</span>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs uppercase tracking-wide text-tinta-500">
              Ciudad
            </h3>
            <select
              value={filtros.ciudad}
              onChange={(e) => setFiltros((f) => ({ ...f, ciudad: e.target.value }))}
              className="w-full rounded-lg border border-tinta-700 bg-tinta-900 px-3 py-2 text-sm text-tinta-100 focus:border-acento focus:outline-none"
            >
              <option value="">Todas las ciudades</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
          </section>
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-tinta-300">
              <strong className="text-tinta-100">{resultados.length}</strong>{" "}
              {resultados.length === 1 ? "tatuador" : "tatuadores"}
              {filtros.tamano !== "todos" && (
                <span className="text-tinta-500">
                  {" "}
                  · precios de {ETIQUETA_TAMANO[filtros.tamano].toLowerCase()}
                </span>
              )}
            </p>
            <label className="flex items-center gap-2 text-sm text-tinta-500">
              Ordenar por
              <select
                value={filtros.orden}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, orden: e.target.value as Orden }))
                }
                className="rounded-lg border border-tinta-700 bg-tinta-900 px-2 py-1.5 text-sm text-tinta-100 focus:border-acento focus:outline-none"
              >
                {ORDENES.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.etiqueta}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {resultados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-tinta-700 p-12 text-center">
              <p className="mb-1 font-medium">No encontramos tatuadores con esos filtros</p>
              <p className="mb-4 text-sm text-tinta-500">
                Probá subir el presupuesto o sacar algún estilo.
              </p>
              <button
                onClick={limpiar}
                className="rounded-lg bg-acento px-4 py-2 text-sm font-medium text-white"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {resultados.map((tatuador) => (
                <TarjetaTatuador
                  key={tatuador.slug}
                  tatuador={tatuador}
                  tamano={filtros.tamano}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
