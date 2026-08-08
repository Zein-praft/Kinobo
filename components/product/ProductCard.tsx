/**
 * Kartu produk — ditampilkan di grid halaman depan dan kategori.
 */
import Link from "next/link";
import type { ProductWithMedia } from "@/lib/queries/products";

interface ProductCardProps {
  product: ProductWithMedia;
}

export function ProductCard({ product }: ProductCardProps) {
  // Ambil gambar pertama dari media, atau gunakan placeholder jika kosong
  const imageUrl = product.media?.[0]?.url || "/images/placeholder.png";

  // Format harga dengan separator titik (contoh: 12.900) dan simbol rubel (₽)
  const formattedPrice = Number(product.base_price)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₽";

  // Cek apakah produk ini bertipe 'NEW' seperti di referensi foto (Black Rashguard)
  const isNew = product.slug === "black-rashguard";

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group block text-center select-none"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[3/4] w-full bg-gray-50 overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* 'NEW' Tag Badge */}
        {isNew && (
          <span className="absolute top-3 left-3 bg-white text-[8px] font-bold tracking-widest text-black px-2.5 py-1 uppercase shadow-sm">
            NEW
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-1">
        <h3 className="text-xs font-semibold tracking-wide text-gray-800 group-hover:text-black transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] font-medium text-gray-500">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}
