import { getProduct } from "@/services/product.service";
import OrderForm from "@/components/OrderForm";
import Image from "next/image";

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

    return (
        <main className="p-6">
            <div className="max-w-2xl mx-auto">

                <div className="border rounded-xl p-4">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-neutral-800">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 672px"
                            className="object-cover"
                        />
                    </div>

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

                    <OrderForm productId={product.id} />
                </div>

            </div>
        </main>
    );
}