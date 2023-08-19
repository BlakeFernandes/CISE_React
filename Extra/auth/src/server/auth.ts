import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { encode } from "next-auth/jwt";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { checkRateLimitAndThrowError } from "./middleware/checkRateLimitAndThrowError";
import { ErrorCode } from "./utils/ErrorCode";

const { client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET } = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
};

const PROVIDERS = [
  // EmailProvider({
  //   type: "email",
  //   maxAge: 10 * 60 * 60,
  //   sendVertificationRequest: async ({ identifier, url, token, baseUrl, provider }) => {
  //     sendVertificationRequest({ identifier, url, token, baseUrl, provider });
  //   },
  // }),
  CredentialsProvider({
    id: "credentials",
    name: "chrono.ly",
    credentials: {
      email: {
        label: "Email Address",
        type: "email",
        placeholder: "john.doe@example.com",
      },
      password: {
        label: "Password",
        type: "password",
        placeholder: "Your super secure password",
      },
      totpCode: {
        label: "Two-factor Code",
        type: "input",
        placeholder: "Code from authenticator app",
      },
    },
    async authorize(credentials, req) {
      if (!credentials) {
        console.error(`Credentials are missing`);
        throw new Error(ErrorCode.InternalServerError);
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLocaleLowerCase() },
      });

      await checkRateLimitAndThrowError({
        identifier: credentials.email,
      });

      if (!user) {
        throw new Error(ErrorCode.IncorrectEmailPassword);
      }

      if (user.password && !credentials.totpCode) {
        if (!user.password) {
          throw new Error(ErrorCode.IncorrectEmailPassword);
        }
        const isCorrectPassword = await compare(
          credentials.password,
          user.password
        );
        if (!isCorrectPassword) {
          throw new Error(ErrorCode.IncorrectEmailPassword);
        }
      }

      return {
        id: user.id,
        email: user.email,
      };
    },
  }),
];

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  PROVIDERS.push(
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID ?? "",
      clientSecret: GOOGLE_CLIENT_SECRET ?? "",
    })
  );
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const AUTH_OPTIONS: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: PROVIDERS,
  callbacks: {
    signIn({ user, account, profile, email, credentials }) {
      if (!user.email) return false;

      if (account?.provider) {
        console.log(profile);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-error TODO validate email_verified key on profile
        user.email_verified =
          !!user.email_verified ||
          !!user.emailVerified ||
          !!profile?.email_verified;

        return true;
      }

      return false;
    },
  },
};

// /**
//  * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
//  *
//  * @see https://next-auth.js.org/configuration/nextjs
//  */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, AUTH_OPTIONS);
};
