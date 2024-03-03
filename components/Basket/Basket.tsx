import React from "react";
import styles from "./Basket.module.css";

interface BasketProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const Basket: React.FC<BasketProps> = ({ isOpen, setIsOpen, children }) => {
  const basketItems = [
    { id: "1", title: "Product 1", quantity: 2 },
    { id: "2", title: "Product 2", quantity: 1 },
  ];

  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {children}
      {isOpen && (
        <div className={styles.container}>
          {basketItems.map((item) => (
            <div key={item.id}>
              {item.title} - Quantity: {item.quantity}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Basket;
