"use server";

/**
 * Server Actions untuk manajemen pengaturan situs (site_settings).
 */
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormValues,
} from "@/lib/validations/settings";
import type { ActionResponse } from "./products";

/**
 * Memperbarui pengaturan situs (footer info, sosmed, WhatsApp) dengan operasi upsert key-value.
 */
export async function updateSiteSettings(
  data: SiteSettingsFormValues
): Promise<ActionResponse> {
  const { supabase } = await requireAdmin();

  const validation = siteSettingsFormSchema.safeParse(data);
  if (!validation.success) {
    const errorMessage = validation.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessage };
  }

  const settingsEntries = Object.entries(validation.data).map(([key, value]) => ({
    key,
    value: value ?? "",
  }));

  try {
    const { error } = await supabase
      .from("site_settings")
      .upsert(settingsEntries, { onConflict: "key" });

    if (error) {
      return {
        success: false,
        error: `Gagal memperbarui pengaturan: ${error.message}`,
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/pengaturan");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga";
    return { success: false, error: errorMsg };
  }
}
