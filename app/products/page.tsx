import { Suspense } from "react";
import { getProducts } from "@/services/product.service";
import ProductListClient from "@/components/ProductListClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Все товары
      </h1>

      <Suspense>
        <ProductListClient products={products} />
      </Suspense>
    </main>
  );
}
