import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosAuth = axios.create({
  baseURL: `${API_URL}/api/v1/auth`,
  withCredentials: true,
});

export default axiosAuth;
