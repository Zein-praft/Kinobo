/**
 * Halaman depan storefront — menampilkan banner, katalog, dan filosofi brand.
 */
import { getActiveBanners } from "@/lib/queries/banners";
import { getProducts } from "@/lib/queries/products";
import { BannerCarousel } from "@/components/layout/BannerCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

export default async function HomePage() {
  const [banners, { products }] = await Promise.all([
    getActiveBanners(),
    getProducts({ limit: 4 }), // Hanya tampilkan 4 produk sesuai referensi foto
  ]);

  return (
    <div className="w-full bg-white text-black min-h-screen">
      {/* Hero Banner Section */}
      <section className="w-full">
        <BannerCarousel banners={banners} />
      </section>

      {/* Catalog Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 select-none">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-wide text-black mb-4">
            Catalog
          </h2>
          <div className="w-12 h-[2px] bg-gray-300 mx-auto" />
        </div>

        {products.length === 0 ? (
          <p className="text-gray-400 text-center text-sm">Belum ada produk tersedia.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Collections Section */}
      <section className="border-t border-gray-100 max-w-7xl mx-auto px-6 py-24 select-none">
        <div className="relative">
          {/* 2x2 Grid with small gap */}
          <div className="grid grid-cols-2 grid-rows-2 gap-3 overflow-hidden rounded-lg">
            {/* Cell 1 */}
            <Link href="/kategori/new-drops" className="group relative overflow-hidden aspect-[4/3] md:aspect-[16/10]">
              <img
                src="/images/products/suede_bomber.png"
                alt="New Drops Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm md:text-lg font-semibold tracking-[0.2em] drop-shadow-sm font-sans uppercase">
                  New Drops
                </span>
              </div>
            </Link>

            {/* Cell 2 */}
            <Link href="/kategori/collection" className="group relative overflow-hidden aspect-[4/3] md:aspect-[16/10]">
              <img
                src="/images/products/brown_zip_jacket.png"
                alt="Signature Line"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm md:text-lg font-semibold tracking-[0.2em] drop-shadow-sm font-sans uppercase">
                  Signature Line
                </span>
              </div>
            </Link>

            {/* Cell 3 */}
            <Link href="/kategori/browse" className="group relative overflow-hidden aspect-[4/3] md:aspect-[16/10]">
              <img
                src="/images/philosophy_left.png"
                alt="Essentials Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm md:text-lg font-semibold tracking-[0.2em] drop-shadow-sm font-sans uppercase">
                  Essentials
                </span>
              </div>
            </Link>

            {/* Cell 4 */}
            <Link href="/kategori/browse" className="group relative overflow-hidden aspect-[4/3] md:aspect-[16/10]">
              <img
                src="/images/philosophy_right.png"
                alt="Limited Drops"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm md:text-lg font-semibold tracking-[0.2em] drop-shadow-sm font-sans uppercase">
                  Limited Drops
                </span>
              </div>
            </Link>
          </div>

          {/* Centered Overlay: Big "K" Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white text-black rounded-full flex items-center justify-center shadow-xl border border-gray-100">
              <span className="font-serif text-5xl md:text-7xl font-bold tracking-normal leading-none mt-1">
                K
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
