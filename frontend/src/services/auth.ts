import { AXIOS_USER } from "@/lib/axios";
import { AxiosError } from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await AXIOS_USER.post("login", { email, password });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An unexpected error occurred");
      }
  }
};
export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  middleName?: string
) => {
  try {
    const response = await AXIOS_USER.post("register", {
      firstName,
      middleName,
      lastName,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An unexpected error occurred");
      }
  }
};
export const logout = async () => {
  await AXIOS_USER.post("logout");
};
