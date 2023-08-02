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

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

// const GOOGLE_API_CREDENTIALS = process.env.GOOGLE_API_CREDENTIALS ?? "{}";
// const { client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET } = JSON.parse(GOOGLE_API_CREDENTIALS)?.web || {};
// const GOOGLE_LOGIN_ENABLED = process.env.GOOGLE_LOGIN_ENABLED === "true";
// const IS_GOOGLE_LOGIN_ENABLED = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_LOGIN_ENABLED);

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
      email: { label: "Email Address", type: "email", placeholder: "john.doe@example.com" },
      password: { label: "Password", type: "password", placeholder: "Your super secure password" },
      totpCode: { label: "Two-factor Code", type: "input", placeholder: "Code from authenticator app" },
    },
    async authorize(credentials, req) {
      console.log('Checking creds');
      
      if (!credentials) {
        console.error(`Credentials are missing`);
        throw new Error(ErrorCode.InternalServerError);
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLocaleLowerCase() },
      })

      if (!user) {
        throw new Error(ErrorCode.IncorrectEmailPassword);
      }

      await checkRateLimitAndThrowError({
        identifier: user.email,
      });

      if (user.password && !credentials.totpCode) {
        if (!user.password) {
          throw new Error(ErrorCode.IncorrectEmailPassword);
        }
        const isCorrectPassword = await compare(credentials.password, user.password);
        if (!isCorrectPassword) {
          throw new Error(ErrorCode.IncorrectEmailPassword);
        }
      }

      return {
        id: user.id,
        email: user.email,
      }
    }
  })
]

// if (IS_GOOGLE_LOGIN_ENABLED) {
//   PROVIDERS.push([
//     GoogleProvider({
//       clientId: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//     }),
//   ])
// }

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
