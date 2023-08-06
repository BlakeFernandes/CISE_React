import { createTRPCRouter } from "../trpc";
import signUpMutation from "./auth/signUp.mutation";
import meQuery from "./auth/me.query";
import forgotPasswordMutation from "./auth/forgot-password.mutation";

export const authRouter = createTRPCRouter({
  signUp: signUpMutation,
  me: meQuery,
  forgotPassword: forgotPasswordMutation
});
