import api from "../api/api";

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/cart/add", {
    productId,
    quantity,
  });

  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/item/${itemId}`, {
    quantity,
  });

  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/item/${itemId}`);

  return response.data;
};