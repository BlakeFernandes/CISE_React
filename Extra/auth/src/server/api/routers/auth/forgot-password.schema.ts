import z from "zod";

export const ForgotPasswordSchema = z.object({
    email: z.string().email().toLowerCase(),
});

export type TForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;