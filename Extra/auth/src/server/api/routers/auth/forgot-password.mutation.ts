import { prisma } from "~/server/db";
import { protectedProcedure } from "../../trpc";
import { ForgotPasswordSchema } from "./forgot-password.schema";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { sendForgotPasswordLink } from "~/server/service/emailing/EmailingService";

const PASSWORD_RESET_EXPIRY_HOURS = 6;
const RECENT_MAX_ATTEMPTS = 3;
const RECENT_PERIOD_IN_MINUTES = 5;

export default protectedProcedure
  .input(ForgotPasswordSchema)
  .mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) return { message: "password_reset_email_sent" };

    const expiry = dayjs().add(PASSWORD_RESET_EXPIRY_HOURS, "hours").toDate();
    const resetPasswordRequest = await prisma.resetPasswordRequest.create({
      data: {
        email: user.email,
        expires: expiry,
      },
    });

    const recentPasswordRequestsCount = await prisma.resetPasswordRequest.count(
      {
        where: {
          email: user.email,
          createdAt: {
            gt: dayjs().subtract(RECENT_PERIOD_IN_MINUTES, "minutes").toDate(),
          },
        },
      }
    );
    if (recentPasswordRequestsCount >= RECENT_MAX_ATTEMPTS) {
      throw new Error(
        "Too many password reset attempts. Please try again later."
      );
    }

    await sendForgotPasswordLink({
      user: {
        name: user.name,
        email: user.email,
      },
      resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordRequest.id}`,
    });
  });
