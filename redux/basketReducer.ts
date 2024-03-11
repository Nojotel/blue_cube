import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productReducer";
import { RootState } from "./store";

interface BasketItem extends Product {
  quantity: number;
}

interface BasketState {
  items: BasketItem[];
}

const initialState: BasketState = {
  items: [],
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction<Product>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex((i) => i.id === action.payload);
      if (itemIndex !== -1) {
        state.items.splice(itemIndex, 1);
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex((i) => i.id === action.payload);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          item.quantity = 0;
        }
      }
    },
  },
});

export const { addToBasket, removeFromBasket, incrementQuantity, decrementQuantity } = basketSlice.actions;
export default basketSlice.reducer;

export const getQuantityInBasket = (state: RootState, productId: string) => {
  const item = state.basket.items.find((i) => i.id === productId);
  return item ? item.quantity : 0;
};
