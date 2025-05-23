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
        const { data, status } = await fetchSentRequests();

        if (status === "success") {
          setSentRequests(data.requests);
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleRemoveRequest = (requestId: string) => {
    setSentRequests((prev) =>
      prev.filter((elem) => elem.requestId != requestId)
    );
  };
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
            <FriendRequests
              key={request.receiverId}
              request={request}
              handleRemoveRequest={handleRemoveRequest}
            />
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
