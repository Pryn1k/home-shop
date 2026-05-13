import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, title, price, image }: Props) {
  return (
    <Link href={`/product/${id}`}>
      <div className="border rounded-xl p-4 hover:shadow-lg transition cursor-pointer">
        
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="rounded-lg object-cover"
        />

        <h2 className="mt-2 text-lg font-semibold">{title}</h2>
        <p className="text-gray-600">{price} грн</p>

      </div>
    </Link>
  );
}