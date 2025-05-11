import { Context } from "hono";
import { getPrisma } from "../utils/getPrisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "hono/cookie";
import { findFriends, findUser } from "../utils/connection";

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

    const token = jwt.sign({ user: user.userId }, "secret");

    setCookie(c, "token", token, {
      sameSite: "Lax",
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

    const hashedPassword = await bcrypt.hash(password, 12);
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

    const token = jwt.sign({ user: user.userId }, "secret");
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
    const friends = await prisma.relation.findMany({
      where: {
        OR: [
          { initiator: userId, type: "FRIENDS" },
          { sender: userId, type: "FRIENDS" },
        ],
      },
    });

    const me = await prisma.user.findFirst({
      where: {
        userId,
      },
      select: {
        userId: true,
        email: true,
        lastName: true,
        firstName: true,
      },
    });

    return c.json({
      status: "success",
      message: "personal data retrieved",
      data: {
        me: {
          me,
          friends,
        },
      },
    });
  } catch (e) {
    return c.json(
      { status: "error", message: "An unexpected error occurred" },
      500
    );
  }
};
export const getUser = async (c: Context) => {
  const targetId = c.req.param().profileId;

  if (!targetId) {
    return;
  }
  const prisma = getPrisma(c);
  try {
    const user = findUser(prisma, targetId);

    if (!user) {
      return;
    }
    return c.json({
      status: "success",
      message: "User data received",
      data: {
        user,
      },
    });
  } catch (e) {
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
    const friends = findFriends(prisma, targetId);

    return c.json({
      status: "error",
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
