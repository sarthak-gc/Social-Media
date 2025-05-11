import { PrismaClient } from "../generated/prisma";
import { Context } from "hono";

let prisma: PrismaClient | null = null;

export const getPrisma = (c: Context): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};
