import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://studytrack-backend-scnp.onrender.com/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.response.use(
  response => response,
  error => {
    error.userMessage = error.response?.data?.message || error.message || "The request could not be completed.";
    return Promise.reject(error);
  }
);

export const unwrap = response => response?.data?.data ?? response?.data ?? {};
export const getErrorMessage = error => error?.userMessage || error?.response?.data?.message || "Something went wrong.";
export default api;
