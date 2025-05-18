import { Button } from "@/components/ui/button";
import type { SentFriendRequestI } from "@/pages/types/types";
import { cancelFriendRequest } from "@/services/connections";
import { X } from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

const FriendRequestSent = ({
  request,
  handleRemoveRequest,
}: {
  request: SentFriendRequestI;
  handleRemoveRequest: (requestId: string) => void;
}) => {
  const cancelRequest = async () => {
    try {
      if (!request.requestId) return;
      const { status } = await cancelFriendRequest(request.requestId);

      if (status === "success") {
        toast.success("Friend request cancelled");
        handleRemoveRequest(request.requestId);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to accept request");
    }
  };

  return (
    <div className="flex items-center mb-2">
      <Link
        to={`/user/${request.receiverId}`}
        key={request.receiverId}
        className="flex items-center w-full"
      >
        <Image request={request} />
        <RequestDetail request={request} />
      </Link>
      <Actions cancelRequest={cancelRequest} />
    </div>
  );
};

export default FriendRequestSent;

const RequestDetail = ({ request }: { request: SentFriendRequestI }) => {
  return (
    <div className="flex-grow">
      <p className="font-medium">
        {request.receiver.firstName} {request.receiver.middleName}{" "}
        {request.receiver.lastName}
      </p>
      <p>{new Date(request.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

const Actions = ({ cancelRequest }: { cancelRequest: () => void }) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={cancelRequest}
        variant="destructive"
        size="sm"
        className="flex items-center gap-1"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

const Image = ({ request }: { request: SentFriendRequestI }) => {
  return request.receiver.pfp ? (
    <img
      src={request.receiver.pfp}
      alt={request.receiver.firstName}
      className="w-12 h-12 rounded-full object-cover mr-2"
    />
  ) : (
    <div className="w-12 h-12 rounded-full  flex items-center justify-center bg-gray-400 mr-2">
      <span className="text-lg font-bold text-white">
        {request.receiver.firstName.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};
