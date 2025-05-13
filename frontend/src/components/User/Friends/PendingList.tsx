import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FriendRequest {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  pfp: string;
}

const PendingList = () => {
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8787/connection/requests/pending/received",
          {
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          setPendingRequests(response.data.data.requests);
        }
      } catch (error) {
        setError("Failed to fetch pending requests");
        console.error("Error fetching pending requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequests();
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Friend Requests
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div key={request.userId} className="flex items-center gap-4">
              {request.pfp ? (
                <img
                  src={request.pfp}
                  alt={request.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {request.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-grow">
                <p className="font-medium">
                  {request.firstName} {request.middleName} {request.lastName}
                </p>
                <p className="text-sm text-gray-500">{request.email}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="default" size="sm">
                  Accept
                </Button>
                <Button variant="destructive" size="sm">
                  Decline
                </Button>
              </div>
            </div>
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

export default PendingList;
