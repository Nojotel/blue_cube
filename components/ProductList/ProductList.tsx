import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/productReducer";
import type { AppDispatch } from "@/redux/store";
import { RootState } from "@/redux/store";
import styles from "./ProductList.module.css";
import { PaginationProps } from "@/types/types";

const selectStatus = (state: RootState) => state.product.status;

const ProductList = () => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch: AppDispatch = useDispatch();
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
      const savedPage = localStorage.getItem("productListPage");
      if (savedPage) {
        setPage(parseInt(savedPage));
      }
    }
  }, [isClient]);

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
