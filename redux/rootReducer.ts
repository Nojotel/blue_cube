import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./productReducer";
import productDetailsReducer from "./productDetailsReducer";
import basketReducer from "./basketReducer";
import basketSlice from "./basketSlice";
import ordersReducer from "./ordersReducer";

const rootReducer = combineReducers({
  product: productReducer,
  productDetails: productDetailsReducer,
  basket: basketReducer,
  basketVisibility: basketSlice,
  orders: ordersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
