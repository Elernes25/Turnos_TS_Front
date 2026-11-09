/**************************************************** */
/*interfaces para la estructura que viene del backend */
/**************************************************** */ 

import { z } from 'zod';
import { pacienteSchema } from './Paciente.type';
import { crearEspecialidadSchema } from './Especialidad.type';

// Médico liviano embebido en el turno (lo que devuelve el backend con populate).
export const medicoDelTurnoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  numeroMatricula: z.string().optional(),
  especialidad: z
    .array(z.object({ id: z.string(), nombre: z.string() }))
    .optional(),
});

export const turnoSchema = z.object({
  paciente: pacienteSchema.nullable(),
  especialidad: crearEspecialidadSchema,
  medico: medicoDelTurnoSchema.nullable().optional(),
  // compat: medicoID / medicoId (CrearTurnoDTO del backend)
  medicoID: z.string().optional(),
  medicoId: z.string().optional(),
  fechaTurno: z.string(),
  estado: z.enum(['pendiente', 'atendido', 'cancelado']),
  observaciones: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  id: z.string(),
});

export type ITurno = z.infer<typeof turnoSchema>;

/**************************************************** */
/* Alta de turno — CrearTurnoDTO del backend           */
/* { pacienteID, especialidadID, medicoID, fechaTurno }*/
/**************************************************** */
export const crearTurnoSchema = z
  .object({
    pacienteID: z
      .string({ error: 'Seleccioná un paciente' })
      .min(1, 'Seleccioná un paciente'),
    especialidadID: z
      .string({ error: 'La especialidad es obligatoria' })
      .min(1, 'La especialidad es obligatoria'),
    medicoID: z.string().optional(),
    fechaTurno: z
      .string({ error: 'La fecha y hora son obligatorias' })
      .min(1, 'La fecha y hora son obligatorias')
      .refine((f) => !Number.isNaN(new Date(f).getTime()), {
        error: 'Fecha y hora inválidas',
      }),
    observaciones: z.string().max(280, 'Máximo 280 caracteres').optional(),
    urgencia: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const fecha = new Date(data.fechaTurno);
    if (data.urgencia) return; // guardia: admite fecha de hoy sin restricción horaria
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    if (fecha < inicioHoy) {
      ctx.addIssue({
        code: 'custom',
        path: ['fechaTurno'],
        message: 'La fecha no puede ser anterior a hoy',
      });
    }
  });

export type ICrearTurnoDTO = z.infer<typeof crearTurnoSchema>;

/** Lo que realmente se POSTea a /turnos (forma del backend). */
export interface TurnoPayloadBackend {
  pacienteID: string;
  especialidadID: string;
  medicoID?: string;
  fechaTurno: string;
  observaciones?: string;
}
