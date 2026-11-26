import { z } from 'zod';

interface ConsultaClinicaReferencia {
  id?: string;
  _id?: string;
  nombre?: string;
  fechaDeNacimiento?: string;
}

export interface IConsultaClinica {
  id?: string;
  _id?: string;
  fecha: string;
  pacienteId: string | ConsultaClinicaReferencia | null;
  medicoId: string | ConsultaClinicaReferencia | null;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  indicaciones: string;
  observaciones?: string;
}

export const consultaClinicaSchema = z.object({
  pacienteId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID paciente inválido'),
  medicoId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID médico inválido'),
  motivoConsulta: z.string().min(1, 'El motivo de la consulta es obligatorio'),
  diagnostico: z.string().min(1, 'El diagnóstico es obligatorio'),
  tratamiento: z.string().min(1, 'El tratamiento es obligatorio'),
  indicaciones: z.string().min(1, 'Las indicaciones son obligatorias'),
  observaciones: z.string().optional().default(''),
}).strict();

export const consultaClinicaFormSchema = consultaClinicaSchema.omit({
  pacienteId: true,
  medicoId: true,
});

export type ICrearConsultaClinicaDTO = z.input<typeof consultaClinicaSchema>;
export type IConsultaClinicaFormData = z.input<typeof consultaClinicaFormSchema>;
export type IConsultaClinicaFormOutput = z.output<typeof consultaClinicaFormSchema>;