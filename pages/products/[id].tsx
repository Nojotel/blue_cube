import React, { FC } from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import RootLayout from "@/app/layout";
import ProductDetails from "@/components/ProductDetails/ProductDetails";
import ButtonBack from "@/components/ButtonBack/ButtonBack";

const WrappedProductDetails: FC = () => (
  <Provider store={store}>
    <RootLayout>
      <ButtonBack />
      <ProductDetails />
    </RootLayout>
  </Provider>
);

export default WrappedProductDetails;
