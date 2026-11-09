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
  nombreObraSocial: string;
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
 
/*export enum ObraSocial {
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
*/
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
    calle: z.string().trim().min(1, { error: "La calle es obligatoria" }),
    numero: z.string().trim().min(1, { error: "El número es obligatorio" }),
    piso: z.string().optional().default(""),
    departamento: z.string().optional().default(""),
    barrio: z.string().optional().default("")
});
//idem a medicos
export const telefonoSchema = z.object({
    tipo: z.enum(TipoTelefono),
    codigoPais: z.string().trim().min(1, { error: "Código de país obligatorio" }),
    codigoArea: z.string().trim().min(1, { error: "Código de área obligatorio" }),
    numero: z.string().trim().min(1, { error: "El número es obligatorio" })
});
//
export const pacienteSchema = z.object({  //se usa en turno
    nombre: z.string(),
    dni: z.string({ error: "El DNI es obligatorio" }).trim().regex(/^\d{7,8}$/, { error: "El DNI debe tener entre 7 y 8 dígitos, sin puntos" }),
    fechaDeNacimiento: z
        .string()
        .min(1, { error: "La fecha de nacimiento es obligatoria" })
        .pipe(z.iso.date({ error: "Fecha inválida" }))
        .refine((f) => new Date(f) <= new Date(), { error: "La fecha no puede ser futura" }),
    sexo : z.enum(TipoSexo),
    direccion: direccionSchema,
    email:z.union([z.email({ error: "Email inválido" }), z.literal("")]).optional(),
    telefono: telefonoSchema,
    obraSocial: z.object({
        obraSocialID: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "Obra social inválida" }).or(z.literal("")),
        numeroAfiliado: z.string().trim().default("")
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string()
});

export const crearPacienteSchema = z.object({
    nombre: z.string().min(2, "El nombre del paciente es obligatorio"),
    dni: z.string({ error: "El DNI es obligatorio" }).trim().regex(/^\d{7,8}$/, { error: "El DNI debe tener entre 7 y 8 dígitos, sin puntos" }),
    fechaDeNacimiento: z.string().min(1, { error: "La fecha de nacimiento es obligatoria" })
        .pipe(z.iso.date({ error: "Fecha inválida" })).refine((f) => new Date(f) <= new Date(), { error: "La fecha no puede ser futura" }),
    sexo : z.enum(TipoSexo),
    direccion: direccionSchema,
    email: z.union([z.email('Email inválido'), z.literal('')]).optional(),
    telefono: telefonoSchema,
    obraSocial: z.object({
        obraSocialID: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "Obra social inválida" }).or(z.literal("")),
        numeroAfiliado: z.string().trim().default("")
    }).refine((data) => {
        if (data.obraSocialID === "") {
            return true; // NINGUNA
        }
        return data.numeroAfiliado.trim().length > 0;
        },
        {
        message: "El número de afiliado es obligatorio",
        path: ["numeroAfiliado"],
        }
)
});

export type IcrearPacienteDTO = z.input<typeof crearPacienteSchema>;

/*z.input → tipa los datos antes de validar (entrada).
  z.infer → tipa los datos después de validar/transformar (salida).
*/