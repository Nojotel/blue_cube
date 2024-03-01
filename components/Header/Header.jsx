import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import logo from "@/public/logo.svg";
import logoMob from "@/public/LogoMob.svg";
import basket from "@/public/basket.svg";
import basketHover from "@/public/basketHover.svg";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Up from "@/public/Arrow Up.svg";

const Header = () => {
  const [logoSrc, setLogoSrc] = useState(logo);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isBasketPage = pathname === "/basket";

  useEffect(() => {
    const getIsMobile = () => window.innerWidth < 530;
    const getIsMedium = () => window.innerWidth < 1050;
    setIsMobile(getIsMobile());
    setShowBackToTop(getIsMedium());
    setLogoSrc(getIsMobile() ? logoMob : logo);

    window.addEventListener("resize", () => {
      const isMobile = getIsMobile();
      const isMedium = getIsMedium();
      setIsMobile(isMobile);
      setShowBackToTop(isMedium);
      setLogoSrc(isMobile ? logoMob : logo);
    });

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", () => {
        const isMobile = getIsMobile();
        const isMedium = getIsMedium();
        setIsMobile(isMobile);
        setShowBackToTop(isMedium);
        setLogoSrc(isMobile ? logoMob : logo);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className={styles.container}>
      <nav className={styles.navigation}>
        <Image className={styles.logo} src={logoSrc} alt="Logo" width={150} height={24} />
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
            {!isMobile && <span className={styles.basketText}>Корзина</span>}(0)
          </div>
        </Link>
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
