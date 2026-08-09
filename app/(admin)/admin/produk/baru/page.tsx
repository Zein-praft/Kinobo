/**
 * Halaman admin — tambah produk baru.
 */
import Link from "next/link";
import { getCategories } from "@/lib/queries/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/produk"
          className="text-sm text-gray-500 hover:text-black font-medium"
        >
          ← Kembali ke Daftar Produk
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900">Tambah Produk Baru</h2>
        <p className="text-sm text-gray-500">
          Isi informasi dasar produk. Setelah disimpan, Anda dapat menambahkan varian dan media.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
