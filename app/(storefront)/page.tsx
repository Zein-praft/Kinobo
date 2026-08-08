/**
 * Halaman depan storefront — menampilkan banner dan daftar produk.
 */
import { getActiveBanners } from "@/lib/queries/banners";
import { getProducts } from "@/lib/queries/products";
import { BannerCarousel } from "@/components/layout/BannerCarousel";
import { ProductCard } from "@/components/product/ProductCard";

export default async function HomePage() {
  const [banners, { products }] = await Promise.all([
    getActiveBanners(),
    getProducts({ limit: 8 }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <BannerCarousel banners={banners} />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Produk Terbaru</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">Belum ada produk tersedia.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
