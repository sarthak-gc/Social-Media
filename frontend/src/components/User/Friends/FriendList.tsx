import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserI } from "@/pages/types/types";

interface FriendListProps {
  friends: UserI[];
}

const FriendList = ({ friends }: FriendListProps) => {
  return (
    <Card className="w-full mt-2 mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Friends
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend.userId}
              className="flex items-center gap-4 p-3 border rounded-md shadow-sm bg-white mb-2"
            >
              <FriendPfp friend={friend} />
              <Name friend={friend} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No friends yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendList;

const FriendPfp = ({ friend }: { friend: UserI }) => {
  return friend.pfp ? (
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
  );
};

const Name = ({ friend }: { friend: UserI }) => {
  return (
    <div className="flex-grow">
      <p className="font-medium">
        {friend.firstName} {friend.lastName}
      </p>
      <p className="text-sm text-gray-500">{friend.email}</p>
    </div>
  );
};
