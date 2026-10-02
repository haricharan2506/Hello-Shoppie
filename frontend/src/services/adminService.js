import api from "../api/api";

export const getPendingSellers = async () => {
  const response = await api.get("/admin/sellers/pending");
  return response.data;
};

export const approveSeller = async (sellerId) => {
  const response = await api.patch(
    `/admin/sellers/${sellerId}/approve`
  );

  return response.data;
};

export const getAllSellers = async () => {
  const response = await api.get("/admin/sellers");
  return response.data;
}

export const getAllCustomers = async () => {
  const response = await api.get("/admin/customers");
  return response.data;
};

export const getAllProducts = async () => {
  const response = await api.get("/admin/products");
  return response.data;
};