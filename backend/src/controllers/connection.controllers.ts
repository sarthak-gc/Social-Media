import { Context } from "hono";
import { RelationType } from "../generated/prisma";
import {
  acceptRequest,
  block,
  cancelRequest,
  createConnection,
  createRequest,
  findConnection,
  findFriends,
  findRequestUsingRequestId,
  findReceivedRequests,
  findRequestUsingUsersId,
  findSentRequest,
  findSentRequests,
  findUser,
  getBlockedUsers,
  rejectRequest,
  removeRelation,
  unBlock,
} from "../utils/connection";

import { getPrisma } from "../utils/getPrisma";

// connectionRoutes.post("/request/send/:profileId");
export const sendRequest = async (c: Context) => {
  const senderId = c.get("userId");
  const receiverId = c.req.param().profileId || null;

  if (!receiverId || !senderId || receiverId == senderId) {
    return c.json(
      {
        status: "error",
        message: "invalid receiver id or sender cannot be the same as receiver",
      },
      404
    );
  }

  const prisma = getPrisma(c);

  try {
    const [receiver, alreadyRequestSent, alreadyConnected] = await Promise.all([
      findUser(prisma, receiverId),
      findSentRequest(prisma, senderId, receiverId),
      findConnection(prisma, senderId, receiverId),
    ]);

    if (!receiver) {
      return c.json(
        {
          status: "error",
          message: "Receiver not found",
        },
        404
      );
    }

    if (alreadyRequestSent) {
      return c.json(
        {
          status: "error",
          message: "Request already sent",
        },
        404
      );
    }

    if (alreadyConnected) {
      let message = "";
      if (alreadyConnected.type == "FRIENDS") {
        message = "You are already connected with this user";
      } else {
        message =
          "Cant sent req when blocked, try unblocking or getting unblocked";
      }
      return c.json(
        {
          status: "error",
          message,
        },
        409
      );
    }
    await createRequest(prisma, senderId, receiverId);
    return c.json({ status: "success", message: "Request sent successfully" });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

// connectionRoutes.get("/friends/all");
export const getFriends = async (c: Context) => {
  const userId = c.get("userId");

  const prisma = getPrisma(c);

  try {
    const friends = await findFriends(prisma, userId);
    return c.json({
      status: "success",
      messages: "friends retrieved",
      data: {
        friends,
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

// connectionRoutes.get("/requests/pending/received");
export const getReceivedRequests = async (c: Context) => {
  const userId = c.get("userId");

  const prisma = getPrisma(c);

  try {
    const requests = await findReceivedRequests(prisma, userId);

    return c.json({
      status: "success",
      messages: "received requests retrieved",
      data: {
        requests: requests ? requests : [],
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

// connectionRoutes.get("/requests/pending/sent");
export const getSentRequests = async (c: Context) => {
  const userId = c.get("userId");

  const prisma = getPrisma(c);

  try {
    const requests = await findSentRequests(prisma, userId);
    return c.json({
      status: "success",
      messages: "sent requests retrieved",
      data: {
        requests: requests ? requests : [],
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

// connectionRoutes.put("/unfriend/:profileId");
export const unFriend = async (c: Context) => {
  const userId = c.get("userId");
  const targetId = c.req.param().profileId || null;

  if (!targetId || userId == targetId) {
    return c.json(
      {
        status: "error",
        message: "invalid target id or you cannot unfriend yourself",
      },
      404
    );
  }

  const prisma = getPrisma(c);

  try {
    const connection = await findConnection(prisma, userId, targetId);
    if (!connection) {
      return c.json(
        {
          status: "error",
          messages: "unable to unfriend a person not in your friend list",
        },
        409
      );
    }

    const relationId = connection.relationId;
    await removeRelation(prisma, relationId);
    return c.json({
      status: "success",
      messages: "Unfriended",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

// connectionRoutes.put("/block/:profileId");
export const blockUser = async (c: Context) => {
  const userId = c.get("userId");
  const targetId = c.req.param().profileId || null;
  if (!targetId || targetId == userId) {
    return c.json(
      { status: "error", message: "invalid target id, can't block" },
      404
    );
  }

  const prisma = getPrisma(c);

  try {
    const connection = await findConnection(prisma, userId, targetId);

    if (connection?.type !== "FRIENDS") {
      return c.json(
        {
          status: "error",
          message: "Cant block without connection",
        },
        409
      );
    }
    const relationId = connection.relationId;
    if (connection.initiator == userId) {
      await block(prisma, relationId, RelationType.BLOCKED_BY_SENDER);
    } else {
      await block(prisma, relationId, RelationType.BLOCKED_BY_RECEIVER);
    }
    return c.json({
      status: "success",
      message: "blocked successfully",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

// connectionRoutes.put("/unblock/:profileId");
export const unBlockUser = async (c: Context) => {
  const userId = c.get("userId");
  const targetId = c.req.param().profileId || null;
  if (!targetId || targetId == userId) {
    return c.json({ status: "error", message: "Invalid target id" }, 409);
  }

  const prisma = getPrisma(c);

  try {
    const connection = await findConnection(prisma, userId, targetId);

    if (!connection) {
      return c.json({ status: "error", message: "Connection not found" }, 404);
    }
    const receiver = connection?.receiver;
    const initiator = connection?.initiator;

    if (initiator == userId && connection.type == "BLOCKED_BY_SENDER") {
      await unBlock(prisma, connection.relationId);
    } else if (receiver == userId && connection.type == "BLOCKED_BY_RECEIVER") {
      await unBlock(prisma, connection.relationId);
    } else {
      return c.json({ status: "error", message: "In valid Request" }, 409);
    }
    return c.json({
      status: "success",
      message: "unblocked successfully",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

// connectionRoutes.put("/request/accept/:requestId");
export const acceptFriendRequest = async (c: Context) => {
  const userId = c.get("userId");

  const requestId = c.req.param().requestId || null;

  if (!requestId) {
    return c.json({ status: "error", message: "invalid request id " }, 404);
  }

  const prisma = getPrisma(c);
  const request = await findRequestUsingRequestId(prisma, requestId, userId);

  if (!request) {
    return c.json({ status: "error", message: "Request not found" }, 404);
  }

  if (request.receiverId !== userId) {
    return c.json({ status: "error", message: "Invalid Request" }, 409);
  }
  try {
    await prisma.$transaction(async () => {
      await acceptRequest(prisma, requestId);
      await createConnection(prisma, userId, request.senderId);
    });

    return c.json({
      status: "success",
      message: "Request Accepted",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};
// connectionRoutes.put("/request/reject/:requestId");
export const rejectFriendRequest = async (c: Context) => {
  const userId = c.get("userId");

  const requestId = c.req.param().requestId || null;

  if (!requestId) {
    return c.json({ status: "error", message: "invalid request id " }, 404);
  }

  const prisma = getPrisma(c);
  const request = await findRequestUsingRequestId(prisma, requestId, userId);

  if (!request) {
    return c.json({ status: "error", message: "Request not found" }, 404);
  }

  if (request.receiverId !== userId) {
    return c.json({ status: "error", message: "Invalid Request" }, 409);
  }
  try {
    await rejectRequest(prisma, requestId);
    return c.json({
      status: "success",
      message: "Request Rejected",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

// connectionRoutes.put("/cancel/request/:requestId");
export const cancelFriendRequest = async (c: Context) => {
  const userId = c.get("userId");

  const requestId = c.req.param().requestId || null;

  if (!requestId) {
    return c.json({ status: "error", message: "invalid request id " }, 404);
  }

  console.log(requestId, "HI THERE I AM ID");

  const prisma = getPrisma(c);
  const request = await findRequestUsingRequestId(prisma, requestId, userId);

  console.log(request, " HI THER EI AM REQUEST");
  if (!request) {
    return c.json({ status: "error", message: "Request not found" }, 404);
  }

  if (request.senderId !== userId) {
    return c.json({ status: "error", message: "Invalid Request" }, 409);
  }
  try {
    await cancelRequest(prisma, requestId);
    return c.json({
      status: "success",
      message: "Request Cancelled",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getConnectionStatus = async (c: Context) => {
  const userId = c.get("userId");
  const targetId = c.req.param().profileId || null;

  if (!targetId || targetId === userId) {
    return c.json({ status: "error", message: "Invalid profile ID" }, 409);
  }

  const prisma = getPrisma(c);

  try {
    const [sentRequest, receivedRequest, user] = await Promise.all([
      findSentRequest(prisma, userId, targetId),
      findRequestUsingUsersId(prisma, targetId, userId),
      findUser(prisma, targetId),
    ]);

    console.log(sentRequest);
    if (!user) {
      return c.json({ status: "error", message: "Invalid target ID" }, 404);
    }

    if (sentRequest) {
      return c.json({
        status: "success",
        message: "Request sent",
        data: {
          requestId: sentRequest.requestId,
        },
      });
    }

    if (receivedRequest) {
      if (receivedRequest.status === "PENDING")
        return c.json({
          status: "success",
          message: "Request received",
          data: {
            requestId: receivedRequest.requestId,
          },
        });
      if (receivedRequest.status === "ACCEPTED")
        return c.json({
          status: "success",
          message: "Friends",
          data: {
            requestId: receivedRequest.requestId,
          },
        });
      if (receivedRequest.status === "REJECTED")
        return c.json({
          status: "success",
          message: "No relation",
        });
    }

    const connection = await prisma.relation.findFirst({
      where: {
        OR: [
          { initiator: userId, receiver: targetId },
          { initiator: targetId, receiver: userId },
        ],
        NOT: { type: "UNFRIENDED" },
      },
    });

    let message = "No relation";
    if (connection) {
      const { type, initiator, receiver } = connection;
      if (type === "FRIENDS") message = "Friends";
      else if (
        (type === "BLOCKED_BY_SENDER" && userId === initiator) ||
        (type === "BLOCKED_BY_RECEIVER" && userId === receiver)
      )
        message = "You blocked the user";
      else if (
        (type === "BLOCKED_BY_RECEIVER" && userId === initiator) ||
        (type === "BLOCKED_BY_SENDER" && userId === receiver)
      )
        message = "You are blocked by the user";
    }

    return c.json({
      status: "success",
      message,
    });
  } catch (err) {
    console.error("Error fetching connection status:", err);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getAllBlockedUsers = async (c: Context) => {
  const userId = c.get("userId");

  const prisma = getPrisma(c);

  try {
    const blockedUsers = await getBlockedUsers(prisma, userId);

    return c.json({
      status: "success",
      message: "Blocked users retrieved",
      data: {
        blockedUsers,
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};
