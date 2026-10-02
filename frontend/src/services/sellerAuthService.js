import api from "../api/api";

export const registerSeller = async (sellerData) => {
  const response = await api.post(
    "/seller/register",
    sellerData
  );

  return response.data;
};

export const getSellerProfile = async () => {
  const response = await api.get("/seller/profile");

  return response.data;
};

export const updateSellerProfile = async (profileData) => {
  const response = await api.put(
    "/seller/profile",
    profileData
  );

  return response.data;
};