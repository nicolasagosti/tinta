import Directorio from "@/components/Directorio";
import { getCiudadesDisponibles, getEstilosSugeridos, getTatuadores } from "@/lib/data/tatuadores";

export const revalidate = 60;

export default async function Home() {
  const [tatuadores, estilosDisponibles, ciudadesDisponibles] = await Promise.all([
    getTatuadores(),
    getEstilosSugeridos(),
    getCiudadesDisponibles(),
  ]);

  return (
    <>
      <section className="border-b border-tinta-800 bg-gradient-to-b from-tinta-900 to-tinta-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-acento-suave">
            Directorio de tatuadores
          </p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Encontrá al tatuador justo para lo que querés hacerte.
          </h1>
          <p className="mt-4 max-w-xl text-tinta-300">
            Filtrá por estilo, ciudad y presupuesto. Mirá los trabajos de cada artista y
            contactalo directo, sin vueltas.
          </p>
        </div>
      </section>

      <Directorio
        tatuadores={tatuadores}
        estilos={estilosDisponibles}
        ciudades={ciudadesDisponibles}
      />
    </>
  );
}
