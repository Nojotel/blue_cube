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
  handlePlaceOrderClick?: () => void;
  showOrderButton?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, isMinusClicked, isPlusClicked, handleMinusClick, handlePlusClick, handlePlaceOrderClick, showOrderButton = true }) => {
  return (
    <div className={styles.quantityContainer}>
      <button className={quantity > 0 ? (isMinusClicked ? styles.buttonMinusClicked : styles.buttonMinus) : styles.buttonMinusInactive} onClick={handleMinusClick} disabled={quantity === 0}>
        <Image src={isMinusClicked ? MinusWhite : Minus} alt="Кнопка на один товар меньше" width={20} height={20} />
      </button>
      <span className={styles.buttonQuantity}>{quantity}</span>
      <button className={isPlusClicked ? styles.buttonPlusClicked : styles.buttonPlus} onClick={handlePlusClick}>
        <Image src={isPlusClicked ? PlusWhite : Plus} alt="Кнопка на один товар больше" width={20} height={20} />
      </button>
      {showOrderButton && quantity > 0 && handlePlaceOrderClick && (
        <button className={styles.orderButton} onClick={handlePlaceOrderClick}>
          Оформить заказ
        </button>
      )}
    </div>
  );
};

export default QuantitySelector;
