"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("page")) || 1;
    }
    return 1;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scrollPosition = Number(localStorage.getItem("scrollPosition")) || 0;
      const handleScroll = () => {
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      };
      const timer = setTimeout(handleScroll, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saveScrollPosition = () => localStorage.setItem("scrollPosition", window.pageYOffset.toString());
      window.addEventListener("scroll", saveScrollPosition);
      return () => window.removeEventListener("scroll", saveScrollPosition);
    }
  }, [page]);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    scrollToTop();
  }, [page]);

  return (
    <div className={styles.container}>
      <ProductCard setPage={setPage} page={page} />
      <Pagination setPage={setPage} page={page} />
    </div>
  );
};

export default ProductList;
