import store from "@/redux/store";

export const updateBasketOnServer = async () => {
  try {
    const updatedBasket = store.getState().basket.items.map(({ id, quantity }) => ({ id, quantity }));

    const response = await fetch("https://skillfactory-task.detmir.team/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: updatedBasket }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Корзина успешно обновлена на сервере:", data);
    } else {
      const errorData = await response.json();
      console.error("Ошибка при обновлении корзины на сервере:", errorData);
    }
  } catch (error) {
    console.error("Ошибка при обновлении корзины на сервере:", error);
  }
};
