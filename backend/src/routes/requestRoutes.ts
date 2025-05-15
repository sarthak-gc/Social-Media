import { Hono } from "hono";
import { authenticate } from "../middlewares/authentication";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getReceivedRequests,
  getSentRequests,
  rejectFriendRequest,
  sendRequest,
} from "../controllers/request.controllers";
const requestRoutes = new Hono();

requestRoutes.use(authenticate);
requestRoutes.post("/send/:profileId", sendRequest);
requestRoutes.get("/pending/received", getReceivedRequests);
requestRoutes.get("/pending/sent", getSentRequests);
requestRoutes.put("/accept/:requestId", acceptFriendRequest);
requestRoutes.put("/reject/:requestId", rejectFriendRequest);
requestRoutes.put("/cancel/:requestId", cancelFriendRequest);

export default requestRoutes;
