"use client";

import React, { useState } from "react";
import styles from "./Pagination.module.css";
import Image from "next/image";
import left from "@/public/Left.svg";
import right from "@/public/Right.svg";
import leftActive from "@/public/LeftActive.svg";
import rightActive from "@/public/RightActive.svg";

const Pagination = ({ setPage, page }) => {
  const [isLeftClicked, setIsLeftClicked] = useState(false);
  const [isRightClicked, setIsRightClicked] = useState(false);
  const totalPages = 10;
  const visiblePages = 5;
  const startPage = Math.max(1, Math.min(page, totalPages - visiblePages + 1));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  const handleClick = (newPage, direction) => {
    setPage(newPage);
    if (direction === "left") {
      setIsLeftClicked(true);
      setTimeout(() => setIsLeftClicked(false), 500);
    } else if (direction === "right") {
      setIsRightClicked(true);
      setTimeout(() => setIsRightClicked(false), 500);
    }
  };

  return (
    <div className={styles.container}>
      {page > 1 && (
        <button className={`${styles.left} ${isLeftClicked ? styles.active : ""}`} onClick={() => handleClick(page - 1, "left")}>
          <Image src={isLeftClicked ? leftActive : left} alt="Left" width={20} height={20} />
        </button>
      )}
      {[...Array(endPage - startPage + 1)].map((_, i) => {
        const pageNumber = startPage + i;
        return (
          <button key={pageNumber} onClick={() => setPage(pageNumber)} className={`${pageNumber === page ? styles.active : ""} ${styles.button}`}>
            {pageNumber}
          </button>
        );
      })}
      {page < totalPages && (
        <button className={`${styles.right} ${isRightClicked ? styles.active : ""}`} onClick={() => handleClick(page + 1, "right")}>
          <Image src={isRightClicked ? rightActive : right} alt="Right" width={20} height={20} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
