/**
 * Schema validasi Zod untuk form varian produk (ukuran, warna, stok).
 */
import { z } from "zod";

export const variantFormSchema = z.object({
  product_id: z.string().uuid("Produk tidak valid"),
  size: z.string().min(1, "Ukuran wajib diisi").max(50),
  color: z.string().min(1, "Warna wajib diisi").max(50),
  stock: z
    .number({ error: "Stok wajib diisi" })
    .int("Stok harus bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
  price_override: z
    .number()
    .min(0, "Harga override tidak boleh negatif")
    .nullable()
    .optional(),
  sku: z
    .string()
    .min(1, "SKU wajib diisi")
    .max(100)
    .regex(/^[A-Za-z0-9-]+$/, "SKU hanya boleh huruf, angka, dan tanda hubung"),
});

export type VariantFormValues = z.infer<typeof variantFormSchema>;
