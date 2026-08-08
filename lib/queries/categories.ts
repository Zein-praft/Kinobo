/**
 * Query functions untuk kategori produk.
 */
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/database.types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Gagal mengambil kategori: ${error.message}`);
  }

  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Gagal mengambil kategori: ${error.message}`);
  }

  return data;
}
