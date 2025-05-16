import { Hono } from "hono";
import {
  getAllNotifications,
  markAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notification.controllers";

const notificationRoutes = new Hono();

notificationRoutes.get("/all", getAllNotifications);
notificationRoutes.post("/read/:notificationId", markAsRead);
notificationRoutes.post("/read/all", markAllNotificationsAsRead);

export default notificationRoutes;
