export interface Product {
  id: string;
  picture: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  quantity?: number;
}

export interface ProductDetailsResponse extends Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
}

export interface OrderProduct extends Product {
  quantity: number;
}

export interface ProductState {
  products: Product[];
  product: Product | null;
  page: number;
  limit: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface Order {
  id: number;
  quantity: number;
  createdAt: string;
  products: OrderProduct[];
}

export interface OrdersState {
  orders: Order[];
}

export interface BasketState {
  isOpen: boolean;
  items: Product[];
}
