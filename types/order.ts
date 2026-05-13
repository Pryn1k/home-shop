export type Order = {
  id: string;
  productId: string;
  name: string;
  phone: string;
  comment: string;
  status: "new" | "processing" | "done";
  createdAt: string;
};
