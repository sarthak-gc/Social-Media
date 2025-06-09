import React, { useEffect, useState } from "react";
import { AXIOS_CONTENT } from "@/lib/axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ReactionI } from "../types/types";
import { Button } from "@/components/ui/button";

const Reactions = () => {
  const location = useLocation();
  const state = location.state || {};
  const { postId } = useParams();

  const navigate = useNavigate();
  const [reactions, setReactions] = useState<ReactionI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchReactions = async () => {
      setLoading(true);
      try {
        const response = await AXIOS_CONTENT.get(`${postId}/reactions`);

        setReactions(response.data.reactions);
      } catch (err) {
        setError("Error fetching reactions");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (postId || state.postId) {
      fetchReactions();
    }
  }, [postId, state.postId]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {loading && (
        <div className="text-center text-gray-600">Loading reactions...</div>
      )}
      {error && <h1>{error}</h1>}

      <ReactionList reactions={reactions} />
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

export default Reactions;

interface ReactionListProps {
  reactions: ReactionI[];
}

const ReactionList: React.FC<ReactionListProps> = ({ reactions }) => {
  return (
    <div className="mt-6 space-y-4">
      {reactions.length === 0 ? (
        <p className="text-center text-gray-500">
          No reactions yet. Be the first to react!
        </p>
      ) : (
        reactions.map((reaction) => (
          <ReactionItem key={reaction.userId} reaction={reaction} />
        ))
      )}
    </div>
  );
};

interface ReactionItemProps {
  reaction: ReactionI;
}

const ReactionItem: React.FC<ReactionItemProps> = ({ reaction }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:bg-gray-50">
      <div className="flex items-center space-x-2">
        <strong className="text-lg text-gray-800">
          {reaction.User?.firstName} {reaction.User?.lastName}
        </strong>
        <span className="text-sm text-gray-500">reacted with</span>
        <strong className="text-sm text-gray-700">{reaction.type}</strong>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {new Date(reaction.createdAt).toLocaleString()}
      </p>
    </div>
  );
};
