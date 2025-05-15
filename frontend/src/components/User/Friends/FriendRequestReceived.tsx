import { Button } from "@/components/ui/button";
import type { ReceivedFriendRequestI } from "@/pages/types/types";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/services/connections";

import { Check, X } from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

const FriendRequestReceived = ({
  request,
}: {
  request: ReceivedFriendRequestI;
}) => {
  const acceptRequest = async () => {
    try {
      if (!request.requestId) return;
      const { status } = await acceptFriendRequest(request.requestId);

      if (status === "success") {
        toast.success("Friend request accepted");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to accept request");
    }
  };

  const rejectRequest = async () => {
    try {
      if (!request.requestId) return;
      const { status } = await rejectFriendRequest(request.requestId);

      if (status === "success") {
        toast.success("Friend request rejected");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="flex items-center mb-2">
      <Link
        to={`/user/${request.senderId}`}
        key={request.senderId}
        className="flex items-center w-full"
      >
        <Image request={request} />
        <RequestDetail request={request} />
      </Link>
      <Actions acceptRequest={acceptRequest} rejectRequest={rejectRequest} />
    </div>
  );
};

export default FriendRequestReceived;

const Actions = ({
  acceptRequest,
  rejectRequest,
}: {
  acceptRequest: () => void;
  rejectRequest: () => void;
}) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={acceptRequest}
        variant="default"
        size="sm"
        className="flex items-center gap-1"
      >
        <Check className="w-4 h-4" />
      </Button>
      <Button
        onClick={rejectRequest}
        variant="destructive"
        size="sm"
        className="flex items-center gap-1"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

const RequestDetail = ({ request }: { request: ReceivedFriendRequestI }) => {
  return (
    <div className="flex-grow">
      <p className="font-medium">
        {request.sender.firstName} {request.sender.middleName}{" "}
        {request.sender.lastName}
      </p>
      <p>{new Date(request.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

const Image = ({ request }: { request: ReceivedFriendRequestI }) => {
  return request.sender.pfp ? (
    <img
      src={request.sender.pfp}
      alt={request.sender.firstName}
      className="w-12 h-12 rounded-full object-cover mr-2"
    />
  ) : (
    <div className="w-12 h-12 rounded-full  flex items-center justify-center bg-gray-400 mr-2">
      <span className="text-lg font-bold text-white">
        {request.sender.firstName.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};
