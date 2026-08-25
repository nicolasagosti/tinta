import Link from "next/link";
import { ETIQUETA_TAMANO, type Tamano, type Tatuador } from "@/data/tatuadores";
import { formatearPrecio, precioDesde } from "@/lib/filtros";

type Props = {
  tatuador: Tatuador;
  tamano: Tamano | "todos";
};

export default function TarjetaTatuador({ tatuador, tamano }: Props) {
  const precio = precioDesde(tatuador, tamano);
  const etiquetaPrecio =
    tamano === "todos" ? "Desde" : `${ETIQUETA_TAMANO[tamano]} desde`;

  return (
    <Link
      href={`/tatuadores/${tatuador.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-tinta-800 bg-tinta-900 transition-colors hover:border-tinta-700"
    >
      <div className="grid grid-cols-3 gap-px bg-tinta-800">
        {tatuador.trabajos.slice(0, 3).map((trabajo) => (
          <img
            key={trabajo.id}
            src={trabajo.imagen}
            alt={trabajo.titulo ? `${trabajo.titulo} por ${tatuador.nombre}` : `Trabajo de ${tatuador.nombre}`}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <img
            src={tatuador.foto}
            alt={`Foto de ${tatuador.nombre}`}
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded-full border border-tinta-700 object-cover"
          />
          <div className="min-w-0">
            <h2 className="truncate font-semibold">{tatuador.nombre}</h2>
            <p className="truncate text-sm text-tinta-500">{tatuador.ciudad}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tatuador.estilos.map((estilo) => (
            <span
              key={estilo}
              className="rounded-full border border-tinta-700 px-2.5 py-0.5 text-xs text-tinta-300"
            >
              {estilo}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-tinta-800 pt-3">
          <div>
            <p className="text-xs text-tinta-500">{etiquetaPrecio}</p>
            <p className="font-semibold text-acento-suave">{formatearPrecio(precio)}</p>
          </div>
          <span className="text-xs text-tinta-500 transition-colors group-hover:text-tinta-300">
            Ver perfil →
          </span>
        </div>
      </div>
    </Link>
  );
}
