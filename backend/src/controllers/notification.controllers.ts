import { Context } from "hono";
import { getPrisma } from "../utils/getPrisma";

export const getAllNotifications = async (c: Context) => {
  const userId = c.get("userId");

  const prisma = getPrisma(c);
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: userId,
      },
      select: {
        notificationId: true,
        type: true,
        isRead: true,
        creator: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            pfp: true,
          },
        },
        postId: true,
      },
    });

    let unReadCount: string | number = 0;
    for (let i = 0; i < notifications.length; i++) {
      if (unReadCount > 10) {
        break;
      }
      if (!notifications[i].isRead) {
        unReadCount++;
      }
    }

    return c.json({
      status: "success",
      message: "Notifications Retrieved",
      data: {
        notifications,
        unReadCount,
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const markAllNotificationsAsRead = async (c: Context) => {
  const userId = c.get("userId");
  const prisma = getPrisma(c);

  try {
    await prisma.notification.updateMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    return c.json({
      status: "success",
      message: "Marked all notifications as read",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const markAsRead = async (c: Context) => {
  const userId = c.get("userId");

  const notificationId = c.req.param().notificationId;

  if (!notificationId) {
    return c.json({
      status: "error",
      message: "Invalid action",
    });
  }

  try {
    const prisma = getPrisma(c);
    const notification = await prisma.notification.findFirst({
      where: {
        notificationId,
      },
    });

    if (!notification) {
      return c.json(
        {
          status: "error",
          message: "No notification found",
        },
        404
      );
    }

    if (!notification.isRead) {
      await prisma.notification.update({
        where: {
          notificationId,
          receiverId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
      return c.json({
        status: "success",
        message: "Notification marked as read",
      });
    }
    return c.json({});
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};
