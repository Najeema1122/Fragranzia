import axios from "axios";

const apiUrl = "/";


export const BASE_URL = apiUrl;
export const MEDIA_URL = "";


export const axiosPrivate = axios.create({
  baseURL: BASE_URL
});