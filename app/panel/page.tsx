import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEstilosDisponibles } from "@/lib/data/tatuadores";
import PanelCliente, { type PerfilCompleto } from "@/components/panel/PanelCliente";

export default async function PanelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: perfil, error }, estilosDisponibles] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "*, precios(tamano, desde, hasta), trabajos(id, titulo, estilo, imagen_url, orden), promos(id, tipo, tamano, precio)"
      )
      .eq("user_id", user.id)
      .maybeSingle(),
    getEstilosDisponibles(),
  ]);

  if (error || !perfil) {
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
