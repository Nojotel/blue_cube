import React, { useEffect, useState, Dispatch, SetStateAction, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/productReducer";
import { AppDispatch, RootState } from "@/redux/store";
import styles from "./ProductList.module.css";
import { PaginationProps } from "@/types/types";

const selectProducts = (state: RootState) => state.product.products;
const selectStatus = (state: RootState) => state.product.status;

const useScrollPosition = (initialPage: number): [number, Dispatch<SetStateAction<number>>] => {
  const [page, setPage] = useState(initialPage);
  const isClient = typeof window !== "undefined";

  useEffect(() => {
    const handleScroll = () => {
      if (isClient) {
        window.scrollTo({ top: Number(localStorage.getItem("scrollPosition")) || 0, behavior: "smooth" });
      }
    };

    const saveScrollPosition = () => {
      if (isClient) {
        localStorage.setItem("scrollPosition", window.pageYOffset.toString());
      }
    };

    if (isClient) {
      window.addEventListener("scroll", saveScrollPosition);
      handleScroll();
    }

    return () => {
      if (isClient) {
        window.removeEventListener("scroll", saveScrollPosition);
      }
    };
  }, [isClient]);

  return [page, setPage];
};

const ProductList = () => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const initialPage = isClient ? Number(localStorage.getItem("productListPage")) || 1 : 1;
  const [page, setPage] = useScrollPosition(initialPage);

  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const status = useSelector(selectStatus);

  const dispatchFetchProducts = useCallback(
    (page: number) => {
      dispatch(fetchProducts(page));
    },
    [dispatch]
  );

  useEffect(() => {
    setHasHydrated(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && isClient) {
      dispatchFetchProducts(page);
    }
  }, [hasHydrated, isClient, page, dispatchFetchProducts]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("productListPage", page.toString());
    }
  }, [page, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.container}>
      <ProductCard setPage={setPage} page={page} hasHydrated={hasHydrated} />
      {status !== "loading" && <Pagination setPage={setPage} page={page} totalPages={10} storageKey="productListPage" />}
    </div>
  );
};

export default ProductList;
