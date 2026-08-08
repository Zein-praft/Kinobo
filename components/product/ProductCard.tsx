/**
 * Kartu produk — ditampilkan di grid halaman depan dan kategori.
 */
import Link from "next/link";
import type { Product } from "@/lib/types/database.types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100 rounded-md mb-3" />
      <h3 className="font-medium text-sm">{product.name}</h3>
      <p className="text-sm text-gray-600 mt-1">
        Rp {Number(product.base_price).toLocaleString("id-ID")}
      </p>
    </Link>
  );
}
