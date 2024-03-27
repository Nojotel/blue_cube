import axios from "axios";

const API_URL = "https://skillfactory-task.detmir.team";

export const submitCart = async (basketItems: any[]) => {
  try {
    const response = await axios.post(`${API_URL}/cart/submit`, basketItems, { withCredentials: true });

    console.log("Успешный ответ от сервера:", response.data);
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
    throw new Error("Ошибка при оформлении заказа");
  }
};
