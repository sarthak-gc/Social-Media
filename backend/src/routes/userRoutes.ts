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
import { cloudinaryMiddleware } from "../middlewares/cloudinary";

const userRoutes = new Hono();
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.post("/register", register);
userRoutes.use(authenticate);
userRoutes.get("/profile/:profileId", getUser);
userRoutes.get("/people/:name", getUsers);
userRoutes.get("/friends/:profileId", getFriends); // not checked

userRoutes.get("/me", aboutMe);
// userRoutes.get("/seed", seed);
userRoutes.put("/pfp", cloudinaryMiddleware, changePfp);
userRoutes.put("/update", updateMe);

export default userRoutes;
