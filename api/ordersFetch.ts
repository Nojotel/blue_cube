export const fetchOrders = async (limit: number, page: number) => {
  try {
    const response = await fetch(`https://skillfactory-task.detmir.team/orders?limit=${limit}&page=${page}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении заказов");
    }

    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error("Ошибка при выполнении запроса к API:", error);
    throw error;
  }
};
