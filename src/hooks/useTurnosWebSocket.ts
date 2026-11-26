import { useEffect, useRef } from 'react';
import type { ITurno } from '../types/Turno.type';

export interface EstadoTurnoActualizado {
  turnoId: string;
  estado: ITurno['estado'];
}

const estadosTurno: ITurno['estado'][] = [
  'pendiente',
  'en atencion',
  'atendido',
  'cancelado',
];

const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null;

const normalizarUrlWebSocket = (url: URL): string => {
  url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
};

const obtenerUrlWebSocket = (): string | null => {
  const env = (import.meta as ImportMeta & {
    env?: { VITE_API_URL?: string; VITE_WS_URL?: string };
  }).env;
  if (env?.VITE_WS_URL) {
    return normalizarUrlWebSocket(new URL(env.VITE_WS_URL, window.location.origin));
  }
  if (!env?.VITE_API_URL) return null;

  const url = new URL(env.VITE_API_URL, window.location.origin);
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/ws/turnos`;
  url.search = '';
  url.hash = '';
  return normalizarUrlWebSocket(url);
};

const leerActualizacion = (contenido: unknown): EstadoTurnoActualizado | null => {
  if (typeof contenido !== 'string') return null;

  let mensaje: unknown;
  try {
    mensaje = JSON.parse(contenido) as unknown;
  } catch {
    console.warn('Se recibió un mensaje WebSocket de turnos con formato inválido.');
    return null;
  }

  if (!esObjeto(mensaje)) return null;

  const tipoEvento = mensaje.type ?? mensaje.event ?? mensaje.evento ?? mensaje.tipo;
  if (tipoEvento !== 'turno.estado.actualizado' && tipoEvento !== 'turno_actualizado') {
    return null;
  }

  const datos = esObjeto(mensaje.data)
    ? mensaje.data
    : esObjeto(mensaje.datos)
      ? mensaje.datos
      : esObjeto(mensaje.turno)
        ? mensaje.turno
        : mensaje;
  const turnoId = datos.turnoId ?? datos.idTurno ?? datos.id ?? datos._id;
  const estado = datos.estado;

  if (
    typeof turnoId !== 'string'
    || typeof estado !== 'string'
    || !estadosTurno.includes(estado as ITurno['estado'])
  ) {
    return null;
  }

  return {
    turnoId,
    estado: estado as ITurno['estado'],
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
