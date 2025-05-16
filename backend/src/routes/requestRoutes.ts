import { Hono } from "hono";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getReceivedRequests,
  getSentRequests,
  rejectFriendRequest,
  sendRequest,
} from "../controllers/request.controllers";
const requestRoutes = new Hono();
requestRoutes.post("/send/:profileId", sendRequest);
requestRoutes.get("/pending/received", getReceivedRequests);
requestRoutes.get("/pending/sent", getSentRequests);
requestRoutes.put("/accept/:requestId", acceptFriendRequest);
requestRoutes.put("/reject/:requestId", rejectFriendRequest);
requestRoutes.put("/cancel/:requestId", cancelFriendRequest);

export default requestRoutes;
