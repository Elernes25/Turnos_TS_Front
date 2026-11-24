import { useEffect, useState } from "react";
import axios from "axios";
import { clientesAxios } from "../config/axios";
import type { IAgenda } from "../types/Agenda.types";
import type { TurnoOcupado } from "../types/Agenda.types";


interface UseDisponibilidadMedicoResult {
    agenda: IAgenda | null;
    turnosOcupados: TurnoOcupado[];
    cargandoDisponibilidad: boolean;
    errorDisponibilidad: string;
}

export const useDisponibilidadMedico = (
    medicoId: string,
): UseDisponibilidadMedicoResult => {
    const [agenda, setAgenda] = useState<IAgenda | null>(null);
    const [turnosOcupados, setTurnosOcupados] = useState<TurnoOcupado[]>([]);
    const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false);
    const [errorDisponibilidad, setErrorDisponibilidad] = useState("");

    useEffect(() => {
        setAgenda(null);
        setTurnosOcupados([]);
        setErrorDisponibilidad("");

        if (!medicoId) {
            setCargandoDisponibilidad(false);
            return;
        }

        const controller = new AbortController();

        const cargarDisponibilidad = async (): Promise<void> => {
            setCargandoDisponibilidad(true);

            try {
                const cargarTurnosOcupados = async (): Promise<TurnoOcupado[]> => {
                    try {
                        const respuesta = await clientesAxios.get<{
                            datos: TurnoOcupado[];
                        }>("/turnos/", {
                            params: {
                                medicoId,
                                activo: true,
                            },
                            signal: controller.signal,
                        });

                        return respuesta.data.datos ?? [];
                    } catch (error) {
                        const mensaje = axios.isAxiosError(error)
                            ? error.response?.data?.message
                            : undefined;

                        if (
                            axios.isAxiosError(error)
                            && error.response?.status === 404
                            && typeof mensaje === "string"
                            && mensaje.toLowerCase().includes("no se encontraron turnos")
                        ) {
                            return [];
                        }

                        throw error;
                    }
                };

                const [respuestaAgenda, turnos] = await Promise.all([
                    clientesAxios.get<{ datos: IAgenda }>(
                        `/medicos/${medicoId}/agenda`,
                        {
                            signal: controller.signal,
                        },
                    ),
                    cargarTurnosOcupados(),
                ]);

                setAgenda(respuestaAgenda.data.datos);
                setTurnosOcupados(turnos);
            } catch (error) {
                if (axios.isCancel(error)) return;

                const mensaje = axios.isAxiosError(error)
                    ? error.response?.data?.message
                    ?? "No se pudo cargar la agenda o los turnos."
                    : "No se pudo cargar la disponibilidad.";

                setErrorDisponibilidad(mensaje);
            } finally {
                if (!controller.signal.aborted) {
                    setCargandoDisponibilidad(false);
                }
            }
        };

        void cargarDisponibilidad();

        return () => controller.abort();
    }, [medicoId]);

    return {
        agenda,
        turnosOcupados,
        cargandoDisponibilidad,
        errorDisponibilidad,
    };
};