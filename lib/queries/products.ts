/**
 * Query functions untuk produk — dijalankan via Server Component / Server Action.
 */
import { createClient } from "@/lib/supabase/server";
import type { Product, ProductWithDetails, ProductMedia } from "@/lib/types/database.types";

export interface GetProductsOptions {
  categorySlug?: string;
  page?: number;
  limit?: number;
}

export type ProductWithMedia = Product & { media: ProductMedia[] };

export interface PaginatedProducts {
  products: ProductWithMedia[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<PaginatedProducts> {
  const { categorySlug, page = 1, limit = 12 } = options;
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let categoryId: string | undefined;

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (!category) {
      return { products: [], total: 0, page, limit, totalPages: 0 };
    }
    categoryId = category.id;
  }

  let query = supabase
    .from("products")
    .select("*, media:product_media(*)", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Gagal mengambil produk: ${error.message}`);
  }

  const total = count ?? 0;

  // Urutkan media berdasarkan sort_order
  const productsWithSortedMedia = (data ?? []).map((p: any) => {
    if (p.media) {
      p.media.sort((a: any, b: any) => a.sort_order - b.sort_order);
    }
    return p as ProductWithMedia;
  });

  return {
    products: productsWithSortedMedia,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithDetails | null> {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      variants:product_variants(*),
      media:product_media(*)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .order("sort_order", { referencedTable: "product_media", ascending: true })
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Gagal mengambil produk: ${error.message}`);
  }

  return product as ProductWithDetails;
}

export async function getProductsByCategorySlug(
  categorySlug: string,
  options: Omit<GetProductsOptions, "categorySlug"> = {}
): Promise<PaginatedProducts> {
  return getProducts({ ...options, categorySlug });
}

/**
 * Mengambil semua produk (aktif & non-aktif) beserta rincian varian & media untuk halaman admin.
 */
export async function getAllProductsForAdmin(): Promise<ProductWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      variants:product_variants(*),
      media:product_media(*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil daftar produk admin: ${error.message}`);
  }

  return (data ?? []) as ProductWithDetails[];
}

/**
 * Mengambil satu produk berdasarkan ID beserta varian & media untuk form edit admin.
 */
export async function getProductByIdForAdmin(
  id: string
): Promise<ProductWithDetails | null> {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      variants:product_variants(*),
      media:product_media(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Gagal mengambil produk admin: ${error.message}`);
  }

  return product as ProductWithDetails;
}
