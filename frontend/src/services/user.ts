import { AXIOS_CONTENT, AXIOS_NOTIFICATION, AXIOS_USER } from "@/lib/axios";

export const fetchUserProfile = async (userId: string) => {
  try {
    const response = await AXIOS_USER.get(`profile/${userId}`);
    return response.data;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const fetchUserFriends = async (userId: string) => {
  try {
    const response = await AXIOS_USER.get(`friends/${userId}`);
    return response.data;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const fetchUserPosts = async (userId: string) => {
  try {
    const response = await AXIOS_CONTENT.get(`all/${userId}`);
    return response.data;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getPeople = async (searchQuery: string) => {
  try {
    const response = await AXIOS_USER.get(`people/${searchQuery}`);
    return response.data;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const changePfp = async (formData: FormData) => {
  try {
    await AXIOS_USER.put("pfp", formData);
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getAllNotifications = async () => {
  const notifications = await AXIOS_NOTIFICATION.get("all");
  return notifications.data;
};

export const markAsRead = async (notificationId: string) => {
  const notifications = await AXIOS_NOTIFICATION.post(`read/${notificationId}`);
  return notifications.data;
};
export const markAllAsRead = async () => {
  const notifications = await AXIOS_NOTIFICATION.post("read/all");
  return notifications.data;
};
