import React, { FC, useState, useEffect, MouseEvent, useCallback } from "react";
import Image from "next/image";
import Head from "next/head";
import styles from "./Header.module.css";
import logo from "@/public/logo.svg";
import basket from "@/public/basket.svg";
import basketHover from "@/public/basketHover.svg";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Up from "@/public/Arrow Up.svg";
import Basket from "@/components/Basket/Basket";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setBasketOpen } from "@/redux/basketSlice";

const Header: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [logoSrc, setLogoSrc] = useState(logo);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isOpen = useSelector((state: RootState) => state.basketVisibility.isOpen);
  const pathname = usePathname();
  const isBasketPage = pathname === "/basket";
  const basketItems = useSelector((state: RootState) => state.basket.items);
  const basketCount = basketItems.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    const getIsMobile = () => window.innerWidth < 530;
    const getIsMedium = () => window.innerWidth < 1050;
    setIsMobile(getIsMobile());
    setShowBackToTop(getIsMedium());
    setLogoSrc(logo);
    const handleResize = () => {
      const isMobile = getIsMobile();
      const isMedium = getIsMedium();
      setIsMobile(isMobile);
      setShowBackToTop(isMedium);
      setLogoSrc(logo);
    };
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBasketToggle = useCallback(
    (value: boolean) => {
      dispatch(setBasketOpen(value));
    },
    [dispatch]
  );

  const scrollToTop = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <header className={styles.container}>
      <Head>
        <title>Синий куб</title>
        <meta name="description" content="Магазин детских товаров" />
      </Head>
      <nav className={styles.navigation}>
        <Image className={styles.logo} src={logoSrc} alt="Logo" width={150} height={24} priority />
        <ul className={styles.links}>
          <li className={pathname === "/" ? styles.active : styles.linksItems}>
            <Link href="/">Товары</Link>
          </li>
          <li className={pathname === "/orders" ? styles.active : styles.linksItems}>
            <Link href="/orders">Заказы</Link>
          </li>
        </ul>
        <Basket isOpen={isOpen} onToggle={handleBasketToggle}>
          <div className={`${styles.basketContainer} ${isOpen || isBasketPage ? styles.hovered : ""} ${isOpen ? styles.opened : ""}`} onClick={() => handleBasketToggle(!isOpen)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Image className={styles.basket} src={isHovered || isOpen ? basketHover : basket} alt="Корзина" width={20} height={20} />
            {!isMobile && <span className={styles.basketText}>Корзина</span>}
            <span style={{ color: "rgb(23, 32, 41)" }}>({basketCount})</span>
          </div>
        </Basket>
        {showBackToTop && (
          <button onClick={scrollToTop} className={`${styles.backToTop} ${isScrolled ? styles.scrolled : ""}`}>
            <Image src={Up} alt="Logo" width={24} height={24} />
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
