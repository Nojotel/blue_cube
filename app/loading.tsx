import styles from "@/style/loading.module.css";
export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.text}>Страница загружается</div>
      <div className={styles.spinner}></div>
    </div>
  );
}
