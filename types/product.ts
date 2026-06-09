export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice: number | null;
  image: string;
  category: string;
  createdAt: string;
}