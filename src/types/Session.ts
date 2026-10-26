import { z } from 'zod';
import { userRolSchema } from './Usuario.type';

export const sessionPayloadSchema = z.object({
    id: z.string(),
    user: z.string(),
    rol: userRolSchema,
    activo: z.boolean(),
    debeCambiarPassword:z.boolean(),
    exp: z.number().optional(),
});

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

