import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { AXIOS_CONTENT } from "@/lib/axios";
import { AxiosError } from "axios";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { PostI } from "../types/types";

const Post = () => {
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();

  const [post, setPost] = useState(location.state || null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  useEffect(() => {
    if (!post && postId) {
      const fetchPost = async () => {
        try {
          const response = await AXIOS_CONTENT.get(`${postId}`);
          console.log(response, "TESTING");
          setPost(response.data.data.post);
        } catch (e) {
          if (e instanceof AxiosError) {
            setError(e.response?.data?.message);
          } else {
            setError("Something went wrong.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    } else {
      setLoading(false);
    }
  }, [postId, post]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!post) {
    return <div className="error-message">Post not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <Card className="shadow-xl border border-gray-200 rounded-lg">
        <CardHeader>
          <Link
            to={`/user/${post.user.userId}`}
            className="flex items-center space-x-3"
          >
            <UserImage post={post} />
            <div>
              <p className="font-semibold text-sm">
                {post.user.firstName} {post.user.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 flex-col">
            <h1>{post.title}</h1>
            {post.images && post.images.length > 0 && (
              <img
                onClick={() => {
                  navigate(`/image/${post.images[0].imageId}`);
                }}
                key={post.images[0].imageId}
                src={post.images[0].url}
                alt="Post Image"
                className="rounded-lg shadow-md w-full object-cover aspect-video"
              />
            )}
          </div>
        </CardContent>
        <div className="flex justify-end p-4">
          <Button
            onClick={() => {
              navigate(-1);
            }}
            variant="outline"
            className="hover:bg-secondary"
          >
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Post;

const UserImage = ({ post }: { post: PostI }) => {
  return (
    <div
      className={`h-10 w-10 rounded-full ${
        !post.user.pfp && "bg-gray-300 items-center justify-center flex"
      }`}
    >
      {post.user.pfp && <img src={post.user.pfp} alt="a" />}
      {!post.user.pfp && <>{post.user.firstName[0].toUpperCase()}</>}
    </div>
  );
};
