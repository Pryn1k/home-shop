export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice: number | null;
  image: string;
  images: string[] | null;
  category: string;
  stock: number | null;
  description: string | null;
  createdAt: string;
}