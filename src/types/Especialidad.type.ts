import { z } from 'zod';

export interface IEspecialidad {
  id: string;
  nombre: string;
  descripcion?: string;
}

export const crearEspecialidadSchema = z.object({
    nombre: z.string().min(2, "el nombre es obligatorio"),
    descripcion: z.string().optional()
});

export type IcrearEspecialidadDTO = z.input<typeof crearEspecialidadSchema>;