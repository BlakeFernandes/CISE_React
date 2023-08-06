import z from "zod";

export const password = z.string().min(7);

export const SignUpSchema = z.object({
    email: z.string().email().toLowerCase(),
    password: password,
    apiError: z.string().optional(),
});

export type TSignUpSchema = z.infer<typeof SignUpSchema>;