import { Context } from "hono";
import { getPrisma } from "../utils/getPrisma";

import {
  block,
  findRelation,
  getBlockedUsers,
  getStatus,
  removeRelation,
  unBlock,
} from "../utils/relation";
import { RelationType } from "../generated/prisma";
import { findRequest, findSentRequest } from "../utils/request";
import { findUser } from "../utils/user";

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
    const connection = await findRelation(prisma, userId, targetId);
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
    const connection = await findRelation(prisma, userId, targetId);

    if (!connection) {
      return c.json(
        { status: "error", message: "Cant block without connection" },
        500
      );
    }
    if (
      connection.type == "BLOCKED_BY_SENDER" ||
      connection.type == "BLOCKED_BY_RECEIVER"
    ) {
      return c.json(
        { status: "error", message: "This contact is already blocked" },
        500
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

export const unBlockUser = async (c: Context) => {
  const userId = c.get("userId");
  const targetId = c.req.param().profileId || null;
  if (!targetId || targetId == userId) {
    return c.json({ status: "error", message: "Invalid target id" }, 409);
  }

  const prisma = getPrisma(c);

  try {
    const connection = await findRelation(prisma, userId, targetId);

    if (!connection) {
      return c.json({ status: "error", message: "Connection not found" }, 404);
    }
    const receiver = connection.receiver;
    const initiator = connection.initiator;

    if (initiator == userId && connection.type == "BLOCKED_BY_SENDER") {
      await unBlock(prisma, connection.relationId);
    } else if (receiver == userId && connection.type == "BLOCKED_BY_RECEIVER") {
      await unBlock(prisma, connection.relationId);
    } else {
      return c.json({ status: "error", message: "Invalid Request" }, 409);
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

export const getRelationStatus = async (c: Context) => {
  const userId = c.get("userId");
  const targetId = c.req.param().profileId || null;

  if (!targetId || targetId === userId) {
    return c.json({ status: "error", message: "Invalid profile ID" }, 409);
  }

  const prisma = getPrisma(c);

  try {
    const [sentRequest, receivedRequest, user] = await Promise.all([
      findSentRequest(prisma, userId, targetId),
      findRequest(prisma, targetId, userId),
      findUser(prisma, targetId),
    ]);

    if (!user) {
      return c.json({ status: "error", message: "Invalid target ID" }, 404);
    }

    if (sentRequest) {
      return c.json({
        status: "success",
        message: "Request sent",
        data: {
          requestId: sentRequest.requestId,
          status: "PENDING_SENT",
        },
      });
    }

    if (receivedRequest) {
      return c.json({
        status: "success",
        message: "Request received",
        data: {
          requestId: receivedRequest.requestId,
          status: "PENDING_RECEIVED",
        },
      });
    }

    const connection = await findRelation(prisma, userId, targetId);

    let status = getStatus(connection, userId);

    return c.json({
      status: "success",
      message: "Status retrieved",
      data: {
        status,
      },
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
