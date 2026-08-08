/**
 * Schema validasi Zod untuk form produk admin.
 */
import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk wajib diisi")
    .max(200, "Nama produk maksimal 200 karakter"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung"
    ),
  category_id: z.string().uuid("Kategori tidak valid").nullable().optional(),
  description: z.string().max(5000, "Deskripsi maksimal 5000 karakter").optional(),
  base_price: z
    .number({ error: "Harga dasar wajib diisi" })
    .min(0, "Harga tidak boleh negatif"),
  is_active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
