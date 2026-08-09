"use client";

/**
 * Form admin banner — kelola banner halaman depan dengan validasi zod.
 * Terhubung dengan Server Actions `createBanner` dan `updateBanner`.
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bannerFormSchema,
  type BannerFormValues,
} from "@/lib/validations/banner";
import { createBanner, updateBanner } from "@/lib/actions/banners";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaUploader } from "@/components/admin/MediaUploader";
import type { SiteBanner } from "@/lib/types/database.types";

interface BannerFormProps {
  banner?: SiteBanner | null;
  onSuccess?: () => void;
}

export function BannerForm({ banner, onSuccess }: BannerFormProps) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEditMode = !!banner;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      image_url: banner?.image_url ?? "",
      title: banner?.title ?? "",
      subtitle: banner?.subtitle ?? "",
      link_url: banner?.link_url ?? "",
      sort_order: banner?.sort_order ?? 0,
      is_active: banner?.is_active ?? true,
      start_date: banner?.start_date ?? undefined,
      end_date: banner?.end_date ?? undefined,
    },
  });

  useEffect(() => {
    if (banner) {
      reset({
        image_url: banner.image_url,
        title: banner.title ?? "",
        subtitle: banner.subtitle ?? "",
        link_url: banner.link_url ?? "",
        sort_order: banner.sort_order,
        is_active: banner.is_active,
        start_date: banner.start_date ?? undefined,
        end_date: banner.end_date ?? undefined,
      });
    }
  }, [banner, reset]);

  const imageUrl = watch("image_url");

  const onSubmit = async (data: BannerFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    let res;
    if (isEditMode && banner) {
      res = await updateBanner(banner.id, data);
    } else {
      res = await createBanner(data);
    }

    if (!res.success) {
      setErrorMessage(res.error ?? "Gagal menyimpan banner");
    } else {
      setSuccessMessage(
        isEditMode
          ? "Banner berhasil diperbarui!"
          : "Banner baru berhasil dibuat!"
      );
      if (!isEditMode) {
        reset({
          image_url: "",
          title: "",
          subtitle: "",
          link_url: "",
          sort_order: 0,
          is_active: true,
        });
      }
      router.refresh();
      onSuccess?.();
    }
  };

  return (
    <Card title={isEditMode ? "Edit Banner" : "Tambah Banner Baru"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {successMessage && (
          <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Gambar Banner</label>
          <MediaUploader
            folder="banners"
            onUpload={({ publicUrl }) => setValue("image_url", publicUrl)}
          />
          {imageUrl && (
            <div className="mt-2 relative rounded overflow-hidden border">
              <img
                src={imageUrl}
                alt="Banner Preview"
                className="h-32 w-full object-cover"
              />
            </div>
          )}
        </div>

        <Input
          label="URL Gambar"
          placeholder="https://..."
          {...register("image_url")}
          error={errors.image_url?.message}
        />

        <Input
          label="Judul (Opsional)"
          placeholder="contoh: Special Summer Sale"
          {...register("title")}
          error={errors.title?.message}
        />

        <Input
          label="Subjudul (Opsional)"
          placeholder="contoh: Diskon hingga 50% untuk koleksi terbaru"
          {...register("subtitle")}
          error={errors.subtitle?.message}
        />

        <Input
          label="Link URL Tujuannya (Opsional)"
          placeholder="contoh: /kategori/pria"
          {...register("link_url")}
          error={errors.link_url?.message}
        />

        <Input
          label="Urutan Tampil"
          type="number"
          {...register("sort_order", { valueAsNumber: true })}
          error={errors.sort_order?.message}
        />

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            {...register("is_active")}
          />
          Aktifkan Banner
        </label>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Menyimpan..."
            : isEditMode
            ? "Simpan Perubahan Banner"
            : "Tambah Banner"}
        </Button>
      </form>
    </Card>
  );
}
