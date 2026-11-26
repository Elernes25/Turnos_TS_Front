import type { ITurno } from '../../../types/Turno.type';
import GraficoTurnosPorMes from './GraficoTurnosPorMes';

interface TurnosCanceladosPorMesProps {
  turnos: ITurno[];
  isLoading: boolean;
}

const TurnosCanceladosPorMes = ({ turnos, isLoading }: TurnosCanceladosPorMesProps) => (
  <GraficoTurnosPorMes
    turnos={turnos}
    isLoading={isLoading}
    estado="cancelado"
    titulo="Turnos cancelados por mes"
    idTitulo="turnos-cancelados-mes-titulo"
    variante="cancelados"
  />
);

export default TurnosCanceladosPorMes;
