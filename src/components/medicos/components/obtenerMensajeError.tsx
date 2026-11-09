// utils/obtenerMensajeError.ts
import axios from 'axios';
import { ZodError } from 'zod';

export const obtenerMensajeError = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) return 'El servidor está apagado o no responde';
    return error.response.data?.message ?? 'Error del servidor';
  }
  if (error instanceof ZodError) {
    return 'La respuesta del servidor no tiene el formato esperado';
  }
  return 'Ocurrió un error inesperado';
};