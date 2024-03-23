import React from "react";
import styles from "./BasketModal.module.css";
import { useDispatch } from "react-redux";
import { clearBasket, addToBasket } from "@/redux/basketReducer";
import { setBasketOpen } from "@/redux/basketSlice";

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction1: () => void;
  onAction2: () => void;
  message: string;
}

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose, onAction1, onAction2, message }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    onClose();
  };

  const handleAction1 = () => {
    onAction1();
    onClose();
    dispatch(setBasketOpen(true));
  };

  const handleAction2 = () => {
    onAction2();
    onClose();
    dispatch(setBasketOpen(true));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={handleClose}>
          X
        </span>
        <p className={styles.modalMessage}>{message}</p>
        <button className={styles.button} onClick={handleAction1}>
          Объединить заказы в корзине
        </button>
        <button className={styles.button} onClick={handleAction2}>
          Создать новый заказ
        </button>
      </div>
    </div>
  );
};

export default BasketModal;
