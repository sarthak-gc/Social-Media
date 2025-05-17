import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAllNotifications } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { NotificationI } from "../types/types";

const Notifications = () => {
  const {
    isPending,
    data: notifications,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await getAllNotifications();
      return response.data.notifications;
    },
    refetchInterval: 5000,
  });

  if (isPending) {
    return <>Loading...</>;
  }
  if (error) {
    return <>Something went wrong</>;
  }
  return (
    <div>
      <h1>
        {console.log(notifications)}
        {notifications.length > 0
          ? notifications.map((notification: NotificationI) => {
              return (
                <Link to={`/user/${notification.creator.userId}`}>
                  <Card
                    className={cn(
                      "transition-all duration-200 cursor-pointer hover:shadow-md",
                      !notification.isRead && "bg-blue-50 border-blue-200"
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
