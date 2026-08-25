"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [cargando, setCargando] = useState(false);

  const entrarConGoogle = async () => {
    setCargando(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/panel`,
        // Fuerza el selector de cuentas de Google en vez de reusar la sesión activa del navegador.
        queryParams: { prompt: "select_account" },
      },
    });
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-acento text-lg font-black text-white">
        T
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight">Panel de tatuadores</h1>
      <p className="mt-2 text-sm text-tinta-300">
        Entrá con tu cuenta de Google para cargar tu perfil, tus trabajos y tus precios.
      </p>
      <button
        onClick={entrarConGoogle}
        disabled={cargando}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-tinta-700 bg-tinta-900 px-4 py-3 text-sm font-medium text-tinta-100 transition-colors hover:border-tinta-500 disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.44c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.1C3.24 21.3 7.28 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.26a12 12 0 0 0 0 10.74z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.24 2.7 1.26 6.63l4.01 3.1C6.22 6.86 8.87 4.75 12 4.75z"
          />
        </svg>
        {cargando ? "Redirigiendo…" : "Continuar con Google"}
      </button>
    </div>
  );
}
