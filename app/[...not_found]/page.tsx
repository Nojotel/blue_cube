import Link from "next/link";
import styles from "@/style/not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>404</h2>
      <div className={styles.text}>Такой страницы нет</div>
      <Link href="/" passHref>
        <button className={styles.button}>На главную</button>
      </Link>
    </div>
  );
}
