import api from "../api/api";

export const getMyOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const getSellerOrders = async () => {
  const response = await api.get("/orders/seller");
  return response.data;
};

export const getSellerOrderById = async (id) => {
  const response = await api.get(`/orders/seller/${id}`);
  return response.data;
};

export const updateSellerOrderStatus = async (id, status) => {
  const response = await api.put(
    `/orders/seller/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};