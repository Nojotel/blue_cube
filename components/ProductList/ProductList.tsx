import React, { useEffect, useState, Dispatch, SetStateAction, useCallback } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/productReducer";
import { AppDispatch, RootState } from "@/redux/store";
import styles from "./ProductList.module.css";

const selectProducts = (state: RootState) => state.product.products;
const selectStatus = (state: RootState) => state.product.status;

const useScrollPosition = (initialPage: number): [number, Dispatch<SetStateAction<number>>] => {
  const [page, setPage] = useState(initialPage);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: Number(localStorage.getItem("scrollPosition")) || 0, behavior: "smooth" });
      }
    };

    const saveScrollPosition = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem("scrollPosition", window.pageYOffset.toString());
      }
    };

    window.addEventListener("scroll", saveScrollPosition);
    handleScroll();
    setIsClient(true);

    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
    };
  }, []);

  if (!isClient) {
    return [initialPage, () => {}];
  }

  return [page, setPage];
};

const ProductList = () => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const initialPage = typeof window !== "undefined" ? Number(localStorage.getItem("page")) || 1 : 1;
  const [page, setPage] = useScrollPosition(initialPage);
  const [isClient, setIsClient] = useState(false);

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

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.container}>
      <ProductCard setPage={setPage} page={page} hasHydrated={hasHydrated} />
      <Pagination setPage={setPage} page={page} />
    </div>
  );
};

export default ProductList;
