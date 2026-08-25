"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function NavAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setListo(true);
    });

    const { data: subscripcion } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscripcion.subscription.unsubscribe();
  }, []);

  if (!listo) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-tinta-700 px-3 py-1.5 text-sm text-tinta-100 transition-colors hover:border-tinta-500"
      >
        Ingresar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/panel" className="transition-colors hover:text-tinta-100">
        Mi panel
      </Link>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="rounded-lg border border-tinta-700 px-3 py-1.5 text-sm text-tinta-300 transition-colors hover:border-tinta-500 hover:text-tinta-100"
        >
          Salir
        </button>
      </form>
    </div>
  );
}
