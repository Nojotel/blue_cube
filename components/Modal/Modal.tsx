import React, { useEffect, useState } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpen) {
      setShowModal(true);
      timeout = setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setShowModal(false);
    }

    return () => clearTimeout(timeout);
  }, [isOpen, onClose]);

  return (
    <>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.modalMessage}>{message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
