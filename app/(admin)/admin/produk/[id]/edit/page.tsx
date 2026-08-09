/**
 * Halaman admin — edit produk, varian, dan media.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByIdForAdmin } from "@/lib/queries/products";
import { getCategories } from "@/lib/queries/categories";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductByIdForAdmin(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

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
        <h2 className="text-xl font-semibold text-gray-900">
          Edit Produk: {product.name}
        </h2>
        <p className="text-sm text-gray-500">
          Perbarui data produk, kelola varian stok, dan galeri media.
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
