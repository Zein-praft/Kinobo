/**
 * Schema validasi Zod untuk form banner halaman depan.
 */
import { z } from "zod";

export const bannerFormSchema = z
  .object({
    image_url: z.string().url("URL media atau gambar tidak valid"),
    title: z.string().max(200).optional(),
    subtitle: z.string().max(300).optional(),
    link_url: z.string().url("URL link tidak valid").optional().or(z.literal("")),
    sort_order: z.number().int().min(0),
    is_active: z.boolean(),
    start_date: z.string().datetime().nullable().optional(),
    end_date: z.string().datetime().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.start_date) <= new Date(data.end_date);
      }
      return true;
    },
    { message: "Tanggal mulai harus sebelum tanggal selesai", path: ["end_date"] }
  );

export type BannerFormValues = z.infer<typeof bannerFormSchema>;
