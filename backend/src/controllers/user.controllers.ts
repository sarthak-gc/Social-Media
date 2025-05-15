import { Context } from "hono";
import { getPrisma } from "../utils/getPrisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "hono/cookie";

import { faker } from "@faker-js/faker";
import { uploadImage, validateImage } from "../utils/uploadImage";
import { findFriends, findRelation, getStatus } from "../utils/relation";
import { findUser } from "../utils/user";
import { findRequest, findSentRequest } from "../utils/request";

export const register = async (c: Context) => {
  try {
    const { email, password, firstName, lastName, middleName } =
      await c.req.json();

    const prisma = getPrisma(c);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        middleName,
      },
    });

    if (!user) {
      return c.json(
        {
          status: "error",
          message: "Something went wrong",
        },
        404
      );
    }

    const token = jwt.sign({ userId: user.userId }, "secret");

    setCookie(c, "token", token, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
    });

    return c.json({
      status: "success",
      message: "Registration successful",
      data: {
        userId: user.userId,
        token,
      },
    });
  } catch (e) {
    console.log(e);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const prisma = getPrisma(c);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return c.json(
        {
          status: "error",
          message: "User not found",
        },
        404
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return c.json(
        {
          status: "error",
          message: "Invalid credentials",
        },
        401
      );
    }

    const token = jwt.sign({ userId: user.userId }, "secret");
    setCookie(c, "token", token, {
      sameSite: "Lax",
      secure: true,
      httpOnly: true,
    });
    return c.json({
      status: "success",
      message: "Login successful",
      data: {
        userId: user.userId,
        token,
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const logout = async (c: Context) => {
  setCookie(c, "token", "");
  return c.json({
    status: "success",
    message: "Logout successful",
  });
};

export const aboutMe = async (c: Context) => {
  const userId = c.get("userId");

  const prisma = getPrisma(c);

  try {
    const friends = await findFriends(prisma, userId);

    const me = await prisma.user.findFirst({
      where: {
        userId,
      },
      select: {
        userId: true,
        email: true,
        lastName: true,
        firstName: true,
        pfp: true,
      },
    });

    return c.json({
      status: "success",
      message: "personal data retrieved",
      data: {
        me,
        friends,
      },
    });
  } catch (e) {
    console.log(e);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getUser = async (c: Context) => {
  const userId = c.get("userId");
  const targetId = c.req.param().profileId;

  if (!targetId) {
    return;
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
          user,
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
          user,
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
        user,
        status,
      },
    });
  } catch (e) {
    console.log(e);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getFriends = async (c: Context) => {
  const targetId = c.req.param().profileId;
  const prisma = getPrisma(c);
  try {
    const friends = await findFriends(prisma, targetId);

    return c.json({
      status: "success",
      message: "User's friends retrieved",
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

export const changePfp = async (c: Context) => {
  const userId = c.get("userId");

  const formData = await c.req.formData();

  const image = formData.get("image") as File;

  if (!(image instanceof File)) {
    return c.json({ msg: "invalid" });
  }

  const formDataToSend = await validateImage(image);
  const prisma = getPrisma(c);

  try {
    const result = await uploadImage(formDataToSend);

    await prisma.user.update({
      where: {
        userId,
      },
      data: {
        pfp: result.secure_url,
      },
    });
    return c.json({
      status: "success",
      message: "Pfp uploaded",
      data: {
        url: result.secure_url,
      },
    });
  } catch (e) {
    console.log(e);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const getUsers = async (c: Context) => {
  const userId = c.get("userId");
  const username = c.req.param().name;
  const prisma = getPrisma(c);

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: username, mode: "insensitive" } },
          { middleName: { contains: username, mode: "insensitive" } },
          { lastName: { contains: username, mode: "insensitive" } },
          { email: { contains: username, mode: "insensitive" } },
        ],
        NOT: [{ userId }],
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

    if (!users.length) {
      return c.json({
        status: "success",
        message: "No users found",
        data: {
          users: [],
        },
      });
    }

    return c.json({
      status: "success",
      message: "Users found",
      data: {
        users,
      },
    });
  } catch (e) {
    console.log(e);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const updateMe = async (c: Context) => {
  const userId = c.get("userId");
  const { firstName, lastName, middleName } = await c.req.json();

  if (!firstName && !lastName && !middleName) {
    return c.json({ status: "error", message: "Nothing to update" }, 409);
  }

  const prisma = getPrisma(c);
  let updatedData: any = {};

  if (firstName) updatedData.firstName = firstName;
  if (middleName) updatedData.middleName = middleName;
  if (lastName) updatedData.lastName = lastName;
  try {
    await prisma.user.update({
      where: {
        userId,
      },
      data: {
        ...updatedData,
      },
    });
    return c.json({
      status: "success",
      message: "User Updated",
    });
  } catch (e) {
    console.log(e);
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};

export const seed = async (c: Context) => {
  const prisma = getPrisma(c);
  const credentials: Record<string, string> = {};

  try {
    for (let i = 0; i < 10; i++) {
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          password: hashedPassword,
          firstName: faker.person.firstName(),
          middleName: faker.person.middleName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          pfp: faker.image.avatar(),
        },
      });

      credentials[user.email] = password;

      for (let j = 0; j < 2; j++) {
        await prisma.post.create({
          data: {
            posterId: user.userId,
            title: faker.lorem.sentence(),
          },
        });
      }

      console.log(`Created user ${user.email} : ${password}`);
    }

    return c.text("DONE");
  } catch (error) {
    console.error("Error seeding database:", error);
    return c.text("Failed");
  } finally {
    await prisma.$disconnect();
  }
};
