import { Hono } from "hono";

import contentRoutes from "./contentRoutes";

import userRoutes from "./userRoutes";
import requestRoutes from "./requestRoutes";
import relationRoutes from "./relationRoutes";
import notificationRoutes from "./notificationRoutes";
import { authenticate } from "../middlewares/authentication";
import { cors } from "hono/cors";

const routes = new Hono();

// const frontendUrl = "https://social-media-ivory-tau.vercel.app";
const frontendUrl = "http://localhost:5173";

routes.use(
  cors({
    origin: frontendUrl,
    allowMethods: ["GET", "PUT", "POST"],
    credentials: true,
  })
);

routes.route("user", userRoutes);

routes.use(authenticate);
routes.route("content", contentRoutes);
routes.route("request", requestRoutes);
routes.route("relation", relationRoutes);
routes.route("notification", notificationRoutes);

export default routes;
