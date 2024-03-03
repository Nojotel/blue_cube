import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BasketState {
  isOpen: boolean;
}

const initialState: BasketState = {
  isOpen: false,
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
  },
});

export const { toggleBasket, setBasketOpen } = basketSlice.actions;

export default basketSlice.reducer;
