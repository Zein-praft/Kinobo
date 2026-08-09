"use client";

/**
 * Tabel daftar produk admin — menampilkan status, varian, media, serta tombol edit dan hapus.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import type { ProductWithDetails } from "@/lib/types/database.types";

interface ProductsTableProps {
  products: ProductWithDetails[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    setErrorMessage(null);

    const res = await deleteProduct(deleteId);
    setLoading(false);
    setDeleteId(null);

    if (!res.success) {
      setErrorMessage(res.error ?? "Gagal menghapus produk");
    } else {
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Total produk terdaftar: <span className="font-semibold">{products.length}</span>
        </p>
        <Link href="/admin/produk/baru">
          <Button>+ Tambah Produk Baru</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
          Belum ada produk. Klik tombol di atas untuk menambah produk pertama.
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                <tr>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Harga Dasar</th>
                  <th className="px-4 py-3">Varian</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => {
                  const thumbnail = p.media && p.media.length > 0 ? p.media[0].url : null;
                  const variantCount = p.variants ? p.variants.length : 0;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={p.name}
                              className="h-10 w-10 object-cover rounded border"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.category?.name ?? "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        Rp {p.base_price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {variantCount} varian
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.is_active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Non-aktif
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <Link
                          href={`/admin/produk/${p.id}/edit`}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="text-xs font-medium text-red-600 hover:underline"
                          onClick={() => setDeleteId(p.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Produk"
        description="Apakah Anda yakin ingin menghapus produk ini? Produk yang memiliki varian harus dihapus variannya terlebih dahulu."
        loading={loading}
      />
    </div>
  );
}
