/**
 * Query functions untuk pengaturan situs (footer info, sosmed, dll).
 */
import { createClient } from "@/lib/supabase/server";
import type { SiteSettingsMap } from "@/lib/types/database.types";

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) {
    throw new Error(`Gagal mengambil pengaturan: ${error.message}`);
  }

  return (data ?? []).reduce<SiteSettingsMap>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const settings = await getSiteSettings();
  return settings[key] ?? null;
}
