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
  onAction1: (order: Order) => void;
  onAction2: (order: Order) => void;
}

const MAX_TOTAL_COST = 10000;

interface Order {
  products: Product[];
}

const BasketModal: React.FC<BasketModalProps> = ({ isOpen, onClose, newOrder, onAction1, onAction2 }) => {
  const dispatch = useDispatch();
  const basketItems = useSelector((state: RootState) => state.basket.items);
  const [showModal, setShowModal] = React.useState(false);

  const handleCloseBasket = () => {
    onClose();
    setShowModal(false);
  };

  const handleMergeOrders = () => {
    const order: Order = { products: newOrder };
    const canMergeOrders = isTotalCostAllowed(order);
    if (canMergeOrders) {
      order.products.forEach((product) => {
        for (let i = 0; i < product.quantity; i++) {
          dispatch(addToBasket([product]));
        }
      });
      handleCloseBasket();
      setTimeout(() => dispatch(setBasketOpen(true)), 3000);
      updateBasketOnServer();
    } else {
      setShowModal(true);
    }
  };

  const handleCreateNewOrder = () => {
    const order: Order = { products: newOrder };
    onAction2(order);
    setTimeout(() => dispatch(setBasketOpen(true)), 3000);
    updateBasketOnServer();
  };
  const isTotalCostAllowed = (order: Order) => {
    const totalCost = basketItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const newTotalCost = order.products.reduce((total, product) => total + product.price * product.quantity, totalCost);
    return newTotalCost <= MAX_TOTAL_COST;
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
