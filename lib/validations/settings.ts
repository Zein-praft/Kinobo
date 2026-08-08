/**
 * Schema validasi Zod untuk form pengaturan situs (footer info, sosmed).
 */
import { z } from "zod";

export const siteSettingsFormSchema = z.object({
  footer_address: z.string().min(1, "Alamat wajib diisi").max(500),
  footer_phone: z.string().min(1, "Nomor telepon wajib diisi").max(50),
  footer_email: z.string().email("Email tidak valid"),
  instagram_url: z.string().url("URL Instagram tidak valid").optional().or(z.literal("")),
  whatsapp_number: z
    .string()
    .min(1, "Nomor WhatsApp wajib diisi")
    .regex(/^\d+$/, "Nomor WhatsApp hanya angka (format internasional tanpa +)"),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;
