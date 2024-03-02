import { NextPage } from "next";
import RootLayout from "@/app/layout";
import ProductList from "@/components/ProductList/ProductList";

const HomePage: NextPage = () => {
  return (
    <RootLayout>
      <ProductList />
    </RootLayout>
  );
};

export default HomePage;
