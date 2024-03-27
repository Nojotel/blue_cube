import React, { useEffect, useState, useCallback } from "react";
import { fetchOrders } from "@/api/ordersFetch";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "@/redux/ordersReducer";
import { clearBasket, addToBasket, getTotalPriceInBasket } from "@/redux/basketReducer";
import { RootState } from "@/redux/store";
import styles from "./OrdersPage.module.css";
import Image from "next/image";
import Loading from "@/app/loading";
import Pagination from "@/components/Pagination/Pagination";
import BasketModal from "@/components/BasketModal/BasketModal";
import { Product } from "@/types/types"; // Импортируем интерфейс Product из types.ts
import store from "@/redux/store";

interface Order {
  id: number;
  createdAt: string;
  products: ProductWithQuantity[];
  quantity: number;
}

interface ProductWithQuantity extends Product {
  quantity: number;
}

const MAX_TOTAL_COST = 10000;
const ORDERS_PER_PAGE = 10;

const OrdersPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    return typeof window !== "undefined" ? Number(localStorage.getItem("ordersPage")) || 1 : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const dispatch = useDispatch();
  const orders = useSelector<RootState, Order[]>((state) => state.orders.orders);

  const fetchData = useCallback(async () => {
    try {
      let page = 1;
      let fetchedOrders: Order[] = [];

      while (true) {
        const response = await fetchOrders(ORDERS_PER_PAGE, page);
        if (response.data.length === 0) {
          break;
        }
        const formattedOrders: Order[] = response.data.map((orderData: any[], index: number) => ({
          id: (page - 1) * ORDERS_PER_PAGE + index + 1,
          createdAt: response.data[0][0].createdAt,
          products: orderData.map((item: any) => ({ ...item.product, quantity: item.quantity })),
          quantity: orderData.length,
        }));
        fetchedOrders.push(...formattedOrders);
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
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = currentPage * ORDERS_PER_PAGE;
    const pageOrders = allOrders.slice(startIndex, endIndex);
    dispatch(setOrders(pageOrders));
  }, [dispatch, currentPage, allOrders]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ordersPage", currentPage.toString());
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOrderMoreClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleMergeOrders = (order: Order) => {
    const newItems: ProductWithQuantity[] = order.products;
    const currentTotalCost = getTotalPriceInBasket(store.getState());
    const orderTotalCost = newItems.reduce((total, item) => total + item.price * item.quantity, 0);

    if (currentTotalCost + orderTotalCost <= MAX_TOTAL_COST) {
      dispatch(addToBasket(newItems));
      handleCloseModal();
    } else {
      setIsModalOpen(false);
    }
  };

  const handleCreateNewOrder = (order: Order) => {
    dispatch(clearBasket());
    order.products.forEach((product) => {
      for (let i = 0; i < product.quantity; i++) {
        dispatch(addToBasket([product]));
      }
    });
    handleCloseModal();
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
                  На сумму <div className={styles.dateContainerTitle}>{order.products.reduce((total, product) => total + product.price * product.quantity, 0)} ₽</div>
                </div>
                <button className={styles.moreButton} onClick={() => handleOrderMoreClick(order)}>
                  Заказать ещё
                </button>
              </div>
            </div>
          ))}
          <Pagination setPage={handlePageChange} page={currentPage} totalPages={totalPages} storageKey="ordersPage" />
        </>
      ) : (
        <p className={styles.none}>Заказы не найдены.</p>
      )}
      {isModalOpen && selectedOrder && <BasketModal isOpen={isModalOpen} onClose={handleCloseModal} newOrder={selectedOrder.products} onAction1={() => handleMergeOrders(selectedOrder)} onAction2={() => handleCreateNewOrder(selectedOrder)} key={selectedOrder.id} />}
    </div>
  );
};

export default OrdersPage;
