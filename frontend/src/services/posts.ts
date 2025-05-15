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
    console.log(e);
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data);
    }
    throw new Error("Un expected Error");
  }
};

export const getPosts = async () => {
  try {
    const response = await AXIOS_CONTENT.get("feed");
    return response.data;
  } catch (e) {
    console.log(e);
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data);
    }
    throw new Error("Un expected Error");
  }
};
