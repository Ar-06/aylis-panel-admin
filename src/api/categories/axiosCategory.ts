import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosCategories = axios.create({
  baseURL: `${API_URL}/api/v1/categories`,
  withCredentials: true,
});

export default axiosCategories;