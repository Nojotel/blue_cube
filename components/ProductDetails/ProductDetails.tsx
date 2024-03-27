import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import undo from "@/public/Undo.svg";
import Loading from "@/app/loading";
import NotFound from "@/app/loading";
import { fetchProductDetails } from "@/redux/productDetailsReducer";
import { addToBasket, incrementQuantity, decrementQuantity, getQuantityInBasket, removeFromBasket } from "@/redux/basketReducer";
import GenerateStars from "@/components/ProductCard/generateStars";
import styles from "./ProductDetails.module.css";
import { AppDispatch, RootState } from "@/redux/store";
import { Product, ModalProps, MAX_TOTAL_COST, TITLE_MAX_LENGTH } from "@/types/types";
import { setBasketOpen } from "@/redux/basketSlice";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import Modal from "@/components/Modal/Modal";
import { updateBasketOnServer } from "@/api/cartUpdate";
import { trimTextToWholeWords } from "@/components/Basket/TrimText";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;
  const product = useSelector((state: RootState) => state.productDetails.product) as Product | null;
  const status = useSelector((state: RootState) => state.productDetails.status);
  const quantityInBasket = useSelector((state: RootState) => (product ? getQuantityInBasket(state, product.id) : 0));
  const [showQuantityButtons, setShowQuantityButtons] = useState(quantityInBasket > 0);
  const [showModal, setShowModal] = useState(false);

  const totalCostSelector = (state: RootState) => state.basket.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const getTotalPriceInBasket = useSelector(totalCostSelector);

  const handleAddToCartClick = () => {
    if (product) {
      const totalCost = getTotalPriceInBasket + product.price;
      if (totalCost > MAX_TOTAL_COST) {
        setShowModal(true);
        return;
      }
      setShowQuantityButtons(true);
      dispatch(addToBasket([product]));
      updateBasketOnServer();
    }
  };

  const handleQuantityChange = (increment: boolean) => {
    if (product) {
      const totalCost = getTotalPriceInBasket + (increment ? product.price : -product.price);
      if (totalCost > MAX_TOTAL_COST || (increment && quantityInBasket >= 10)) {
        setShowModal(true);
        return;
      }
      increment ? dispatch(incrementQuantity(product.id)) : dispatch(decrementQuantity(product.id));
      updateBasketOnServer();
    }
  };

  const handlePlaceOrderClick = () => {
    dispatch(setBasketOpen(true));
    setShowQuantityButtons(false);
  };

  const handleRemoveFromBasket = () => {
    if (product) {
      dispatch(removeFromBasket(product.id));
      setShowQuantityButtons(false);
      updateBasketOnServer();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id as string));
    }
  }, [id, dispatch]);

  useEffect(() => {
    setShowQuantityButtons(quantityInBasket > 0);
  }, [quantityInBasket]);

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
          <h2 className={styles.title}>{trimTextToWholeWords(product.title, TITLE_MAX_LENGTH)}</h2>
          <p className={styles.rating}>
            <GenerateStars rating={product.rating} />
          </p>
          <p className={styles.price}>{product.price} ₽</p>
          {showQuantityButtons ? (
            <QuantitySelector quantity={quantityInBasket} isMinusClicked={false} isPlusClicked={false} handleMinusClick={() => handleQuantityChange(false)} handlePlusClick={() => handleQuantityChange(true)} handleRemoveClick={handleRemoveFromBasket} handlePlaceOrderClick={handlePlaceOrderClick} />
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
        <Modal message="Корзина переполнена" isOpen={showModal} onClose={closeModal} />
      </div>
      <div className={styles.description}>
        <div className={styles.titleDescription}>Описание</div>
        <div className={styles.subtitleDescription} dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>
    </div>
  );
};

export default ProductDetails;
