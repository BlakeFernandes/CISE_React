import { randomBytes } from "crypto";
import { checkRateLimitAndThrowError } from "../middleware/checkRateLimitAndThrowError";
import { prisma } from "../db";

interface VerifyEmailType {
  email: string;
}

export const sendEmailVerification = async ({ email }: VerifyEmailType) => {
  const token = randomBytes(32).toString("hex");

  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: email,
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 3600 * 1000), // +1 day
    },
  });

  const params = new URLSearchParams({
    token,
  });

  await sendEmailVerificationLink({
    verificationEmailLink: `${WEBAPP_URL}/api/auth/verify-email?${params.toString()}`,
    user: {
      email,
    },
  });

  return true;
};
