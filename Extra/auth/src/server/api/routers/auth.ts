import { hash } from "bcryptjs";

import { createTRPCRouter } from "../trpc";
import { SignUpSchema } from "./auth.handler";
import { publicProcedure } from "../trpc";
import { prisma } from "~/server/db";

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(SignUpSchema).mutation(async ({ input, ctx }) => {
    const user = await prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });

    if (user) {
      throw new Error("Email address is already registered");
    }

    const hashedPassword = await hashPassword(input.password);

    await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
      },
    });
  }),
});
