import { z } from 'zod';
export enum TipoTelefono {
    CELULAR = 'CELULAR',
    FIJO = 'FIJO'
}

export interface DireccionMedico {
  calle: string;
  numero: string;
  piso: string;
  departamento: string;
  barrio: string;
}

export interface TelefonoMedico {
  tipo: TipoTelefono;
  codigoPais: string;
  codigoArea: string;
  numero: string;
}

export interface IMedico {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  direccion: DireccionMedico;
  telefono: TelefonoMedico;
  especialidad: string;
  matriculaNumero: string;
}

export const direccionSchema = z.object({
    calle: z.string(),
    numero: z.string(),
    piso: z.string().optional().default(""),
    departamento: z.string().optional().default(""),
    barrio: z.string().optional().default("")
});

export const telefonoSchema = z.object({
    tipo: z.enum(TipoTelefono).optional().default(TipoTelefono.CELULAR),
    codigoPais: z.string(),
    codigoArea: z.string(),
    numero: z.string()
});

export const crearMedicoSchema = z.object({
    nombre: z.string().min(2, "el nombre es obligatorio"),
    dni: z.string().min(7, "DNI invalido"),
    direccion: direccionSchema,
    email: z.email('Email invalido'),
    telefono: telefonoSchema,
    especialidad: z.string().min(2, "La especialidad es obligatoria"),
    matriculaNumero: z.string().min(2, "El número de matrícula es obligatorio") 
});

export type IcrearMedicoDTO = z.input<typeof crearMedicoSchema>;