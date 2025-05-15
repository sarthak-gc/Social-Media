import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import ProfileImage from "./Pfp";
import Name from "./Name";
import axios from "axios";
import { useEffect, useState } from "react";
import type { UserI } from "@/pages/types/types";
import {
  acceptFriendRequest,
  getConnectionStatus,
  rejectFriendRequest,
  sendRequest,
} from "@/services/connections";
import { toast } from "sonner";

const UserCard = ({ user }: { user: UserI }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [friendshipStatus, setFriendShipStatus] = useState<
    "PENDING" | "FRIENDS" | "RECEIVED" | "BLOCKED_BY_YOU" | "BLOCKED_YOU" | null
  >(null);

  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, message } = await getConnectionStatus(user.userId);

        if (message === "Request sent") {
          setFriendShipStatus("PENDING");
          setRequestId(data.requestId);
        } else if (message === "Request received") {
          setFriendShipStatus("RECEIVED");
          setRequestId(data.requestId);
        } else if (message === "No relation") {
          setFriendShipStatus(null);
        } else if (message === "Friends") {
          setFriendShipStatus("FRIENDS");
          setRequestId(data.requestId);
        } else if (message === "You blocked the user") {
          setFriendShipStatus("BLOCKED_BY_YOU");
          setRequestId(data.requestId);
        } else if (message === "You are blocked by the user") {
          setFriendShipStatus("BLOCKED_YOU");
          setRequestId(data.requestId);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user.userId]);

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      const { status } = await sendRequest(user.userId);

      if (status === "success") {
        setRequestSent(true);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRequest = async () => {
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
    }
  };

  const rejectRequest = async () => {
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
    }
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
            ) : friendshipStatus === "PENDING" ? (
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await axios.put(
                      `http://localhost:8787/connection/cancel/request/${requestId}`,
                      {},
                      {
                        withCredentials: true,
                      }
                    );
                    setRequestSent(false);
                    setFriendShipStatus(null);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {isLoading ? (
                  <>
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
                    Cancelling...
                  </>
                ) : (
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
                      className="lucide lucide-user-minus"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="2" x2="10" y1="15" y2="15" />
                    </svg>
                    Cancel Request
                  </>
                )}
              </Button>
            ) : friendshipStatus === "RECEIVED" ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={rejectRequest}>
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
                  Accept
                </Button>
                <Button variant="outline" onClick={acceptRequest}>
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
                    className="lucide lucide-user-minus"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="2" x2="10" y1="15" y2="15" />
                  </svg>
                  Reject
                </Button>
              </div>
            ) : friendshipStatus === "BLOCKED_BY_YOU" ||
              friendshipStatus === "BLOCKED_YOU" ? (
              <Button variant="destructive" disabled>
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
                  className="lucide lucide-user-x"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="18" x2="22" y1="6" y2="2" />
                  <line x1="22" x2="18" y1="6" y2="2" />
                </svg>
                Blocked
              </Button>
            ) : (
              <Button
                onClick={handleSendRequest}
                disabled={isLoading || requestSent}
              >
                {isLoading ? (
                  <>
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
                    Sending Request...
                  </>
                ) : (
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
                    Add Friend
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;
