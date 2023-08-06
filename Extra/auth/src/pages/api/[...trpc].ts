import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createOpenApiNextHandler } from 'trpc-openapi';

export default createOpenApiNextHandler({
  router: appRouter,
  createContext: createTRPCContext,
});