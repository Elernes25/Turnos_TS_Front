import {z} from 'zod';

export enum DiaSemana {
    LUNES = 'LUNES',
    MARTES = 'MARTES',
    MIERCOLES = 'MIERCOLES',
    JUEVES = 'JUEVES',
    VIERNES = 'VIERNES',
    SABADO = 'SABADO',
    DOMINGO = 'DOMINGO'
}


export const crearAgendaMedicoSchema =z.object ({
    medicoId: z.string({ error: 'Identificador de médico no válido'}),
    dias: z.array(
    z.object({
        diaSemana: z.enum(DiaSemana, { error: 'Debe ser un día de la semana válido' }),
        rangos: z.array(
        z.object({
            horaInicio: z.string({error:"error en hora de inicio"}),
            horaFin: z.string({error: "error en hora de fin"})
        })
        ).min(1, 'Debe existir al menos un rango horario')
    })
    ).min(1, 'Debe existir al menos un día de atención'),

    duracionTurnoMinutos: z.number({error: 'La duración debe ser un número' })
    .min(1, 'La duración debe ser mayor a 0')
    .max(60, 'La duración no puede ser mayor a 60 minutos')
   
});
export type ICrearAgendaMedicoDTO = z.infer <typeof crearAgendaMedicoSchema>