import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./ProductList.module.css";

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

  useEffect(() => {
    setHasHydrated(true);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && isClient) {
      setPage(initialPage);
    }
  }, [hasHydrated, isClient, setPage, initialPage]);

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
