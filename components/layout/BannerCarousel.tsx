"use client";

/**
 * Hero Banner — Menampilkan banner halaman depan dengan style editorial lavender.
 */
import type { SiteBanner } from "@/lib/types/database.types";
import Link from "next/link";

interface BannerCarouselProps {
  banners: SiteBanner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  if (banners.length === 0) return null;

  // Menggunakan banner pertama sesuai referensi foto
  const banner = banners[0];

  return (
    <div className="relative w-full min-h-[480px] bg-[#E2E1F8] flex flex-col items-center justify-center px-6 py-16 overflow-hidden select-none">
      {/* Background image if available with lavender tint overlay */}
      {banner.image_url && banner.image_url !== '/images/banner.png' && (
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.image_url}
            alt={banner.title ?? "Banner"}
            className="w-full h-full object-cover opacity-30 mix-blend-multiply"
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl text-center">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-medium tracking-wide leading-[1.15] mb-6 drop-shadow-sm">
          Confidence Begins <br className="hidden md:inline" /> With Attire
        </h1>
        
        <p className="text-white text-xs md:text-sm font-light tracking-widest leading-relaxed max-w-2xl mb-10 opacity-90">
          {banner.subtitle || "Explore the latest editorial pieces. A curation of bold silhouettes and minimal perfection for the modern aesthetic."}
        </p>

        {banner.link_url && (
          <Link
            href={banner.link_url}
            className="bg-[#121212] hover:bg-black text-white text-[10px] md:text-xs font-semibold tracking-[0.2em] px-8 py-3.5 transition-colors uppercase"
          >
            EXPLORE COLLECTION
          </Link>
        )}
      </div>
    </div>
  );
}
