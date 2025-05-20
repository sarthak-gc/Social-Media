import { Hono } from "hono";
import {
  getAllNotifications,
  markAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notification.controllers";

const notificationRoutes = new Hono();

notificationRoutes.get("/all", getAllNotifications);
notificationRoutes.post("/read/all", markAllNotificationsAsRead);
notificationRoutes.post("/read/:notificationId", markAsRead);

export default notificationRoutes;
