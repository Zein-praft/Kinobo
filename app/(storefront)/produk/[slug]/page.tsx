/**
 * Halaman detail produk — menampilkan info, varian, dan galeri media.
 */
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { VariantPicker } from "@/components/product/VariantPicker";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery media={product.media} productName={product.name} />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.category && (
            <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
          )}
          <p className="text-xl font-semibold mt-4">
            Rp {Number(product.base_price).toLocaleString("id-ID")}
          </p>
          {product.description && (
            <p className="mt-4 text-gray-600">{product.description}</p>
          )}
          <VariantPicker variants={product.variants} basePrice={product.base_price} />
        </div>
      </div>
    </div>
  );
}
