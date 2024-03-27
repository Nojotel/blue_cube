import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, ProductState } from "@/types/types";

const initialState: ProductState = {
  products: [],
  product: null,
  page: 1,
  limit: 15,
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (page: number) => {
  const response = await axios.get(`https://skillfactory-task.detmir.team/products?limit=15&page=${page}`);
  return response.data.data;
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
  },
});

export const { setProducts, setPage, setLimit } = productSlice.actions;

export default productSlice.reducer;
