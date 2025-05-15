import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import UserCard from "@/components/User/Card/Card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/Post/Card";
import {
  fetchUserFriends,
  fetchUserPosts,
  fetchUserProfile,
} from "@/services/user";
import type { Post, UserI } from "../types/types";

const User = () => {
  const [user, setUser] = useState<UserI | null>(null);
  const [friends, setFriends] = useState<UserI[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const { userId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        if (!userId) return;

        const { status, data } = await fetchUserProfile(userId);

        if (status === "success") {
          setUser(data.user);
        }
      } catch (error) {
        setError("Failed to fetch user profile");
        console.error("Error fetching user profile:", error);
      }
    })();
    // const connectionStatus = async () => {
    //   try {
    //     const response = await axios.get(
    //       `http://localhost:8787/connection/status/${userId}`,
    //       {
    //         withCredentials: true,
    //       }
    //     );
    //   } catch (e) {
    //     if (e instanceof AxiosError) {
    //       console.log(e.response?.data);
    //     }
    //   }
    // };

    (async () => {
      try {
        if (!userId) return;
        const { status, data } = await fetchUserFriends(userId);

        if (status === "success") {
          setFriends(data.friends);
        }
      } catch (error) {
        setError("Failed to fetch user friends");
        console.error("Error fetching user friends:", error);
      }
    })();
    (async () => {
      try {
        if (!userId) return;
        const { status, data } = await fetchUserPosts(userId);

        if (status === "success") {
          setPosts(data.posts);
        }
      } catch (error) {
        setError("Failed to fetch user posts");
        console.error("Error fetching user posts:", error);
      }
    })();
  }, [userId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <UserCard user={user} />

      <div className="flex justify-center space-x-4 mb-6">
        <Button
          className={`px-4 py-2 text-sm font-semibold rounded-md  ${
            activeTab === "posts"
              ? "bg-black text-white hover:bg-black"
              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
          } `}
          onClick={() => setActiveTab("posts")}
        >
          View Posts
        </Button>
        <Button
          className={`px-4 py-2 text-sm font-semibold rounded-md ${
            activeTab === "posts"
              ? "bg-gray-100 hover:bg-gray-100 text-gray-700"
              : "bg-black hover:bg-black text-white"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          View Friends
        </Button>
      </div>

      {activeTab === "posts" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.postId} post={post} />)
            ) : (
              <p className="text-center text-gray-500">No posts available.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Friends
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <Link
                  to={`/user/${friend.userId}`}
                  key={friend.userId}
                  className="flex items-center gap-4 p-3 border rounded-md shadow-sm bg-white mb-2"
                >
                  {friend.pfp ? (
                    <img
                      src={friend.pfp}
                      alt={friend.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {friend.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {friend.firstName} {friend.middleName} {friend.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {friend.email}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No friends to display.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default User;
