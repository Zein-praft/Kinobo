"use client";

/**
 * Uploader media produk — upload gambar/video ke Supabase Storage.
 * Digunakan di form admin produk untuk menambah media.
 */
import { useState } from "react";
import {
  uploadFile,
  getBucketForMime,
  type StorageBucket,
} from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";

interface MediaUploaderProps {
  folder?: string;
  onUpload?: (result: { path: string; publicUrl: string; bucket: StorageBucket }) => void;
}

export function MediaUploader({ folder, onUpload }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bucket = getBucketForMime(file.type);
    if (!bucket) {
      setError("Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, MP4, atau WebM.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadFile(bucket, file, folder);
      onUpload?.({ ...result, bucket });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium">Upload Media</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          onChange={handleFileChange}
          disabled={uploading}
          className="mt-1 block w-full text-sm"
        />
      </label>
      {uploading && <p className="text-sm text-gray-500">Mengupload...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="button" variant="secondary" disabled={uploading}>
        Pilih File
      </Button>
    </div>
  );
}
