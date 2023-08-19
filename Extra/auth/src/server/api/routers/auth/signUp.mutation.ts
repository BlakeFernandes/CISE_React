import { publicProcedure } from "../../trpc";
import { hash } from "bcryptjs";
import { SignUpSchema } from "../auth.handler";
import { prisma } from "~/server/db";

export default publicProcedure
  .input(SignUpSchema)
  .mutation(async ({ input, ctx }) => {
    const user = await prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });

    if (user) {
      throw new Error("Email address is already registered");
    }

    const hashedPassword = await hash(input.password, 12);

    await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
      },
    });
  });
