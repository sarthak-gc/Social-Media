import { Hono } from "hono";

import contentRoutes from "./contentRoutes";
import userRoutes from "./userRoutes";
import requestRoutes from "./requestRoutes";
import relationRoutes from "./relationRoutes";

const routes = new Hono();

routes.route("user", userRoutes);
routes.route("content", contentRoutes);
routes.route("request", requestRoutes);
routes.route("relation", relationRoutes);

export default routes;
