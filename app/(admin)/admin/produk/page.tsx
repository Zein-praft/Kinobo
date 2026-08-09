/**
 * Halaman admin — daftar produk (CRUD).
 */
import { getAllProductsForAdmin } from "@/lib/queries/products";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Manajemen Produk</h2>
        <p className="text-sm text-gray-500">
          Kelola katalog produk, harga, varian stok, dan galeri media.
        </p>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
