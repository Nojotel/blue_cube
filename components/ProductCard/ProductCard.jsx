"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import { fetchProducts } from "@/redux/productReducer";
import Loading from "@/app/loading";
import { generateStars } from "./generateStars";

const selectProducts = (state) => state.product.products;
const selectStatus = (state) => state.product.status;

const ProductCard = ({ setPage, page }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchProducts(page));
  }, [page, dispatch]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className={styles.container}>
            <Image className={styles.image} src={product.picture} alt={product.title} width={240} height={240} priority />
            <h2 className={styles.title}>{product.title}</h2>
            <p className={styles.rating}>{generateStars(product.rating)}</p>
            <p className={styles.price}>{product.price} ₽</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCard;
