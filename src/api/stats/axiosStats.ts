import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosStats = axios.create({
  baseURL: `${API_URL}/api/v1/stats`,
  withCredentials: true,
});

export default axiosStats;
