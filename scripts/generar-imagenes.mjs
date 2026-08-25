/**
 * Genera imágenes SVG de muestra para cada ruta declarada en data/tatuadores.ts.
 * Son placeholders: reemplazá los archivos de public/img/ por fotos reales
 * (mismo nombre) o cambiá las rutas en el archivo de datos.
 *
 * Uso: node scripts/generar-imagenes.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const datos = readFileSync(join(raiz, "data", "tatuadores.ts"), "utf8");

const rutas = [...new Set(datos.match(/\/img\/[^"']+\.svg/g) ?? [])];

function hash(texto) {
  let h = 0;
  for (const char of texto) h = (h * 31 + char.codePointAt(0)) % 360;
  return h;
}

function iniciales(slug) {
  return slug
    .split("-")
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

function svgPerfil(slug) {
  const tono = hash(slug);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${tono} 30% 26%)"/>
      <stop offset="100%" stop-color="hsl(${(tono + 40) % 360} 35% 12%)"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <circle cx="200" cy="160" r="62" fill="hsl(${tono} 18% 70%)" opacity="0.35"/>
  <path d="M80 400c0-70 54-118 120-118s120 48 120 118z" fill="hsl(${tono} 18% 70%)" opacity="0.35"/>
  <text x="200" y="372" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="34" font-weight="700" fill="#fff" opacity="0.75">${iniciales(slug)}</text>
</svg>
`;
}

function svgTrabajo(nombre) {
  const tono = hash(nombre);
  const semilla = hash(nombre + "x");
  const figuras = Array.from({ length: 7 }, (_, i) => {
    const x = (semilla * (i + 3)) % 400;
    const y = (semilla * (i + 7)) % 400;
    const r = 20 + ((semilla + i * 37) % 90);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="hsl(${tono} 25% 80%)" stroke-width="${1 + (i % 3)}" opacity="0.4"/>`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="hsl(${tono} 12% 10%)"/>
  ${figuras}
  <path d="M60 340 Q200 220 340 340" fill="none" stroke="hsl(${tono} 40% 65%)" stroke-width="3" opacity="0.6"/>
  <path d="M60 300 Q200 180 340 300" fill="none" stroke="hsl(${tono} 40% 65%)" stroke-width="2" opacity="0.35"/>
</svg>
`;
}

for (const ruta of rutas) {
  const destino = join(raiz, "public", ruta);
  const nombre = ruta.split("/").pop().replace(".svg", "");
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(
    destino,
    ruta.includes("/perfil/") ? svgPerfil(nombre) : svgTrabajo(nombre),
    "utf8"
  );
}

console.log(`Generadas ${rutas.length} imágenes en public/img/`);
