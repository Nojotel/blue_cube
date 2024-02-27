import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
}

interface ProductDetailsState {
  product: ProductDetails | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductDetailsState = {
  product: null,
  status: "idle",
  error: null,
};

export const fetchProductDetails = createAsyncThunk("productDetails/fetchProductDetails", async (id: string) => {
  const response = await axios.get(`https://skillfactory-task.detmir.team/products/${id}`);
  return response.data;
});

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.product = action.payload;
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
  },
});

export default productDetailsSlice.reducer;
