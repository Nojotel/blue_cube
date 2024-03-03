import React, { useState } from "react";
import styles from "./Basket.module.css";

interface BasketProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Basket: React.FC<BasketProps> = ({ children, isOpen, setIsOpen }) => {
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {children}
      {isOpen && (
        <div className={styles.container}>
          <div>123123</div>
        </div>
      )}
    </div>
  );
};

export default Basket;
