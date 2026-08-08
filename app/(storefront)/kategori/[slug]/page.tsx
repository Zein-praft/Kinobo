/**
 * Halaman kategori — menampilkan produk dalam kategori tertentu.
 */
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/queries/categories";
import { getProductsByCategorySlug } from "@/lib/queries/products";
import { ProductCard } from "@/components/product/ProductCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, { products }] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategorySlug(slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">Belum ada produk di kategori ini.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
