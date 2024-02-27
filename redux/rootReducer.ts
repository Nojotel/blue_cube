import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./productReducer";
import productDetailsReducer from "./productDetailsReducer";

const rootReducer = combineReducers({
  product: productReducer,
  productDetails: productDetailsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
