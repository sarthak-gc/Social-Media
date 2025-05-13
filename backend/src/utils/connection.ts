import { PrismaClient, RelationType } from "../generated/prisma";

export const findUser = async (prisma: PrismaClient, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
    select: {
      userId: true,
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      pfp: true,
    },
  });

  return user;
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
    },
  });
  return friendRequest;
};

export const findConnection = async (
  prisma: PrismaClient,
  person1: string,
  person2: string
) => {
  const connection = await prisma.relation.findFirst({
    where: {
      OR: [
        { initiator: person1, receiver: person2 },
        { initiator: person2, receiver: person1 },
      ],
      NOT: { type: "UNFRIENDED" },
    },
  });
  return connection;
};

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

export const findFriends = async (prisma: PrismaClient, userId: string) => {
  const friends = await prisma.relation.findFirst({
    where: {
      OR: [{ initiator: userId, receiver: userId }],
      type: "FRIENDS",
    },
  });
  return friends;
};

export const findReceivedRequests = async (
  prisma: PrismaClient,
  userId: string
) => {
  const requests = await prisma.request.findFirst({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
  });
  return requests;
};

export const findSentRequests = async (
  prisma: PrismaClient,
  userId: string
) => {
  const requests = await prisma.request.findFirst({
    where: {
      senderId: userId,
    },
  });
  return requests;
};

export const removeRelation = async (
  prisma: PrismaClient,
  relationId: string
) => {
  await prisma.relation.update({
    where: {
      relationId,
    },
    data: {
      type: "UNFRIENDED",
    },
  });
};

export const block = async (
  prisma: PrismaClient,
  relationId: string,
  type: RelationType
) => {
  await prisma.relation.update({
    where: {
      relationId,
    },
    data: {
      type,
    },
  });
};

export const unBlock = async (prisma: PrismaClient, relationId: string) => {
  await prisma.relation.update({
    where: {
      relationId,
    },
    data: {
      type: "FRIENDS",
    },
  });
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

export const createConnection = async (
  prisma: PrismaClient,
  receiver: string,
  initiator: string
) => {
  await prisma.relation.create({
    data: {
      receiver,
      initiator,
      type: "FRIENDS",
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
export const getBlockedUsers = async (prisma: PrismaClient, userId: string) => {
  const relations = await prisma.relation.findMany({
    where: {
      OR: [
        { initiator: userId, type: "BLOCKED_BY_SENDER" },
        { receiver: userId, type: "BLOCKED_BY_RECEIVER" },
      ],
    },
  });
  const users = relations.filter((relation) => {
    if (relation.initiator == userId) {
      return relation.receiver;
    }
    if (relation.receiver == userId) {
      return relation.receiver;
    }
  });
  return users;
};
