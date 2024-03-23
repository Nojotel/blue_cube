import React from "react";
import styles from "./BasketModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { clearBasket, addToBasket } from "@/redux/basketReducer";
import { setBasketOpen } from "@/redux/basketSlice";
import { RootState } from "@/redux/store";
import { Product } from "@/redux/productReducer";
import Modal from "@/components/Modal/Modal";
import { updateBasketOnServer } from "@/api/cartUpdate";

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  newOrder: Product[];
  onAction1: (newItems: Product[]) => void;
  onAction2: (newItems: Product[]) => void;
}

const MAX_TOTAL_COST = 10000;

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose, newOrder, onAction1, onAction2 }) => {
  const dispatch = useDispatch();
  const basketItems = useSelector((state: RootState) => state.basket.items);

  const [showModal, setShowModal] = React.useState(false);

  const handleCloseBasket = () => {
    onClose();
    setShowModal(false);
  };

  const handleMergeOrders = () => {
    const newItems: Product[] = [];
    let totalCost = 0;

    newOrder.forEach((product) => {
      const quantityToAdd = product.quantity || 1;
      for (let i = 0; i < quantityToAdd; i++) {
        newItems.push(product);
        totalCost += product.price;
      }
    });

    if (totalCost + basketItems.reduce((total, item) => total + item.price * item.quantity, 0) <= MAX_TOTAL_COST) {
      dispatch(addToBasket(newItems));
      setTimeout(() => dispatch(setBasketOpen(true)), 3000);
      updateBasketOnServer();
      onAction1(newItems);
    } else {
      setShowModal(true);
    }
  };

  const handleCreateNewOrder = () => {
    const newItems: Product[] = [];
    newOrder.forEach((product) => {
      const quantityToAdd = product.quantity || 1;
      for (let i = 0; i < quantityToAdd; i++) {
        newItems.push(product);
      }
    });
    dispatch(clearBasket());
    newItems.forEach((product) => dispatch(addToBasket([product])));
    setTimeout(() => dispatch(setBasketOpen(true)), 3000);
    updateBasketOnServer();
    onAction2(newItems);
  };

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
