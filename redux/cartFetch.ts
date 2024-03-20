import { Dispatch } from "redux";
import { updateBasket } from "./basketReducer";

export const fetchCartData = async (dispatch: Dispatch) => {
  try {
    const response = await fetch("https://skillfactory-task.detmir.team/cart", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      const items = data.map(({ product: { id, title, price, picture }, quantity }: { product: { id: string; title: string; price: number; picture: string }; quantity: number }) => ({
        id,
        title,
        price,
        quantity,
        picture,
      }));
      dispatch(updateBasket(items));
    } else {
      const errorData = await response.json();
      console.error("Ошибка при получении данных корзины:", errorData);
    }
  } catch (error) {
    console.error("Ошибка при получении данных корзины:", error);
  }
};
