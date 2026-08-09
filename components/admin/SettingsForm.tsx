"use client";

/**
 * Form admin pengaturan situs — footer info, sosmed, WhatsApp.
 * Terhubung dengan Server Action `updateSiteSettings`.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormValues,
} from "@/lib/validations/settings";
import { updateSiteSettings } from "@/lib/actions/settings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SettingsFormProps {
  defaultValues?: Partial<SiteSettingsFormValues>;
}

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: {
      footer_address: defaultValues?.footer_address ?? "",
      footer_phone: defaultValues?.footer_phone ?? "",
      footer_email: defaultValues?.footer_email ?? "",
      instagram_url: defaultValues?.instagram_url ?? "",
      whatsapp_number: defaultValues?.whatsapp_number ?? "",
    },
  });

  const onSubmit = async (data: SiteSettingsFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const res = await updateSiteSettings(data);

    if (!res.success) {
      setErrorMessage(res.error ?? "Gagal menyimpan pengaturan");
    } else {
      setSuccessMessage("Pengaturan situs berhasil diperbarui!");
      router.refresh();
    }
  };

  return (
    <Card title="Pengaturan Footer & Kontak Sosmed">
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

        <Input
          label="Alamat Toko (Footer)"
          placeholder="Jl. Contoh No. 123, Jakarta"
          {...register("footer_address")}
          error={errors.footer_address?.message}
        />

        <Input
          label="Nomor Telepon (Footer)"
          placeholder="+62 812-3456-7890"
          {...register("footer_phone")}
          error={errors.footer_phone?.message}
        />

        <Input
          label="Email Kontak (Footer)"
          type="email"
          placeholder="hello@kinobo.id"
          {...register("footer_email")}
          error={errors.footer_email?.message}
        />

        <Input
          label="URL Instagram"
          placeholder="https://instagram.com/kinobo"
          {...register("instagram_url")}
          error={errors.instagram_url?.message}
        />

        <Input
          label="Nomor WhatsApp (format internasional tanpa +)"
          placeholder="6281234567890"
          {...register("whatsapp_number")}
          error={errors.whatsapp_number?.message}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </form>
    </Card>
  );
}
