import z from "zod";

export const SignUpSchema = z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(7),
    apiError: z.string().optional(),
});

export type TSignUpSchema = z.infer<typeof SignUpSchema>;