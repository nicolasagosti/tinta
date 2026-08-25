"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Precio, Tamano } from "@/data/tatuadores";
import { createClient } from "@/lib/supabase/client";
import PerfilForm, { type DatosPerfil } from "./PerfilForm";
import FotoPerfilUploader from "./FotoPerfilUploader";
import EstilosEditor from "./EstilosEditor";
import PreciosEditor from "./PreciosEditor";
import PortafolioManager, { type FotoPendiente } from "./PortafolioManager";

export type TrabajoRow = {
  id: string;
  titulo: string;
  estilo: string;
  imagen_url: string;
  orden: number;
};

export type PerfilCompleto = {
  id: string;
  user_id: string;
  slug: string;
  nombre: string;
  ciudad: string;
  estudio: string;
  bio: string;
  foto_url: string | null;
  estilos: string[];
  experiencia: number;
  contacto_instagram: string | null;
  contacto_whatsapp: string | null;
  contacto_email: string | null;
  contacto_web: string | null;
  precios: Precio[];
  trabajos: TrabajoRow[];
};

const TAMANOS_ORDEN: Tamano[] = ["pequeno", "mediano", "grande", "sesion"];

type FilaPrecio = { desde: number; hasta: number };

export default function PanelCliente({
  perfil,
  estilosDisponibles,
}: {
  userId: string;
  perfil: PerfilCompleto;
  estilosDisponibles: string[];
}) {
  const [form, setForm] = useState<DatosPerfil>({
    nombre: perfil.nombre,
    ciudad: perfil.ciudad,
    contacto_instagram: perfil.contacto_instagram ?? "",
    contacto_whatsapp: perfil.contacto_whatsapp ?? "",
    contacto_email: perfil.contacto_email ?? "",
    contacto_web: perfil.contacto_web ?? "",
  });

  const [estilos, setEstilos] = useState(perfil.estilos);

  const [precios, setPrecios] = useState<Record<Tamano, FilaPrecio>>(
    () =>
      Object.fromEntries(
        TAMANOS_ORDEN.map((t) => {
          const existente = perfil.precios.find((p) => p.tamano === t);
          return [t, { desde: existente?.desde ?? 0, hasta: existente?.hasta ?? 0 }];
        })
      ) as Record<Tamano, FilaPrecio>
  );

  const [fotoUrlActual, setFotoUrlActual] = useState(perfil.foto_url);
  const [fotoPerfilFile, setFotoPerfilFile] = useState<File | null>(null);
  const [fotoPreviewBlob, setFotoPreviewBlob] = useState<string | null>(null);

  useEffect(() => {
    if (!fotoPerfilFile) {
      setFotoPreviewBlob(null);
      return;
    }
    const url = URL.createObjectURL(fotoPerfilFile);
    setFotoPreviewBlob(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoPerfilFile]);

  const [trabajos, setTrabajos] = useState(perfil.trabajos);
  const [fotosNuevas, setFotosNuevas] = useState<FotoPendiente[]>([]);

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cambiarForm = (campo: keyof DatosPerfil, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const cambiarPrecio = (tamano: Tamano, campo: keyof FilaPrecio, valor: string) =>
    setPrecios((p) => ({ ...p, [tamano]: { ...p[tamano], [campo]: Number(valor) || 0 } }));

  const agregarFotos = (files: File[]) => {
    const nuevas = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setFotosNuevas((f) => [...f, ...nuevas]);
  };

  const quitarFotoNueva = (id: string) => {
    setFotosNuevas((f) => {
      const foto = f.find((x) => x.id === id);
      if (foto) URL.revokeObjectURL(foto.previewUrl);
      return f.filter((x) => x.id !== id);
    });
  };

  const borrarTrabajo = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("trabajos").delete().eq("id", id);
    if (!error) setTrabajos((t) => t.filter((trabajo) => trabajo.id !== id));
  };

  const guardarTodo = async () => {
    setGuardando(true);
    setMensaje(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMensaje("Tenés que iniciar sesión de nuevo.");
      setGuardando(false);
      return;
    }

    let huboError = false;
    let fotoUrl = fotoUrlActual;

    if (fotoPerfilFile) {
      const extension = fotoPerfilFile.name.split(".").pop();
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: subidaError } = await supabase.storage
        .from("perfil-fotos")
        .upload(path, fotoPerfilFile, { upsert: true });
      if (subidaError) {
        huboError = true;
        console.error("Error al subir foto de perfil:", subidaError.message);
      } else {
        const { data: publica } = supabase.storage.from("perfil-fotos").getPublicUrl(path);
        fotoUrl = publica.publicUrl;
      }
    }

    const { error: perfilError } = await supabase
      .from("profiles")
      .update({
        nombre: form.nombre,
        ciudad: form.ciudad,
        contacto_instagram: form.contacto_instagram || null,
        contacto_whatsapp: form.contacto_whatsapp || null,
        contacto_email: form.contacto_email || null,
        contacto_web: form.contacto_web || null,
        estilos,
        foto_url: fotoUrl,
      })
      .eq("id", perfil.id);
    if (perfilError) {
      huboError = true;
      console.error("Error al guardar el perfil:", perfilError.message);
    }

    const filasPrecios = TAMANOS_ORDEN.map((tamano) => ({
      profile_id: perfil.id,
      tamano,
      desde: precios[tamano].desde,
      hasta: precios[tamano].hasta || precios[tamano].desde,
    }));
    const { error: preciosError } = await supabase
      .from("precios")
      .upsert(filasPrecios, { onConflict: "profile_id,tamano" });
    if (preciosError) {
      huboError = true;
      console.error("Error al guardar precios:", preciosError.message);
    }

    if (fotosNuevas.length > 0) {
      const resultados = await Promise.all(
        fotosNuevas.map(async (foto, indice) => {
          const extension = foto.file.name.split(".").pop();
          const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
          const { error: subidaError } = await supabase.storage
            .from("trabajos-fotos")
            .upload(path, foto.file);
          if (subidaError) {
            console.error("Error al subir foto de trabajo:", subidaError.message);
            return null;
          }

          const { data: publica } = supabase.storage.from("trabajos-fotos").getPublicUrl(path);
          const { data: fila } = await supabase
            .from("trabajos")
            .insert({
              profile_id: perfil.id,
              titulo: "",
              estilo: "",
              imagen_url: publica.publicUrl,
              orden: trabajos.length + indice,
            })
            .select("id, titulo, estilo, imagen_url, orden")
            .single();
          return fila as TrabajoRow | null;
        })
      );

      const subidasOk = resultados.filter((f): f is TrabajoRow => f !== null);
      if (subidasOk.length > 0) setTrabajos((t) => [...t, ...subidasOk]);
      if (subidasOk.length < fotosNuevas.length) huboError = true;

      fotosNuevas.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      setFotosNuevas([]);
    }

    setFotoUrlActual(fotoUrl);
    setFotoPerfilFile(null);
    setGuardando(false);
    setMensaje(
      huboError ? "Guardamos casi todo, pero algo falló. Revisá y probá de nuevo." : "Cambios guardados."
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tu panel</h1>
          <p className="mt-1 text-sm text-tinta-300">
            Completá tu perfil para que aparezca en el directorio.
          </p>
        </div>
        <Link
          href={`/tatuadores/${perfil.slug}`}
          target="_blank"
          className="rounded-lg border border-tinta-700 px-3 py-1.5 text-sm text-tinta-300 transition-colors hover:border-tinta-500 hover:text-tinta-100"
        >
          Ver mi perfil público ↗
        </Link>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-tinta-300">
            Foto de perfil
          </h2>
          <FotoPerfilUploader
            previewUrl={fotoPreviewBlob ?? fotoUrlActual}
            onSeleccionar={setFotoPerfilFile}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-tinta-300">
            Datos del perfil
          </h2>
          <PerfilForm form={form} onChange={cambiarForm} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-tinta-300">
            Tipos de tatuaje que hacés
          </h2>
          <EstilosEditor
            estilos={estilos}
            estilosDisponibles={estilosDisponibles}
            onChange={setEstilos}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-tinta-300">
            Precios por tamaño
          </h2>
          <PreciosEditor precios={precios} tamanos={TAMANOS_ORDEN} onChange={cambiarPrecio} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-tinta-300">
            Fotos de trabajos
          </h2>
          <PortafolioManager
            trabajos={trabajos}
            fotosNuevas={fotosNuevas}
            onAgregarFotos={agregarFotos}
            onQuitarFotoNueva={quitarFotoNueva}
            onBorrarTrabajo={borrarTrabajo}
          />
        </section>
      </div>

      <div className="sticky bottom-4 mt-10 flex items-center gap-3 rounded-2xl border border-tinta-800 bg-tinta-900/95 p-4 backdrop-blur">
        <button
          type="button"
          onClick={guardarTodo}
          disabled={guardando}
          className="rounded-lg bg-acento px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
        {mensaje && <span className="text-sm text-tinta-300">{mensaje}</span>}
      </div>
    </div>
  );
}
