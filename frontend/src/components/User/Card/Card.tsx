import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ProfileImage from "./Pfp";
import Name from "./Name";

import { useEffect, useState } from "react";
import type { UserI } from "@/pages/types/types";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getConnectionStatus,
  rejectFriendRequest,
  sendRequest,
  unFriend,
} from "@/services/connections";
import { toast } from "sonner";
import PendingRequest from "@/components/Requests/PendingRequest";
import RequestReceived from "@/components/Requests/RequestReceived";
import SendingRequest from "@/components/Requests/SentRequest";
import Blocked from "@/components/Requests/Blocked";

const UserCard = ({
  user,
  connectionStatus,
}: {
  user: UserI;
  connectionStatus: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [friendshipStatus, setFriendShipStatus] = useState<
    | "PENDING_SENT"
    | "PENDING_RECEIVED"
    | "FRIENDS"
    | "BLOCKED_BY_YOU"
    | "BLOCKED_YOU"
    | null
  >(null);

  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (connectionStatus == "PENDING_SENT") {
      setFriendShipStatus("PENDING_SENT");
    } else if (connectionStatus == "PENDING_RECEIVED")
      setFriendShipStatus("PENDING_RECEIVED");
    else if (connectionStatus == "FRIENDS") setFriendShipStatus("FRIENDS");
    else if (connectionStatus == "BLOCKED_BY_YOU")
      setFriendShipStatus("BLOCKED_BY_YOU");
    else if (connectionStatus == "BLOCKED_YOU")
      setFriendShipStatus("BLOCKED_YOU");
    else if (connectionStatus == null) setFriendShipStatus(null);
  }, [connectionStatus]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getConnectionStatus(user.userId);

        if (data.requestId) {
          setRequestId(data.requestId);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user.userId, connectionStatus]);

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      await sendRequest(user.userId);
      setFriendShipStatus("PENDING_SENT");
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRequest = async () => {
    setIsAccepting(true);
    try {
      if (!requestId) return;
      const { status } = await acceptFriendRequest(requestId);

      if (status === "success") {
        setFriendShipStatus("FRIENDS");
        toast.success("Friend request accepted");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to accept request");
    } finally {
      setIsAccepting(false);
    }
  };

  const rejectRequest = async () => {
    setIsRejecting(true);
    try {
      if (!requestId) return;
      const { status } = await rejectFriendRequest(requestId);

      if (status === "success") {
        setFriendShipStatus(null);
        toast.success("Friend request rejected");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject request");
    } finally {
      setIsRejecting(false);
    }
  };

  const cancelRequest = async () => {
    setIsLoading(true);
    try {
      if (!requestId) return;
      await cancelFriendRequest(requestId);
      setFriendShipStatus(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const removeRelation = async () => {
    setIsRemoving(true);
    try {
      await unFriend(user.userId);
      setFriendShipStatus(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRemoving(false);
    }
  };

  const unblockUser = async () => {
    console.log("USER UNBLOCKED");
  };
  return (
    <div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <ProfileImage
              pfp={user.pfp}
              name={user.firstName}
              editable={false}
            />
          </div>
          <Name
            firstName={user.firstName}
            lastName={user.lastName}
            middleName={user.middleName}
            email={user.email}
          />

          <div className="flex justify-center">
            {friendshipStatus === "FRIENDS" ? (
              <Friends
                isRemoving={isRemoving}
                removeRelation={removeRelation}
              />
            ) : friendshipStatus === "PENDING_SENT" ? (
              <PendingRequest
                cancelRequest={cancelRequest}
                isLoading={isLoading}
              />
            ) : friendshipStatus === "PENDING_RECEIVED" ? (
              <RequestReceived
                acceptRequest={acceptRequest}
                rejectRequest={rejectRequest}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
              />
            ) : friendshipStatus === "BLOCKED_BY_YOU" ||
              friendshipStatus === "BLOCKED_YOU" ? (
              <Blocked status={friendshipStatus} handleUnblock={unblockUser} />
            ) : (
              <Button onClick={handleSendRequest} disabled={isLoading}>
                {isLoading ? <SendingRequest /> : <Action />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;

const Friends = ({
  removeRelation,
  isRemoving,
}: {
  removeRelation: () => void;
  isRemoving: boolean;
}) => {
  return !isRemoving ? (
    <div className=" gap-4 flex">
      <Button variant="secondary" disabled>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-user-check"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="m15 15 6 6L23 17" />
        </svg>
        Friends
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          removeRelation();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-user-check"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="m15 15 6 6L23 17" />
        </svg>
        Remove
      </Button>
    </div>
  ) : (
    <Button variant="secondary" disabled={true}>
      <svg
        className="animate-spin h-5 w-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Removing...
    </Button>
  );
};

const Action = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-user-plus"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" x2="19" y1="1" y2="7" />
        <line x1="16" x2="22" y1="4" y2="4" />
      </svg>
      Add friend
    </>
  );
};
