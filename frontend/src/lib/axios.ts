import axios from "axios";

const userUrl = import.meta.env.VITE_USER_URL;
const contentUrl = import.meta.env.VITE_CONTENT_URL;
const connectionUrl = import.meta.env.VITE_CONNECTION_URL;

export const AXIOS_USER = axios.create({
  baseURL: userUrl,
  withCredentials: true,
});

export const AXIOS_CONNECTION = axios.create({
  baseURL: connectionUrl,
  withCredentials: true,
});

export const AXIOS_CONTENT = axios.create({
  baseURL: contentUrl,
  withCredentials: true,
});
