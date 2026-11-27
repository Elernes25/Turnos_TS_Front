import { clientesAxios } from '../config/axios';

interface FeriadoApi {
    date?: unknown;
    fecha?: unknown;
    localName?: unknown;
    nombre?: unknown;
    name?: unknown;
}

const feriadosPorAnio = new Map<number, Promise<Map<string, string>>>();

const extraerListaFeriados = (respuesta: unknown): unknown[] => {
    if (Array.isArray(respuesta)) return respuesta;
    if (!respuesta || typeof respuesta !== 'object') {
        throw new Error('La respuesta de feriados no tiene un formato válido.');
    }

    const objeto = respuesta as Record<string, unknown>;
    for (const clave of ['datos', 'feriados', 'holidays', 'data']) {
        if (clave in objeto) return extraerListaFeriados(objeto[clave]);
    }

    throw new Error('La respuesta de feriados no contiene una lista.');
};

const convertirFeriadosEnMapa = (respuesta: unknown, anio: number): Map<string, string> => {
    const feriados = extraerListaFeriados(respuesta);
    const resultado = new Map<string, string>();

    for (const item of feriados) {
        const feriado: FeriadoApi = typeof item === 'string' ? { date: item } : item as FeriadoApi;
        const fecha = typeof feriado.date === 'string' ? feriado.date : feriado.fecha;
        if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
            throw new Error('La respuesta de feriados contiene una fecha inválida.');
        }

        const claveFecha = fecha.slice(0, 10);
        if (claveFecha.startsWith(`${anio}-`)) {
            const nombre = feriado.localName ?? feriado.nombre ?? feriado.name;
            resultado.set(claveFecha, typeof nombre === 'string' ? nombre : 'Feriado');
        }
    }

    return resultado;
};

export const obtenerFeriadosDelAnio = (anio: number): Promise<Map<string, string>> => {
    const enCache = feriadosPorAnio.get(anio);
    if (enCache) return enCache;

    const solicitud = clientesAxios
        .get<unknown>('/feriados', { params: { year: anio } })
        .then(({ data }) => convertirFeriadosEnMapa(data, anio))
        .catch((error: unknown) => {
            feriadosPorAnio.delete(anio);
            throw error;
        });

    feriadosPorAnio.set(anio, solicitud);
    return solicitud;
};
