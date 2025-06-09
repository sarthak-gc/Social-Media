import { Hono } from "hono";

import {
  aboutMe,
  getFriends,
  getUser,
  login,
  logout,
  register,
  getUsers,
  changePfp,
  updateMe,
  // seed,
} from "../controllers/user.controllers";
import { authenticate } from "../middlewares/authentication";

const userRoutes = new Hono();
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.post("/register", register);
// userRoutes.get("/seed", seed);
userRoutes.use(authenticate);
userRoutes.get("/profile/:profileId", getUser);
userRoutes.get("/people/:name", getUsers);
userRoutes.get("/friends/:profileId", getFriends);

userRoutes.get("/me", aboutMe);
userRoutes.put("/pfp", changePfp);
userRoutes.put("/update", updateMe);

export default userRoutes;
