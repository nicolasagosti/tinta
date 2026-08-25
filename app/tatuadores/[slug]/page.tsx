import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Galeria from "@/components/Galeria";
import { DETALLE_TAMANO, ETIQUETA_TAMANO } from "@/data/tatuadores";
import { getTatuador } from "@/lib/data/tatuadores";
import { formatearPrecio } from "@/lib/filtros";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tatuador = await getTatuador(slug);
  if (!tatuador) return { title: "Tatuador no encontrado" };
  return {
    title: `${tatuador.nombre} — ${tatuador.estilos.join(", ")} en ${tatuador.ciudad}`,
    description: `${tatuador.nombre} · ${tatuador.estilos.join(", ")} en ${tatuador.ciudad}`,
  };
}

/** Convierte "+54 9 11 4455-6677" en un link de wa.me. */
function linkWhatsapp(numero: string): string {
  return `https://wa.me/${numero.replace(/\D/g, "")}`;
}

export default async function PerfilTatuador({ params }: Props) {
  const { slug } = await params;
  const tatuador = await getTatuador(slug);
  if (!tatuador) notFound();

  const { contacto } = tatuador;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-tinta-500 transition-colors hover:text-tinta-100"
      >
        ← Volver al directorio
      </Link>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          src={tatuador.foto}
          alt={`Foto de ${tatuador.nombre}`}
          className="h-28 w-28 shrink-0 rounded-2xl border border-tinta-700 object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tatuador.nombre}</h1>
          <p className="mt-1 text-tinta-300">{tatuador.ciudad}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tatuador.estilos.map((estilo) => (
              <span
                key={estilo}
                className="rounded-full bg-acento/15 px-3 py-1 text-xs text-acento-suave"
              >
                {estilo}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Trabajos</h2>
          <Galeria trabajos={tatuador.trabajos} autor={tatuador.nombre} />

          <h2 className="mb-3 mt-10 text-lg font-semibold">Precios por tamaño</h2>
          <div className="overflow-hidden rounded-2xl border border-tinta-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-tinta-900 text-xs uppercase tracking-wide text-tinta-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Tamaño</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                </tr>
              </thead>
              <tbody>
                {tatuador.precios.map((precio) => (
                  <tr key={precio.tamano} className="border-t border-tinta-800">
                    <td className="px-4 py-3">
                      <div className="font-medium">{ETIQUETA_TAMANO[precio.tamano]}</div>
                      <div className="text-xs text-tinta-500">
                        {DETALLE_TAMANO[precio.tamano]}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-acento-suave">
                      {precio.desde === precio.hasta
                        ? formatearPrecio(precio.desde)
                        : `${formatearPrecio(precio.desde)} – ${formatearPrecio(precio.hasta)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-tinta-500">
            Valores de referencia. El precio final depende del diseño, la zona y el detalle.
          </p>

          {tatuador.promos.length > 0 && (
            <>
              <h2 className="mb-3 mt-10 text-lg font-semibold">Promos</h2>
              <div className="flex flex-wrap gap-3">
                {tatuador.promos.map((promo) => (
                  <div
                    key={promo.id}
                    className="rounded-xl border border-acento/40 bg-acento/10 px-4 py-3"
                  >
                    <p className="font-semibold text-acento-suave">
                      {promo.tipo} en {ETIQUETA_TAMANO[promo.tamano].toLowerCase()}
                    </p>
                    <p className="text-sm text-tinta-300">{formatearPrecio(promo.precio)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-tinta-800 bg-tinta-900 p-5">
            <h2 className="mb-4 text-lg font-semibold">Contacto</h2>
            <div className="space-y-2 text-sm">
              {contacto.whatsapp && (
                <a
                  href={linkWhatsapp(contacto.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg bg-acento px-4 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
                >
                  WhatsApp <span className="text-xs opacity-80">{contacto.whatsapp}</span>
                </a>
              )}
              {contacto.instagram && (
                <a
                  href={`https://instagram.com/${contacto.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-tinta-700 px-4 py-2.5 transition-colors hover:border-tinta-500"
                >
                  Instagram <span className="text-xs text-tinta-500">{contacto.instagram}</span>
                </a>
              )}
              {contacto.email && (
                <a
                  href={`mailto:${contacto.email}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-tinta-700 px-4 py-2.5 transition-colors hover:border-tinta-500"
                >
                  Mail{" "}
                  <span className="truncate text-xs text-tinta-500">{contacto.email}</span>
                </a>
              )}
              {contacto.web && (
                <a
                  href={contacto.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-tinta-700 px-4 py-2.5 transition-colors hover:border-tinta-500"
                >
                  Sitio web <span className="text-xs text-tinta-500">↗</span>
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
