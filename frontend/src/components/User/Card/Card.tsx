import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/pages/User";
import ProfileImage from "./Pfp";
import Name from "./Name";
import axios from "axios";
import { useState } from "react";

const UserCard = ({ user }: { user: UserProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  // const [friendshipStatus, setFriendShipStatus] = useState<
  // "PENDING" | "ACCEPTED" | ""
  // >();
  const handleSendRequest = async () => {
    setIsLoading(true);
    console.log(user.userId, "HIHI");
    try {
      const response = await axios.post(
        `http://localhost:8787/connection/request/send/${user.userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        setRequestSent(true);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <ProfileImage pfp={user.pfp} name={user.firstName} />
          </div>
          <Name
            firstName={user.firstName}
            lastName={user.lastName}
            middleName={user.middleName}
            email={user.email}
          />
          <div className="flex justify-center">
            <Button
              onClick={handleSendRequest}
              disabled={isLoading || requestSent}
            >
              {isLoading
                ? "Sending Request..."
                : requestSent
                ? "Request Sent"
                : "Add Friend"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;
