import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, isOpen, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      setShow(true);
      timeout = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000);
    } else {
      setShow(false);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isOpen, onClose]);

  return show ? (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.modalMessage}>{message}</span>
      </div>
    </div>
  ) : null;
};

export default Modal;
