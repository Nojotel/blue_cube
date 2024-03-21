import React, { useEffect, useState, useCallback } from "react";
import { fetchOrders } from "@/api/ordersFetch";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "@/redux/ordersReducer";
import { RootState } from "@/redux/store";
import styles from "./OrdersPage.module.css";
import Image from "next/image";
import Loading from "@/app/loading";
import Pagination from "@/components/Pagination/Pagination";

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
  products: Product[];
}

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const dispatch = useDispatch();
  const orders = useSelector<RootState, Order[]>((state) => state.orders.orders);

  const fetchData = useCallback(async () => {
    try {
      let page = 1;
      let fetchedOrders: Order[] = [];
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetchOrders(10, page);
        if (response.data.length === 0) {
          break;
        }
        const offset = (page - 1) * 10;
        const formattedOrders: Order[] = response.data.map((orderData: any[], index: number) => ({
          id: index + offset + 1,
          quantity: orderData.length,
          createdAt: orderData[0].createdAt,
          products: orderData.map((item: any) => item.product),
        }));
        fetchedOrders = [...fetchedOrders, ...formattedOrders];
        hasMorePages = response.data.length === 10;
        page++;
      }
      setAllOrders(fetchedOrders);
      setTotalPages(page - 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const pageOrders = allOrders.slice((currentPage - 1) * 10, currentPage * 10);
    dispatch(setOrders(pageOrders));
  }, [dispatch, currentPage, allOrders]);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : orders.length > 0 ? (
        <>
          {orders.map((order) => (
            <div key={order.id} className={styles.container}>
              <div className={styles.orderContainer}>
                <div className={styles.orderSubtitle}>Заказ</div>
                <div className={styles.orderTitle}>№{order.id}</div>
              </div>
              <div className={styles.imageContainer}>
                {order.products.map((product, index) => (
                  <div key={index} className={styles.image}>
                    <Image src={product.picture} alt={product.title} width={48} height={48} />
                  </div>
                ))}
              </div>
              <div className={styles.dateContainer}>
                <div className={styles.dateContainerSubtitle}>
                  Оформлено <div className={styles.dateContainerTitle}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className={styles.dateContainerSubtitle}>
                  На сумму <div className={styles.dateContainerTitle}>{order.products.reduce((total, product) => total + product.price, 0)} ₽</div>
                </div>
                <button className={styles.moreButton}>Заказать ещё</button>
              </div>
            </div>
          ))}
          <Pagination setPage={handlePageChange} page={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <p className={styles.none}>Заказы не найдены.</p>
      )}
    </div>
  );
};

export default OrdersPage;
