import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getEstilosSugeridos } from "@/lib/data/tatuadores";
import PanelCliente, { type PerfilCompleto } from "@/components/panel/PanelCliente";

const SELECT_PERFIL =
  "*, precios(tamano, desde, hasta), trabajos(id, titulo, estilo, imagen_url, orden), promos(id, tipo, tamano, precio)";

function slugificar(texto: string): string {
  const base = texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "tatuador";
}

async function generarSlugUnico(supabase: SupabaseClient, base: string): Promise<string> {
  let candidato = base;
  let sufijo = 1;
  while (true) {
    const { data } = await supabase.from("profiles").select("id").eq("slug", candidato).maybeSingle();
    if (!data) return candidato;
    sufijo += 1;
    candidato = `${base}-${sufijo}`;
  }
}

/** Crea el perfil si el usuario está autenticado pero, por algún motivo, no tiene fila todavía. */
async function crearPerfilFaltante(supabase: SupabaseClient, user: { id: string; email?: string; user_metadata: Record<string, unknown> }) {
  const nombreBase =
    (user.user_metadata.full_name as string | undefined) ??
    (user.user_metadata.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Tatuador";
  const slugFinal = await generarSlugUnico(supabase, slugificar(nombreBase));

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      slug: slugFinal,
      nombre: nombreBase,
      foto_url: (user.user_metadata.avatar_url as string | undefined) ?? null,
    })
    .select(SELECT_PERFIL)
    .single();

  return { data, error };
}

export default async function PanelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: perfilInicial, error: errorInicial }, estilosDisponibles] = await Promise.all([
    supabase.from("profiles").select(SELECT_PERFIL).eq("user_id", user.id).maybeSingle(),
    getEstilosSugeridos(),
  ]);

  let perfil = perfilInicial;

  if (!errorInicial && !perfil) {
    const { data } = await crearPerfilFaltante(supabase, user);
    perfil = data;
  }

  if (!perfil) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-tinta-300">
          Todavía no pudimos crear tu perfil. Recargá la página en unos segundos.
        </p>
      </div>
    );
  }

  return (
    <PanelCliente
      userId={user.id}
      perfil={perfil as PerfilCompleto}
      estilosDisponibles={estilosDisponibles}
    />
  );
}
