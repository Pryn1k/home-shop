export type OrderItem = {
  productId: string;
  title: string;
  price: number;
  qty: number;
};

export type Order = {
  id: number;
  productId: string | null;
  name: string;
  phone: string;
  comment: string;
  status: "new" | "processing" | "done";
  createdAt: string;
  items: OrderItem[] | null;
  total: number | null;
};
