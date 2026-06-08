import { getProducts } from "@/services/product.service";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import Link from "next/link";

// всегда подтягиваем свежий список товаров из базы
export const dynamic = "force-dynamic";

export default async function Home() {
  // 6 самых новых товаров (getProducts отдаёт отсортированными: новые сверху)
  const products = (await getProducts()).slice(0, 6);

  return (
    // -mt-16 убирает отступ сверху от body, чтобы Hero был вровень с верхом экрана
    <main className="-mt-16">
      <Hero />

      <section className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          Новинки
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="rounded-lg border border-accent px-6 py-3 font-medium text-accent transition hover:bg-accent hover:text-neutral-900"
          >
            Посмотреть все товары →
          </Link>
        </div>
      </section>
    </main>
  );
}
