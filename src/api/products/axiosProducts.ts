import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosProducts = axios.create({
  baseURL: `${API_URL}/api/v1/products`,
  withCredentials: true,
});

export default axiosProducts;