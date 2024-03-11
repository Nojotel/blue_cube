import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/legacy/image"; // Использование next/legacy/image
import styles from "./ProductCard.module.css";
import { fetchProducts } from "@/redux/productReducer";
import Loading from "@/app/loading";
import { GenerateStars } from "./generateStars";
import { AppDispatch, RootState } from "@/redux/store";

interface ProductCardProps {
  setPage: (page: number) => void;
  page: number;
  hasHydrated: boolean;
}

const selectProducts = (state: RootState) => state.product.products;
const selectStatus = (state: RootState) => state.product.status;

const ProductCard: React.FC<ProductCardProps> = ({ setPage, page, hasHydrated }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const status = useSelector(selectStatus);

  useEffect(() => {
    if (hasHydrated) {
      dispatch(fetchProducts(page));
    }
  }, [page, dispatch, hasHydrated]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className={styles.grid}>
      {products.map((product: any) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className={styles.container}>
            <Image className={styles.image} src={product.picture} alt={product.title} width={240} height={240} priority />
            <h2 className={styles.title}>{product.title}</h2>
            <p className={styles.rating}>
              <GenerateStars rating={product.rating} />
            </p>
            <p className={styles.price}>{product.price} ₽</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductCard;
