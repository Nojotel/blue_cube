import React, { useEffect } from "react";
import styles from "./BasketModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { clearBasket, addToBasket } from "@/redux/basketReducer";
import { setBasketOpen } from "@/redux/basketSlice";
import { RootState } from "@/redux/store";
import { Product } from "@/redux/productReducer";
import Modal from "@/components/Modal/Modal";

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  newOrder: Product[];
  onAction1: () => void;
  onAction2: () => void;
}

const MAX_TOTAL_COST = 10000;

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose, newOrder, onAction1, onAction2 }) => {
  const dispatch = useDispatch();
  const basketItems = useSelector((state: RootState) => state.basket.items);
  const [showModal, setShowModal] = React.useState(false);

  const handleClose = () => {
    onClose();
    setShowModal(false);
  };

  const handleMergeOrders = () => {
    const canMergeOrders = isTotalCostAllowed(newOrder);
    if (canMergeOrders) {
      dispatch(addToBasket(newOrder));
      onAction1();
      onClose();
      dispatch(setBasketOpen(true));
    } else {
      setShowModal(true);
    }
  };

  const handleCreateNewOrder = () => {
    dispatch(clearBasket());
    dispatch(addToBasket(newOrder));
    onAction2();
    onClose();
    dispatch(setBasketOpen(true));
  };

  const isTotalCostAllowed = (newOrder: Product[]) => {
    const totalCost = basketItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const newTotalCost = newOrder.reduce((total, product) => total + product.price, totalCost);
    return newTotalCost <= MAX_TOTAL_COST;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={handleClose}>
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
      <Modal message="Корзина уже переполнена" isOpen={showModal} onClose={handleClose} />
    </div>
  );
};

export default BasketModal;
