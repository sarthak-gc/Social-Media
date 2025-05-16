import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileImage from "./Card/Pfp";
import FriendList from "./Friends/FriendList";
import { Link, Outlet } from "react-router-dom";
import type { PostI, UserI } from "@/pages/types/types";
import { getPersonalData, updateMe } from "@/services/me";
import { fetchUserPosts } from "@/services/user";
import PostCard from "../Post/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Self = () => {
  const [userData, setUserData] = useState<UserI>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    pfp: "",
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");

  const [friends, setFriends] = useState<UserI[]>([]);
  const [posts, setPosts] = useState<PostI[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { status, data } = await getPersonalData();
        const { data: posts } = await fetchUserPosts(data.me.userId);

        if (status === "success") {
          const user = data.me;
          setUserData(user);
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setMiddleName(user.middleName);
          setFriends(data.friends);
          setPosts(posts.posts);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const updatedData = {
        ...userData,
        firstName,
        lastName,
        middleName,
      };

      const { status } = await updateMe(firstName, middleName || "", lastName);
      if (status === "success") {
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
      <div className="w-2/3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <ProfileImage
                pfp={userData.pfp}
                name={userData.firstName}
                editable={true}
              />
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
                        setFirstName(userData.firstName);
                        setLastName(userData.lastName);
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            {posts.map((post) => (
              <PostCard post={post} key={post.postId} />
            ))}
          </TabsContent>
          <TabsContent value="friends">
            <FriendList friends={friends} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-1/3">
        <Card className="h-[90vh] overflow-auto px-10">
          <div className=" flex gap-4 w-full  ">
            <Link to="friends"> All</Link>
            <Link to="sent">Sent</Link>
            <Link to="received">Received</Link>
          </div>
          <Outlet />
        </Card>
      </div>
    </div>
  );
};

export default Self;
