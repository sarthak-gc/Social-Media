import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { NotificationI } from "../types/types";
import { markAsRead } from "@/services/user";
import useUserStore from "@/store/userStore";

const Notifications = () => {
  const notifications = useUserStore().notifications;

  const markRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };
  return (
    <div>
      <h1>
        {notifications.length > 0
          ? notifications.map((notification: NotificationI) => {
              return (
                <Link
                  to={`/user/${notification.creator.userId}`}
                  onClick={() => markRead(notification.notificationId)}
                >
                  {notification.notificationId} hi
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
                        <div className="bg-red-50 h-12 w-12 rounded-full"></div>
                      )}
                      <h1 className="text-sm font-medium text-gray-900">
                        {notification.type === "REQUEST_SENT" && (
                          <>
                            You received a friend request from{" "}
                            {notification.creator.firstName}
                          </>
                        )}
                      </h1>
                      <h1 className="text-sm font-medium text-gray-900">
                        {notification.type === "REQUEST_ACCEPTED" && (
                          <>
                            {notification.creator.firstName} accepted your
                            friend request
                          </>
                        )}
                      </h1>{" "}
                      <h1 className="text-sm font-medium text-gray-900">
                        {notification.type === "POST" && (
                          <Link to={`/post/${notification.postId}`}>
                            {notification.creator.firstName} uploaded a new post
                          </Link>
                        )}
                      </h1>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          : "No notification"}
      </h1>
    </div>
  );
};

export default Notifications;
