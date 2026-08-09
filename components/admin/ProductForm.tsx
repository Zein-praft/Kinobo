"use client";

/**
 * Form admin produk — kelola data dasar produk, varian, dan media.
 * Terhubung dengan Server Actions `createProduct`, `updateProduct`, `deleteVariant`, dan `deleteMedia`.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { deleteVariant } from "@/lib/actions/variants";
import { attachMedia, deleteMedia } from "@/lib/actions/media";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { VariantModal } from "@/components/admin/VariantModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type {
  Category,
  ProductWithDetails,
  ProductVariant,
  ProductMedia,
} from "@/lib/types/database.types";

interface ProductFormProps {
  product?: ProductWithDetails | null;
  categories?: Category[];
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State varian modal
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [deleteVariantId, setDeleteVariantId] = useState<string | null>(null);

  // State media delete
  const [deleteMediaId, setDeleteMediaId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const isEditMode = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      category_id: product?.category_id ?? null,
      description: product?.description ?? "",
      base_price: product?.base_price ?? 0,
      is_active: product?.is_active ?? true,
    },
  });

  const productName = watch("name");

  // Generate slug otomatis dari nama produk jika slug masih kosong
  const handleNameBlur = () => {
    const currentSlug = watch("slug");
    if (!currentSlug && productName) {
      const generatedSlug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    let res;
    if (isEditMode && product) {
      res = await updateProduct(product.id, data);
    } else {
      res = await createProduct(data);
    }

    if (!res.success) {
      setErrorMessage(res.error ?? "Gagal menyimpan produk");
    } else {
      setSuccessMessage(
        isEditMode
          ? "Produk berhasil diperbarui!"
          : "Produk berhasil dibuat! Silakan tambahkan varian dan media."
      );
      if (!isEditMode && res.productId) {
        router.push(`/admin/produk/${res.productId}/edit`);
      } else {
        router.refresh();
      }
    }
  };

  const handleDeleteVariantConfirm = async () => {
    if (!deleteVariantId) return;
    setLoadingAction(true);
    const res = await deleteVariant(deleteVariantId);
    setLoadingAction(false);
    setDeleteVariantId(null);
    if (!res.success) {
      setErrorMessage(res.error ?? "Gagal menghapus varian");
    } else {
      setSuccessMessage("Varian berhasil dihapus");
      router.refresh();
    }
  };

  const handleDeleteMediaConfirm = async () => {
    if (!deleteMediaId) return;
    setLoadingAction(true);
    const res = await deleteMedia(deleteMediaId);
    setLoadingAction(false);
    setDeleteMediaId(null);
    if (!res.success) {
      setErrorMessage(res.error ?? "Gagal menghapus media");
    } else {
      setSuccessMessage("Media berhasil dihapus");
      router.refresh();
    }
  };

  const handleMediaUpload = async (result: {
    publicUrl: string;
    bucket: string;
  }) => {
    if (!product) return;
    const mediaType = result.bucket === "product-videos" ? "video" : "image";
    const currentMediaCount = product.media?.length ?? 0;

    const res = await attachMedia(product.id, {
      type: mediaType,
      url: result.publicUrl,
      sort_order: currentMediaCount,
    });

    if (!res.success) {
      setErrorMessage(res.error ?? "Gagal menyambungkan media ke produk");
    } else {
      setSuccessMessage("Media berhasil diupload & ditambahkan!");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Messages */}
      {successMessage && (
        <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Main Product Info Card */}
      <Card title={isEditMode ? "Edit Produk" : "Tambah Produk Baru"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Produk"
              placeholder="contoh: Suede Bomber Jacket"
              {...register("name", { onBlur: handleNameBlur })}
              error={errors.name?.message}
            />

            <Input
              label="Slug (URL Friendly)"
              placeholder="contoh: suede-bomber-jacket"
              {...register("slug")}
              error={errors.slug?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="category_id" className="text-sm font-medium">
                Kategori
              </label>
              <select
                id="category_id"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                {...register("category_id")}
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <span className="text-xs text-red-500">
                  {errors.category_id.message}
                </span>
              )}
            </div>

            <Input
              label="Harga Dasar (Rp)"
              type="number"
              step="0.01"
              {...register("base_price", { valueAsNumber: true })}
              error={errors.base_price?.message}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium">
              Deskripsi Produk
            </label>
            <textarea
              id="description"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              rows={4}
              placeholder="Tuliskan rujukan deskripsi, bahan, dan panduan perawatan produk..."
              {...register("description")}
            />
            {errors.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              {...register("is_active")}
            />
            Status Aktif (Tampilkan di toko publik)
          </label>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : isEditMode
              ? "Simpan Perubahan Produk"
              : "Buat Produk Baru"}
          </Button>
        </form>
      </Card>

      {/* Sub-section Varian Produk */}
      <Card title="Varian Produk (Ukuran, Warna, Stok, SKU)">
        {!isEditMode || !product ? (
          <p className="text-sm text-gray-500 py-2">
            Silakan simpan informasi dasar produk terlebih dahulu untuk mulai menambahkan varian.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Total varian: {product.variants?.length ?? 0}
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedVariant(null);
                  setVariantModalOpen(true);
                }}
              >
                + Tambah Varian Baru
              </Button>
            </div>

            {(!product.variants || product.variants.length === 0) ? (
              <p className="text-sm text-gray-500 italic py-4 text-center border rounded-md">
                Belum ada varian produk. Klik "+ Tambah Varian Baru" di atas.
              </p>
            ) : (
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                    <tr>
                      <th className="px-4 py-2">Ukuran</th>
                      <th className="px-4 py-2">Warna</th>
                      <th className="px-4 py-2">SKU</th>
                      <th className="px-4 py-2">Stok</th>
                      <th className="px-4 py-2">Harga Override</th>
                      <th className="px-4 py-2 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.variants.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{v.size}</td>
                        <td className="px-4 py-2">{v.color}</td>
                        <td className="px-4 py-2 text-xs font-mono">{v.sku}</td>
                        <td className="px-4 py-2 font-semibold">{v.stock}</td>
                        <td className="px-4 py-2">
                          {v.price_override
                            ? `Rp ${v.price_override.toLocaleString("id-ID")}`
                            : "-"}
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => {
                              setSelectedVariant(v);
                              setVariantModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs text-red-600 hover:underline"
                            onClick={() => setDeleteVariantId(v.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Sub-section Media Produk */}
      <Card title="Galeri Media Produk (Gambar & Video)">
        {!isEditMode || !product ? (
          <p className="text-sm text-gray-500 py-2">
            Silakan simpan informasi dasar produk terlebih dahulu untuk mengupload media.
          </p>
        ) : (
          <div className="space-y-6">
            <MediaUploader
              folder={`products/${product.id}`}
              onUpload={handleMediaUpload}
            />

            <div>
              <h4 className="text-sm font-medium mb-3">Media Terpasang</h4>
              {(!product.media || product.media.length === 0) ? (
                <p className="text-sm text-gray-500 italic py-4 text-center border rounded-md">
                  Belum ada media terpasang pada produk ini.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {product.media.map((item) => (
                    <div
                      key={item.id}
                      className="group relative border rounded-md overflow-hidden bg-gray-100 p-1"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          className="h-32 w-full object-cover rounded"
                          controls
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt="Product media"
                          className="h-32 w-full object-cover rounded"
                        />
                      )}
                      <div className="mt-2 flex items-center justify-between px-1">
                        <span className="text-xs text-gray-500 capitalize">
                          {item.type} (#{item.sort_order})
                        </span>
                        <button
                          type="button"
                          className="text-xs text-red-600 hover:underline font-medium"
                          onClick={() => setDeleteMediaId(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Variant Form Modal */}
      {isEditMode && product && (
        <VariantModal
          open={variantModalOpen}
          onClose={() => setVariantModalOpen(false)}
          productId={product.id}
          variant={selectedVariant}
          onSuccess={() => {
            setSuccessMessage("Varian berhasil disimpan!");
            router.refresh();
          }}
        />
      )}

      {/* Delete Variant Confirm Modal */}
      <DeleteConfirmModal
        open={!!deleteVariantId}
        onClose={() => setDeleteVariantId(null)}
        onConfirm={handleDeleteVariantConfirm}
        title="Hapus Varian"
        description="Apakah Anda yakin ingin menghapus varian produk ini?"
        loading={loadingAction}
      />

      {/* Delete Media Confirm Modal */}
      <DeleteConfirmModal
        open={!!deleteMediaId}
        onClose={() => setDeleteMediaId(null)}
        onConfirm={handleDeleteMediaConfirm}
        title="Hapus Media"
        description="Apakah Anda yakin ingin menghapus media ini dari galeri produk?"
        loading={loadingAction}
      />
    </div>
  );
}
