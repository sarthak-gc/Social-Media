import { PrismaClient, RelationType } from "../generated/prisma";

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

export const createRelation = async (
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

export const findRelation = async (
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
    },
  });
  return connection;
};

interface ConnectionType {
  relationId: string;
  initiator: string;
  receiver: string;
  createdAt: Date;
  type: RelationType;
}
export const getStatus = (
  connection: ConnectionType | null,
  userId: string
) => {
  let message = null;
  if (connection) {
    const { type, initiator, receiver } = connection;
    if (type === "FRIENDS") message = "FRIENDS";
    else if (
      (type === "BLOCKED_BY_SENDER" && userId === initiator) ||
      (type === "BLOCKED_BY_RECEIVER" && userId === receiver)
    )
      message = "BLOCKED_BY_YOU";
    else if (
      (type === "BLOCKED_BY_RECEIVER" && userId === initiator) ||
      (type === "BLOCKED_BY_SENDER" && userId === receiver)
    )
      message = "BLOCKED_YOU";
  }
  return message;
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

export const findFriends = async (prisma: PrismaClient, userId: string) => {
  const relations = await prisma.relation.findMany({
    where: {
      OR: [{ initiator: userId }, { receiver: userId }],
      type: "FRIENDS",
    },
    select: {
      initiator: true,
      receiver: true,
      sender: {
        select: {
          userId: true,
          pfp: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
      accepter: {
        select: {
          userId: true,
          pfp: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
    },
  });

  const friends = relations.map((relation) => {
    return relation.initiator === userId ? relation.accepter : relation.sender;
  });

  return friends;
};
