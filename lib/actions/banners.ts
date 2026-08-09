"use server";

/**
 * Server Actions untuk manajemen CRUD Banner Halaman Depan Kinobo.
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  bannerFormSchema,
  type BannerFormValues,
} from "@/lib/validations/banner";
import type { SiteBanner } from "@/lib/types/database.types";
import type { ActionResponse } from "./products";

/**
 * Membuat banner baru.
 */
export async function createBanner(
  data: BannerFormValues
): Promise<ActionResponse<SiteBanner>> {
  const { supabase } = await requireAdmin();

  const validation = bannerFormSchema.safeParse(data);
  if (!validation.success) {
    const errorMessage = validation.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessage };
  }

  const {
    image_url,
    title,
    subtitle,
    link_url,
    sort_order,
    is_active,
    start_date,
    end_date,
  } = validation.data;

  try {
    const { data: newBanner, error } = await supabase
      .from("site_banners")
      .insert({
        image_url,
        title: title || null,
        subtitle: subtitle || null,
        link_url: link_url || null,
        sort_order,
        is_active,
        start_date: start_date || null,
        end_date: end_date || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: `Gagal membuat banner: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/banner");

    return { success: true, data: newBanner };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}

/**
 * Memperbarui banner yang sudah ada.
 */
export async function updateBanner(
  id: string,
  data: BannerFormValues
): Promise<ActionResponse<SiteBanner>> {
  const { supabase } = await requireAdmin();

  const validation = bannerFormSchema.safeParse(data);
  if (!validation.success) {
    const errorMessage = validation.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessage };
  }

  const {
    image_url,
    title,
    subtitle,
    link_url,
    sort_order,
    is_active,
    start_date,
    end_date,
  } = validation.data;

  try {
    const { data: updatedBanner, error } = await supabase
      .from("site_banners")
      .update({
        image_url,
        title: title || null,
        subtitle: subtitle || null,
        link_url: link_url || null,
        sort_order,
        is_active,
        start_date: start_date || null,
        end_date: end_date || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Gagal memperbarui banner: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/banner");

    return { success: true, data: updatedBanner };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}

/**
 * Menghapus banner.
 */
export async function deleteBanner(id: string): Promise<ActionResponse> {
  const { supabase } = await requireAdmin();

  try {
    const { error } = await supabase
      .from("site_banners")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: `Gagal menghapus banner: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/banner");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}
