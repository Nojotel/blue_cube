import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { Product } from "./productReducer";
import { RootState } from "./store";
import Cookies from "js-cookie";

interface BasketItem extends Product {
  quantity: number;
}

interface BasketState {
  items: BasketItem[];
}

const initialState: BasketState = {
  items: [],
};

const MAX_TOTAL_COST = 10000;
const MAX_ITEM_QUANTITY = 10;

const updateQuantity = (state: BasketState, productId: string, increment: boolean) => {
  const itemIndex = state.items.findIndex((i) => i.id === productId);
  if (itemIndex !== -1) {
    const item = state.items[itemIndex];
    const totalCost = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

    if (increment) {
      if (item.quantity < MAX_ITEM_QUANTITY && totalCost + item.price <= MAX_TOTAL_COST) {
        item.quantity += 1;
      }
    } else {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        item.quantity = 0;
      }
    }
  }
};

export const updateBasket = (state: BasketState, updatedBasket: { id: string; quantity: number }[]) => {
  state.items = updatedBasket.map(({ id, quantity }) => {
    const item = state.items.find((i) => i.id === id);
    if (item) {
      return { ...item, quantity };
    } else {
      const product = state.items.find((i) => i.id === id);
      if (product) {
        return { ...product, quantity };
      } else {
        throw new Error(`Товар с идентификатором ${id} не найден.`);
      }
    }
  });
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction<Product>) => {
      const totalCost = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      if (totalCost + action.payload.price <= MAX_TOTAL_COST) {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item) {
          if (item.quantity < MAX_ITEM_QUANTITY) {
            item.quantity += 1;
          }
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
      }
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex((i) => i.id === action.payload);
      if (itemIndex !== -1) {
        state.items.splice(itemIndex, 1);
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      updateQuantity(state, action.payload, true);
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      updateQuantity(state, action.payload, false);
    },
    clearBasket: (state) => {
      state.items = [];
    },
  },
});

export const { addToBasket, removeFromBasket, incrementQuantity, decrementQuantity, clearBasket } = basketSlice.actions;

const basketReducer: Reducer<BasketState> = basketSlice.reducer;

export default basketReducer;

export const getQuantityInBasket = (state: RootState, productId: string) => {
  const item = state.basket.items.find((i) => i.id === productId);
  return item ? item.quantity : 0;
};

export const getTotalPriceInBasket = (state: RootState) => {
  return state.basket.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const basketCookie = Cookies.get("basket");
if (basketCookie) {
  initialState.items = JSON.parse(basketCookie);
}
