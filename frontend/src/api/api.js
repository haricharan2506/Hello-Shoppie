import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    // Let the browser set the correct Content-Type
    // when sending FormData.
    if (config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    } else {
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;