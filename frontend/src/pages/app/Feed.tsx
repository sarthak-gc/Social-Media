import { useState, useEffect } from "react";
import PostCard from "@/components/Post/Card";
import { getFeed } from "@/services/posts";
import { useQuery } from "@tanstack/react-query";
import type { PostI, UserI } from "../types/types";
import { getPeople } from "@/services/user";
import Header from "@/components/Feed/Header";
import SearchArea from "@/components/Feed/SearchArea";
import SearchResult from "@/components/Feed/SearchResult";
import AddPost from "@/components/Feed/AddPost";

const Feed = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserI[]>([]);
  const [showAddPost, setShowAddPost] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["feed-posts"],
    queryFn: async () => {
      const { data } = await getFeed();
      return data.posts;
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const { status, data } = await getPeople(searchQuery);

        if (status === "success") {
          setSearchResults(data.users);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    const debounceTimeout = setTimeout(searchUsers, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  if (error) {
    return <h1>Failed to fetch posts</h1>;
  }

  if (isPending) return <h1>Loading...</h1>;
  return (
    <div className="container mx-auto py-8">
      <Header setShowAddPost={setShowAddPost} showAddPost={showAddPost} />

      <div className="mb-6 relative">
        <SearchArea searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <SearchResult searchResults={searchResults} />
      </div>

      {showAddPost && (
        <AddPost onPostAdded={getFeed} setShowAddPost={setShowAddPost} />
      )}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="space-y-4">
        {data.map((post: PostI) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
