/**
 * Helper upload file ke Supabase Storage dan generate public URL.
 * Digunakan oleh komponen MediaUploader di panel admin.
 */
import { createClient } from "@/lib/supabase/client";

export type StorageBucket = "product-images" | "product-videos" | "banners";

const MIME_TO_BUCKET: Record<string, StorageBucket> = {
  "image/jpeg": "product-images",
  "image/png": "product-images",
  "image/webp": "product-images",
  "image/gif": "product-images",
  "video/mp4": "product-videos",
  "video/webm": "product-videos",
};

export function getBucketForMime(mimeType: string): StorageBucket | null {
  return MIME_TO_BUCKET[mimeType] ?? null;
}

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  folder = ""
): Promise<{ path: string; publicUrl: string }> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const path = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`);
  }

  return { path, publicUrl: getPublicUrl(bucket, path) };
}

export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Hapus file gagal: ${error.message}`);
  }
}
