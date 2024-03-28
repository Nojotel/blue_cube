import axios from "axios";
import { Dispatch } from "redux";
import { updateBasket } from "../redux/basketReducer";
import { BasketItem, Product } from "@/types/types";

const API_URL = "https://skillfactory-task.detmir.team";

interface CartItem {
  product: Product;
  quantity: number;
}

export const fetchCartData = async (dispatch: Dispatch) => {
  try {
    const response = await axios.get<CartItem[]>(`${API_URL}/cart`, {
      withCredentials: true,
    });

    const items: BasketItem[] = response.data.map(({ product, quantity }) => ({
      ...product,
      quantity,
    }));

    dispatch(updateBasket(items));
  } catch (error) {
    console.error("Ошибка при получении данных корзины:", error);
  }
};
