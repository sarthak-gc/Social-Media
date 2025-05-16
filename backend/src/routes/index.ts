import { Hono } from "hono";

import contentRoutes from "./contentRoutes";
import userRoutes from "./userRoutes";
import requestRoutes from "./requestRoutes";
import relationRoutes from "./relationRoutes";
import notificationRoutes from "./notificationRoutes";
import { authenticate } from "../middlewares/authentication";

const routes = new Hono();

routes.route("user", userRoutes);

routes.use(authenticate);
routes.route("content", contentRoutes);
routes.route("request", requestRoutes);
routes.route("relation", relationRoutes);
routes.route("notification", notificationRoutes);

export default routes;
