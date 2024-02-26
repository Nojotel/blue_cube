import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./productReducer";

const rootReducer = combineReducers({
  product: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
