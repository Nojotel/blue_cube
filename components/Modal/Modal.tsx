import React, { useEffect, useState } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setShowModal(true);
      timeout = setTimeout(() => {
        setShowModal(false);
        onClose();
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isOpen, onClose]);

  if (!showModal) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.modalMessage}>{message}</span>
      </div>
    </div>
  );
};

export default Modal;
