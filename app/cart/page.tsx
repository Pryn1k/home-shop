import CartView from "@/components/CartView";

export const metadata = { title: "Корзина" };

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Корзина</h1>
      <CartView />
    </main>
  );
}
