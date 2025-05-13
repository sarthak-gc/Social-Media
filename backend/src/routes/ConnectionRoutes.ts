import { Hono } from "hono";
import {
  acceptFriendRequest,
  blockUser,
  cancelFriendRequest,
  getAllBlockedUsers,
  getFriends,
  getReceivedRequests,
  getRequestStatus,
  getSentRequests,
  rejectFriendRequest,
  sendRequest,
  unBlockUser,
  unFriend,
} from "../controllers/connection.controllers";
import { authenticate } from "../middlewares/authentication";
const connectionRoutes = new Hono();

connectionRoutes.use(authenticate);
connectionRoutes.post("/request/send/:profileId", sendRequest);
connectionRoutes.get("/requests/pending/received", getReceivedRequests);
connectionRoutes.get("/requests/pending/sent", getSentRequests);
connectionRoutes.get("/friends/all", getFriends);
connectionRoutes.put("/unfriend/:profileId", unFriend);
connectionRoutes.put("/block/:profileId", blockUser);
connectionRoutes.put("/unblock/:profileId", unBlockUser);
connectionRoutes.put("/request/accept/:requestId", acceptFriendRequest);
connectionRoutes.put("/request/reject/:requestId", rejectFriendRequest);
connectionRoutes.put("/cancel/request/:requestId", cancelFriendRequest);
connectionRoutes.get("/connection/status/:profileId", getRequestStatus);
connectionRoutes.get("/blocked/all", getAllBlockedUsers);

export default connectionRoutes;
