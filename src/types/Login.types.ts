import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Formato de email invalido" }), //z.email("Formato de email invalido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginDTO = z.infer<typeof loginSchema>;