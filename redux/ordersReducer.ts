import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  picture: string;
  rating: number;
  quantity: number;
}

interface Order {
  id: number;
  quantity: number;
  createdAt: string;
  products: Product[];
}

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
