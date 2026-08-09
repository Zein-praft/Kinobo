/**
 * Helper autentikasi & otorisasi Supabase Server.
 * Memverifikasi session user dan hak akses admin via RPC `is_admin()`.
 */
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Memastikan request dipanggil oleh user terautentikasi yang terdaftar di `admin_users`.
 * Jika tidak terautentikasi atau bukan admin, otomatis mere-redirect ke `/login`.
 *
 * @returns Object berisi `user` yang terautentikasi dan instance `supabase` server client.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    redirect("/login");
  }

  return { user, supabase };
}
