import { Hono } from "hono";
import {
  aboutMe,
  getFriends,
  getUser,
  login,
  logout,
  register,
} from "../controllers/user.controllers";

const userRoutes = new Hono();
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.post("/register", register);
userRoutes.get("/profile/:profileId", getUser);
userRoutes.get("/friends/:profileId", getFriends);
userRoutes.get("/me", aboutMe);

export default userRoutes;
