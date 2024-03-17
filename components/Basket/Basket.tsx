import React, { useState } from "react";
import styles from "./Basket.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { incrementQuantity, decrementQuantity, removeFromBasket } from "@/redux/basketReducer";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import Modal from "@/components/Modal/Modal";

interface BasketItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  picture: string;
}

interface BasketProps {
  isOpen: boolean;
  onToggle: (value: boolean) => void;
  children: React.ReactNode;
}

const MAX_TOTAL_COST = 10000;

function trimTextToWholeWords(text: string, maxLength: number): string {
  let trimmedText = text.substr(0, maxLength);
  if (trimmedText.length < text.length) {
    trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));
  }
  const lastWord = trimmedText.split(" ").pop();
  if (lastWord && lastWord.length === 1) {
    trimmedText = trimmedText.substr(0, trimmedText.lastIndexOf(" "));
  }
  return trimmedText;
}

const Basket: React.FC<BasketProps> = ({ isOpen, onToggle, children }) => {
  const dispatch = useDispatch();
  const basketItems = useSelector((state: RootState) => state.basket.items);
  const [showModal, setShowModal] = useState(false);

  const handleContainerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleMinusClick = (productId: string) => {
    dispatch(decrementQuantity(productId));
  };

  const handlePlusClick = (productId: string) => {
    const item = basketItems.find((item) => item.id === productId);
    const totalCost = calculateTotalPrice() + (item?.price || 0);
    if (totalCost > MAX_TOTAL_COST) {
      setShowModal(true);
      return;
    }
    dispatch(incrementQuantity(productId));
  };

  const handleRemoveClick = (productId: string) => {
    dispatch(removeFromBasket(productId));
  };

  const calculateItemPrice = (item: BasketItem) => {
    return item.price * item.quantity;
  };

  const calculateTotalPrice = () => {
    return basketItems.reduce((total, item) => total + calculateItemPrice(item), 0);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCheckoutClick = () => {
    console.log("Оформление заказа с составом корзины:", basketItems);
  };

  return (
    <div onClick={() => onToggle(!isOpen)}>
      {children}
      {isOpen && (
        <div className={styles.container} onClick={handleContainerClick}>
          {basketItems.length > 0 ? (
            basketItems.map((item) => (
              <div key={item.id} className={styles.basketItem}>
                <Image className={styles.image} src={item.picture} alt={item.title} width={50} height={50} />
                <div className={styles.title}>{trimTextToWholeWords(item.title, 20)}</div>
                <QuantitySelector quantity={item.quantity} isMinusClicked={false} isPlusClicked={false} handleMinusClick={() => handleMinusClick(item.id)} handlePlusClick={() => handlePlusClick(item.id)} handleRemoveClick={() => handleRemoveClick(item.id)} showOrderButton={false} />
                {item.quantity > 0 && (
                  <div className={styles.price}>
                    {item.quantity > 1 && <span className={styles.subPrice}>{`${item.price} ₽ за шт. `}</span>}
                    <span className={styles.price}>{calculateItemPrice(item)} ₽</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.none}>Корзина пуста</div>
          )}
          <div className={styles.totalPrice}>
            <span className={styles.totalPriceText}>Итого:</span>
            <span className={styles.totalPriceValue}>{calculateTotalPrice()} ₽</span>
          </div>
          <button className={styles.checkout} onClick={handleCheckoutClick}>
            Оформить заказ
          </button>
          <Modal message="Корзина переполнена" isOpen={showModal} onClose={closeModal} />
        </div>
      )}
    </div>
  );
};

export default Basket;
