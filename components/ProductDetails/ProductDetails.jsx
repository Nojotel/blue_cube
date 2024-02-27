import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import undo from "@/public/Undo.svg";
import Loading from "@/app/loading";
import NotFound from "@/app/loading";
import { fetchProductDetails } from "@/redux/productDetailsReducer";
import { generateStars } from "@/components/ProductCard/generateStars";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const product = useSelector((state) => state.productDetails.product);
  const status = useSelector((state) => state.productDetails.status);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [id, dispatch]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!product) {
    return <NotFound />;
  }

  return (
    <div>
      <div className={styles.container}>
        <Image className={styles.image} src={product.picture} alt={product.title} width={374} height={374} priority />
        <div className={styles.information}>
          <h2 className={styles.title}>{product.title}</h2>
          <p className={styles.rating}>{generateStars(product.rating)}</p>
          <p className={styles.price}>{product.price} ₽</p>
          <button className={styles.button}>Добавить в корзину</button>
          <div className={styles.containerUndo}>
            <Image className={styles.undo} src={undo} alt="Logo" width={20} height={20} priority />
            <div className={styles.textUndo}>Условия возврата</div>
          </div>
          <div className={styles.titleUndo}>Обменять или вернуть товар надлежащего качества можно в течение 14 дней с момента покупки.</div>
          <div className={styles.subtitleUndo}>Цены в интернет-магазине могут отличаться от розничных магазинов.</div>
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.titleDescription}>Описание</div>
        <div className={styles.subtitleDescription} dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>
    </div>
  );
};

export default ProductDetails;
