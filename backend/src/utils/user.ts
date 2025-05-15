import { PrismaClient } from "../generated/prisma";

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
