import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./ProductList.module.css";

const useScrollPosition = (initialPage: number): [number, Dispatch<SetStateAction<number>>] => {
  const [page, setPage] = useState(initialPage);

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

    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
    };
  }, []);

  return [page, setPage];
};

const ProductList = () => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const initialPage = typeof window !== "undefined" ? Number(localStorage.getItem("page")) || 1 : 1;
  const [page, setPage] = useScrollPosition(initialPage);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      setPage(initialPage);
    }
  }, [hasHydrated, setPage, initialPage]);

  return (
    <div className={styles.container}>
      <ProductCard setPage={setPage} page={page} hasHydrated={hasHydrated} />
      <Pagination setPage={setPage} page={page} />
    </div>
  );
};

export default ProductList;
