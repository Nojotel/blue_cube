import axios from "axios";

const API_URL = "https://skillfactory-task.detmir.team";

export const fetchOrders = async (limit: number, page: number) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      params: {
        limit,
        page,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Ошибка при выполнении запроса к API:", error);
    throw error;
  }
};
