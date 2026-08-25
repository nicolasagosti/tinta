import { createPublicClient } from "@/lib/supabase/public";
import { ESTILOS_CONOCIDOS, type Precio, type Promo, type Tatuador, type Trabajo } from "@/data/tatuadores";

type PrecioRow = { tamano: Precio["tamano"]; desde: number; hasta: number };
type TrabajoRow = { id: string; titulo: string; estilo: string; imagen_url: string; orden: number };
type PromoRow = { id: string; tipo: Promo["tipo"]; tamano: Promo["tamano"]; precio: number };
type ProfileRow = {
  slug: string;
  nombre: string;
  ciudad: string;
  barrio: string | null;
  estudio: string;
  bio: string;
  foto_url: string | null;
  estilos: string[];
  experiencia: number;
  contacto_instagram: string | null;
  contacto_whatsapp: string | null;
  contacto_email: string | null;
  contacto_web: string | null;
  precios: PrecioRow[];
  trabajos: TrabajoRow[];
  promos: PromoRow[];
};

const SELECT =
  "*, precios(tamano, desde, hasta), trabajos(id, titulo, estilo, imagen_url, orden), promos(id, tipo, tamano, precio)";

function mapRow(row: ProfileRow): Tatuador {
  return {
    slug: row.slug,
    nombre: row.nombre,
    ciudad: row.ciudad,
    barrio: row.barrio ?? "",
    estudio: row.estudio,
    bio: row.bio,
    foto: row.foto_url ?? "",
    estilos: row.estilos ?? [],
    experiencia: row.experiencia,
    contacto: {
      instagram: row.contacto_instagram ?? undefined,
      whatsapp: row.contacto_whatsapp ?? undefined,
      email: row.contacto_email ?? undefined,
      web: row.contacto_web ?? undefined,
    },
    precios: [...(row.precios ?? [])].sort(
      (a, b) => a.tamano.localeCompare(b.tamano)
    ),
    trabajos: [...(row.trabajos ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map((t): Trabajo => ({ id: t.id, titulo: t.titulo, estilo: t.estilo, imagen: t.imagen_url })),
    promos: row.promos ?? [],
  };
}

export async function getTatuadores(): Promise<Tatuador[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("profiles").select(SELECT);
  if (error) {
    console.error("Error al traer tatuadores:", error.message);
    return [];
  }
  return (data as ProfileRow[]).map(mapRow);
}

export async function getTatuador(slug: string): Promise<Tatuador | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapRow(data as ProfileRow);
}

export async function getEstilosDisponibles(): Promise<string[]> {
  const tatuadores = await getTatuadores();
  return Array.from(new Set(tatuadores.flatMap((t) => t.estilos))).sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

/** Lista de estilos para filtros/sugerencias: los más conocidos primero, más los que
 * ya haya cargado algún tatuador y no estén en esa lista. */
export async function getEstilosSugeridos(): Promise<string[]> {
  const disponibles = await getEstilosDisponibles();
  return Array.from(new Set([...ESTILOS_CONOCIDOS, ...disponibles]));
}

export async function getCiudadesDisponibles(): Promise<string[]> {
  const tatuadores = await getTatuadores();
  return Array.from(new Set(tatuadores.map((t) => t.ciudad))).sort((a, b) =>
    a.localeCompare(b, "es")
  );
}
