import { useEffect, useState } from 'react';
import { Alert, Container, ListGroup, Spinner } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import { clientesAxios } from '../../config/axios';
import type { IConsultaClinica } from '../../types/ConsultaClinica.types';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';
import styles from '../recepcionistas/DashboardRecepcion.module.scss';

interface ListadoConsultasLocationState {
  pacienteNombre?: string;
}

const ListadoConsultasClinicas = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const location = useLocation();
  const { pacienteNombre } =
    (location.state as ListadoConsultasLocationState | null) ?? {};
  const [consultas, setConsultas] = useState<IConsultaClinica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pacienteId) return;

    let cancelado = false;

    const cargarConsultas = async (): Promise<void> => {
      try {
        setCargando(true);
        setError(null);
        const { data } = await clientesAxios.get<{ datos: IConsultaClinica[] }>(
          `/consultaClinica/paciente/${encodeURIComponent(pacienteId)}`,
        );
        if (!cancelado) setConsultas(data.datos);
      } catch (error: unknown) {
        if (!cancelado) setError(obtenerMensajeError(error));
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    void cargarConsultas();
    return () => {
      cancelado = true;
    };
  }, [pacienteId]);

  if (!pacienteId) {
    return <Alert variant="danger">No se indicó un paciente para consultar.</Alert>;
  }

  return (
    <Container fluid className={styles.dashboard} data-rol="MEDICO">
      <header className={styles.encabezado}>
        <div>
          <h1 className={styles.titulo}>Consultas clínicas</h1>
          <p className={styles.subtitulo}>
            {pacienteNombre ? `Paciente: ${pacienteNombre}` : `Paciente: ${pacienteId}`}
          </p>
        </div>
        <Link
          to={`/historia-clinica/${pacienteId}`}
          state={{ pacienteNombre }}
          className="btn btn-outline-secondary"
        >
          Volver a la historia clínica
        </Link>
      </header>

      {cargando ? (
        <div className="py-4 text-center" role="status" aria-label="Cargando consultas clínicas">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : consultas.length === 0 ? (
        <Alert variant="info">Este paciente todavía no tiene consultas clínicas registradas.</Alert>
      ) : (
        <ListGroup>
          {consultas.map((consulta, index) => {
            const fecha = new Date(consulta.fecha);
            const fechaTexto = Number.isNaN(fecha.getTime())
              ? 'Fecha no disponible'
              : `${fecha.toLocaleDateString('es-AR')} · ${fecha.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}`;

            return (
              <ListGroup.Item key={consulta.id ?? consulta._id ?? `${consulta.fecha}-${index}`}>
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                  <strong>{fechaTexto}</strong>
                </div>
                <p className="mb-1"><strong>Motivo:</strong> {consulta.motivoConsulta}</p>
                <p className="mb-1"><strong>Diagnóstico:</strong> {consulta.diagnostico}</p>
                <p className="mb-1"><strong>Tratamiento:</strong> {consulta.tratamiento}</p>
                <p className="mb-1"><strong>Indicaciones:</strong> {consulta.indicaciones}</p>
                {consulta.observaciones && (
                  <p className="mb-0"><strong>Observaciones:</strong> {consulta.observaciones}</p>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </Container>
  );
};

export default ListadoConsultasClinicas;
