"use client";

/**
 * Carousel banner — Client Component untuk slider halaman depan.
 */
import type { SiteBanner } from "@/lib/types/database.types";

interface BannerCarouselProps {
  banners: SiteBanner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  if (banners.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-lg">
      {banners.map((banner) => (
        <div key={banner.id} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.image_url}
            alt={banner.title ?? "Banner"}
            className="w-full h-64 md:h-96 object-cover"
          />
          {(banner.title || banner.subtitle) && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-6">
              {banner.title && (
                <h2 className="text-2xl font-bold">{banner.title}</h2>
              )}
              {banner.subtitle && (
                <p className="mt-1 text-sm opacity-90">{banner.subtitle}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
