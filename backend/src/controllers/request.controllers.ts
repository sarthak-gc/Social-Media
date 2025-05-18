import { Context } from "hono";
import { getPrisma } from "../utils/getPrisma";
import { findUser } from "../utils/user";

import {
  acceptRequest,
  cancelRequest,
  createRequest,
  findReceivedRequests,
  findRequest,
  findRequestUsingRequestId,
  findSentRequests,
  rejectRequest,
} from "../utils/request";
import { createRelation, findRelation } from "../utils/relation";
import { NotificationType } from "../generated/prisma";

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
      findRequest(prisma, senderId, receiverId),
      findRelation(prisma, senderId, receiverId),
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
    await prisma.$transaction(async (p) => {
      return Promise.all([
        createRequest(prisma, senderId, receiverId),
        p.notification.create({
          data: {
            type: NotificationType.REQUEST_SENT,
            creatorId: senderId,
            receiverId,
          },
        }),
      ]);
    });
    return c.json({ status: "success", message: "Request sent successfully" });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

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

export const acceptFriendRequest = async (c: Context) => {
  const userId = c.get("userId");

  const requestId = c.req.param().requestId || null;

  if (!requestId) {
    return c.json({ status: "error", message: "invalid request id " }, 404);
  }

  const prisma = getPrisma(c);
  const request = await findRequestUsingRequestId(prisma, requestId);
  if (!request) {
    return c.json({ status: "error", message: "Request not found" }, 404);
  }

  if (request.receiverId != userId) {
    return c.json({ status: "error", message: "Invalid Request" }, 409);
  }

  try {
    await prisma.$transaction(async () => {
      await acceptRequest(prisma, requestId);
      await createRelation(prisma, userId, request.senderId);
      await prisma.notification.create({
        data: {
          type: NotificationType.REQUEST_ACCEPTED,
          creatorId: userId,
          receiverId: request.senderId,
        },
      });
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

export const rejectFriendRequest = async (c: Context) => {
  const userId = c.get("userId");

  const requestId = c.req.param().requestId || null;

  if (!requestId) {
    return c.json({ status: "error", message: "invalid request id " }, 404);
  }

  const prisma = getPrisma(c);
  const request = await findRequestUsingRequestId(prisma, requestId);

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

export const cancelFriendRequest = async (c: Context) => {
  const userId = c.get("userId");

  const requestId = c.req.param().requestId || null;

  if (!requestId) {
    return c.json({ status: "error", message: "invalid request id " }, 404);
  }

  const prisma = getPrisma(c);
  const request = await findRequestUsingRequestId(prisma, requestId);

  if (!request) {
    return c.json({ status: "error", message: "Request not found" }, 404);
  }

  if (request.senderId !== userId) {
    return c.json({ status: "error", message: "Invalid Request" }, 409);
  }
  try {
    await cancelRequest(prisma, requestId);
    await prisma.notification.deleteMany({
      where: {
        creatorId: userId,
        receiverId: request.receiverId,
        type: "REQUEST_SENT",
      },
    });
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
