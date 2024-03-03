import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./productReducer";
import productDetailsReducer from "./productDetailsReducer";
import basketReducer from "./basketReducer";
import basketSlice from "./basketSlice";

const rootReducer = combineReducers({
  product: productReducer,
  productDetails: productDetailsReducer,
  basket: basketReducer,
  basketVisibility: basketSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
