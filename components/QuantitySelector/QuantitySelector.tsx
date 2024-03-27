import React from "react";
import Image from "next/image";
import Minus from "@/public/Minus.svg";
import Plus from "@/public/Plus.svg";
import MinusWhite from "@/public/MinusWhite.svg";
import PlusWhite from "@/public/PlusWhite.svg";
import styles from "./QuantitySelector.module.css";
import { QuantitySelectorProps } from "@/types/types";

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, isMinusClicked, isPlusClicked, handleMinusClick, handlePlusClick, handleRemoveClick, handlePlaceOrderClick, showOrderButton = true }) => {
  const minusButtonClass = quantity > 0 ? (isMinusClicked ? styles.buttonMinusClicked : styles.buttonMinus) : styles.buttonMinusInactive;
  const plusButtonClass = isPlusClicked ? styles.buttonPlusClicked : styles.buttonPlus;

  return (
    <div className={styles.quantityContainer}>
      <button className={minusButtonClass} onClick={handleMinusClick} disabled={quantity === 0}>
        <Image src={isMinusClicked ? MinusWhite : Minus} alt="Decrease by one" width={20} height={20} />
      </button>
      <span className={styles.buttonQuantity}>{quantity}</span>
      <button className={plusButtonClass} onClick={handlePlusClick}>
        <Image src={isPlusClicked ? PlusWhite : Plus} alt="Increase by one" width={20} height={20} />
      </button>
      {quantity === 0 && (
        <button className={styles.removeButton} onClick={handleRemoveClick}>
          Remove
        </button>
      )}
      {showOrderButton && quantity > 0 && handlePlaceOrderClick && (
        <button className={styles.orderButton} onClick={handlePlaceOrderClick}>
          Place Order
        </button>
      )}
    </div>
  );
};

export default QuantitySelector;
