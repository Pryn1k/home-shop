export type Order = {
  id: number;
  productId: string;
  name: string;
  phone: string;
  comment: string;
  status: "new" | "processing" | "done";
  createdAt: string;
};
