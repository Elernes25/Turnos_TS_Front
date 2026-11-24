import { IAgenda } from "../../types/Agenda.types";
import { DiaSemana } from "../../types/Agenda.types";
import { TurnoOcupado,HorarioDisponible } from "../../types/Agenda.types";

export const DIAS_SEMANA: DiaSemana[] = [
    DiaSemana.DOMINGO,
    DiaSemana.LUNES,
    DiaSemana.MARTES,
    DiaSemana.MIERCOLES,
    DiaSemana.JUEVES,
    DiaSemana.VIERNES,
    DiaSemana.SABADO,
];

const pad = (valor: number): string => String(valor).padStart(2, "0");

export const obtenerClaveFecha = (fecha: Date): string =>
    `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;

export const horarioYaPaso = (fecha: Date, ahora = new Date()): boolean => {
    const claveHorario = obtenerClaveFecha(fecha);
    const claveHoy = obtenerClaveFecha(ahora);
    if (claveHorario < claveHoy) return true;
    if (claveHorario > claveHoy) return false;

    const minutosHorario = fecha.getHours() * 60 + fecha.getMinutes();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    return minutosHorario <= minutosActuales;
};

export const obtenerHorarios = ( fecha: Date, agenda: IAgenda, 
    turnosOcupados: TurnoOcupado[], ahora = new Date(),): HorarioDisponible[] => {
    const diaAgenda = agenda.dias.find((dia) => dia.diaSemana === DIAS_SEMANA[fecha.getDay()]);
    if (!diaAgenda || agenda.duracionTurnoMinutos <= 0) return [];

    const duracionMs = agenda.duracionTurnoMinutos * 60_000;
    const horarios: HorarioDisponible[] = [];

    for (const rango of diaAgenda.rangos) {
        const [horaInicio, minutoInicio] = rango.horaInicio.split(":").map(Number);
        const [horaFin, minutoFin] = rango.horaFin.split(":").map(Number);
        const inicio = horaInicio * 60 + minutoInicio;
        const fin = horaFin * 60 + minutoFin;

        for (let minuto = inicio; minuto + agenda.duracionTurnoMinutos <= fin; minuto += agenda.duracionTurnoMinutos) {
            const hora = `${pad(Math.floor(minuto / 60))}:${pad(minuto % 60)}`;
            const fechaHorario = new Date(
                fecha.getFullYear(),
                fecha.getMonth(),
                fecha.getDate(),
                Math.floor(minuto / 60),
                minuto % 60,
            );
            const inicioHorario = fechaHorario.getTime();
            const pasado = horarioYaPaso(fechaHorario, ahora);
            const ocupado = turnosOcupados.some((turno) => {
                if (turno.estado?.toLowerCase() === "cancelado") return false;
                const inicioOcupado = new Date(turno.fechaTurno).getTime();
                if (Number.isNaN(inicioOcupado)) return false;

                return inicioOcupado < inicioHorario + duracionMs
                    && inicioOcupado + duracionMs > inicioHorario;
            });

            horarios.push({ hora, fecha: fechaHorario, ocupado, pasado });
        }
    }

    return horarios;
};