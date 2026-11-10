import { z } from 'zod';
import type { IEspecialidad } from './Especialidad.type';

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
  especialidad: IEspecialidad[];
  numeroMatricula: string;
}

export const direccionSchema = z.object({
    calle: z.string().trim().min(1, { error: "La calle es obligatoria" }),
    numero: z.string().trim().min(1, { error: "El número es obligatorio" }),
    piso: z.string().optional().default(""),
    departamento: z.string().optional().default(""),
    barrio: z.string().optional().default("")
});

export const telefonoSchema = z.object({
    tipo: z.enum(TipoTelefono),
    codigoPais: z.string().trim().min(1, { error: "Código de país obligatorio" }),
    codigoArea: z.string().trim().min(1, { error: "Código de área obligatorio" }),
    numero: z.string().trim().min(1, { error: "El número es obligatorio" })
});

export const crearMedicoSchema = z.object({
    nombre: z.string().min(2, "el nombre es obligatorio"),
    dni: z.string({ error: "El DNI es obligatorio" }).trim().regex(/^\d{7,8}$/, { error: "El DNI debe tener entre 7 y 8 dígitos, sin puntos" }),
    direccion: direccionSchema,
    email: z.email('Email invalido'),
    telefono: telefonoSchema,
    especialidad:z.array(z.string("La especialidad es obligatoria")), 
    numeroMatricula: z.string().min(2, "El número de matrícula es obligatorio") 
});

export type IcrearMedicoDTO = z.input<typeof crearMedicoSchema>;

export const medicoDetalleSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  dni: z.string(),
  email: z.string().email(),
  direccion: direccionSchema,
  telefono: telefonoSchema,
  numeroMatricula: z.string(),

  especialidad: z.array(
    z.object({
      id: z.string(),
      nombre: z.string(),
    })
  ),
});

export type ImedicoDetalleSchema = z.input< typeof medicoDetalleSchema >

export const medicoListadoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  numeroMatricula: z.string(),
  especialidad: z.array(
    z.object({
      id: z.string(),
      nombre: z.string(),
    })
  ),
  // agenda: idealmente trae dias/rangos. Compat: backend actual (/medicos/conAgenda)
  // solo devuelve duracionTurnoMinutos; si faltan dias, la UI avisa que falta detalle.
  agenda: z
    .object({
      duracionTurnoMinutos: z.number(),
      dias: z
        .array(
          z.object({
            diaSemana: z.string(),
            rangos: z.array(
              z.object({
                horaInicio: z.string(),
                horaFin: z.string(),
              }),
            ),
          }),
        )
        .optional(),
      _id: z.string().optional(),
      medicoId: z.string().optional(),
    })
    .nullable(),
});

export const medicosListadoSchema = z.array(medicoListadoSchema);
export type IMedicoListado = z.infer<typeof medicoListadoSchema>;

