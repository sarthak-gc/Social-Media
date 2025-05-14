import { Hono } from "hono";
import connectionRoutes from "./connectionRoutes";
import contentRoutes from "./contentRoutes";
import userRoutes from "./userRoutes";

const routes = new Hono();

routes.route("user", userRoutes);
routes.route("content", contentRoutes);
routes.route("connection", connectionRoutes);

export default routes;
