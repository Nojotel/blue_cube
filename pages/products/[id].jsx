import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import RootLayout from "@/app/layout";
import ProductDetails from "@/components/ProductDetails/ProductDetails";

const WrappedProductDetails = () => (
  <Provider store={store}>
    <RootLayout>
      <ProductDetails />
    </RootLayout>
  </Provider>
);

export default WrappedProductDetails;
