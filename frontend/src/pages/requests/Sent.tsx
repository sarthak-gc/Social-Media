import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FriendRequests from "@/components/User/Friends/FriendRequestSent";
import { fetchSentRequests } from "@/services/requests";
import type { SentFriendRequestI } from "../types/types";

const Sent = () => {
  const [sentRequests, setSentRequests] = useState<SentFriendRequestI[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await fetchSentRequests();

        if (data.status === "success") {
          setSentRequests(data.data.requests);
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
          Sent Friend Requests
        </CardTitle>
      </CardHeader>

      <CardContent>
        {sentRequests.length > 0 ? (
          sentRequests.map((request) => (
            <FriendRequests key={request.receiverId} request={request} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No sent friend requests.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Sent;
