import React, { useEffect } from "react";
import styles from "./Basket.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { incrementQuantity, decrementQuantity, removeFromBasket, clearBasket, updateBasket } from "@/redux/basketReducer";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import Modal from "@/components/Modal/Modal";
import Cookies from "js-cookie";
import { updateBasketOnServer } from "@/redux/cartUpdate";
import { submitCart } from "@/redux/cartSubmit";

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
  const [showModal, setShowModal] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch("https://skillfactory-task.detmir.team/cart", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const items = data.map(({ product: { id, title, price, picture }, quantity }: { product: { id: string; title: string; price: number; picture: string }; quantity: number }) => ({
            id,
            title,
            price,
            quantity,
            picture,
          }));
          dispatch(updateBasket(items));
        } else {
          const errorData = await response.json();
          console.error("Ошибка при получении данных корзины:", errorData);
        }
      } catch (error) {
        console.error("Ошибка при получении данных корзины:", error);
      }
    };

    fetchCartData();
  }, [dispatch]);

  const handleContainerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleQuantityChange = (productId: string, increment: boolean) => {
    const item = basketItems.find((item) => item.id === productId);
    const totalCost = calculateTotalPrice() + (increment ? item?.price || 0 : -(item?.price || 0));
    if (totalCost > MAX_TOTAL_COST) {
      setShowModal(true);
      return;
    }
    increment ? dispatch(incrementQuantity(productId)) : dispatch(decrementQuantity(productId));
    updateBasketOnServer();
  };

  const handleRemoveClick = (productId: string) => {
    dispatch(removeFromBasket(productId));
    updateBasketOnServer();
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

  const handleCheckoutClick = async () => {
    setIsSending(true);

    try {
      await submitCart(basketItems);
      dispatch(clearBasket());
      Cookies.remove("basket");
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    } finally {
      setIsSending(false);
    }
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
          <button className={styles.checkout} onClick={handleCheckoutClick} disabled={isSending}>
            {isSending ? "Отправка..." : "Оформить заказ"}
          </button>
          <Modal message="Корзина переполнена" isOpen={showModal} onClose={closeModal} />
        </div>
      )}
    </div>
  );
};

export default Basket;
