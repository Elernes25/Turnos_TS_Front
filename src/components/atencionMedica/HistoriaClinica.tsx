import { Alert, Container, Spinner } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { type IHistoriaClinica } from '../../types/HistoriaClinica.types';
import CrearHistoriaClinica from './CrearHistoriaClinica';
import MostrarHistoriaClinica from './MostrarHistoriaClinica';
import styles from '../../components/recepcionistas/DashboardRecepcion.module.scss';

interface HistoriaClinicaLocationState {
  pacienteNombre?: string;
  turnoId?: string;
}

const HistoriaClinica = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const location = useLocation();
  const { pacienteNombre, turnoId } =
    (location.state as HistoriaClinicaLocationState | null) ?? {};
  const { data: historiaRespuesta, isLoading, refetch } =
    useFetch<IHistoriaClinica | IHistoriaClinica[]>(
      pacienteId
        ? `/historiaClinica?pacienteId=${encodeURIComponent(pacienteId)}`
        : '/historiaClinica',
    );
  const historia = Array.isArray(historiaRespuesta)
    ? historiaRespuesta[0] ?? null
    : historiaRespuesta;

  if (!pacienteId) {
    return <Alert variant="danger">No se indicó un paciente para consultar la historia clínica.</Alert>;
  }

  return (
    <Container fluid className={styles.dashboard} data-rol="MEDICO">
      <header className={`${styles.encabezado} ${styles.encabezadoHistoria}`}>
        <div>
          <h1 className={styles.titulo}>
            {!isLoading && !historia ? 'Crear Historia Clínica' : 'Historia Clínica'}
          </h1>
          <p className={styles.subtitulo}>
            {pacienteNombre ? `Paciente: ${pacienteNombre}` : `Paciente: ${pacienteId}`}
          </p>
        </div>
        <div className={styles.acciones}>
          {historia?.id && (
            <Link
              to={`/historiaclinica/${historia.id}/editar`}
              state={{ historia }}
              className="btn btn-primary"
            >
              Editar
            </Link>
          )}
          <Link to="/" className="btn btn-outline-secondary">Volver al dashboard</Link>
        </div>
      </header>

      {isLoading ? (
        <div className="py-4 text-center" role="status" aria-label="Cargando historia clínica">
          <Spinner animation="border" />
        </div>
      ) : historia ? (
        <>
          <MostrarHistoriaClinica historia={historia} />
          <div className="d-flex flex-wrap gap-2 mt-3">
            <Link
              to={`/consulta-nueva/${pacienteId}`}
              state={{ pacienteNombre, turnoId }}
              className="btn btn-primary"
            >
              Continuar con la consulta
            </Link>
            <Link
              to={`/consultas-clinicas/${pacienteId}`}
              state={{ pacienteNombre }}
              className="btn btn-outline-primary"
            >
              Ver consultas clínicas
            </Link>
          </div>
        </>
      ) : (
        <CrearHistoriaClinica
          pacienteId={pacienteId}
          onCreated={() => void refetch()}
        />
      )}
    </Container>
  );
};

export default HistoriaClinica;
