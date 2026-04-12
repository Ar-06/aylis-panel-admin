import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const axiosSetting = axios.create({
  baseURL: `${API_URL}/api/v1/settings`,
  withCredentials: true,
});
