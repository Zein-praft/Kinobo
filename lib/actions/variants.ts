"use server";

/**
 * Server Actions untuk manajemen CRUD Varian Produk Kinobo & penyesuaian stok.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import {
  variantFormSchema,
  type VariantFormValues,
} from "@/lib/validations/variant";
import type { ProductVariant } from "@/lib/types/database.types";
import type { ActionResponse } from "./products";

/**
 * Membuat varian produk baru.
 */
export async function createVariant(
  data: VariantFormValues
): Promise<ActionResponse<ProductVariant>> {
  const { supabase } = await requireAdmin();

  const validation = variantFormSchema.safeParse(data);
  if (!validation.success) {
    const errorMessage = validation.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessage };
  }

  const { product_id, size, color, stock, price_override, sku } =
    validation.data;

  // Cek keunikan SKU
  const { data: existingSku } = await supabase
    .from("product_variants")
    .select("id")
    .eq("sku", sku)
    .maybeSingle();

  if (existingSku) {
    return {
      success: false,
      error: `SKU "${sku}" sudah digunakan oleh varian lain`,
    };
  }

  try {
    const { data: newVariant, error } = await supabase
      .from("product_variants")
      .insert({
        product_id,
        size,
        color,
        stock,
        price_override: price_override ?? null,
        sku,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: `Gagal membuat varian: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/produk");
    revalidatePath("/produk/[slug]", "page");

    return { success: true, data: newVariant };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}

/**
 * Memperbarui varian produk.
 */
export async function updateVariant(
  id: string,
  data: VariantFormValues
): Promise<ActionResponse<ProductVariant>> {
  const { supabase } = await requireAdmin();

  const validation = variantFormSchema.safeParse(data);
  if (!validation.success) {
    const errorMessage = validation.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessage };
  }

  const { product_id, size, color, stock, price_override, sku } =
    validation.data;

  // Cek keunikan SKU (kecuali varian ini sendiri)
  const { data: existingSku } = await supabase
    .from("product_variants")
    .select("id")
    .eq("sku", sku)
    .neq("id", id)
    .maybeSingle();

  if (existingSku) {
    return {
      success: false,
      error: `SKU "${sku}" sudah digunakan oleh varian lain`,
    };
  }

  try {
    const { data: updatedVariant, error } = await supabase
      .from("product_variants")
      .update({
        product_id,
        size,
        color,
        stock,
        price_override: price_override ?? null,
        sku,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Gagal memperbarui varian: ${error.message}`,
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/produk");
    revalidatePath("/produk/[slug]", "page");

    return { success: true, data: updatedVariant };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}

/**
 * Menghapus varian produk.
 */
export async function deleteVariant(id: string): Promise<ActionResponse> {
  const { supabase } = await requireAdmin();

  try {
    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: `Gagal menghapus varian: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/produk");
    revalidatePath("/produk/[slug]", "page");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}

/**
 * Mengubah stok varian secara atomik.
 * Reusable untuk manajemen admin dan integrasi sistem checkout/payment gateway.
 */
export async function adjustStock(
  variantId: string,
  delta: number
): Promise<ActionResponse> {
  const supabase = await createClient();

  try {
    // Ambil stok varian saat ini
    const { data: variant, error: selectError } = await supabase
      .from("product_variants")
      .select("stock")
      .eq("id", variantId)
      .single();

    if (selectError || !variant) {
      return { success: false, error: "Varian produk tidak ditemukan" };
    }

    const newStock = variant.stock + delta;
    if (newStock < 0) {
      return { success: false, error: "Stok tidak mencukupi" };
    }

    // Update stok dengan perbandingan optimis
    const { error: updateError } = await supabase
      .from("product_variants")
      .update({ stock: newStock })
      .eq("id", variantId)
      .eq("stock", variant.stock);

    if (updateError) {
      return {
        success: false,
        error: `Gagal memperbarui stok: ${updateError.message}`,
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/produk");
    revalidatePath("/produk/[slug]", "page");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}
