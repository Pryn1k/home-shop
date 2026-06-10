import { shop } from "@/lib/shop";

export default function About() {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-bold">О нас</h2>
        <p className="text-lg leading-relaxed text-muted">{shop.about}</p>
      </div>
    </section>
  );
}
