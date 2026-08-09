"use client";

/**
 * Modal form untuk menambah atau memperbarui varian produk.
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  variantFormSchema,
  type VariantFormValues,
} from "@/lib/validations/variant";
import { createVariant, updateVariant } from "@/lib/actions/variants";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProductVariant } from "@/lib/types/database.types";

interface VariantModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  variant?: ProductVariant | null;
  onSuccess: () => void;
}

export function VariantModal({
  open,
  onClose,
  productId,
  variant,
  onSuccess,
}: VariantModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      product_id: productId,
      size: "",
      color: "",
      stock: 0,
      sku: "",
    },
  });

  useEffect(() => {
    if (open) {
      setErrorMsg(null);
      if (variant) {
        reset({
          product_id: productId,
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          price_override: variant.price_override ?? undefined,
          sku: variant.sku,
        });
      } else {
        reset({
          product_id: productId,
          size: "",
          color: "",
          stock: 0,
          price_override: undefined,
          sku: "",
        });
      }
    }
  }, [open, variant, productId, reset]);

  const onSubmit = async (data: VariantFormValues) => {
    setErrorMsg(null);
    let result;
    if (variant) {
      result = await updateVariant(variant.id, data);
    } else {
      result = await createVariant(data);
    }

    if (!result.success) {
      setErrorMsg(result.error ?? "Gagal menyimpan varian");
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={variant ? "Edit Varian Produk" : "Tambah Varian Produk"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {errorMsg}
          </div>
        )}
        <input type="hidden" {...register("product_id")} />

        <Input
          label="Ukuran (Size)"
          placeholder="contoh: S, M, L, XL, ALL SIZE"
          {...register("size")}
          error={errors.size?.message}
        />

        <Input
          label="Warna (Color)"
          placeholder="contoh: Hitam, Putih, Navy"
          {...register("color")}
          error={errors.color?.message}
        />

        <Input
          label="SKU"
          placeholder="contoh: KNB-TSHIRT-BLK-M"
          {...register("sku")}
          error={errors.sku?.message}
        />

        <Input
          label="Stok"
          type="number"
          {...register("stock", { valueAsNumber: true })}
          error={errors.stock?.message}
        />

        <Input
          label="Harga Override (Opsional - kosongkan jika sama dengan harga dasar)"
          type="number"
          step="0.01"
          {...register("price_override", {
            setValueAs: (v) => (v === "" || isNaN(v) ? null : Number(v)),
          })}
          error={errors.price_override?.message}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : variant
              ? "Simpan Perubahan"
              : "Tambah Varian"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
