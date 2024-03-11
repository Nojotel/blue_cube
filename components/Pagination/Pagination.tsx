import React, { FC, useState, useEffect } from "react";
import styles from "./Pagination.module.css";
import Image from "next/legacy/image";
import leftIcon from "@/public/Left.svg";
import rightIcon from "@/public/Right.svg";
import leftActiveIcon from "@/public/LeftActive.svg";
import rightActiveIcon from "@/public/RightActive.svg";

interface PaginationProps {
  setPage: (page: number) => void;
  page: number;
}

const Pagination: FC<PaginationProps> = ({ setPage, page }) => {
  const [isLeftClicked, setIsLeftClicked] = useState(false);
  const [isRightClicked, setIsRightClicked] = useState(false);
  const [visiblePages, setVisiblePages] = useState(5);
  const totalPages = 10;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    localStorage.setItem("page", page.toString());
  }, [page]);

  useEffect(() => {
    const updateVisiblePages = () => {
      if (window.innerWidth < 530) {
        setVisiblePages(1);
      } else {
        setVisiblePages(5);
      }
    };

    window.addEventListener("resize", updateVisiblePages);
    updateVisiblePages();

    setIsClient(true);

    return () => window.removeEventListener("resize", updateVisiblePages);
  }, []);

  if (!isClient) {
    return null;
  }

  let startPage = page - Math.floor(visiblePages / 2);
  startPage = Math.max(startPage, 1);
  startPage = Math.min(startPage, totalPages - visiblePages + 1);
  let endPage = startPage + visiblePages - 1;
  endPage = Math.min(endPage, totalPages);

  const handleClick = (newPage: number, direction: string) => {
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
          <Image src={isLeftClicked ? leftActiveIcon.src : leftIcon.src} alt={isLeftClicked ? "Left Active" : "Left"} width={20} height={20} />
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
          <Image src={isRightClicked ? rightActiveIcon.src : rightIcon.src} alt={isRightClicked ? "Right Active" : "Right"} width={20} height={20} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
