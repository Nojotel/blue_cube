import React, { useEffect, useState, useRef } from "react";
import styles from "./Basket.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { incrementQuantity, decrementQuantity, removeFromBasket, clearBasket } from "@/redux/basketReducer";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import Modal from "@/components/Modal/Modal";
import Cookies from "js-cookie";
import { updateBasketOnServer } from "@/api/cartUpdate";
import { submitCart } from "@/api/cartSubmit";
import { fetchCartData } from "@/api/cartFetch";
import { BasketItem, BasketProps, MAX_TOTAL_COST, TITLE_MAX_LENGTH } from "@/types/types";
import { trimTextToWholeWords } from "@/components/Basket/TrimText";

const Basket: React.FC<BasketProps> = ({ isOpen, onToggle, children }) => {
  const dispatch = useDispatch();
  const basketItems = useSelector((state: RootState) => state.basket.items);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCartData(dispatch);
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, onToggle]);

  const handleQuantityChange = (productId: string, increment: boolean, isFromModal = false) => {
    const item = basketItems.find((item) => item.id === productId);
    const totalCost = calculateTotalPrice() + (increment ? item?.price || 0 : -(item?.price || 0));
    if (totalCost > MAX_TOTAL_COST) {
      if (!isFromModal) {
        setShowModal(true);
        setModalMessage("Превышен максимально допустимый лимит корзины");
      }
      return;
    }
    increment ? dispatch(incrementQuantity(productId)) : dispatch(decrementQuantity(productId));
    updateBasketOnServer();
  };

  const handleRemoveClick = (productId: string) => {
    dispatch(removeFromBasket(productId));
    updateBasketOnServer();
  };

  const calculateItemPrice = (item: BasketItem) => item.price * item.quantity;

  const calculateTotalPrice = (items: BasketItem[] = basketItems) => items.reduce((total, item) => total + calculateItemPrice(item), 0);

  const closeModal = () => setShowModal(false);

  const handleCheckoutClick = async () => {
    setIsSending(true);

    try {
      await submitCart(basketItems);
      dispatch(clearBasket());
      Cookies.remove("basket");
      setModalMessage("Заказ успешно оформлен");
      setShowModal(true);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setModalMessage("Произошла ошибка в формировании заказа");
      setShowModal(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div onClick={() => onToggle(!isOpen)}>
      {children}
      {isOpen && (
        <div className={styles.container} ref={containerRef}>
          <div onClick={(e) => e.stopPropagation()}>
            {basketItems.length > 0 ? (
              basketItems.map((item) => (
                <div key={item.id} className={styles.basketItem}>
                  <Image className={styles.image} src={item.picture} alt={item.title} width={50} height={50} />
                  <div className={styles.title}>{trimTextToWholeWords(item.title, TITLE_MAX_LENGTH)}</div>
                  <QuantitySelector quantity={item.quantity} isMinusClicked={false} isPlusClicked={false} handleMinusClick={() => handleQuantityChange(item.id, false)} handlePlusClick={() => handleQuantityChange(item.id, true)} handleRemoveClick={() => handleRemoveClick(item.id)} showOrderButton={false} />
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
            <button className={`${styles.checkout} ${basketItems.length === 0 || isSending ? styles.disabled : ""}`} onClick={handleCheckoutClick} disabled={isSending || basketItems.length === 0}>
              {isSending ? "Отправка..." : "Оформить заказ"}
            </button>
            <Modal message={modalMessage} isOpen={showModal} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Basket;
