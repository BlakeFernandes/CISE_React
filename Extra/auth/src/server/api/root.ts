import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";

export const appRouter = createTRPCRouter({
  authRouter: authRouter,
});

export type AppRouter = typeof appRouter;
