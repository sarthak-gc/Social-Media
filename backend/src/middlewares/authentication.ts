import { Context } from "hono";
import { getCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import { getPrisma } from "../utils/getPrisma";
import { findUser } from "../utils/connection";

export const authenticate = async (c: Context, next: any) => {
  try {
    const token = getCookie(c, "token");

    if (!token) {
      return c.json(
        {
          status: "error",
          message: "Token not found",
        },
        401
      );
    }

    const decoded = jwt.verify(token, "secret") as { userId: string };

    const prisma = getPrisma(c);
    const user = await findUser(prisma, decoded.userId);

    if (!user) {
      return c.json(
        {
          status: "error",
          message: "User not found",
        },
        401
      );
    }

    c.set("userId", decoded.userId);

    await next();
  } catch (e) {
    return c.json(
      {
        status: "error",
        message: "Invalid or expired token",
      },
      401
    );
  }
};
