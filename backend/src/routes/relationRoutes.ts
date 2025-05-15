import { Hono } from "hono";
import { authenticate } from "../middlewares/authentication";

import {
  blockUser,
  getAllBlockedUsers,
  getRelationStatus,
  unBlockUser,
  unFriend,
} from "../controllers/relation.controllers";
import { getFriends } from "../controllers/user.controllers";
const relationRoutes = new Hono();

relationRoutes.use(authenticate);
relationRoutes.get("/friends/all", getFriends);
relationRoutes.put("/unfriend/:profileId", unFriend);
relationRoutes.put("/block/:profileId", blockUser);
relationRoutes.put("/unblock/:profileId", unBlockUser);

relationRoutes.get("/status/:profileId", getRelationStatus);
relationRoutes.get("/blocked/all", getAllBlockedUsers);

export default relationRoutes;
