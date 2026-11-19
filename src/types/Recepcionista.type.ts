import { z } from 'zod';
import { direccionSchema, telefonoSchema } from './Medico.type';

export interface ICredencialesRecepcionista {
    user: string;
    password: string;
}

export const crearRecepcionistaSchema = z.object({
    nombre: z.string().trim().min(2, 'El nombre es obligatorio'),
    dni: z.string().trim().regex(/^\d{7,8}$/, 'El DNI debe tener entre 7 y 8 dígitos, sin puntos'),
    direccion: direccionSchema,
    email: z.email('Email inválido'),
    telefono: telefonoSchema,
    usuario: z.object({
        password: z.string().min(7, 'La contraseña debe tener al menos 7 caracteres'),
    }).optional(),
});

export type ICrearRecepcionistaDTO = z.input<typeof crearRecepcionistaSchema>;
export type ICrearRecepcionistaRequest = Omit<ICrearRecepcionistaDTO, 'usuario'> & {
    usuario: ICredencialesRecepcionista;
};
