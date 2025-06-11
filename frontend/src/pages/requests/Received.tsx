import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FriendRequestReceived from "@/components/User/Friends/FriendRequestReceived";
import { fetchPendingRequests } from "@/services/requests";
import type { ReceivedFriendRequestI } from "../types/types";
import { useQuery } from "@tanstack/react-query";

const Received = () => {
  const {
    isPending,
    error,
    data: pendingRequests,
  } = useQuery({
    queryKey: ["received-requests"],
    queryFn: async () => {
      const { data } = await fetchPendingRequests();
      return data.requests;
    },
    refetchInterval: 3000,
  });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto ">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Friend Requests
        </CardTitle>
      </CardHeader>

      <CardContent className="">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request: ReceivedFriendRequestI) => (
            <FriendRequestReceived key={request.senderId} request={request} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No pending friend requests.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Received;
