import type { Metadata } from "next";
import Link from "next/link";
import NavAuth from "@/components/NavAuth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tinta — Directorio de tatuadores",
  description:
    "Encontrá tatuadores por estilo, ciudad y precio. Mirá sus trabajos y contactalos directo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-30 border-b border-tinta-800 bg-tinta-950/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-acento text-sm font-black text-white">
                T
              </span>
              <span className="text-lg font-semibold tracking-tight">Tinta</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-tinta-300">
              <Link href="/" className="transition-colors hover:text-tinta-100">
                Tatuadores
              </Link>
              <a
                href="#como-funciona"
                className="hidden transition-colors hover:text-tinta-100 sm:block"
              >
                Cómo funciona
              </a>
              <NavAuth />
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer
          id="como-funciona"
          className="mt-20 border-t border-tinta-800 bg-tinta-900/40"
        >
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-tinta-100">Buscá</h3>
              <p className="text-sm text-tinta-300">
                Filtrá por estilo, ciudad o presupuesto para el tamaño de tatuaje que querés.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-tinta-100">Mirá el trabajo</h3>
              <p className="text-sm text-tinta-300">
                Cada perfil tiene galería de tatuajes, estilos y lista de precios de referencia.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-tinta-100">Contactá</h3>
              <p className="text-sm text-tinta-300">
                Escribile directo por WhatsApp, Instagram o mail. Sin intermediarios.
              </p>
            </div>
          </div>
          <div className="border-t border-tinta-800 px-4 py-5 text-center text-xs text-tinta-500">
            Los precios son de referencia y pueden variar según el diseño y la zona del cuerpo.
          </div>
        </footer>
      </body>
    </html>
  );
}
