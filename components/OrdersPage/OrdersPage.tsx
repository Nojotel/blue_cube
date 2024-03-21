import React, { useEffect, useState } from "react";
import { fetchOrders } from "@/api/ordersFetch";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "@/redux/ordersReducer";
import { RootState } from "@/redux/store";
import styles from "./OrdersPage.module.css";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  picture: string;
}

interface Order {
  id: number;
  quantity: number;
  createdAt: string;
  product: Product;
}

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders as Order[]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetchOrders(10, 1);
        const formattedOrders = response.data.flat().map((order: any, index: number) => ({
          ...order,
          id: index + 1,
        }));
        dispatch(setOrders(formattedOrders));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, [dispatch]);

  return (
    <div>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className={styles.container}>
            <div className={styles.orderContainer}>
              <div className={styles.orderSubtitile}>Заказ</div>
              <div className={styles.orderTitile}>№{order.id}</div>
            </div>
            <div className={styles.image}>
              <Image src={order.product.picture} alt={order.product.title} width={48} height={48} layout="responsive" />
            </div>
            <div className={styles.dateContainer}>
              <div className={styles.dateContainerSubtitle}>
                Оформлено <div className={styles.dateContainerTitle}>{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div className={styles.dateContainerSubtitle}>
                На сумму <div className={styles.dateContainerTitle}>{order.quantity * order.product.price} ₽</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Заказы не найдены.</p>
      )}
    </div>
  );
};

export default OrdersPage;
