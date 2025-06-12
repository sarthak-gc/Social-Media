import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { PostI } from "@/pages/types/types";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";
import React from "../Svg/React";
import Comment from "../Svg/Comment";

const PostCard = ({ post }: { post: PostI }) => {
  const fullName = `${post.user.firstName} ${post.user.middleName || ""} ${
    post.user.lastName
  }`.trim();
  const formattedDate = new Date(post.createdAt).toLocaleString();
  const [showReactions, setShowReactions] = useState(false);
  const toggleReactionOptions = () => {
    setShowReactions(!showReactions);
  };
  const navigate = useNavigate();
  return (
    <Card className="max-w-xl mx-auto shadow-md my-2">
      <CardHeader>
        <Link
          to={`/user/${post.user.userId}`}
          className="flex items-center space-x-3"
        >
          <UserImage post={post} fullName={fullName} />
          <PostData formattedDate={formattedDate} fullName={fullName} />
        </Link>
      </CardHeader>
      <Link to={`/post/${post.postId}`}>
        <CardContent>
          {post.title && <p className="mb-2 text-sm">{post.title}</p>}
          {post.images.length > 0 && <Image url={post.images[0].url} />}
        </CardContent>
      </Link>

      <div className="relative  w-full h-10 flex items-center px-10 gap-4">
        <span onClick={toggleReactionOptions}>
          <div className="flex gap-1 text-sm">
            <React />
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/reactions/${post.postId}`, {
                  state: {
                    postId: post.postId,
                    post: post,
                  },
                });
              }}
            >
              {post.reactions}
            </span>
          </div>
        </span>
        <span>
          <div
            onClick={() => {
              navigate(`/post/${post.postId}`, {
                state: {
                  post,
                },
              });
            }}
            className="flex gap-1 text-sm"
          >
            <Comment />
            <span>{post.Comments.length}</span>
          </div>
        </span>
        {showReactions && (
          <Actions
            postId={post.postId}
            toggleReactionOptions={toggleReactionOptions}
          />
        )}
      </div>
    </Card>
  );
};

export default PostCard;

const UserImage = ({ post, fullName }: { post: PostI; fullName: string }) => {
  return (
    <div
      className={`h-10 w-10 rounded-full ${
        !post.user.pfp && "bg-gray-300 items-center justify-center flex"
      }`}
    >
      {post.user.pfp && <img src={post.user.pfp} alt="a" />}
      {!post.user.pfp && fullName.charAt(0).toUpperCase()}
    </div>
  );
};

const PostData = ({
  fullName,
  formattedDate,
}: {
  fullName: string;
  formattedDate: string;
}) => {
  return (
    <div>
      <p className="font-semibold text-sm">{fullName}</p>
      <p className="text-xs text-gray-500">{formattedDate}</p>
    </div>
  );
};
const Image = ({ url }: { url: string }) => {
  return (
    <div>
      <img
        src={url}
        alt="Post"
        className="rounded max-h-[400px] w-full object-cover"
      />
    </div>
  );
};
