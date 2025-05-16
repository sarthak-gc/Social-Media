import { Hono } from "hono";
import {
  addPost,
  getPosts,
  getFeed,
  getPost,
  getImage,
} from "../controllers/content.controllers";
import { cloudinaryMiddleware } from "../middlewares/cloudinary";

const contentRoutes = new Hono();

contentRoutes.post("/post", cloudinaryMiddleware, addPost);
contentRoutes.get("/all/:profileId", getPosts);
contentRoutes.get("/feed", getFeed);
contentRoutes.get("/image/:imageId", getImage);
contentRoutes.get("/:postId", getPost);
export default contentRoutes;
