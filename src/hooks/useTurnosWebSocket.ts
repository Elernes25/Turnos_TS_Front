import { useEffect, useRef } from 'react';
import type { ITurno } from '../types/Turno.type';

export interface EstadoTurnoActualizado {
  turnoId: string;
  estado: ITurno['estado'];
}

interface MensajeWebSocket {
  type: string;
  data?: {
    turnoId?: unknown;
    estado?: unknown;
  };
}

const estadosTurno: ITurno['estado'][] = [
  'pendiente',
  'en atencion',
  'atendido',
  'cancelado',
];

const obtenerUrlWebSocket = (): string | null => {
  const env = (import.meta as ImportMeta & {
    env?: { VITE_API_URL?: string; VITE_WS_URL?: string };
  }).env;
  if (env?.VITE_WS_URL) return env.VITE_WS_URL;
  if (!env?.VITE_API_URL) return null;

  const url = new URL(env.VITE_API_URL, window.location.origin);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/ws/turnos`;
  url.search = '';
  url.hash = '';
  return url.toString();
};

const leerActualizacion = (contenido: unknown): EstadoTurnoActualizado | null => {
  if (typeof contenido !== 'string') return null;

  let mensaje: MensajeWebSocket;
  try {
    mensaje = JSON.parse(contenido) as MensajeWebSocket;
  } catch {
    console.warn('Se recibió un mensaje WebSocket de turnos con formato inválido.');
    return null;
  }

  if (
    mensaje.type !== 'turno.estado.actualizado'
    || typeof mensaje.data?.turnoId !== 'string'
    || typeof mensaje.data.estado !== 'string'
    || !estadosTurno.includes(mensaje.data.estado as ITurno['estado'])
  ) {
    return null;
  }

  return {
    turnoId: mensaje.data.turnoId,
    estado: mensaje.data.estado as ITurno['estado'],
  };
};

export const useTurnosWebSocket = (
  alActualizarEstado: (actualizacion: EstadoTurnoActualizado) => void,
): void => {
  const callbackRef = useRef(alActualizarEstado);

  useEffect(() => {
    callbackRef.current = alActualizarEstado;
  }, [alActualizarEstado]);

  useEffect(() => {
    const url = obtenerUrlWebSocket();
    if (!url) {
      console.warn('Configura VITE_WS_URL o VITE_API_URL para habilitar las actualizaciones en vivo de turnos.');
      return;
    }

    let cancelado = false;
    let socket: WebSocket | null = null;
    let temporizadorReconectar: number | undefined;

    const conectar = (): void => {
      if (cancelado) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No se puede conectar al WebSocket de turnos sin una sesión iniciada.');
        return;
      }

      try {
        socket = new WebSocket(url);
      } catch (error: unknown) {
        console.error('No se pudo abrir la conexión WebSocket de turnos.', error);
        temporizadorReconectar = window.setTimeout(conectar, 3000);
        return;
      }

      const conexionActual = socket;
      conexionActual.onopen = () => {
        conexionActual.send(JSON.stringify({ type: 'authenticate', token }));
      };
      conexionActual.onmessage = (evento: MessageEvent<unknown>) => {
        const actualizacion = leerActualizacion(evento.data);
        if (actualizacion) callbackRef.current(actualizacion);
      };
      conexionActual.onerror = () => {
        conexionActual.close();
      };
      conexionActual.onclose = () => {
        if (!cancelado) {
          temporizadorReconectar = window.setTimeout(conectar, 3000);
        }
      };
    };

    conectar();
    return () => {
      cancelado = true;
      if (temporizadorReconectar !== undefined) {
        window.clearTimeout(temporizadorReconectar);
      }
      socket?.close();
    };
  }, []);
};
