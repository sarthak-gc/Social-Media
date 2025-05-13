import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileImage from "./Card/Pfp";
import PendingList from "./Friends/PendingList";
import FriendList from "./Friends/FriendList";

interface UserData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  pfp: string;
}

interface FriendData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  pfp: string;
}

const Self = () => {
  const [userData, setUserData] = useState<UserData>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    pfp: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pfp, setPfp] = useState("");

  const [friends, setFriends] = useState<FriendData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8787/user/me", {
          withCredentials: true,
        });
        if (response.data.status === "success") {
          const user = response.data.data.me;
          setUserData(user);
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setPfp(user.pfp);
          setFriends(response.data.data.friends);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedData = {
        ...userData,
        firstName,
        lastName,
        pfp,
      };
      const response = await axios.put(
        "http://localhost:8787/user/update",
        updatedData,
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        setUserData(updatedData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-6 p-6">
      <div className="w-1/3">
        <PendingList />
      </div>

      <div className="w-2/3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <ProfileImage pfp={userData.pfp} name={userData.firstName} />
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                    />
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleSave}>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form values to current userData if cancelled
                        setFirstName(userData.firstName);
                        setLastName(userData.lastName);
                        setPfp(userData.pfp);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <p className="text-gray-600">{userData.email}</p>
                  </div>
                  <div className="flex justify-center">
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <FriendList friends={friends} />
      </div>
    </div>
  );
};

export default Self;
