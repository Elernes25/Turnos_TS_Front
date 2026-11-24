import { useEffect, useState } from 'react';
import { Alert, Container, Spinner, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { getSession } from '../../auth/session';
import { clientesAxios } from '../../config/axios';
import type { IConsultaClinica } from '../../types/ConsultaClinica.types';
import { obtenerMensajeError } from '../utils/obtenerMensajeError';
import styles from '../recepcionistas/DashboardRecepcion.module.scss';

const cargarConsultasDelMedico = async (medicoId: string): Promise<IConsultaClinica[]> => {
  const { data } = await clientesAxios.get<{ datos: IConsultaClinica[] }>(
    `/consultaClinica/medico/${encodeURIComponent(medicoId)}`,
  );
  return data.datos;
};

const obtenerIdConsulta = (consulta: IConsultaClinica): string | undefined =>
  consulta.id ?? consulta._id;

const obtenerNombrePaciente = (consulta: IConsultaClinica): string => {
  if (!consulta.pacienteId || typeof consulta.pacienteId === 'string') {
    return 'Paciente sin nombre';
  }
  return consulta.pacienteId.nombre ?? 'Paciente sin nombre';
};

const formatearFecha = (fecha: string): string => {
  const fechaConsulta = new Date(fecha);
  if (Number.isNaN(fechaConsulta.getTime())) return 'Fecha no disponible';
  return `${fechaConsulta.toLocaleDateString('es-AR')} · ${fechaConsulta.toLocaleTimeString(
    'es-AR',
    { hour: '2-digit', minute: '2-digit', hour12: false },
  )}`;
};

const MisConsultas = () => {
  const session = getSession();
  const [consultas, setConsultas] = useState<IConsultaClinica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    const cargar = async (): Promise<void> => {
      if (!session?.id) {
        setError('No se pudo identificar al médico de la sesión.');
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);
        const resultado = await cargarConsultasDelMedico(session.id);
        if (!cancelado) setConsultas(resultado);
      } catch (error: unknown) {
        if (!cancelado) setError(obtenerMensajeError(error));
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    void cargar();
    return () => {
      cancelado = true;
    };
  }, [session?.id]);

  return (
    <Container fluid className={styles.dashboard} data-rol="MEDICO">
      <header className={styles.encabezado}>
        <div>
          <h1 className={styles.titulo}>Mis Consultas</h1>
          <p className={styles.subtitulo}>Consultas clínicas realizadas</p>
        </div>
      </header>

      {cargando ? (
        <div className="py-4 text-center" role="status" aria-label="Cargando consultas">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : consultas.length === 0 ? (
        <Alert variant="info">Todavía no hay consultas clínicas registradas.</Alert>
      ) : (
        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Paciente</th>
              <th>Motivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((consulta, index) => {
              const consultaId = obtenerIdConsulta(consulta);
              return (
                <tr key={consultaId ?? `${consulta.fecha}-${index}`}>
                  <td>{formatearFecha(consulta.fecha)}</td>
                  <td>{obtenerNombrePaciente(consulta)}</td>
                  <td>{consulta.motivoConsulta}</td>
                  <td>
                    {consultaId ? (
                      <Link
                        to={`/mis-consultasl/${encodeURIComponent(consultaId)}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Detalles
                      </Link>
                    ) : (
                      <button type="button" className="btn btn-sm btn-outline-primary" disabled>
                        Detalles
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export const DetalleMisConsulta = () => {
  const { consultaId } = useParams<{ consultaId: string }>();
  const session = getSession();
  const [consulta, setConsulta] = useState<IConsultaClinica | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    const cargar = async (): Promise<void> => {
      if (!session?.id || !consultaId) {
        setError('No se pudo identificar la consulta o el médico de la sesión.');
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError(null);
        const consultas = await cargarConsultasDelMedico(session.id);
        const encontrada = consultas.find(
          (item) => obtenerIdConsulta(item) === consultaId,
        );
        if (!cancelado) {
          if (encontrada) setConsulta(encontrada);
          else setError('No se encontró la consulta solicitada.');
        }
      } catch (error: unknown) {
        if (!cancelado) setError(obtenerMensajeError(error));
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    void cargar();
    return () => {
      cancelado = true;
    };
  }, [consultaId, session?.id]);

  return (
    <Container fluid className={styles.dashboard} data-rol="MEDICO">
      <header className={styles.encabezado}>
        <div>
          <h1 className={styles.titulo}>Detalle de consulta</h1>
          {consulta && (
            <p className={styles.subtitulo}>{obtenerNombrePaciente(consulta)}</p>
          )}
        </div>
        <Link to="/mis-consultasl" className="btn btn-outline-secondary">
          Volver a Mis Consultas
        </Link>
      </header>

      {cargando ? (
        <div className="py-4 text-center" role="status" aria-label="Cargando detalle">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : consulta ? (
        <section className={styles.seccion}>
          <p><strong>Fecha:</strong> {formatearFecha(consulta.fecha)}</p>
          <p><strong>Paciente:</strong> {obtenerNombrePaciente(consulta)}</p>
          <p><strong>Motivo:</strong> {consulta.motivoConsulta}</p>
          <p><strong>Diagnóstico:</strong> {consulta.diagnostico}</p>
          <p><strong>Tratamiento:</strong> {consulta.tratamiento}</p>
          <p><strong>Indicaciones:</strong> {consulta.indicaciones}</p>
          <p className="mb-0">
            <strong>Observaciones:</strong> {consulta.observaciones || 'Sin observaciones'}
          </p>
        </section>
      ) : null}
    </Container>
  );
};

export default MisConsultas;
