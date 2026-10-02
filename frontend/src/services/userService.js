import api from "../api/api";

export const getMyProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/users/change-password",
    passwordData
  );

  return response.data;
};