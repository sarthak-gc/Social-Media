// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface Post {
//   id: string;
//   title: string;
//   user: {
//     firstName: string;
//     lastName: string;
//   };
//   userId: string;
//   createdAt: string;
//   image: [];
// }

// interface User {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   middleName: string;
//   email: string;
//   pfp: string;
// }

// const Feed = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<User[]>([]);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get("http://localhost:8787/content/feed", {
//           withCredentials: true,
//         });

//         if (response.data.status === "success") {
//           setPosts(response.data.data.posts);
//         }
//       } catch (error) {
//         setError("Failed to fetch posts");
//         console.error("Error fetching posts:", error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   useEffect(() => {
//     const searchUsers = async () => {
//       if (!searchQuery.trim()) {
//         setSearchResults([]);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:8787/user/people/${searchQuery}`,
//           {
//             withCredentials: true,
//           }
//         );

//         if (response.data.status === "success") {
//           console.log(response.data.data.users[0].userId);
//           setSearchResults(response.data.data.users);
//         }
//       } catch (error) {
//         console.error("Error searching users:", error);
//       }
//     };

//     const debounceTimeout = setTimeout(searchUsers, 500);
//     return () => clearTimeout(debounceTimeout);
//   }, [searchQuery]);

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-6">Your Feed</h1>

//       <div className="mb-6 relative">
//         <div className="relative max-w-md">
//           <Input
//             type="search"
//             placeholder="Search users..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pr-10"
//           />
//           <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//         </div>

//         {searchResults.length > 0 && (
//           <div className="absolute z-10 w-full max-w-md mt-1 bg-white rounded-md shadow-lg border">
//             {searchResults.map((user) => (
//               <div
//                 key={user.userId}
//                 onClick={() => navigate(`/user/${user.userId}`)}
//                 className="p-2 hover:bg-gray-100 cursor-pointer"
//               >
//                 {user.firstName} {user.lastName}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {error && <div className="text-red-600 mb-4">{error}</div>}

//       <div className="space-y-4">
//         {posts.map((post) => (
//           <Card key={post.id}>
//             <CardHeader>
//               <p className="text-sm text-gray-500">{post.title}</p>
//             </CardHeader>
//             <CardContent>
//               <p>{post.createdAt}</p>
//               <p>{post.user.firstName}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Feed;
// src/components/Post/AddPost.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "@/components/Post/Card";

interface Post {
  postId: string;
  title: string;
  createdAt: string;
  images: {
    imageId: string;
    url: string;
  }[];
  user: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
}

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  pfp: string;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8787/content/feed", {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setPosts(response.data.data.posts);
      }
    } catch (error) {
      setError("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8787/user/people/${searchQuery}`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setSearchResults(response.data.data.users);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    const debounceTimeout = setTimeout(searchUsers, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Feed</h1>
        <Button onClick={() => setShowAddPost(!showAddPost)}>
          <Plus className="mr-2 h-4 w-4" />
          {showAddPost ? "Cancel" : "Add Post"}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative max-w-md">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full max-w-md mt-1 bg-white rounded-md shadow-lg border">
            {searchResults.map((user) => (
              <div
                key={user.userId}
                onClick={() => navigate(`/user/${user.userId}`)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {user.firstName} {user.lastName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Post Form */}
      {showAddPost && <AddPost onPostAdded={fetchPosts} />}

      {/* Posts */}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
const AddPost = ({ onPostAdded }: { onPostAdded: () => void }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Post title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);

      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        "http://localhost:8787/content/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res);

      setTitle("");
      setImage(null);
      setError("");
      onPostAdded();
    } catch (err) {
      console.error("Failed to add post:", err);
      setError("Failed to add post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-md mb-6 bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">Create a new post</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <Textarea
        placeholder="What's on your mind?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rows={4}
        className="mb-3"
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-3"
      />
      {image && (
        <div className="mb-3">
          <img
            src={URL.createObjectURL(image)}
            alt="Selected preview"
            className="max-h-60 rounded"
          />
        </div>
      )}
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </Button>
    </div>
  );
};
