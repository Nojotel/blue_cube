import React from "react";
import Image from "next/image";
import Minus from "@/public/Minus.svg";
import Plus from "@/public/Plus.svg";
import MinusWhite from "@/public/MinusWhite.svg";
import PlusWhite from "@/public/PlusWhite.svg";
import styles from "./QuantitySelector.module.css";

interface QuantitySelectorProps {
  quantity: number;
  isMinusClicked: boolean;
  isPlusClicked: boolean;
  handleMinusClick: () => void;
  handlePlusClick: () => void;
  handleRemoveClick: () => void;
  handlePlaceOrderClick?: () => void;
  showOrderButton?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, isMinusClicked, isPlusClicked, handleMinusClick, handlePlusClick, handleRemoveClick, handlePlaceOrderClick, showOrderButton = true }) => {
  const minusButtonClass = quantity > 0 ? (isMinusClicked ? styles.buttonMinusClicked : styles.buttonMinus) : styles.buttonMinusInactive;
  const plusButtonClass = isPlusClicked ? styles.buttonPlusClicked : styles.buttonPlus;

  return (
    <div className={styles.quantityContainer}>
      <button className={minusButtonClass} onClick={handleMinusClick} disabled={quantity === 0}>
        <Image src={isMinusClicked ? MinusWhite : Minus} alt="Кнопка на один товар меньше" width={20} height={20} />
      </button>
      <span className={styles.buttonQuantity}>{quantity}</span>
      <button className={plusButtonClass} onClick={handlePlusClick}>
        <Image src={isPlusClicked ? PlusWhite : Plus} alt="Кнопка на один товар больше" width={20} height={20} />
      </button>
      {quantity === 0 && (
        <button className={styles.removeButton} onClick={handleRemoveClick}>
          Удалить
        </button>
      )}
      {showOrderButton && quantity > 0 && handlePlaceOrderClick && (
        <button className={styles.orderButton} onClick={handlePlaceOrderClick}>
          Оформить заказ
        </button>
      )}
    </div>
  );
};

export default QuantitySelector;
