"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import star from "@/public/star.svg";
import starHalf from "@/public/StarHalf.svg";
import starNone from "@/public/starNone.svg";
import { fetchProducts } from "@/redux/productReducer";
import Loading from "@/app/loading";

const selectProducts = (state) => state.product.products;
const selectStatus = (state) => state.product.status;

const ProductCard = ({ setPage, page }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchProducts(page));
  }, [page, dispatch]);

  const generateStars = (rating) => {
    let fullStars, halfStar, emptyStars;
    if (rating >= 4.6) {
      fullStars = 5;
      halfStar = false;
      emptyStars = 0;
    } else if (rating >= 4.2) {
      fullStars = 4;
      halfStar = true;
      emptyStars = 0;
    } else {
      fullStars = Math.floor(rating);
      halfStar = rating % 1 >= 0.6;
      emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    }
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Image key={i} src={star} alt="Full Star" width={16} height={16} />
        ))}
        {halfStar && <Image src={starHalf} alt="Half Star" width={16} height={16} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Image key={i} src={starNone} alt="Empty Star" width={16} height={16} />
        ))}
      </>
    );
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <div className={styles.container} key={product.id}>
          <Image className={styles.image} src={product.picture} alt={product.title} width={240} height={240} priority />
          <h2 className={styles.title}>{product.title}</h2>
          <p className={styles.rating}>{generateStars(product.rating)}</p>
          <p className={styles.price}>{product.price} ₽</p>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
