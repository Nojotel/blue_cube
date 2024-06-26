export interface Product {
  id: string;
  picture: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  quantity?: number;
}

export interface OrderProduct extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  quantity: number;
  createdAt: string;
  products: OrderProduct[];
}

export interface ProductState {
  products: Product[];
  product: Product | null;
  page: number;
  limit: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface OrdersState {
  orders: Order[];
}

export interface BasketState {
  isOpen: boolean;
  items: BasketItem[];
}

export interface BasketItem extends Omit<Product, "rating"> {
  quantity: number;
}

export interface BasketProps {
  isOpen: boolean;
  onToggle: (value: boolean) => void;
  children: React.ReactNode;
}

export interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  newOrder: OrderProduct[];
  onAction1: (order: Order) => void;
  onAction2: (order: Order) => void;
}

export interface ModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface PaginationProps {
  setPage: (page: number) => void;
  page: number;
  totalPages: number;
  storageKey: string;
}

export interface GenerateStarsProps {
  rating: number;
}

export interface ProductCardProps {
  setPage: (page: number) => void;
  page: number;
  hasHydrated: boolean;
}

export interface ProductDetailsResponse {
  id: string;
  picture: string;
  title: string;
  description: string;
  price: number;
  rating: number;
}

export interface QuantitySelectorProps {
  quantity: number;
  isMinusClicked: boolean;
  isPlusClicked: boolean;
  handleMinusClick: () => void;
  handlePlusClick: () => void;
  handleRemoveClick: () => void;
  handlePlaceOrderClick?: () => void;
  showOrderButton?: boolean;
}

export const MAX_TOTAL_COST = 30000;
export const MAX_ITEM_QUANTITY = 10;
export const TITLE_MAX_LENGTH = 28;
export const ORDERS_PER_PAGE = 10;
