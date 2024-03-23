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
import { Product } from "@/redux/productReducer";

interface Order {
  id: number;
  quantity: number;
  createdAt: string;
  products: ProductWithQuantity[];
}

interface ProductWithQuantity extends Product {
  quantity: number;
}

const MAX_TOTAL_COST = 10000;

const OrdersPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("ordersPage")) || 1;
    }
    return 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const dispatch = useDispatch();

  const orders = useSelector<RootState, Order[]>((state) => state.orders.orders);
  const basketTotalCost = useSelector<RootState, number>(getTotalPriceInBasket);

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
          createdAt: response.data[0][0].createdAt,
          products: orderData.map((item: any) => ({ ...item.product, quantity: item.quantity })),
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ordersPage", currentPage.toString());
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
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
    const orderTotalCost = newItems.reduce((total, item) => total + item.price * item.quantity, 0);
    if (basketTotalCost + orderTotalCost <= MAX_TOTAL_COST) {
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
