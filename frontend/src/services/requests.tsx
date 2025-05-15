import { AXIOS_CONNECTION } from "@/lib/axios";

export const fetchPendingRequests = async () => {
  try {
    const requests = await AXIOS_CONNECTION.get("requests/pending/received");
    return requests.data;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const fetchSentRequests = async () => {
  try {
    const response = await AXIOS_CONNECTION.get("requests/pending/sent");
    return response.data;
  } catch (e) {
    throw new Error(e as string);
  }
};
