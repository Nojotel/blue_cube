import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import undo from "@/public/Undo.svg";
import Loading from "@/app/loading";
import NotFound from "@/app/loading";
import { fetchProductDetails } from "@/redux/productDetailsReducer";
import { addToBasket, incrementQuantity, decrementQuantity, getQuantityInBasket } from "@/redux/basketReducer";
import { GenerateStars } from "@/components/ProductCard/generateStars";
import styles from "./ProductDetails.module.css";
import { AppDispatch, RootState } from "@/redux/store";
import { Product } from "@/redux/productReducer";
import { setBasketOpen } from "@/redux/basketSlice";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;
  const product = useSelector((state: RootState) => state.productDetails.product) as Product | null;
  const status = useSelector((state: RootState) => state.productDetails.status);
  const quantityInBasket = useSelector((state: RootState) => (product ? getQuantityInBasket(state, product.id) : 0));
  const [showQuantityButtons, setShowQuantityButtons] = React.useState(false);
  const [isMinusClicked, setIsMinusClicked] = React.useState(false);
  const [isPlusClicked, setIsPlusClicked] = React.useState(false);

  const handleAddToCartClick = () => {
    if (product) {
      setShowQuantityButtons(true);
      dispatch(addToBasket(product));
    }
  };

  const handleMinusClick = () => {
    if (product) {
      dispatch(decrementQuantity(product.id));
    }
  };

  const handlePlusClick = () => {
    if (product) {
      if (quantityInBasket === 0) {
        dispatch(addToBasket(product));
      } else {
        dispatch(incrementQuantity(product.id));
      }
    }
  };

  const handlePlaceOrderClick = () => {
    dispatch(setBasketOpen(true));
    setShowQuantityButtons(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id as string));
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
          <p className={styles.rating}>
            <GenerateStars rating={product.rating} />
          </p>
          <p className={styles.price}>{product.price} ₽</p>
          {showQuantityButtons ? (
            <QuantitySelector quantity={quantityInBasket} isMinusClicked={isMinusClicked} isPlusClicked={isPlusClicked} handleMinusClick={handleMinusClick} handlePlusClick={handlePlusClick} handlePlaceOrderClick={handlePlaceOrderClick} />
          ) : (
            <button className={styles.button} onClick={handleAddToCartClick}>
              Добавить в корзину
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
