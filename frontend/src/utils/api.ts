import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore"; // ✅ make sure path matches your project

// Change this if you deploy or tunnel your backend
// const BASE_URL = "https://tiketa-51fb.onrender.com";
const BASE_URL = "http://localhost:8765";

// Create a single axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // since we’re using headers, not cookies
});

// ✅ Interceptor: automatically attach Bearer token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // grab from Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Optional: handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — clearing token");
      useAuthStore.getState().clearAuth(); // clear Zustand token
    }
    return Promise.reject(error);
  }
);

// ✅ Helper request methods
export const getRequest = async (endpoint: string, options = {}) => {
  const res = await api.get(endpoint, options);
  return res.data;
};

export const postRequest = async (
  endpoint: string,
  data: unknown,
  options = {}
) => {
  const res = await api.post(endpoint, data, options);
  return res.data;
};

export const putRequest = async (
  endpoint: string,
  data: unknown,
  options = {}
) => {
  const res = await api.put(endpoint, data, options);
  return res.data;
};

export const patchRequest = async (
  endpoint: string,
  data: unknown,
  options = {}
) => {
  const res = await api.patch(endpoint, data, options);
  return res.data;
};

export const deleteRequest = async (endpoint: string, options = {}) => {
  const res = await api.delete(endpoint, options);
  return res.data;
};

export default api;
