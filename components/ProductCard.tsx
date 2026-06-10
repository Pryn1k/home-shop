import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  price: number;
  image: string;
  createdAt?: string;
  oldPrice?: number | null;
  stock?: number | null;
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function ProductCard({
  id,
  title,
  price,
  image,
  createdAt,
  oldPrice,
  stock,
}: Props) {
  // товар считается новым неделю с момента создания
  const isNew = createdAt
    ? Date.now() - new Date(createdAt).getTime() < WEEK_MS
    : false;

  // скидка есть, если старая цена задана и больше текущей
  const discountPercent =
    oldPrice != null && oldPrice > price
      ? Math.round((1 - price / oldPrice) * 100)
      : 0;
  const hasDiscount = discountPercent > 0;

  const outOfStock = stock === 0;

  return (
    <Link href={`/product/${id}`}>
      <div className="border bg-surface rounded-xl p-4 hover:shadow-lg transition cursor-pointer">

        {/* КАРТИНКА — адаптивная (резиновая), фикс. соотношение сторон */}
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-img-bg">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className={`object-cover ${outOfStock ? "opacity-50" : ""}`}
          />

          {/* бейджи слева сверху */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {outOfStock ? (
              <span className="rounded-full bg-neutral-700 px-2.5 py-1 text-[13px] font-bold text-neutral-100 shadow-md">
                Нет в наличии
              </span>
            ) : (
              <>
                {isNew && (
                  <span className="rounded-full bg-badge-new px-2.5 py-1 text-[13px] font-bold text-white shadow-md">
                    NEW
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded-full bg-badge-sale px-2.5 py-1 text-[13px] font-bold text-white shadow-md">
                    −{discountPercent}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* цена справа сверху — матовая плашка как в шапке (со старой ценой при скидке) */}
          <span className="absolute right-2 top-2 flex items-center gap-1.5 rounded-lg border border-border bg-surface/80 px-2.5 py-1 text-sm font-semibold shadow-md backdrop-blur-sm">
            {hasDiscount && (
              <span className="text-xs font-normal text-muted line-through">
                {oldPrice} грн
              </span>
            )}
            <span className="text-accent">{price} грн</span>
          </span>
        </div>

        <h2 className="mt-2 text-lg font-semibold">{title}</h2>

      </div>
    </Link>
  );
}
