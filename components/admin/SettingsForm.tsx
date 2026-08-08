"use client";

/**
 * Form admin pengaturan situs — footer info, sosmed, WhatsApp.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormValues,
} from "@/lib/validations/settings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SettingsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
  });

  const onSubmit = async (data: SiteSettingsFormValues) => {
    // TODO: panggil Server Action untuk update site_settings
    console.log("Settings form data:", data);
  };

  return (
    <Card title="Pengaturan Footer & Sosmed">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Input
          label="Alamat"
          {...register("footer_address")}
          error={errors.footer_address?.message}
        />
        <Input
          label="Nomor Telepon"
          {...register("footer_phone")}
          error={errors.footer_phone?.message}
        />
        <Input
          label="Email"
          type="email"
          {...register("footer_email")}
          error={errors.footer_email?.message}
        />
        <Input
          label="URL Instagram"
          {...register("instagram_url")}
          error={errors.instagram_url?.message}
        />
        <Input
          label="Nomor WhatsApp (tanpa +)"
          {...register("whatsapp_number")}
          error={errors.whatsapp_number?.message}
        />
        <Button type="submit" disabled={isSubmitting}>
          Simpan Pengaturan
        </Button>
      </form>
    </Card>
  );
}
