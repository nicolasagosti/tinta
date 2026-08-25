export const TAMANOS = ["pequeno", "mediano", "grande", "sesion"] as const;

export type Tamano = (typeof TAMANOS)[number];

export const ETIQUETA_TAMANO: Record<Tamano, string> = {
  pequeno: "Pequeño",
  mediano: "Mediano",
  grande: "Grande",
  sesion: "Sesión completa",
};

export const DETALLE_TAMANO: Record<Tamano, string> = {
  pequeno: "Hasta 8 cm · 1 a 2 horas",
  mediano: "8 a 15 cm · 2 a 4 horas",
  grande: "Más de 15 cm · 4 a 6 horas",
  sesion: "Jornada completa · 6 a 8 horas",
};

export type Precio = {
  tamano: Tamano;
  /** Precio de referencia "desde", en pesos argentinos. */
  desde: number;
  /** Precio de referencia "hasta". Igual a `desde` si es un valor fijo. */
  hasta: number;
};

export type Trabajo = {
  id: string;
  titulo: string;
  estilo: string;
  imagen: string;
};

export type Tatuador = {
  slug: string;
  nombre: string;
  ciudad: string;
  estudio: string;
  bio: string;
  foto: string;
  estilos: string[];
  experiencia: number;
  contacto: {
    instagram?: string;
    whatsapp?: string;
    email?: string;
    web?: string;
  };
  precios: Precio[];
  trabajos: Trabajo[];
};
