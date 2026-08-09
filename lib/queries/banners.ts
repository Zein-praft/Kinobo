/**
 * Query functions untuk banner halaman depan.
 */
import { createClient } from "@/lib/supabase/server";
import type { SiteBanner } from "@/lib/types/database.types";

export async function getActiveBanners(): Promise<SiteBanner[]> {
  const supabase = await createClient();

  // Filter tanggal aktif ditangani oleh RLS policy di database
  const { data, error } = await supabase
    .from("site_banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Gagal mengambil banner: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Mengambil seluruh banner (aktif & non-aktif) untuk halaman manajemen admin.
 */
export async function getAllBannersForAdmin(): Promise<SiteBanner[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Gagal mengambil banner admin: ${error.message}`);
  }

  return data ?? [];
}
