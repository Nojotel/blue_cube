import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BasketState {
  count: number;
}

const initialState: BasketState = {
  count: 0,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
  },
});

export const { addToBasket } = basketSlice.actions;

export default basketSlice.reducer;
