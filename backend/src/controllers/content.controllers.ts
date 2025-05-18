import { Context } from "hono";
import { getPrisma } from "../utils/getPrisma";

import { uploadImage, validateImage } from "../utils/uploadImage";
import { findUser } from "../utils/user";
import { findFriends } from "../utils/relation";
import { NotificationType } from "../generated/prisma";

export const addPost = async (c: Context) => {
  const userId = c.get("userId");

  try {
    // const { title } = (await c.req.json()) || null;
    
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

    const post = await prisma.post.create({
      data: {
        posterId: userId,
        title,
      },
    });
    let result;

    if (image) {
      if (!(image instanceof File)) {
        return c.json({ msg: "invalid" });
      }
      formDataToSend = await validateImage(image);

      result = await uploadImage(formDataToSend);

      await prisma.image.create({
        data: {
          postId: post.postId,
          url: result.secure_url,
        },
      });
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
    console.log("Error during file upload:", e);

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
    const posts = await prisma.post.findMany({
      where: {
        posterId: userId,
      },
      include: {
        images: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            pfp: true,
          },
        },
      },
    });
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
  const posts = await prisma.post.findMany({
    where: {},
    include: {
      images: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          pfp: true,
          middleName: true,
          userId: true,
        },
      },
    },
  });
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
    const post = await prisma.post.findUnique({
      where: {
        postId: postId,
      },
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
      },
    });

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
