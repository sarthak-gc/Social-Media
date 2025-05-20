import axios from "axios";

const userUrl = import.meta.env.VITE_USER_URL;
const contentUrl = import.meta.env.VITE_CONTENT_URL;
const relationUrl = import.meta.env.VITE_RELATION_URL;
const requestUrl = import.meta.env.VITE_REQUEST_URL;
const notificationUrl = import.meta.env.VITE_NOTIFICATION_URL;

export const AXIOS_USER = axios.create({
  baseURL: userUrl,
  withCredentials: true,
});

export const AXIOS_RELATION = axios.create({
  baseURL: relationUrl,
  withCredentials: true,
});

export const AXIOS_REQUEST = axios.create({
  baseURL: requestUrl,
  withCredentials: true,
});

export const AXIOS_CONTENT = axios.create({
  baseURL: contentUrl,
  withCredentials: true,
});

export const AXIOS_NOTIFICATION = axios.create({
  baseURL: notificationUrl,
  withCredentials: true,
});
