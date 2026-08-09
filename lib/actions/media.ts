"use server";

/**
 * Server Actions untuk manajemen media produk (gambar/video).
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { deleteFile, type StorageBucket } from "@/lib/supabase/storage";
import type { MediaType, ProductMedia } from "@/lib/types/database.types";
import type { ActionResponse } from "./products";

export interface AttachMediaInput {
  type: MediaType;
  url: string;
  sort_order: number;
  variant_id?: string | null;
}

/**
 * Menghubungkan record media baru ke tabel `product_media`.
 */
export async function attachMedia(
  productId: string,
  media: AttachMediaInput
): Promise<ActionResponse<ProductMedia>> {
  const { supabase } = await requireAdmin();

  try {
    const { data: newMedia, error } = await supabase
      .from("product_media")
      .insert({
        product_id: productId,
        type: media.type,
        url: media.url,
        sort_order: media.sort_order ?? 0,
        variant_id: media.variant_id ?? null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: `Gagal menyimpan media: ${error.message}` };
    }

    revalidatePath("/admin/produk");
    revalidatePath("/produk/[slug]", "page");

    return { success: true, data: newMedia };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}

/**
 * Menghapus record media dan mencoba menghapus file fisik di Supabase Storage.
 */
export async function deleteMedia(mediaId: string): Promise<ActionResponse> {
  const { supabase } = await requireAdmin();

  try {
    // Ambil data media untuk mendapatkan URL
    const { data: media, error: fetchError } = await supabase
      .from("product_media")
      .select("url, product_id")
      .eq("id", mediaId)
      .single();

    if (fetchError || !media) {
      return { success: false, error: "Media tidak ditemukan" };
    }

    // Hapus baris DB terlebih dahulu
    const { error: deleteError } = await supabase
      .from("product_media")
      .delete()
      .eq("id", mediaId);

    if (deleteError) {
      return { success: false, error: `Gagal menghapus media: ${deleteError.message}` };
    }

    // Mencoba hapus file fisik di Storage jika URL berformat public Supabase
    if (media.url.includes("/storage/v1/object/public/")) {
      try {
        const relativePath = media.url.split("/storage/v1/object/public/")[1];
        if (relativePath) {
          const firstSlashIndex = relativePath.indexOf("/");
          if (firstSlashIndex !== -1) {
            const bucket = relativePath.substring(0, firstSlashIndex) as StorageBucket;
            const filePath = relativePath.substring(firstSlashIndex + 1);
            await deleteFile(bucket, filePath);
          }
        }
      } catch (storageErr) {
        console.warn("Gagal menghapus file dari storage:", storageErr);
      }
    }

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
 * Mengubah urutan galeri media secara batch.
 */
export async function reorderMedia(
  updates: { id: string; sort_order: number }[]
): Promise<ActionResponse> {
  const { supabase } = await requireAdmin();

  try {
    for (const update of updates) {
      const { error } = await supabase
        .from("product_media")
        .update({ sort_order: update.sort_order })
        .eq("id", update.id);

      if (error) {
        return { success: false, error: `Gagal mengurutkan media: ${error.message}` };
      }
    }

    revalidatePath("/admin/produk");
    revalidatePath("/produk/[slug]", "page");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}
