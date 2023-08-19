import z from "zod";
import { password } from "./signUp.schema";

export const ResetPasswordSchema = z.object({
    password: password,
    newPassword: password,
});

export type TResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;