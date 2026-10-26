/**************************************************** */
/*interfaces para la estructura que viene del backend */
/**************************************************** */ 
/*
export interface ITurno {
	paciente: IPaciente;
    //paciente: pacienteSchema.nullish(),
	//paciente: IPaciente | null ; //por si se creo el turno pero despues se borra el paciente en mongo, no encontraria el id y seria null
    //se podria validar primero que antes de borrar un paciente no tenga algun turno asignado//
	especialidad: string;
	fechaTurno: string;
	estado: 'pendiente' | 'atendido' | 'cancelado';
	observaciones: string;
	activo: boolean;
	createdAt: string;
	updatedAt: string;
	id: string;
}*/
// directamente vuelan las interfases tipicas
// solo habra interfases para tipar las Props 

import { z } from 'zod';
import { pacienteSchema } from './Paciente.type';

export const turnoSchema = z.object({
	//paciente: pacienteSchema.nullish(),
	paciente: pacienteSchema.nullable(),
	especialidad: z.string(),
	fechaTurno: z.string(),
	estado: z.enum(['pendiente', 'atendido', 'cancelado']),
	observaciones: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	id: z.string()
});

export type ITurno = z.infer<typeof turnoSchema>;

/* esto es lo del profe ver diferencia entre nullish y nullable
	paciente: pacienteSchema.nullable(),    <----
	medicoId: z.string().optional(),		<----
	especialidad: z.enum(Especialidad),
	fechaTurno: z.string(),
	estado: z.enum(EstadoTurno).optional(),
	observaciones: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	id: z.string()
*/