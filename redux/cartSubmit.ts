export const submitCart = async (basketItems: any[]) => {
  try {
    const response = await fetch("https://skillfactory-task.detmir.team/cart/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(basketItems),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Успешный ответ от сервера:", data);
    } else {
      const errorData = await response.json();
      console.error("Ошибка при оформлении заказа:", errorData);
      throw new Error("Ошибка при оформлении заказа");
    }
  } catch (error) {
    console.error("Ошибка при отправке запроса:", error);
    throw error;
  }
};
