import { AXIOS_RELATION, AXIOS_REQUEST, AXIOS_USER } from "@/lib/axios";
import { AxiosError } from "axios";

export const getSelfFriends = async (userId: string) => {
  try {
    const response = await AXIOS_USER.get(`friends/${userId}`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to fetch friends");
  }
};

export const getConnectionStatus = async (userId: string) => {
  try {
    const response = await AXIOS_RELATION.get(`status/${userId}`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to get connection status");
  }
};

export const sendRequest = async (userId: string) => {
  try {
    const response = await AXIOS_REQUEST.post(`send/${userId}`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to send request");
  }
};

export const acceptFriendRequest = async (requestId: string) => {
  try {
    const response = await AXIOS_REQUEST.put(`accept/${requestId}`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to accept request");
  }
};

export const rejectFriendRequest = async (requestId: string) => {
  try {
    const response = await AXIOS_REQUEST.put(`reject/${requestId}`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to accept request");
  }
};

export const cancelFriendRequest = async (requestId: string) => {
  try {
    const response = await AXIOS_REQUEST.put(`cancel/${requestId}`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to accept request");
  }
};

export const unFriend = async (profileId: string) => {
  try {
    const response = await AXIOS_RELATION.put(`unfriend/${profileId}`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to accept request");
  }
};
