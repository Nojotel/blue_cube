import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./productReducer";
import productDetailsReducer from "./productDetailsReducer";
import basketReducer from "./basketReducer";

const rootReducer = combineReducers({
  product: productReducer,
  productDetails: productDetailsReducer,
  basket: basketReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
