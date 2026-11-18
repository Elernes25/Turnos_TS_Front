import { z } from 'zod';

export enum Sexo {
  FEMENINO = 'FEMENINO',
  MASCULINO = 'MASCULINO',
}

export enum GrupoSanguineo {
  A_POSITIVO = 'A+',
  A_NEGATIVO = 'A-',
  B_POSITIVO = 'B+',
  B_NEGATIVO = 'B-',
  AB_POSITIVO = 'AB+',
  AB_NEGATIVO = 'AB-',
  O_POSITIVO = 'O+',
  O_NEGATIVO = 'O-',
  NO_SABE = 'NO SABE',
}

export interface IConsultaClinica {
  fecha: string;
  medicoID: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  indicaciones: string;
  observaciones?: string;
}

export interface IHistoriaClinica {
  id?: string;
  pacienteID: string;
  datosClinicos: {
    sexo: Sexo;
    grupoSanguineo?: GrupoSanguineo;
  };
  antecedentes: {
    alergias: string[];
    cirugias: string[];
    enfermedadesCronicas: string[];
    historiaGeneral: string;
  };
  consultas: IConsultaClinica[];
  createdAt?: string;
  updatedAt?: string;
}

export const consultaClinicaSchema = z.object({
  fecha: z.string(),
  medicoID: z.string(),
  motivoConsulta: z.string(),
  diagnostico: z.string(),
  tratamiento: z.string(),
  indicaciones: z.string(),
  observaciones: z.string().optional(),
});

export const historiaClinicaSchema = z.object({
  id: z.string().optional(),
  pacienteID: z.string(),
  datosClinicos: z.object({
    sexo: z.enum(Sexo),
    grupoSanguineo: z.enum(GrupoSanguineo).optional(),
  }),
  antecedentes: z.object({
    alergias: z.array(z.string()),
    cirugias: z.array(z.string()),
    enfermedadesCronicas: z.array(z.string()),
    historiaGeneral: z.string(),
  }),
  consultas: z.array(consultaClinicaSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const crearHistoriaClinicaSchema = z.object({
  pacienteID: z.string().min(1),
  datosClinicos: z.object({
    sexo: z.enum(Sexo),
    grupoSanguineo: z.enum(GrupoSanguineo).optional(),
  }),
  antecedentes: z.object({
    alergias: z.array(z.string()),
    cirugias: z.array(z.string()),
    enfermedadesCronicas: z.array(z.string()),
    historiaGeneral: z.string(),
  }),
  consultas: z.array(consultaClinicaSchema),
});

export type ICrearHistoriaClinicaDTO = z.input<typeof crearHistoriaClinicaSchema>;
