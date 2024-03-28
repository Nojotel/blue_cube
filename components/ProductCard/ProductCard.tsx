import Link from "next/link";
import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/productReducer";
import Loading from "@/app/loading";
import GenerateStars from "./generateStars";
import { ProductCardProps, Product, TITLE_MAX_LENGTH } from "@/types/types";
import { trimTextToWholeWords } from "@/components/Basket/TrimText";

const ProductCard: React.FC<ProductCardProps> = React.memo(({ setPage, page, hasHydrated }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.product.products);
  const status = useSelector((state: RootState) => state.product.status);

  const dispatchFetchProducts = useCallback(
    (page: number) => {
      dispatch(fetchProducts(page));
    },
    [dispatch]
  );

  useEffect(() => {
    if (hasHydrated) {
      dispatchFetchProducts(page);
    }
  }, [page, hasHydrated, dispatchFetchProducts]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className={styles.grid}>
      {products.map((product: Product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className={styles.container}>
            <Image className={styles.image} src={product.picture} alt={product.title} width={240} height={240} priority />
            <h2 className={styles.title}>{trimTextToWholeWords(product.title, TITLE_MAX_LENGTH)}</h2>
            <p className={styles.rating}>
              <GenerateStars rating={product.rating} />
            </p>
            <p className={styles.price}>{product.price} ₽</p>
          </div>
        </Link>
      ))}
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
