import type { ITurno } from '../../../types/Turno.type';
import GraficoTurnosPorMes from './GraficoTurnosPorMes';

interface TurnosPorMesProps {
  turnos: ITurno[];
  isLoading: boolean;
}

const TurnosPorMes = ({ turnos, isLoading }: TurnosPorMesProps) => (
  <GraficoTurnosPorMes
    turnos={turnos}
    isLoading={isLoading}
    titulo="Turnos por mes"
    idTitulo="turnos-mes-titulo"
  />
);

export default TurnosPorMes;
