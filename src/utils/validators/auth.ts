import * as z from "zod"


export const authSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(5, {
            message: "Password must be at least 5 characters long",
        })
        .max(100),
});

export const authSchemaRegister = z.object({
    username: z.string().min(3, { message: "Username must be longer than 3 characters" }),
    email: z.string().email(),
    password: z.string()
        .min(5, {
            message: "Password must be at least 5 characters long",
        })
        .max(100),
});