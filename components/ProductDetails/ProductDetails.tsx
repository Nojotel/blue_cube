import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import undo from "@/public/Undo.svg";
import Loading from "@/app/loading";
import NotFound from "@/app/loading";
import { fetchProductDetails } from "@/redux/productDetailsReducer";
import { addToBasket, incrementQuantity, decrementQuantity, getQuantityInBasket, removeFromBasket, updateBasket } from "@/redux/basketReducer";
import { GenerateStars } from "@/components/ProductCard/generateStars";
import styles from "./ProductDetails.module.css";
import { AppDispatch, RootState } from "@/redux/store";
import { Product } from "@/redux/productReducer";
import { setBasketOpen } from "@/redux/basketSlice";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import Modal from "@/components/Modal/Modal";
import store from "@/redux/store";

const MAX_TOTAL_COST = 10000;

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = router.query;
  const product = useSelector((state: RootState) => state.productDetails.product) as Product | null;
  const status = useSelector((state: RootState) => state.productDetails.status);
  const quantityInBasket = useSelector((state: RootState) => (product ? getQuantityInBasket(state, product.id) : 0));
  const [showQuantityButtons, setShowQuantityButtons] = React.useState(quantityInBasket > 0);
  const [showModal, setShowModal] = useState(false);

  const getTotalPriceInBasket = (state: RootState) => {
    return state.basket.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleAddToCartClick = () => {
    if (product) {
      const totalCost = getTotalPriceInBasket(store.getState()) + product.price;
      if (totalCost > MAX_TOTAL_COST) {
        setShowModal(true);
        return;
      }
      setShowQuantityButtons(true);
      dispatch(addToBasket(product));
      const updatedBasket = store.getState().basket.items.map(({ id, quantity }) => ({ id, quantity }));
      updateBasketOnServer(updatedBasket);
    }
  };

  const handleQuantityChange = (increment: boolean) => {
    if (product) {
      const totalCost = getTotalPriceInBasket(store.getState()) + (increment ? product.price : -product.price);
      if (totalCost > MAX_TOTAL_COST || (increment && quantityInBasket >= 10)) {
        setShowModal(true);
        return;
      }
      increment ? dispatch(incrementQuantity(product.id)) : dispatch(decrementQuantity(product.id));
      const updatedBasket = store.getState().basket.items.map(({ id, quantity }) => ({ id, quantity }));
      updateBasketOnServer(updatedBasket);
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
      const updatedBasket = store.getState().basket.items.map(({ id, quantity }) => ({ id, quantity }));
      updateBasketOnServer(updatedBasket);
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

  const updateBasketOnServer = async (updatedBasket: { id: string; quantity: number }[]) => {
    try {
      const response = await fetch("https://skillfactory-task.detmir.team/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBasket),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Корзина успешно обновлена на сервере:", data);
      } else {
        const errorData = await response.json();
        console.error("Ошибка при обновлении корзины на сервере:", errorData);
      }
    } catch (error) {
      console.error("Ошибка при обновлении корзины на сервере:", error);
    }
  };

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
