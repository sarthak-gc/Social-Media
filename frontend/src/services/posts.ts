import { AXIOS_CONTENT } from "@/lib/axios";
import { AxiosError } from "axios";

export const getImage = async (imageId: string) => {
  try {
    const response = await AXIOS_CONTENT(`/image/${imageId}`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data);
    }
    throw new Error("Un expected Error");
  }
};

export const uploadPost = async (formData: FormData) => {
  try {
    const res = await AXIOS_CONTENT.post("post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (e) {
    console.error(e);
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data);
    }
    throw new Error("Un expected Error");
  }
};

export const getFeed = async () => {
  try {
    const response = await AXIOS_CONTENT.get("feed");
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data);
    }
    throw new Error("Un expected Error");
  }
};

export const getComments = async (postId: string) => {
  try {
    const response = await AXIOS_CONTENT.get(`${postId}/comments`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to accept request");
  }
};

export const makeComment = async (commentContent: string, postId: string) => {
  try {
    const response = await AXIOS_CONTENT.post(`/${postId}/comment`, {
      comment: commentContent,
    });
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to accept request");
  }
};
export const getReactions = async (postId: string) => {
  try {
    const response = await AXIOS_CONTENT.get(`${postId}/reactions`);
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to accept request");
  }
};

export const makeReaction = async (action: string, postId: string) => {
  try {
    const response = await AXIOS_CONTENT.post(`${postId}/react`, {
      type: action,
    });
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) throw new Error(e.response?.data);
    else throw new Error("Failed to accept request");
  }
};
