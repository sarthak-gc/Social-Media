import { Hono } from "hono";
import {
  addPost,
  getPosts,
  getFeed,
  getPost,
  getImage,
  reactPost,
  getReactions,
  commentOnPost,
  getPostComments,
  editComment,
  deleteComment,
} from "../controllers/content.controllers";

const contentRoutes = new Hono();

contentRoutes.post("/post", addPost);
contentRoutes.get("/all/:profileId", getPosts);
contentRoutes.get("/feed", getFeed);
contentRoutes.get("/image/:imageId", getImage);
contentRoutes.get("/:postId", getPost);

contentRoutes.post("/:postId/react", reactPost);
contentRoutes.get("/:postId/reactions", getReactions);

contentRoutes.post("/:postId/comment", commentOnPost);

contentRoutes.get("/:postId/comments", getPostComments);
contentRoutes.put("/comment/:commentId", editComment);
contentRoutes.delete("/comment/:commentId", deleteComment);

export default contentRoutes;
