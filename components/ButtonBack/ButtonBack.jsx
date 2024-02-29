"use client";

import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./ButtonBack.module.css";
import left from "@/public/Left.svg";

const ButtonBack = () => {
  const router = useRouter();
  const handleClick = () => {
    router.back();
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      <Image src={left} alt="Left" width={20} height={20} />
      Назад
    </button>
  );
};

export default ButtonBack;
