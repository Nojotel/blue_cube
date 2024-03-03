import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
  id: string;
  picture: string;
  title: string;
  description: string;
  price: number;
  rating: number;
}

interface ProductState {
  products: Product[];
  product: Product | null;
  page: number;
  limit: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  page: 1,
  limit: 15,
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (page: number, { getState }) => {
  const limit = (getState() as ProductState).limit || 15;
  const response = await axios.get(`https://skillfactory-task.detmir.team/products?limit=${limit}&page=${page}`);
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
