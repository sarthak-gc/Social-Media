import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Friend {
  id: string;
  name: string;
  email: string;
}

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:8787/friends/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          setFriends(response.data.friends);
        }
      } catch (error) {
        setError("Failed to fetch friends");
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Friends</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend) => (
          <Card key={friend.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-xl font-semibold">{friend.name}</h2>
              <p className="text-sm text-gray-500">{friend.email}</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  Message
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Remove Friend
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {friends.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-8">
          You haven't added any friends yet.
        </p>
      )}
    </div>
  );
};

export default Friends;
