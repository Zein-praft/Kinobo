/**
 * Supabase browser client untuk Client Components.
 * Session disimpan di cookie via @supabase/ssr sehingga tetap sinkron dengan server.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
