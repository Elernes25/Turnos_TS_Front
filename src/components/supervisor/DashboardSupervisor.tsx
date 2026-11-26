

import { Col, Container, Row } from 'react-bootstrap';
import { useFetch } from '../../hooks/useFetch';
import type { ITurno } from '../../types/Turno.type';
import RankingEspecialidades from './components/RankingEspecialidades';
import RankingMedicos from './components/RankingMedicos';
import TurnosCanceladosPorMes from './components/TurnosCanceladosPorMes';
import TurnosPorMes from './components/TurnosPorMes';
import styles from './DashboardSupervisor.module.scss';

export default function DashboardSupervisor() {
  const { data: turnos, isLoading: cargandoTurnos } = useFetch<ITurno[]>('/turnos');

  return (
    <Container fluid className="py-2">
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Panel Supervisor</h1>
        <p className={styles.subtitulo}>Estadísticas de turnos y atención.</p>
      </header>

      <Row className="g-3 mb-3">
        <Col lg={6}>
          <RankingMedicos turnos={turnos ?? []} isLoading={cargandoTurnos} />
        </Col>
        <Col lg={6}>
          <RankingEspecialidades turnos={turnos ?? []} isLoading={cargandoTurnos} />
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={6}>
          <TurnosPorMes turnos={turnos ?? []} isLoading={cargandoTurnos} />
        </Col>
        <Col lg={6}>
          <TurnosCanceladosPorMes turnos={turnos ?? []} isLoading={cargandoTurnos} />
        </Col>
      </Row>
    </Container>
  );
}