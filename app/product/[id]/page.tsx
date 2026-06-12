import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/services/product.service";
import { isAdmin } from "@/lib/auth";
import AddToCartButton from "@/components/AddToCartButton";
import AdminEditButton from "@/components/AdminEditButton";
import ProductGallery from "@/components/ProductGallery";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, admin] = await Promise.all([getProduct(id), isAdmin()]);

  if (!product) {
    notFound();
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

                <Link
                    href="/products"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-accent"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M19 12H5" />
                        <path d="m12 19-7-7 7-7" />
                    </svg>
                    Назад к товарам
                </Link>

                <div className="border bg-surface rounded-xl p-4">
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
                                <span className="text-muted line-through">
                                    {product.oldPrice} грн
                                </span>
                                <span className="rounded bg-badge-sale px-2 py-0.5 text-sm font-semibold text-white">
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
                            stock: product.stock,
                        }}
                    />

                    {admin && (
                        <div className="mt-4">
                            <AdminEditButton label="Редактировать" product={product} />
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}