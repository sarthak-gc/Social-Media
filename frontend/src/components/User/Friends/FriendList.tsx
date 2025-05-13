import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FriendData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  pfp: string;
}

interface FriendListProps {
  friends: FriendData[];
}

const FriendList = ({ friends }: FriendListProps) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Friends
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.userId} className="flex items-center gap-4">
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
              <div className="flex-grow">
                <p className="font-medium">
                  {friend.firstName} {friend.lastName}
                </p>
                <p className="text-sm text-gray-500">{friend.email}</p>
              </div>
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
