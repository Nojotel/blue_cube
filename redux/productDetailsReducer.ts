import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductDetailsResponse, ProductState } from "@/types/types";

const initialState: ProductState = {
  products: [],
  product: null,
  page: 1,
  limit: 10,
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
      state.product = action.payload as ProductDetailsResponse;
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
  },
});

export default productDetailsSlice.reducer;
