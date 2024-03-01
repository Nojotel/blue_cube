"use client";

import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./ProductList.module.css";

const useScrollPosition = (initialPage: number): [number, Dispatch<SetStateAction<number>>] => {
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo({ top: Number(localStorage.getItem("scrollPosition")) || 0, behavior: "smooth" });
    };
    const timer = setTimeout(handleScroll, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saveScrollPosition = () => localStorage.setItem("scrollPosition", window.pageYOffset.toString());
    window.addEventListener("scroll", saveScrollPosition);
    return () => window.removeEventListener("scroll", saveScrollPosition);
  }, [page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return [page, setPage];
};

const ProductList = () => {
  const initialPage = typeof window !== "undefined" ? Number(localStorage.getItem("page")) || 1 : 1;
  const [page, setPage] = useScrollPosition(initialPage);

  return (
    <div className={styles.container}>
      <ProductCard setPage={setPage} page={page} />
      <Pagination setPage={setPage} page={page} />
    </div>
  );
};

export default ProductList;
