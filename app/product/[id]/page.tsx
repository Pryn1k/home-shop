import { getProduct } from "@/services/product.service";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return <div>Товар не найден</div>;
  }

  const discountPercent =
    product.oldPrice != null && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;
  const hasDiscount = discountPercent > 0;

  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

    return (
        <main className="p-6">
            <div className="max-w-2xl mx-auto">

                <div className="border rounded-xl p-4">
                    <ProductGallery images={gallery} title={product.title} />

                    <h1 className="text-2xl font-bold mt-4">
                        {product.title}
                    </h1>

                    <div className="mt-2 flex items-center gap-3">
                        <p className="text-xl text-accent font-semibold">
                            {product.price} грн
                        </p>
                        {hasDiscount && (
                            <>
                                <span className="text-neutral-400 line-through">
                                    {product.oldPrice} грн
                                </span>
                                <span className="rounded bg-[#c46a4f] px-2 py-0.5 text-sm font-semibold text-white">
                                    −{discountPercent}%
                                </span>
                            </>
                        )}
                    </div>

                    <AddToCartButton
                        product={{
                            productId: product.id,
                            title: product.title,
                            price: product.price,
                            image: product.image,
                        }}
                    />
                </div>

            </div>
        </main>
    );
}