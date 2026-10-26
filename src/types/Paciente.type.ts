import { z } from 'zod';

export interface DireccionPaciente {
  calle: string;
  numero: string;
  piso: string;
  departamento: string;
  barrio: string;
}

export interface TelefonoPaciente {
  tipo: TipoTelefono;
  codigoPais: string;
  codigoArea: string;
  numero: string;
}

export interface ObraSocialPaciente {
  obraSocialNombre: ObraSocial;
  numeroAfiliado: string;
}

export interface IPaciente {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  sexo: string;
  fechaDeNacimiento: string;
  direccion: DireccionPaciente;
  telefono: TelefonoPaciente;
  obraSocial: ObraSocialPaciente;
}

export enum ObraSocial {
    PAMI = 'PAMI',
    OSPEL = 'OSPEL',
    OSDE = 'OSDE',
    SANCOR = 'SANCOR',
    OSECAC = 'OSECAC',
    SWISS_MEDICAL = 'SWISS MEDICAL',
    GALENO = 'GALENO',
    MEDICUS = 'MEDICUS',
    OMINT = 'OMINT',
    FEMEBA = 'FEMEBA',
    OTRAS = 'OTRAS',
    NINGUNA = 'NINGUNA',
}

export enum TipoTelefono {
    CELULAR = 'CELULAR',
    FIJO = 'FIJO'
}

export enum TipoSexo {
    FEMENINO = 'FEMENINO',
    MASCULINO = 'MASCULINO'
}



// idem a medicos
export const direccionSchema = z.object({
    calle: z.string(),
    numero: z.string(),
    piso: z.string().optional().default(""),
    departamento: z.string().optional().default(""),
    barrio: z.string().optional().default("")
});
//idem a medicos
export const telefonoSchema = z.object({
    tipo: z.enum(TipoTelefono).optional().default(TipoTelefono.CELULAR),
    codigoPais: z.string(),
    codigoArea: z.string(),
    numero: z.string()
});
//
export const pacienteSchema = z.object({
    nombre: z.string(),
    dni: z.string(),
    fechaDeNacimiento : z.iso.date(),
    sexo : z.enum(TipoSexo),
    direccion: direccionSchema,
    email: z.email(),
    telefono: telefonoSchema,
    obraSocial: z.object({
        nombreObraSocial: z.enum(ObraSocial),
        numeroAfiliado: z.string().optional().default("")
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string()
});

export const crearPacienteSchema = z.object({
    nombre: z.string().min(2, "El nombre del paciente es obligatorio"),
    dni: z.string().min(7, "DNI invalido debe tener al menos 7 digitos"),
    fechaDeNacimiento : z.iso.date(),
    sexo : z.enum(TipoSexo),
    direccion: direccionSchema,
    email: z.email('Email invalido'),
    telefono: telefonoSchema,
    obraSocial: z.object({
        nombreObraSocial: z.enum(ObraSocial),
        numeroAfiliado: z.string().optional().default("")
    })
});

export type IcrearPacienteDTO = z.input<typeof crearPacienteSchema>;

/*z.input → tipa los datos antes de validar (entrada).
  z.infer → tipa los datos después de validar/transformar (salida).
*/