import React, { useCallback, useState } from "react";
import styles from "./BasketModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { clearBasket, addToBasket } from "@/redux/basketReducer";
import { setBasketOpen } from "@/redux/basketSlice";
import { RootState } from "@/redux/store";
import { Product, Order, BasketModalProps, MAX_TOTAL_COST, OrderProduct } from "@/types/types";
import Modal from "@/components/Modal/Modal";
import { updateBasketOnServer } from "@/api/cartUpdate";

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose, newOrder, onAction1, onAction2 }) => {
  const dispatch = useDispatch();
  const basketItems = useSelector((state: RootState) => state.basket.items);
  const [showModal, setShowModal] = useState(false);

  const isTotalCostAllowed = useCallback(
    (order: Order) => {
      const totalCost = basketItems.reduce((total, item) => total + item.price * item.quantity!, 0);
      const newTotalCost = order.products.reduce((total, product) => total + product.price * product.quantity!, totalCost);
      return newTotalCost <= MAX_TOTAL_COST;
    },
    [basketItems]
  );

  const handleCloseBasket = useCallback(() => {
    onClose();
    setShowModal(false);
  }, [onClose]);

  const handleMergeOrders = useCallback(() => {
    const order: Order = { id: 0, quantity: 0, createdAt: "", products: newOrder };
    const canMergeOrders = isTotalCostAllowed(order);
    if (canMergeOrders) {
      newOrder.forEach((product) => {
        dispatch(addToBasket([product]));
      });
      handleCloseBasket();
      setTimeout(() => dispatch(setBasketOpen(true)), 3000);
      updateBasketOnServer();
    } else {
      setShowModal(true);
    }
  }, [dispatch, handleCloseBasket, isTotalCostAllowed, newOrder]);

  const handleCreateNewOrder = useCallback(() => {
    const order: Order = { id: 0, quantity: 0, createdAt: "", products: newOrder };
    onAction2(order);
    setTimeout(() => dispatch(setBasketOpen(true)), 3000);
    updateBasketOnServer();
  }, [dispatch, newOrder, onAction2]);

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={handleCloseBasket}>
          X
        </span>
        <p className={styles.modalMessage}>Что вы хотите сделать?</p>
        <button className={styles.button} onClick={handleMergeOrders}>
          Объединить заказы в корзине
        </button>
        <button className={styles.button} onClick={handleCreateNewOrder}>
          Создать новый заказ
        </button>
      </div>
      {showModal && <Modal message="Корзина уже переполнена" isOpen={showModal} onClose={handleCloseBasket} />}
    </div>
  );
};

export default BasketModal;
