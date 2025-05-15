import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FriendRequestReceived from "@/components/User/Friends/FriendRequestReceived";
import { fetchPendingRequests } from "@/services/requests";
import type { ReceivedFriendRequestI } from "../types/types";

const Received = () => {
  const [pendingRequests, setPendingRequests] = useState<
    ReceivedFriendRequestI[]
  >([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await fetchPendingRequests();

        if (data.status === "success") {
          setPendingRequests(data.data.requests);
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
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
          pendingRequests.map((request) => (
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
