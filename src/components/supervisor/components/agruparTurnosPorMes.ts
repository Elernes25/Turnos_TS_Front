import type { ITurno } from '../../../types/Turno.type';

export interface MesTurnos {
  clave: string;
  etiqueta: string;
  cantidad: number;
}

export interface AgrupacionMensualTurnos {
  meses: MesTurnos[];
  total: number;
  sinFechaValida: number;
}

const claveMes = (fecha: Date): string =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

export const agruparTurnosPorMes = (
  turnos: ITurno[],
  estado?: ITurno['estado'],
): AgrupacionMensualTurnos => {
  const turnosFiltrados = estado ? turnos.filter((turno) => turno.estado === estado) : turnos;
  const porClave = new Map<string, MesTurnos>();
  const formatearMes = new Intl.DateTimeFormat('es-AR', { month: 'short', year: '2-digit' });
  let primerMes: Date | null = null;
  let ultimoMes: Date | null = null;
  let sinFechaValida = 0;

  for (const turno of turnosFiltrados) {
    const fechaTurno = new Date(turno.fechaTurno);
    if (Number.isNaN(fechaTurno.getTime())) {
      sinFechaValida += 1;
      continue;
    }

    const fechaMes = new Date(fechaTurno.getFullYear(), fechaTurno.getMonth(), 1);
    const clave = claveMes(fechaMes);
    const mes = porClave.get(clave);
    if (mes) {
      mes.cantidad += 1;
    } else {
      porClave.set(clave, {
        clave,
        etiqueta: formatearMes.format(fechaMes),
        cantidad: 1,
      });
    }

    if (!primerMes || fechaMes < primerMes) primerMes = fechaMes;
    if (!ultimoMes || fechaMes > ultimoMes) ultimoMes = fechaMes;
  }

  const fechaInicio = primerMes ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const fechaFin = ultimoMes ?? fechaInicio;
  const meses: MesTurnos[] = [];

  for (
    let fecha = fechaInicio;
    fecha <= fechaFin;
    fecha = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1)
  ) {
    const clave = claveMes(fecha);
    meses.push(
      porClave.get(clave) ?? {
        clave,
        etiqueta: formatearMes.format(fecha),
        cantidad: 0,
      },
    );
  }

  return {
    meses,
    total: meses.reduce((suma, mes) => suma + mes.cantidad, 0),
    sinFechaValida,
  };
};
