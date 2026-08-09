"use server";

/**
 * Server Actions untuk manajemen CRUD Produk Kinobo.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import type { Product } from "@/lib/types/database.types";

export interface ActionResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  productId?: string;
}

/**
 * Membuat produk baru di database.
 */
export async function createProduct(
  data: ProductFormValues
): Promise<ActionResponse<Product>> {
  const { supabase } = await requireAdmin();

  const validation = productFormSchema.safeParse(data);
  if (!validation.success) {
    const errorMessage = validation.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessage };
  }

  const { slug, name, category_id, description, base_price, is_active } =
    validation.data;

  // Cek keunikan slug
  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    return {
      success: false,
      error: `Slug "${slug}" sudah digunakan oleh produk lain`,
    };
  }

  try {
    const { data: newProduct, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        category_id: category_id || null,
        description: description || null,
        base_price,
        is_active,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: `Gagal membuat produk: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/kategori/[slug]", "page");
    revalidatePath("/produk/[slug]", "page");
    revalidatePath("/admin/produk");

    return {
      success: true,
      data: newProduct,
      productId: newProduct.id,
    };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}

/**
 * Memperbarui produk yang sudah ada.
 */
export async function updateProduct(
  id: string,
  data: ProductFormValues
): Promise<ActionResponse<Product>> {
  const { supabase } = await requireAdmin();

  const validation = productFormSchema.safeParse(data);
  if (!validation.success) {
    const errorMessage = validation.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessage };
  }

  const { slug, name, category_id, description, base_price, is_active } =
    validation.data;

  // Cek keunikan slug (pastikan tidak dimiliki oleh produk lain)
  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (existingSlug) {
    return {
      success: false,
      error: `Slug "${slug}" sudah digunakan oleh produk lain`,
    };
  }

  try {
    const { data: updatedProduct, error } = await supabase
      .from("products")
      .update({
        name,
        slug,
        category_id: category_id || null,
        description: description || null,
        base_price,
        is_active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Gagal memperbarui produk: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/kategori/[slug]", "page");
    revalidatePath("/produk/[slug]", "page");
    revalidatePath("/admin/produk");

    return { success: true, data: updatedProduct, productId: id };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}

/**
 * Menghapus produk. Menolak hapus jika produk masih memiliki varian.
 */
export async function deleteProduct(id: string): Promise<ActionResponse> {
  const { supabase } = await requireAdmin();

  try {
    // Cek apakah masih ada varian
    const { count, error: countError } = await supabase
      .from("product_variants")
      .select("id", { count: "exact", head: true })
      .eq("product_id", id);

    if (countError) {
      return {
        success: false,
        error: `Gagal mengecek varian produk: ${countError.message}`,
      };
    }

    if (count && count > 0) {
      return {
        success: false,
        error: "Produk masih punya varian, hapus varian dulu",
      };
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return {
        success: false,
        error: `Gagal menghapus produk: ${deleteError.message}`,
      };
    }

    revalidatePath("/");
    revalidatePath("/kategori/[slug]", "page");
    revalidatePath("/produk/[slug]", "page");
    revalidatePath("/admin/produk");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}
