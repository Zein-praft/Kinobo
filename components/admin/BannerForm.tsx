"use client";

/**
 * Form admin banner — kelola banner halaman depan dengan validasi zod.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bannerFormSchema,
  type BannerFormValues,
} from "@/lib/validations/banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaUploader } from "@/components/admin/MediaUploader";

export function BannerForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: { is_active: true, sort_order: 0 },
  });

  const onSubmit = async (data: BannerFormValues) => {
    // TODO: panggil Server Action untuk simpan banner
    console.log("Banner form data:", data);
  };

  return (
    <Card title="Tambah / Edit Banner">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <MediaUploader
          folder="banners"
          onUpload={({ publicUrl }) => setValue("image_url", publicUrl)}
        />
        <Input
          label="URL Gambar"
          {...register("image_url")}
          error={errors.image_url?.message}
        />
        <Input label="Judul" {...register("title")} error={errors.title?.message} />
        <Input
          label="Subjudul"
          {...register("subtitle")}
          error={errors.subtitle?.message}
        />
        <Input
          label="Link URL"
          {...register("link_url")}
          error={errors.link_url?.message}
        />
        <Input
          label="Urutan"
          type="number"
          {...register("sort_order", { valueAsNumber: true })}
          error={errors.sort_order?.message}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_active")} />
          Aktif
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Simpan Banner
        </Button>
      </form>
    </Card>
  );
}
