import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "/";


export const BASE_URL = apiUrl;
export const MEDIA_URL = "";


export const axiosPrivate = axios.create({
  baseURL: BASE_URL
});
