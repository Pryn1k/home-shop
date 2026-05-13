import { getProducts } from "@/services/product.service";
import OrderForm from "@/components/OrderForm";
import Image from "next/image";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("ID:", id);

  const products = await getProducts();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div>Товар не найден</div>;
  }

    return (
        <main className="p-6">
            <div className="max-w-2xl mx-auto">

                <Link href="/" className="text-blue-500">
                    ← Назад к товарам
                </Link>

                <div className="mt-4 border rounded-xl p-4">
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={500}
                        height={300}
                        className="rounded-lg"
                    />

                    <h1 className="text-2xl font-bold mt-4">
                        {product.title}
                    </h1>

                    <p className="text-xl mt-2">
                        {product.price} грн
                    </p>

                    <OrderForm productId={product.id} />
                </div>

            </div>
        </main>
    );
}