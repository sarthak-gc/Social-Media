import React, { useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";
import { type CommentI, type UserI } from "../types/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments, makeComment } from "@/services/posts";

const Comments = () => {
  const location = useLocation();
  const state = location.state || {};
  const { postId } = useParams();

  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    data: comments,
  } = useQuery({
    queryKey: ["feed-comments"],
    queryFn: async () => {
      if (postId || state.postId) {
        const { data } = await getComments(postId || state.postId);
        return data.comments;
      }
    },
    refetchInterval: 3000,
  });

  const handleNewComment = async (commentContent: string) => {
    if (!postId && !state.postId) {
      return;
    }
    try {
      makeComment(commentContent, postId || state.postId);
      queryClient.invalidateQueries({ queryKey: ["feed-comments"] });
    } catch (err) {
      console.error("Failed to add comment");
      JSON.stringify(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6  rounded-xl shadow-md">
      <div className="flex justify-end p-4"></div>
      <CommentForm onSubmit={handleNewComment} />
      {isPending ? (
        <div className="text-center text-gray-600 mt-4">
          Loading comments...
        </div>
      ) : (
        <CommentList comments={comments} />
      )}
      {error && <h1>{error.message}</h1>}
    </div>
  );
};

export default Comments;

interface CommentListProps {
  comments: CommentI[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="mt-6 space-y-4">
      {comments.length === 0 ? (
        <p className="text-center text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment.commentId} comment={comment} />
        ))
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: CommentI;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:bg-gray-50">
      <Link
        to={`/user/${comment.User.userId}`}
        className="flex items-center space-x-2"
      >
        <UserImage user={comment.User} />
        <strong className="text-lg text-gray-800">
          {comment.User.firstName}
        </strong>
      </Link>
      <p className="mt-2 text-gray-700">{comment.content}</p>
      <p className="mt-2 text-xs text-gray-400">
        {new Date(comment.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

interface CommentFormProps {
  onSubmit: (commentContent: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [commentContent, setCommentContent] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onSubmit(commentContent);
      setCommentContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-lg"
        required
      />
      <Button
        type="submit"
        className="w-full py-2 text-white rounded-lg"
        disabled={commentContent.trim() === ""}
      >
        Post Comment
      </Button>
    </form>
  );
};

const UserImage = ({ user }: { user: UserI }) => {
  const fullName = `${user.firstName} ${user.middleName || ""} ${
    user.lastName
  }`.trim();
  return (
    <div
      className={`h-10 w-10 rounded-full ${
        !user.pfp && "bg-gray-300 items-center justify-center flex"
      }`}
    >
      {user.pfp && <img src={user.pfp} alt="a" />}
      {!user.pfp && fullName.charAt(0).toUpperCase()}
    </div>
  );
};
