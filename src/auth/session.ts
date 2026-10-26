import type { SessionPayload } from '../types/Session';
import { RolUsuario } from '../types/Usuario.type';

/*TODO usar jwtDecode */
const SESSION_EVENT = 'session-changed';

const isUserRole = (value: unknown): value is RolUsuario => (
    value === 'PACIENTE'
    || value === 'RECEPCIONISTA'
    || value === 'ADMIN'
    || value === 'MEDICO'
    || value === 'SUPERVISOR'

);

const parsePayload = (token: string): SessionPayload | null => {
    try {
        const encodedPayload = token.split('.')[1];
        if (!encodedPayload) return null;

        const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
        const payloadValue: unknown = JSON.parse(atob(base64));
        if (typeof payloadValue !== 'object' || payloadValue === null) return null;

        const payload = payloadValue as Record<string, unknown>;
        if (
            typeof payload.id !== 'string'
            || typeof payload.user !== 'string'
            || !isUserRole(payload.rol)
            || typeof payload.activo !== 'boolean'
            || typeof payload.debeCambiarPassword !== 'boolean'
        ) return null;

        return {
            id: payload.id,
            user: payload.user,
            rol: payload.rol,
            activo: payload.activo,
            debeCambiarPassword: payload.debeCambiarPassword,
            ...(typeof payload.exp === 'number' ? { exp: payload.exp } : {}),
        };
    } catch {
        return null;
    }
};

export const getSession = (): SessionPayload | null => {
    const token = localStorage.getItem('token');
    return token ? parsePayload(token) : null;
};

export const saveSession = (token: string): void => {
    localStorage.setItem('token', token);
    window.dispatchEvent(new Event(SESSION_EVENT));
};

export const clearSession = (): void => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event(SESSION_EVENT));
};

export const subscribeSession = (callback: () => void): (() => void) => {
    window.addEventListener(SESSION_EVENT, callback);
    window.addEventListener('storage', callback);
    return () => {
        window.removeEventListener(SESSION_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
};

/*
import { jwtDecode } from 'jwt-decode';
import { z } from 'zod';

import type { SessionPayload } from '../types/Api.type';

const SESSION_EVENT = 'session-changed';

const SessionSchema = z.object({
    id: z.string(),
    user: z.string(),
    rol: z.enum([
        'PACIENTE',
        'RECEPCIONISTA',
        'ADMIN',
        'MEDICO',
    ]),
    activo: z.boolean(),
    exp: z.number().optional(),
});

export type SessionPayload = z.infer<typeof SessionSchema>;

const parsePayload = (token: string): SessionPayload | null => {
    try {
        const payload = jwtDecode(token);

        const result = SessionSchema.safeParse(payload);

        return result.success ? result.data : null;
    } catch {
        return null;
    }
};

export const getSession = (): SessionPayload | null => {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    const session = parsePayload(token);

    if (!session) {
        return null;
    }

    if (session.exp && Date.now() >= session.exp * 1000) {
        localStorage.removeItem('token');
        return null;
    }

    return session;
};

export const saveSession = (token: string): void => {
    localStorage.setItem('token', token);
    window.dispatchEvent(new Event(SESSION_EVENT));
};

export const clearSession = (): void => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event(SESSION_EVENT));
};

export const subscribeSession = (
    callback: () => void
): (() => void) => {
    window.addEventListener(SESSION_EVENT, callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener(SESSION_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
};

*/