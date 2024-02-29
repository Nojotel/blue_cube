"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const [page, setPage] = useState(() => Number(localStorage.getItem("page")) || 1);

  useEffect(() => {
    window.scrollTo(0, Number(localStorage.getItem("scrollPosition")) || 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("page", page.toString());
    const saveScrollPosition = () => localStorage.setItem("scrollPosition", window.pageYOffset.toString());
    window.addEventListener("scroll", saveScrollPosition);
    return () => window.removeEventListener("scroll", saveScrollPosition);
  }, [page]);

  return (
    <div className={styles.container}>
      <ProductCard setPage={setPage} page={page} />
      <Pagination setPage={setPage} page={page} />
    </div>
  );
};

export default ProductList;
