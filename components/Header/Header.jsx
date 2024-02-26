"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import logo from "@/public/logo.svg";
import basket from "@/public/basket.svg";
import basketHover from "@/public/basketHover.svg";
import { usePathname } from "next/navigation";
import Link from "next/link";
const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const isBasketPage = pathname === "/basket";
  return (
    <header className={styles.container}>
      <nav className={styles.navigation}>
        <Image className={styles.logo} src={logo} alt="Logo" width={150} height={24} priority />
        <ul className={styles.links}>
          <li className={pathname === "/" ? styles.active : styles.linksItems}>
            <Link href="/">Товары</Link>
          </li>
          <li className={pathname === "/orders" ? styles.active : styles.linksItems}>
            <Link href="/orders">Заказы</Link>
          </li>
        </ul>
        <Link href="/basket">
          <div className={`${styles.basketContainer} ${isHovered || isBasketPage ? styles.hovered : ""}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Image className={styles.basket} src={isHovered || isBasketPage ? basketHover : basket} alt="Корзина" width={20} height={20} />
            <span className={styles.basketText}>Корзина (0)</span>
          </div>
        </Link>
      </nav>
    </header>
  );
};
export default Header;
