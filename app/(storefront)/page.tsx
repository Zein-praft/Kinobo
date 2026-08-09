/**
 * Halaman depan storefront — menampilkan banner, katalog, dan filosofi brand.
 */
import { getActiveBanners } from "@/lib/queries/banners";
import { getProducts } from "@/lib/queries/products";
import { BannerCarousel } from "@/components/layout/BannerCarousel";
import { ProductCard } from "@/components/product/ProductCard";

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

      {/* Philosophy Section */}
      <section className="border-t border-gray-100 max-w-7xl mx-auto px-6 py-24 select-none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          
          {/* Left Column: Large Image */}
          <div className="col-span-1 md:col-span-5">
            <div className="relative aspect-[4/5] w-full bg-gray-50 overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/philosophy_left.png"
                alt="Our philosophy main concept"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Middle Column: Philosophy Text content */}
          <div className="col-span-1 md:col-span-4 flex flex-col justify-center space-y-8 py-4">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-wide text-black mb-6">
                Our <br className="hidden md:inline" /> philosophy
              </h2>
              <p className="text-xs md:text-sm font-light text-gray-500 leading-relaxed max-w-sm">
                The <span className="font-semibold text-black tracking-wider">KINOBO</span> brand is not just about clothes. It is apparel that instills confidence. It helps you fall in love with yourself and realize you are capable of anything.
              </p>
            </div>

            {/* In-between callout section */}
            <div className="flex items-start gap-4 py-6 border-t border-b border-gray-100">
              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-gray-50 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/philosophy_middle.png"
                  alt="Model layout styling detail"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] md:text-xs text-gray-400 font-normal leading-relaxed">
                In our clothes, everyone around will notice you. Most importantly—you will notice yourself and your state of mind.
              </p>
            </div>

            <div>
              <p className="text-xs md:text-sm font-light text-gray-500 leading-relaxed max-w-sm">
                Our pieces assist you in working with people you like, in places you enjoy. You get paid what you deserve, because you look and feel confident.
              </p>
            </div>
          </div>

          {/* Right Column: Medium Image */}
          <div className="col-span-1 md:col-span-3 self-stretch flex items-center">
            <div className="relative aspect-[3/4] md:aspect-[3/5] w-full bg-gray-50 overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/philosophy_right.png"
                alt="Minimal model posing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
