"use client";

/**
 * Form admin produk — placeholder dengan react-hook-form + zod validasi.
 * Server Action untuk submit akan ditambahkan di tahap berikutnya.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { is_active: true, base_price: 0 },
  });

  const onSubmit = async (data: ProductFormValues) => {
    // TODO: panggil Server Action untuk simpan produk
    console.log("Product form data:", data);
  };

  return (
    <Card title="Tambah / Edit Produk">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Input label="Nama Produk" {...register("name")} error={errors.name?.message} />
        <Input label="Slug" {...register("slug")} error={errors.slug?.message} />
        <Input
          label="Harga Dasar"
          type="number"
          step="0.01"
          {...register("base_price", { valueAsNumber: true })}
          error={errors.base_price?.message}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Deskripsi
          </label>
          <textarea
            id="description"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={4}
            {...register("description")}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_active")} />
          Aktif
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Simpan Produk
        </Button>
      </form>
    </Card>
  );
}
