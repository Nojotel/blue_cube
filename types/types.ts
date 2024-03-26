export interface BasketItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  picture: string;
}

export interface ProductState {
  products: Product[];
  product: Product | null;
  page: number;
  limit: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  picture: string;
  // дополнительные поля, если есть
}
