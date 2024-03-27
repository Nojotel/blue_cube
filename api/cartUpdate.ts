import axios from "axios";
import store from "@/redux/store";

const API_URL = "https://skillfactory-task.detmir.team";

export const updateBasketOnServer = async () => {
  try {
    const updatedBasket = store.getState().basket.items.map(({ id, quantity }) => ({ id, quantity }));

    const response = await axios.post(`${API_URL}/cart/update`, { data: updatedBasket }, { withCredentials: true });

    console.log("Корзина успешно обновлена на сервере:", response.data);
  } catch (error) {
    console.error("Ошибка при обновлении корзины на сервере:", error);
  }
};
