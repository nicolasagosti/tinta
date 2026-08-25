import { NextResponse } from "next/server";

type ResultadoNominatim = {
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 3) {
    return NextResponse.json({ resultados: [] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", q);
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "ar");

  const respuesta = await fetch(url, {
    headers: { "User-Agent": "TintaApp/1.0 (directorio de tatuadores)" },
  });

  if (!respuesta.ok) {
    return NextResponse.json({ resultados: [] });
  }

  const datos: ResultadoNominatim[] = await respuesta.json();

  const resultados = Array.from(
    new Set(
      datos.map((item) => {
        const ciudad = item.address?.city ?? item.address?.town ?? item.address?.village;
        const provincia = item.address?.state;
        if (ciudad && provincia && ciudad !== provincia) return `${ciudad}, ${provincia}`;
        return ciudad ?? item.display_name;
      })
    )
  ).slice(0, 6);

  return NextResponse.json({ resultados });
}
