"use client";

/**
 * Hero Banner — Menampilkan banner halaman depan dengan style editorial lavender.
 */
import type { SiteBanner } from "@/lib/types/database.types";
import Link from "next/link";

interface BannerCarouselProps {
  banners: SiteBanner[];
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)($|\?)/i.test(url);
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  if (banners.length === 0) return null;

  // Menggunakan banner pertama sesuai referensi foto
  const banner = banners[0];
  const ytId = banner.image_url ? getYouTubeId(banner.image_url) : null;
  const isVideo = banner.image_url ? isDirectVideo(banner.image_url) : false;

  return (
    <div className="relative w-full min-h-[720px] bg-[#E2E1F8] flex flex-col items-center justify-center px-6 pt-[168px] pb-20 overflow-hidden select-none -mt-[88px]">
      {/* Background media with tint overlay */}
      {banner.image_url && (
        <div className="absolute inset-0 z-0 w-full h-full">
          {ytId ? (
            <div className="relative w-full h-full pointer-events-none overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-[177.78vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2 scale-125 opacity-80 border-0"
                allow="autoplay; encrypted-media"
                title="Banner background video"
                frameBorder="0"
              />
            </div>
          ) : isVideo ? (
            <video
              src={banner.image_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            banner.image_url !== '/images/banner.png' && (
              <img
                src={banner.image_url}
                alt={banner.title ?? "Banner"}
                className="w-full h-full object-cover opacity-80"
              />
            )
          )}
        </div>
      )}

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 z-5 bg-black/45" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl text-center">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-medium tracking-wide leading-[1.15] mb-6 uppercase drop-shadow-md">
          {banner.title || "Confidence Begins With Attire"}
        </h1>
        
        <p className="text-white text-xs md:text-sm font-light tracking-widest leading-relaxed max-w-2xl mb-10 opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
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
