import axios from "axios";
import { store } from "../app/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Request interceptor to add JWT token from Redux state
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.token;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
