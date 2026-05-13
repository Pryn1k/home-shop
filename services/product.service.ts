import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    title: "iPhone 11",
    price: 12000,
    image: "/iphone.jpeg",
    category: "phones"
  },
  {
    id: "2",
    title: "Samsung TV",
    price: 8000,
    image: "/tv.jpg",
    category: "tv"
  }
];

export const getProducts = async (): Promise<Product[]> => {
  return products;
};