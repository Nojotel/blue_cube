import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, BasketState, BasketItem } from "@/types/types";

const initialState: BasketState = {
  isOpen: false,
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    toggleBasket: (state) => {
      state.isOpen = !state.isOpen;
    },
    setBasketOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    addToBasket: (state, action: PayloadAction<Product[]>) => {
      state.items.push(
        ...action.payload.map((product) => ({
          ...product,
          quantity: 1,
        }))
      );
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearBasket: (state) => {
      state.items = [];
    },
  },
});

export const { toggleBasket, setBasketOpen, addToBasket, removeFromBasket, clearBasket } = basketSlice.actions;

export default basketSlice.reducer;
