import { getProducts } from "@/services/product.service";
import AdminProductsClient from "@/components/AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Управление товарами
      </h1>

      <AdminProductsClient products={products} />
    </main>
  );
}
