import React from "react";
import styles from "./Basket.module.css";

interface BasketProps {
  isOpen: boolean;
  onToggle: (value: boolean) => void;
  children: React.ReactNode;
}

const Basket: React.FC<BasketProps> = ({ isOpen, onToggle, children }) => {
  const basketItems = [
    { id: "1", title: "Product 1", quantity: 2 },
    { id: "2", title: "Product 2", quantity: 1 },
  ];

  const handleContainerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div onClick={() => onToggle(!isOpen)}>
      {children}
      {isOpen && (
        <div className={styles.container} onClick={handleContainerClick}>
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
