"use client";

import React, { useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const [page, setPage] = useState(1);

  return (
    <div className={styles.container}>
      <ProductCard setPage={setPage} page={page} />
      <Pagination setPage={setPage} page={page} />
    </div>
  );
};

export default ProductList;
