import styles from "./page.module.css";
import ProductList from "@/components/ProductList/ProductList";

export default function Home() {
  return (
    <main className={styles.main}>
      <ProductList />
    </main>
  );
}
