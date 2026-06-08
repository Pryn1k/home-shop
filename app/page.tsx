import { getProducts } from "@/services/product.service";
import ProductListClient from "@/components/ProductListClient";

// всегда подтягиваем свежий список товаров из базы
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Магазин техники
      </h1>

      <ProductListClient products={products} />
    </main>
  );
}