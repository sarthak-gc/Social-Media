import { Context } from "hono";
import { PrismaClient, ReactionType } from "../generated/prisma";

export const getValidReaction = (c: Context, type: string) => {
  const reactionMap = new Map([
    ["angry", ReactionType.ANGRY],
    ["dislike", ReactionType.DISLIKE],
    ["heart", ReactionType.HEART],
    ["laugh", ReactionType.LAUGH],
    ["like", ReactionType.LIKE],
  ]);

  type = String(type).trim().toLowerCase();

  if (!reactionMap.get(type)) {
    c.status(400);
    throw Error("Invalid reaction");
  }

  return reactionMap.get(type);
};

export const findReaction = async (
  prisma: PrismaClient,
  userId: string,
  postId: string
) => {
  const reaction = await prisma.reactions.findFirst({
    where: {
      userId,
      postId,
    },
  });
  return reaction;
};

export const removeReaction = async (
  prisma: PrismaClient,
  userId: string,
  postId: string
) => {
  await prisma.$transaction([
    prisma.post.update({
      where: {
        postId,
      },
      data: {
        reactions: {
          decrement: 1,
        },
      },
    }),

    prisma.reactions.delete({
      where: {
        postId_userId: { postId, userId },
      },
    }),
  ]);
};

export const changeReaction = async (
  prisma: PrismaClient,
  userId: string,
  postId: string,
  type: ReactionType
) => {
  await prisma.reactions.update({
    where: {
      postId_userId: {
        postId,
        userId: userId,
      },
    },
    data: {
      type: type,
    },
  });
};

export const addReaction = async (
  prisma: PrismaClient,
  userId: string,
  postId: string,
  type: ReactionType
) => {
  await prisma.$transaction([
    prisma.post.update({
      where: {
        postId,
      },
      data: {
        reactions: {
          increment: 1,
        },
      },
    }),
    prisma.reactions.create({
      data: {
        userId,
        postId,
        type,
      },
    }),
  ]);
};

export const getValidComment = (comment: string) => {
  if (String(comment).trim()) {
    return String(comment).trim();
  } else {
    throw Error("Empty Comment");
  }
};

export const addComment = async (
  prisma: PrismaClient,
  postId: string,
  userId: string,
  comment: string
) => {
  return await prisma.comment.create({
    data: {
      content: comment,
      postId,
      commenterId: userId,
    },
    include: {
      User: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const getComments = async (prisma: PrismaClient, postId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      isDeleted: false,
    },
    include: {
      User: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return comments;
};

export const findPost = async (prisma: PrismaClient, postId: string) => {
  const post = await prisma.post.findFirst({
    where: {
      postId,
    },
    include: {
      Comments: {
        select: {
          createdAt: true,
          isUpdated: true,
          parentId: true,
          commentId: true,
          User: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
            },
          },
          content: true,
        },
      },
      Reactions: {
        select: {
          createdAt: true,
          User: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
        },
      },
      images: true,
    },
  });
  return post;
};

export const findComment = async (prisma: PrismaClient, commentId: string) => {
  const comment = await prisma.comment.findFirst({
    where: {
      commentId,
    },
  });
  return comment;
};

export const updateComment = async (
  prisma: PrismaClient,
  commentId: string,
  content: string
) => {
  await prisma.comment.update({
    where: {
      commentId,
    },
    data: {
      content,
    },
  });
};

export const removeComment = async (
  prisma: PrismaClient,
  commentId: string
) => {
  await prisma.comment.delete({
    where: {
      commentId,
    },
  });
};

export const createPost = async (
  prisma: PrismaClient,
  userId: string,
  title: string
) => {
  const post = await prisma.post.create({
    data: {
      posterId: userId,
      title,
    },
  });
  return post;
};

export const createImage = async (
  prisma: PrismaClient,
  postId: string,
  url: string
) => {
  await prisma.image.create({
    data: {
      postId,
      url,
    },
  });
};

export const findPosts = async (
  prisma: PrismaClient,
  userId: string | null
) => {
  const whereCondition = userId ? { posterId: userId } : {};
  const post = await prisma.post.findMany({
    where: whereCondition,
    include: {
      images: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          pfp: true,
          userId: true,
        },
      },
      Comments: true,
    },
  });
  return post;
};

export const findReactions = async (prisma: PrismaClient, postId: string) => {
  const reactions = await prisma.reactions.findMany({
    where: {
      postId,
    },
    include: {
      User: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return reactions;
};
