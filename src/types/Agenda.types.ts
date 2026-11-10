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

const DiaAgendaSchema = z.object({
  diaSemana: z.enum(DiaSemana, { error: 'Debe ser un día de la semana válido' }),
  rangos: z.array(
    z.object({
      horaInicio: z.string({ error: 'Error en hora de inicio' }),
      horaFin: z.string({ error: 'Error en hora de fin' }),
    })
  )
  .min(1, 'Debe existir al menos un rango horario')
  .max(3, 'No puede tener más de 3 rangos'),
}).superRefine((dia, ctx) => {
  const aMinutos = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  };

  let finAnterior = -1;

  for (let i = 0; i < dia.rangos.length; i++) {
    const inicio = aMinutos(dia.rangos[i].horaInicio);
    const fin = aMinutos(dia.rangos[i].horaFin);

    //Valida cada rango en si mismo
    if (inicio >= fin) {
      ctx.addIssue({
        code: 'custom', // 
        message: 'La hora de fin debe ser mayor a la hora de inicio',
        path: ['rangos', i, 'horaFin'],
      });
    }

    //Valida que sea mayor al rango anterior
    if (i > 0 && inicio < finAnterior) {
      ctx.addIssue({
        code: 'custom', // 
        message: `La hora de inicio debe ser mayor a la hora de fin del rango ${i}`,
        path: ['rangos', i, 'horaInicio'],
      });
    }

    finAnterior = fin;
  }
});



export const crearAgendaMedicoSchema =z.object ({
    medicoId: z.string({ error: 'Identificador de médico no válido'}),
    dias: z.array(DiaAgendaSchema).min(1, 'Debe existir al menos un día de atención'),
    duracionTurnoMinutos: z.number({error: 'La duración debe ser un número' })
        .min(1, 'La duración debe ser mayor a 0')
        .max(60, 'La duración no puede ser mayor a 60 minutos')
   
});

/*
import { z } from 'zod';

// Esquema de un rango individual
const rangoItemSchema = z.object({
  horaInicio: z.string({ required_error: "error en hora de inicio" }),
  horaFin: z.string({ required_error: "error en hora de fin" })
});

// Esquema del arreglo con las validaciones cruzadas
export const rangosSchema = z
  .array(rangoItemSchema)
  .min(1, "Debe tener al menos 1 rango")
  .max(3, "No puede tener más de 3 rangos")
  .superRefine((data, ctx) => {
    for (let i = 0; i < data.length; i++) {
      const actual = data[i];

      // 1. Validar que horaFin sea mayor que horaInicio en el mismo ítem
      if (actual.horaFin <= actual.horaInicio) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La hora de fin debe ser mayor a la hora de inicio",
          path: [i, 'horaFin'], // Apunta al campo exacto del error
        });
      }

      // 2. Validar que la horaInicio sea mayor que la horaFin del ítem anterior
      if (i > 0) {
        const anterior = data[i - 1];
        if (actual.horaInicio <= anterior.horaFin) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Esta hora de inicio debe ser mayor a la hora de fin del rango anterior",
            path: [i, 'horaInicio'], // Apunta al campo exacto del error
          });
        }
      }
    }
  });
*/








export type ICrearAgendaMedicoDTO = z.infer <typeof crearAgendaMedicoSchema>