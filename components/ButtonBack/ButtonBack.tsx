import React, { FC, MouseEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./ButtonBack.module.css";
import left from "@/public/Left.svg";

const ButtonBack: FC = () => {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
