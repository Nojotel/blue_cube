import React, { FC, useState, useEffect } from "react";
import styles from "./Pagination.module.css";
import Image from "next/image";
import leftIcon from "@/public/Left.svg";
import rightIcon from "@/public/Right.svg";
import leftActiveIcon from "@/public/LeftActive.svg";
import rightActiveIcon from "@/public/RightActive.svg";
import { PaginationProps } from "@/types/types";

const Pagination: FC<PaginationProps> = ({ setPage, page, totalPages, storageKey }) => {
  const [isLeftClicked, setIsLeftClicked] = useState(false);
  const [isRightClicked, setIsRightClicked] = useState(false);
  const [visiblePages, setVisiblePages] = useState(5);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, page.toString());
  }, [page, storageKey]);

  useEffect(() => {
    const updateVisiblePages = () => {
      setVisiblePages(window.innerWidth < 530 ? 1 : 5);
    };

    window.addEventListener("resize", updateVisiblePages);
    updateVisiblePages();
    setIsClient(true);

    return () => window.removeEventListener("resize", updateVisiblePages);
  }, []);

  const handleClick = (newPage: number, direction: string) => {
    if (newPage >= 1 && newPage <= totalPages) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setPage(newPage);
      if (direction === "left") {
        setIsLeftClicked(true);
        setTimeout(() => setIsLeftClicked(false), 500);
      } else if (direction === "right") {
        setIsRightClicked(true);
        setTimeout(() => setIsRightClicked(false), 500);
      }
    }
  };

  const renderPageButtons = () => {
    const startPage = Math.max(page - Math.floor(visiblePages / 2), 1);
    const endPage = Math.min(startPage + visiblePages - 1, totalPages);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
      const pageNumber = startPage + i;
      return pageNumber >= 1 && pageNumber <= totalPages ? (
        <button key={pageNumber} onClick={() => handleClick(pageNumber, "")} className={`${pageNumber === page ? styles.active : ""} ${styles.button}`}>
          {pageNumber}
        </button>
      ) : null;
    });
  };

  return (
    <div className={styles.container}>
      {page > 1 && (
        <button className={`${styles.left} ${isLeftClicked ? styles.active : ""}`} onClick={() => handleClick(page - 1, "left")} disabled={page === 1}>
          <Image src={isLeftClicked ? leftActiveIcon.src : leftIcon.src} alt={isLeftClicked ? "Left Active" : "Left"} width={20} height={20} />
        </button>
      )}
      {renderPageButtons()}
      {page < totalPages && (
        <button className={`${styles.right} ${isRightClicked ? styles.active : ""}`} onClick={() => handleClick(page + 1, "right")} disabled={page === totalPages}>
          <Image src={isRightClicked ? rightActiveIcon.src : rightIcon.src} alt={isRightClicked ? "Right Active" : "Right"} width={20} height={20} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
