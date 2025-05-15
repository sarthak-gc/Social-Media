import { AXIOS_USER } from "@/lib/axios";

export const getPersonalData = async () => {
  try {
    const response = await AXIOS_USER.get("user/me", {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const updateMe = async (
  firstName: string,
  middleName: string,
  lastName: string
) => {
  const response = await AXIOS_USER.put("update", {
    firstName,
    middleName,
    lastName,
  });
  return response.data;
};
