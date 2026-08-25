import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente sin cookies, para las páginas públicas del directorio.
 * No toca `cookies()`, así `app/page.tsx` y `app/tatuadores/[slug]/page.tsx`
 * pueden seguir siendo estáticas/ISR en vez de volverse dinámicas.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
