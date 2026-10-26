import { z } from 'zod';

export enum RolUsuario {
    ADMIN = 'ADMIN',
    SUPERVISOR = 'SUPERVISOR',
    MEDICO = 'MEDICO',
    RECEPCIONISTA = 'RECEPCIONISTA',
    PACIENTE = 'PACIENTE',
}

/* para decodificar el JWT para poder proteger rutas por Rol */
export interface ITokenPayload {
    id: string;
    user: string;
    rol: RolUsuario;
    activo: boolean;
    debeCambiarPassword:boolean;
    exp?: number;
}

// Schema de Zod para validar roles 
export const userRolSchema = z.enum(RolUsuario);

export const crearUsuarioSchema = z.object({
    user: z.string().min(4, 'El usuario debe tener al menos 4 caracteres'),
    dni: z.string().min(7, 'El DNI debe tener al menos 7 dígitos'),
    email: z.email('Formato de email inválido'),
    password: z.string().min(7, 'La contraseña debe tener al menos 7 caracteres'),
    rol: userRolSchema,
    // activo: z.boolean(),
    // fechaCreacion: z.string(),
    // debeCambiarPassword: z.boolean(),
});

export type ICrearUsuarioDTO = z.infer<typeof crearUsuarioSchema>;
export type IRolUsuario = z.infer<typeof userRolSchema>;
