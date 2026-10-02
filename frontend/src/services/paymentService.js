import api from "../api/api";

export const createPaymentOrder = async () => {
  const response = await api.post("/payment/create-order");
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post("/payment/verify", paymentData);
  return response.data;
};