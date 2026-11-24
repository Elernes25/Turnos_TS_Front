import { z } from "zod";

export const crearObraSocialSchema = z.object({
    nombreObraSocial: z
        .string({ error: "El nombre de la obra social es obligatorio" })
        .trim()
        .min(1, { error: "El nombre de la obra social es obligatorio" })
        .max(100, { error: "El nombre no puede superar los 100 caracteres" }),
});

export type IcrearObraSocialDTO = z.infer<typeof crearObraSocialSchema>;

export interface IObraSocial {
    id: string;
    nombreObraSocial: string;
    activa?: boolean;
}

// Ajustá a la forma real que devuelve tu respuestaEstandar
export interface IRespuestaObrasSociales {
    exito?: boolean;
    message?: string;
    datos?: IObraSocial[];
}
