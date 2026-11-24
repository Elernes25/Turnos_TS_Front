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

export interface IHistoriaClinica {
  id?: string;
  pacienteId: string;
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
  modificacion: {
    medicoId: string;
    fecha: string;
  };
  createdAt?: string;
  updatedAt?: string;
}


export const historiaClinicaSchema = z.object({
  id: z.string().optional(),
  pacienteId: z.string(),
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
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const crearHistoriaClinicaSchema = z.object({
  pacienteId: z.string().min(1),
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
  modificacion: z.object({ 
    medicoId:z.string().min(1),
    fecha: z.coerce.date()
  })

  //consultas: z.array(consultaClinicaSchema),
});

export type ICrearHistoriaClinicaDTO = z.input<typeof crearHistoriaClinicaSchema>;
