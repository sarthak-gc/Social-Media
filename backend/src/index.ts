import { Hono } from "hono";
import routes from "./routes";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors({ origin: "*", credentials: true }));

app.route("/", routes);

export default app;
