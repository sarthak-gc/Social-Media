import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { NotificationI } from "../types/types";
import { markAllAsRead, markAsRead } from "@/services/user";
import useUserStore from "@/store/userStore";

const Notifications = () => {
  const notifications = useUserStore().notifications;

  const markRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };
  const handleMarkAllAsRead = async () => {
    if (notifications.length > 0) {
      await markAllAsRead();
    }
  };
  return (
    <div>
      <div className="w-full flex flex-col">
        <h1 className="px-4 py-1 flex justify-end">
          <span className="cursor-pointer" onClick={handleMarkAllAsRead}>
            Mark all as read
          </span>
        </h1>

        {notifications.length > 0 ? (
          notifications.map((notification: NotificationI) => {
            return (
              <Link
                to={
                  notification.type !== "POST"
                    ? `/user/${notification.creator.userId}`
                    : `/post/${notification.postId}`
                }
                onClick={() => markRead(notification.notificationId)}
              >
                <Card
                  className={cn(
                    "transition-all duration-200 cursor-pointer hover:shadow-md",
                    !notification.isRead && "bg-blue-200 border-blue-200"
                  )}
                >
                  <CardContent className="p-4 flex gap-3 items-center ">
                    {notification.creator.pfp ? (
                      <img src={notification.creator.pfp} />
                    ) : (
                      <div className="bg-red-50 h-12 w-12 rounded-full flex items-center justify-center">
                        {notification.creator.firstName[0].toUpperCase()}
                      </div>
                    )}
                    <Message
                      type={notification.type}
                      creator={notification.creator}
                    />
                  </CardContent>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className="px-10 py-4">No notifications</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

const Message = ({
  type,
  creator,
}: {
  type: string;
  creator: {
    firstName: string;
    lastName: string;
  };
}) => {
  return (
    <div>
      <h1 className="text-sm font-medium text-gray-900">
        {type === "REQUEST_SENT" && (
          <>
            You received a friend request from {creator.firstName}{" "}
            {creator.lastName}
          </>
        )}
        {type === "REQUEST_ACCEPTED" && (
          <>
            {creator.firstName} {creator.lastName} accepted your friend request
          </>
        )}

        {type === "POST" && (
          <div>
            {creator.firstName} {creator.lastName} uploaded a new post
          </div>
        )}
      </h1>
    </div>
  );
};
