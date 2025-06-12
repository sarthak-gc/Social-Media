import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { ReactionI, UserI } from "../types/types";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getReactions } from "@/services/posts";

const Reactions = () => {
  const location = useLocation();
  const state = location.state || {};
  const { postId } = useParams();
  const navigate = useNavigate();

  const {
    isPending,
    error,
    data: reactions,
  } = useQuery({
    queryKey: ["feed-reactions"],
    queryFn: async () => {
      if (postId || state.postId) {
        const { data } = await getReactions(postId || state.postId);
        return data.reactions;
      }
    },
    refetchInterval: 3000,
  });
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {isPending ? (
        <div className="text-center text-gray-600">Loading reactions...</div>
      ) : (
        <ReactionList reactions={reactions} />
      )}
      {error && <h1>{error.message}</h1>}

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
        <>
          <h1>{reactions.length} people reacted to this post</h1>
          {reactions.map((reaction) => (
            <ReactionItem key={reaction.userId} reaction={reaction} />
          ))}
        </>
      )}
    </div>
  );
};

interface ReactionItemProps {
  reaction: ReactionI;
}

const ReactionItem: React.FC<ReactionItemProps> = ({ reaction }) => {
  const reactions = [
    {
      icon: "❤️",
      bgColor: "bg-red-500",
      action: "Heart",
    },
    {
      icon: "👍",
      bgColor: "bg-blue-600",
      action: "Like",
    },
    {
      icon: "😂",
      bgColor: "bg-yellow-600",
      action: "Laugh",
    },
    {
      icon: "😡",
      bgColor: "bg-orange-600",
      action: "Angry",
    },
    {
      icon: "👎",
      bgColor: "bg-gray-600",
      action: "Dislike",
    },
  ];

  const icons = reactions.filter(
    (r) => r.action.toUpperCase() == reaction.type.toUpperCase()
  );
  const { icon, bgColor } = icons[0];
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:bg-gray-50">
      <div className="flex items-center space-x-2 justify-between">
        <Link
          to={`/user/${reaction.User.userId}`}
          className="flex items-center space-x-2"
        >
          <UserImage user={reaction.User} />
          <strong className="text-lg text-gray-800">
            {reaction.User?.firstName} {reaction.User?.lastName}
          </strong>
        </Link>
        <span
          className={`p-3 rounded-full text-white ${bgColor} transform transition-transform duration-300 ease-in-out hover:scale-110 active:scale-90`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {new Date(reaction.createdAt).toLocaleString()}
      </p>
    </div>
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
