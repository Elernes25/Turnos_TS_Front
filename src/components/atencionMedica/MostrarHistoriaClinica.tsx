import { Col, ListGroup, Row } from 'react-bootstrap';
import { type IHistoriaClinica } from '../../types/HistoriaClinica.types';
import styles from '../recepcionistas/DashboardRecepcion.module.scss';

interface MostrarHistoriaClinicaProps {
  historia: IHistoriaClinica;
}

const MostrarHistoriaClinica = ({ historia }: MostrarHistoriaClinicaProps) => (
  <>
    <section className={`${styles.seccion} ${styles.seccionHistoria}`}>
      <h2 className={`${styles.seccionTitulo} ${styles.tituloSeccionHistoria}`}>
        Datos clínicos
      </h2>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Row>
            <Col xs={12} md={6}>
              <strong>Sexo:</strong> {historia.datosClinicos.sexo}
            </Col>
            <Col xs={12} md={6}>
              <strong>Grupo sanguíneo:</strong>{' '}
              {historia.datosClinicos.grupoSanguineo ?? 'No registrado'}
            </Col>
          </Row>
        </ListGroup.Item>
      </ListGroup>
    </section>

    <section className={`${styles.seccion} ${styles.seccionHistoria}`}>
      <h2 className={`${styles.seccionTitulo} ${styles.tituloSeccionHistoria}`}>
        Antecedentes
      </h2>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Row>
            <Col xs={12} md={6}>
              <strong>Alergias:</strong>{' '}
              {historia.antecedentes.alergias.join(', ') || 'Sin registrar'}
            </Col>
            <Col xs={12} md={6}>
              <strong>Cirugías:</strong>{' '}
              {historia.antecedentes.cirugias.join(', ') || 'Sin registrar'}
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Enfermedades crónicas:</strong>{' '}
          {historia.antecedentes.enfermedadesCronicas.join(', ') || 'Sin registrar'}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Historia general:</strong>{' '}
          {historia.antecedentes.historiaGeneral || 'Sin registrar'}
        </ListGroup.Item>
      </ListGroup>
    </section>
  </>
);

export default MostrarHistoriaClinica;
