import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { prisma } from "~/server/db";

export default protectedProcedure
.meta({ openapi: { method: 'GET', path: '/me' } })
  .query(async ({ input, ctx }) => {
    const user = await prisma.user.findUnique({ where: { id: ctx.session.user.id } });

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    return {
      identifier: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdDate: user.createdDate,
    };
  });