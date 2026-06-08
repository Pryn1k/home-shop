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

                    <p className="text-xl mt-2 text-accent font-semibold">
                        {product.price} грн
                    </p>

                    <OrderForm productId={product.id} />
                </div>

            </div>
        </main>
    );
}