"use client";

/**
 * Galeri media produk — menampilkan gambar/video produk.
 */
import type { ProductMedia } from "@/lib/types/database.types";

interface ProductGalleryProps {
  media: ProductMedia[];
  productName: string;
}

export function ProductGallery({ media, productName }: ProductGalleryProps) {
  const primary = media[0];

  if (!primary) {
    return <div className="aspect-square bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="space-y-2">
      {primary.type === "video" ? (
        <video
          src={primary.url}
          controls
          className="w-full aspect-square object-cover rounded-lg"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={primary.url}
          alt={productName}
          className="w-full aspect-square object-cover rounded-lg"
        />
      )}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {media.slice(1).map((item) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.id}
              src={item.url}
              alt=""
              className="w-16 h-16 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
