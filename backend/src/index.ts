import { Hono } from "hono";
import routes from "./routes";

const app = new Hono();

app.route("/api/v1", routes);

export default app;
