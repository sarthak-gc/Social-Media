import { Context } from "hono";
import { getPrisma } from "../utils/getPrisma";

import { uploadImage, validateImage } from "../utils/uploadImage";
import { findUser } from "../utils/user";
import { findFriends } from "../utils/relation";
import { NotificationType } from "../generated/prisma";
import {
  addComment,
  addReaction,
  changeReaction,
  createImage,
  createPost,
  findComment,
  findPost,
  findPosts,
  findReaction,
  findReactions,
  getComments,
  getValidComment,
  getValidReaction,
  removeComment,
  removeReaction,
  updateComment,
} from "../utils/content";

export const addPost = async (c: Context) => {
  const userId = c.get("userId");

  try {
    const formData = await c.req.formData();
    const title = formData.get("title") as string;

    const image = formData.get("image") as File;
    let formDataToSend: FormData;

    if (!title && !image) {
      return c.json({
        status: "error",
        message: "Nothing to post",
      });
    }
    const prisma = getPrisma(c);

    const post = await createPost(prisma, userId, title);
    let result;

    if (image) {
      if (!(image instanceof File)) {
        return c.json({ msg: "invalid" });
      }
      formDataToSend = await validateImage(image);

      result = await uploadImage(formDataToSend, c);

      await createImage(prisma, post.postId, result.secure_url);
    }

    const friends = await findFriends(prisma, userId);
    const friendsId: string[] = friends.map((friend) => friend.userId);

    const notificationsData = friendsId.map((friendId) => ({
      type: NotificationType.POST,
      receiverId: friendId,
      creatorId: userId,
      postId: post.postId,
    }));

    await prisma.notification.createMany({
      data: notificationsData,
    });

    return c.json({
      status: "success",
      message: "Post uploaded",
      data: {
        postId: post.postId,
        url: result ? result.secure_url : "",
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};
export const getPosts = async (c: Context) => {
  const userId = c.req.param().profileId;
  if (!userId) {
    return c.json(
      {
        status: "error",
        message: "User ID is required",
      },
      400
    );
  }
  try {
    const prisma = getPrisma(c);
    const user = await findUser(prisma, userId);
    if (!user) {
      return c.json(
        {
          status: "error",
          message: "User not found",
        },
        404
      );
    }
    const posts = await findPosts(prisma, userId);
    return c.json({
      status: "success",
      message: "Posts retrieved",
      data: {
        posts,
      },
    });
  } catch (e) {
    console.error("Error fetching posts:", e);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getFeed = async (c: Context) => {
  const prisma = getPrisma(c);
  const posts = findPosts(prisma, null);
  return c.json({
    status: "success",
    message: "Posts Retrieved",
    data: {
      posts,
    },
  });
};

export const getPost = async (c: Context) => {
  const prisma = getPrisma(c);
  const postId = c.req.param("postId");

  try {
    const post = await findPost(prisma, postId);

    if (!post) {
      return c.json(
        {
          status: "error",
          message: "Post not found",
        },
        404
      );
    }

    return c.json({
      status: "success",
      message: "Post retrieved",
      data: {
        post,
      },
    });
  } catch (e) {
    console.error("Error fetching post:", e);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getImage = async (c: Context) => {
  const imageId = c.req.param().imageId;

  if (!imageId) {
    return c.json(
      {
        status: "error",
        message: "Image not found",
      },
      404
    );
  }

  const prisma = getPrisma(c);
  try {
    const image = await prisma.image.findFirst({
      where: {
        imageId,
      },
    });
    if (!image) {
      return c.json({ status: "error", message: "Image not found" }, 404);
    }

    return c.json({
      status: "success",
      message: "Image received",
      data: {
        imageUrl: image.url,
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const reactPost = async (c: Context) => {
  const { postId } = c.req.param();
  const { userId } = c.get("user");

  const body = await c.req.json();

  let { type = "" } = body;

  try {
    type = getValidReaction(c, type);

    const prisma = getPrisma(c);
    const reaction = await findReaction(prisma, userId, postId);

    if (reaction) {
      if (reaction.type === type) {
        await removeReaction(prisma, userId, postId);
        return c.json({
          status: "success",
          message: "reaction removed",
        });
      } else {
        await changeReaction(prisma, userId, postId, type);
        return c.json({
          status: "success",
          message: "reaction changed",
        });
      }
    }
    await addReaction(prisma, userId, postId, type);
    return c.json({ status: "success", message: "Reacted to the post" });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getReactions = async (c: Context) => {
  const { postId } = c.req.param();
  const prisma = getPrisma(c);
  try {
    const reactions = await findReactions(prisma, postId);
    return c.json({
      reactions,
      count: reactions.length,
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const commentOnPost = async (c: Context) => {
  const { postId } = c.req.param();
  const { userId } = c.get("user");
  let { comment } = await c.req.json();
  try {
    comment = getValidComment(comment);

    const prisma = getPrisma(c);

    const commentDetails = await addComment(prisma, postId, userId, comment);
    return c.json({
      status: "success",
      message: "Comment posted",
      data: {
        commentDetails,
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getPostComments = async (c: Context) => {
  const { userId } = c.get("user");
  const { postId } = c.req.param();

  const prisma = getPrisma(c);

  try {
    const post = await findPost(prisma, postId);

    if (!post) {
      return c.json({
        status: "error",
        message: "post not found",
      });
    }

    const isFollowing = await prisma.relation.findFirst({
      where: {
        sender: userId,
      },
    });

    const comments = await getComments(prisma, postId);

    if (isFollowing) {
      return c.json({
        status: "success",
        message: "Comments retrieved",
        data: {
          comments,
        },
      });
    }

    return c.json({
      status: "success",
      message: "Comments retrieved",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const editComment = async (c: Context) => {
  const { userId } = c.get("user");

  const { commentId } = c.req.param();
  const { content } = await c.req.json();
  const prisma = getPrisma(c);
  try {
    const comment = await findComment(prisma, commentId);
    if (!comment) {
      return c.json({
        status: "error",
        message: "No comment to edit",
      });
    }
    const isAuthor = userId === comment.commenterId;
    if (!isAuthor) {
      return c.json({
        status: "error",
        message: "Not Authorized to edit the comment",
      });
    }

    updateComment(prisma, commentId, content);
    return c.json({
      status: "success",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const deleteComment = async (c: Context) => {
  const { userId } = c.get("user");

  const { commentId } = c.req.param();

  const prisma = getPrisma(c);
  try {
    const comment = await findComment(prisma, commentId);
    if (!comment) {
      return c.json({
        status: "error",
        message: "No comment to delete",
      });
    }
    const isAuthor = userId === comment.commenterId;
    if (!isAuthor) {
      return c.json({
        status: "error",
        message: "Not Authorized to delete the comment",
      });
    }

    removeComment(prisma, commentId);
    return c.json({
      status: "success",
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};
