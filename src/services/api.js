import axios from "axios";

const api = axios.create({
  baseURL: "",   // খালি রাখুন, কারণ এখন /api দিয়ে কল হবে
  headers: {
    "Content-Type": "application/json",
  },
});

// ইন্টারসেপ্টর আগের মতো থাকবে
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;