import type { Tamano, Tatuador } from "@/data/tatuadores";

export type Orden = "relevancia" | "precio-asc" | "precio-desc" | "experiencia";

export type Filtros = {
  texto: string;
  estilos: string[];
  ciudad: string;
  tamano: Tamano | "todos";
  precioMax: number;
  orden: Orden;
};

export const FILTROS_INICIALES: Filtros = {
  texto: "",
  estilos: [],
  ciudad: "",
  tamano: "todos",
  precioMax: Number.POSITIVE_INFINITY,
  orden: "relevancia",
};

const formateador = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor: number): string {
  return formateador.format(valor);
}

/** Quita acentos y pasa a minúsculas para que el buscador tolere "japones" o "Japonés". */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

/** Un precio en $0 y $0 significa que el tatuador todavía no lo cargó. */
function precioCargado(p: { desde: number; hasta: number }): boolean {
  return p.desde > 0 || p.hasta > 0;
}

/**
 * Precio de referencia del tatuador para el tamaño elegido.
 * Con "todos" se usa el precio más bajo de su lista.
 * Si no cargó precio para ese tamaño, devuelve Infinity (queda afuera de los filtros de precio).
 */
export function precioDesde(tatuador: Tatuador, tamano: Tamano | "todos"): number {
  const precios = tatuador.precios.filter(precioCargado);
  if (tamano === "todos") {
    if (precios.length === 0) return Number.POSITIVE_INFINITY;
    return Math.min(...precios.map((p) => p.desde));
  }
  const precio = precios.find((p) => p.tamano === tamano);
  return precio ? precio.desde : Number.POSITIVE_INFINITY;
}

/** Precio máximo entre todos los perfiles para un tamaño: sirve de tope del slider. */
export function topePrecio(tatuadores: Tatuador[], tamano: Tamano | "todos"): number {
  const valores = tatuadores
    .map((t) => precioDesde(t, tamano))
    .filter((v) => Number.isFinite(v));
  if (valores.length === 0) return 0;
  // Redondeo hacia arriba a la decena de miles más cercana.
  return Math.ceil(Math.max(...valores) / 10000) * 10000;
}

function coincideTexto(tatuador: Tatuador, texto: string): boolean {
  const q = normalizar(texto);
  if (!q) return true;
  const campos = [
    tatuador.nombre,
    tatuador.ciudad,
    tatuador.barrio,
    ...tatuador.estilos,
    ...tatuador.promos.map((p) => p.tipo),
  ];
  return campos.some((campo) => normalizar(campo).includes(q));
}

export function filtrarTatuadores(tatuadores: Tatuador[], filtros: Filtros): Tatuador[] {
  const resultado = tatuadores.filter((t) => {
    if (!coincideTexto(t, filtros.texto)) return false;
    if (filtros.ciudad && t.ciudad !== filtros.ciudad) return false;
    if (filtros.estilos.length > 0 && !filtros.estilos.some((e) => t.estilos.includes(e))) {
      return false;
    }
    if (Number.isFinite(filtros.precioMax) && precioDesde(t, filtros.tamano) > filtros.precioMax) {
      return false;
    }
    return true;
  });

  const porPrecio = (a: Tatuador, b: Tatuador) =>
    precioDesde(a, filtros.tamano) - precioDesde(b, filtros.tamano);

  switch (filtros.orden) {
    case "precio-asc":
      return resultado.sort(porPrecio);
    case "precio-desc":
      return resultado.sort((a, b) => porPrecio(b, a));
    case "experiencia":
      return resultado.sort((a, b) => b.experiencia - a.experiencia);
    default:
      return resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }
}
