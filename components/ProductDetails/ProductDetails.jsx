import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import undo from "@/public/Undo.svg";
import Loading from "@/app/loading";
import NotFound from "@/app/loading";
import { fetchProductDetails } from "@/redux/productDetailsReducer";
import { generateStars } from "@/components/ProductCard/generateStars";
import styles from "./ProductDetails.module.css";
import Minus from "@/public/Minus.svg";
import Plus from "@/public/Plus.svg";
import MinusWhite from "@/public/MinusWhite.svg";
import PlusWhite from "@/public/PlusWhite.svg";
const ProductDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const product = useSelector((state) => state.productDetails.product);
  const status = useSelector((state) => state.productDetails.status);
  const [quantity, setQuantity] = useState(0);
  const [showQuantityButtons, setShowQuantityButtons] = useState(false);
  const [isMinusClicked, setIsMinusClicked] = useState(false);
  const [isPlusClicked, setIsPlusClicked] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const handleAddToCartClick = () => {
    setShowQuantityButtons(true);
    setQuantity(1);
    setIsOrderPlaced(false);
  };
  const handlePlaceOrderClick = () => {
    setIsOrderPlaced(true);
    setShowQuantityButtons(false);
    setQuantity(0);
  };
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
          {showQuantityButtons ? (
            <div className={styles.quantityContainer}>
              <button
                className={quantity > 0 ? (isMinusClicked ? styles.buttonMinusClicked : styles.buttonMinus) : styles.buttonMinusInactive}
                onClick={() => {
                  if (quantity > 0) {
                    setQuantity(quantity - 1);
                    setIsMinusClicked(true);
                    setTimeout(() => setIsMinusClicked(false), 500);
                  }
                }}
                disabled={quantity === 0}
              >
                <Image src={isMinusClicked ? MinusWhite : Minus} alt={"Кнопка на один товар меньше"} width={20} height={20} />
              </button>
              <span className={styles.buttonQuantity}>{quantity}</span>
              <button
                className={isPlusClicked ? styles.buttonPlusClicked : styles.buttonPlus}
                onClick={() => {
                  setQuantity(quantity + 1);
                  setIsPlusClicked(true);
                  setTimeout(() => setIsPlusClicked(false), 500);
                }}
              >
                <Image src={isPlusClicked ? PlusWhite : Plus} alt={"Кнопка на один товар больше"} width={20} height={20} />
              </button>
              {quantity > 0 && (
                <button className={styles.orderButton} onClick={handlePlaceOrderClick}>
                  Оформить заказ
                </button>
              )}
            </div>
          ) : (
            <button className={styles.button} onClick={handleAddToCartClick}>
              {isOrderPlaced ? "Добавить еще в корзину" : "Добавить в корзину"}
            </button>
          )}
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
