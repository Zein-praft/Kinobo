/**
 * Halaman admin — manajemen produk (CRUD akan diimplementasi di tahap UI).
 */
import { ProductForm } from "@/components/admin/ProductForm";

export default function AdminProductsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manajemen Produk</h2>
      <ProductForm />
    </div>
  );
}
