import { Context } from "hono";
import { PrismaClient } from "../generated/prisma";

export const createRequest = async (
  prisma: PrismaClient,
  senderId: string,
  receiverId: string
) => {
  const request = await prisma.request.create({
    data: {
      senderId,
      receiverId,
    },
  });
  return request;
};

export const findRequest = async (
  prisma: PrismaClient,
  senderId: string,
  receiverId: string
) => {
  const friendRequest = await prisma.request.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      status: "PENDING",
    },
  });
  return friendRequest;
};

export const findReceivedRequests = async (
  prisma: PrismaClient,
  userId: string
) => {
  const requests = await prisma.request.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
          userId: true,
          pfp: true,
        },
      },
    },
  });
  return requests;
};

export const findSentRequests = async (
  prisma: PrismaClient,
  senderId: string
) => {
  const requests = await prisma.request.findMany({
    where: {
      senderId,
      status: "PENDING",
    },
    select: {
      receiver: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
          pfp: true,
        },
      },
      receiverId: true,
      requestId: true,
      createdAt: true,
      status: true,
    },
  });
  return requests;
};

export const findRequestUsingRequestId = async (
  prisma: PrismaClient,
  requestId: string
) => {
  const requests = await prisma.request.findFirst({
    where: {
      requestId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
          pfp: true,
        },
      },
    },
  });
  return requests;
};

export const acceptRequest = async (
  prisma: PrismaClient,
  requestId: string
) => {
  await prisma.request.update({
    where: {
      requestId,
    },
    data: {
      status: "ACCEPTED",
    },
  });
};

export const rejectRequest = async (
  prisma: PrismaClient,
  requestId: string
) => {
  await prisma.request.update({
    where: {
      requestId,
    },
    data: {
      status: "REJECTED",
    },
  });
};

export const cancelRequest = async (
  prisma: PrismaClient,
  requestId: string
) => {
  await prisma.request.delete({
    where: {
      requestId,
    },
  });
};

export const findSentRequest = async (
  prisma: PrismaClient,
  senderId: string,
  receiverId: string
) => {
  const requests = await prisma.request.findFirst({
    where: {
      receiverId,
      senderId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
          pfp: true,
        },
      },
    },
  });
  return requests;
};
