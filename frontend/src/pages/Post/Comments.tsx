import React, { useEffect, useState } from "react";
import { AXIOS_CONTENT } from "@/lib/axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type CommentI } from "../types/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/userStore";

const Comments = () => {
  const location = useLocation();
  const state = location.state || {};
  const { postId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async (id: string) => {
      setLoading(true);
      try {
        const response = await AXIOS_CONTENT.get(`${id}/comments`);
        setComments(response.data.data.comments);
      } catch (err) {
        setError("Error fetching comments");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (postId || state.postId) {
      fetchComments(state.postId || postId);
    }
  }, [postId, state.postId]);

  const handleNewComment = async (commentContent: string) => {
    const fakeComment: CommentI = {
      commentId: "id",
      content: "Loading comment...",
      postId: postId || "postId",
      commenterId: useUserStore.getState().user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isUpdated: false,
      parentId: null,
      User: {
        userId: "string",
        firstName: "string",
        lastName: "string",
        middleName: "string",
        email: "string",
        pfp: null,
      },
      parent: null,
      replies: [],
    };
    setComments((prev) => [...prev, fakeComment]);

    try {
      const response = await AXIOS_CONTENT.post(`/${postId}/comment`, {
        comment: commentContent,
      });

      const newComment = response.data.data.commentDetails;

      setComments((prev) => {
        const updatedComments = prev.filter(
          (comment) => comment.commentId !== "id"
        );
        updatedComments.push(newComment);
        return updatedComments;
      });
    } catch (err) {
      console.log(err);
      setError("Error posting comment");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        {state.postId || postId}
      </h1>

      {loading && (
        <div className="text-center text-gray-600">Loading comments...</div>
      )}
      {error && <h1>{error}</h1>}

      <CommentForm onSubmit={handleNewComment} />
      <CommentList comments={comments} />
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
      <div className="flex items-center space-x-2">
        <strong className="text-lg text-gray-800">
          {comment.User?.firstName}
        </strong>
        <span className="text-sm text-gray-500">commented:</span>
      </div>
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
